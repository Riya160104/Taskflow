import Task from '../models/Task.js';
import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import { Op } from 'sequelize';

export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    let where = {};
    
    if (projectId) where.projectId = projectId;
    
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.findAll({ where });
    } else {
      // Member can only see tasks assigned to them
      where.assignedTo = req.user.id;
      tasks = await Task.findAll({ where });
    }
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, projectId, assignedTo } = req.body;
    
    // Check if assigned user is member of project
    const isMember = await ProjectMember.findOne({
      where: { projectId, userId: assignedTo }
    });
    
    if (!isMember && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'User must be project member' });
    }
    
    const task = await Task.create({
      title,
      description,
      dueDate,
      projectId,
      assignedTo,
      createdBy: req.user.id,
      status: 'pending'
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Members can only update status of tasks assigned to them
    if (req.user.role !== 'admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // If member, only allow status update
    if (req.user.role !== 'admin') {
      const { status } = req.body;
      await task.update({ status });
    } else {
      await task.update(req.body);
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete tasks' });
    }
    
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
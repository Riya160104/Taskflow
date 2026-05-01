import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

export const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.findAll({
        include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
      });
    } else {
      const memberProjects = await ProjectMember.findAll({
        where: { userId: req.user.id },
        attributes: ['projectId']
      });
      const projectIds = memberProjects.map(mp => mp.projectId);
      projects = await Project.findAll({
        where: { id: projectIds },
        include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
      });
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id
    });
    
    // Add creator as member automatically
    await ProjectMember.create({
      projectId: project.id,
      userId: req.user.id
    });
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.update(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
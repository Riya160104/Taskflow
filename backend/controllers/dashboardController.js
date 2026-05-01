import Task from '../models/Task.js';
import ProjectMember from '../models/ProjectMember.js';
import { Op } from 'sequelize';

export const getDashboardStats = async (req, res) => {
  try {
    let where = {};
    
    if (req.user.role !== 'admin') {
      where.assignedTo = req.user.id;
    }
    
    const tasks = await Task.findAll({ where });
    const now = new Date();
    
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => t.dueDate < now && t.status !== 'completed').length
    };
    
    // Get recent tasks (last 5)
    const recentTasks = tasks
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);
    
    res.json({ stats, recentTasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
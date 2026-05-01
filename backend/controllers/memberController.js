import ProjectMember from '../models/ProjectMember.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

export const getProjectMembers = async (req, res) => {
  try {
    const members = await ProjectMember.findAll({
      where: { projectId: req.params.projectId },
      include: [{ model: User, attributes: ['id', 'name', 'email', 'role'] }]
    });
    res.json(members.map(m => m.User));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const projectId = req.params.projectId;
    
    const existing = await ProjectMember.findOne({ where: { projectId, userId } });
    if (existing) {
      return res.status(400).json({ message: 'User already in project' });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const member = await ProjectMember.create({ projectId, userId });
    res.status(201).json({ message: 'Member added', member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    await ProjectMember.destroy({
      where: { projectId: req.params.projectId, userId: req.params.userId }
    });
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
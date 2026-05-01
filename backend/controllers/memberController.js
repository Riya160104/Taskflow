import ProjectMember from '../models/ProjectMember.js';
import User from '../models/User.js';

export const getProjectMembers = async (req, res) => {
  try {
    const members = await ProjectMember.findAll({
      where: { projectId: req.params.projectId },
      include: [{ model: User, attributes: ['id', 'name', 'email', 'role'] }]
    });
    res.json(members.map(m => m.User));
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existing = await ProjectMember.findOne({ where: { projectId, userId } });
    if (existing) {
      return res.status(400).json({ message: 'User already in project' });
    }

    await ProjectMember.create({ projectId, userId });
    res.status(201).json({ message: 'Member added successfully' });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const deleted = await ProjectMember.destroy({ where: { projectId, userId } });
    if (deleted === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: error.message });
  }
};
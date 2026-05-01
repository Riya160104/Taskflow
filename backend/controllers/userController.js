import User from '../models/User.js';
import { Op } from 'sequelize';

export const findUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({
      where: { email: { [Op.iLike]: email } },
      attributes: ['id', 'name', 'email', 'role']
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
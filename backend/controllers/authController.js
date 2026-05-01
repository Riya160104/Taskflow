import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, email, password, role } = req.body;
  
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'member'
  });
  
  const token = generateToken(user.id);
  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  
  if (user && await user.comparePassword(password)) {
    const token = generateToken(user.id);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
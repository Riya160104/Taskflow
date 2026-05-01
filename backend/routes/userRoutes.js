import express from 'express';
import { findUserByEmail } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/search', findUserByEmail);

export default router;
import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getTasks).post(isAdmin, createTask);
router.route('/:id').put(updateTask).delete(isAdmin, deleteTask);

export default router;
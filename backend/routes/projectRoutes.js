import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { getProjectMembers, addMember, removeMember } from '../controllers/memberController.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getProjects).post(isAdmin, createProject);
router.route('/:id').put(isAdmin, updateProject).delete(isAdmin, deleteProject);
router.get('/:projectId/members', getProjectMembers);
router.post('/:projectId/members', isAdmin, addMember);
router.delete('/:projectId/members/:userId', isAdmin, removeMember);

export default router;
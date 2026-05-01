import express from 'express';
import { body } from 'express-validator';
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProject,
  getProjectMembers,
  getProjects,
  removeProjectMember,
  updateProject
} from '../controllers/projectController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

const projectValidators = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Project name must be 2 to 100 characters'),
  body('deadline').optional({ nullable: true, checkFalsy: true }).isISO8601().custom((value) => {
    if (new Date(value) <= new Date()) throw new Error('Deadline must be in the future');
    return true;
  })
];

router.use(verifyToken);

router.route('/')
  .get(getProjects)
  .post(requireAdmin, projectValidators.map((validator) => validator.optional({ nullable: true })), body('name').exists().withMessage('Project name is required'), createProject);

router.route('/:id')
  .get(getProject)
  .put(requireAdmin, projectValidators, updateProject)
  .delete(requireAdmin, deleteProject);

router.post('/:id/members', requireAdmin, addProjectMember);
router.delete('/:id/members/:userId', requireAdmin, removeProjectMember);
router.get('/:id/members', getProjectMembers);

export default router;

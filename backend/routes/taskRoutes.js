import express from 'express';
import { body } from 'express-validator';
import {
  createTask,
  deleteTask,
  getMyTasks,
  getTask,
  getTasks,
  updateTask,
  updateTaskStatus
} from '../controllers/taskController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

const taskValidators = [
  body('title').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Task title must be 2 to 200 characters'),
  body('status').optional().isIn(['todo', 'in-progress', 'review', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true, checkFalsy: true }).isISO8601().custom((value) => {
    if (new Date(value) <= new Date()) throw new Error('Due date must be in the future');
    return true;
  })
];

router.use(verifyToken);

router.get('/my', getMyTasks);
router.route('/')
  .get(getTasks)
  .post(requireAdmin, body('title').exists().withMessage('Task title is required'), body('project').exists().withMessage('Project is required'), taskValidators, createTask);

router.route('/:id')
  .get(getTask)
  .put(taskValidators, updateTask)
  .delete(requireAdmin, deleteTask);

router.patch('/:id/status', body('status').isIn(['todo', 'in-progress', 'review', 'done']).withMessage('Invalid status'), updateTaskStatus);

export default router;

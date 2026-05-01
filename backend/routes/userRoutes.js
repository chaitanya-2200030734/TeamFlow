import express from 'express';
import { deleteUser, getUser, getUsers, updateUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireAdmin, requireSelfOrAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', requireAdmin, getUsers);
router.get('/:id', getUser);
router.put('/:id', requireSelfOrAdmin, updateUser);
router.delete('/:id', requireAdmin, deleteUser);

export default router;

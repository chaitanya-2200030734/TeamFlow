import express from 'express';
import { body } from 'express-validator';
import { getMe, login, logout, registerOrganization, signup } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/register-organization',
  [
    body('organizationName').trim().isLength({ min: 2, max: 100 }).withMessage('Organization name must be 2 to 100 characters'),
    body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2 to 80 characters'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
  ],
  registerOrganization
);

router.post(
  '/signup',
  [
    body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2 to 80 characters'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain at least one number'),
    body('organizationCode').trim().notEmpty().withMessage('Organization invite code is required')
  ],
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

router.get('/me', verifyToken, getMe);
router.post('/logout', verifyToken, logout);

export default router;

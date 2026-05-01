import express from 'express';
import {
  deleteOrganization,
  getOrganizations,
  resetInviteCode,
  resetOrganizationInviteCode
} from '../controllers/organizationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireAdmin, requireTeamflowAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', requireTeamflowAdmin, getOrganizations);
router.patch('/invite-code/reset', requireAdmin, resetInviteCode);
router.patch('/:id/invite-code/reset', requireTeamflowAdmin, resetOrganizationInviteCode);
router.delete('/:id', requireTeamflowAdmin, deleteOrganization);

export default router;

import { Router } from 'express';
import * as healthController from '../controllers/health.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.get('/live', healthController.liveness);
router.get('/ready', healthController.readiness);
// Metrics may expose internal data — restrict to admins (or scrape behind a network ACL).
router.get('/metrics', authenticate, authorize(UserRole.ADMIN), healthController.metrics);

export default router;

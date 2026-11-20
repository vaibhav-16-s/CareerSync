import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';
import { UserRole } from '../types';
import { createReportSchema, handleReportSchema } from '../validators/report.validator';

const router = Router();

// Any authenticated user can file a report (rate-limited to curb abuse)
router.post(
  '/',
  authenticate,
  authLimiter,
  validate(createReportSchema),
  reportController.create
);

// Admin triage
router.get('/', authenticate, authorize(UserRole.ADMIN), reportController.list);
router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(handleReportSchema),
  reportController.handle
);

export default router;

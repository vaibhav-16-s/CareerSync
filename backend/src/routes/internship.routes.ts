import { Router } from 'express';
import * as internshipController from '../controllers/internship.controller';
import * as applicationController from '../controllers/application.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UserRole } from '../types';
import {
  createInternshipSchema,
  updateInternshipSchema,
} from '../validators/internship.validator';
import { applySchema } from '../validators/application.validator';

const router = Router();

// Public browse + search
router.get('/', optionalAuth, internshipController.list);
router.get('/:id', optionalAuth, internshipController.getById);

// Company-only management
router.post(
  '/',
  authenticate,
  authorize(UserRole.COMPANY),
  validate(createInternshipSchema),
  internshipController.create
);
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.COMPANY, UserRole.ADMIN),
  validate(updateInternshipSchema),
  internshipController.update
);
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.COMPANY, UserRole.ADMIN),
  internshipController.remove
);

// Applications nested under an internship
router.post(
  '/:id/apply',
  authenticate,
  authorize(UserRole.STUDENT),
  validate(applySchema),
  applicationController.apply
);
router.get(
  '/:id/applications',
  authenticate,
  authorize(UserRole.COMPANY, UserRole.ADMIN),
  applicationController.listForInternship
);

export default router;

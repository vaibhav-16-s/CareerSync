import { Router } from 'express';
import * as applicationController from '../controllers/application.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UserRole } from '../types';
import { updateStatusSchema, addNoteSchema } from '../validators/application.validator';

const router = Router();

router.use(authenticate);

// Student: own applications
router.get('/me', authorize(UserRole.STUDENT), applicationController.myApplications);
router.delete('/:id', authorize(UserRole.STUDENT), applicationController.withdraw);

// Company / Admin: manage applicants
router.patch(
  '/:id/status',
  authorize(UserRole.COMPANY, UserRole.ADMIN),
  validate(updateStatusSchema),
  applicationController.updateStatus
);
router.post(
  '/:id/notes',
  authorize(UserRole.COMPANY, UserRole.ADMIN),
  validate(addNoteSchema),
  applicationController.addNote
);

export default router;

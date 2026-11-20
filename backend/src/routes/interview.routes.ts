import { Router } from 'express';
import * as interviewController from '../controllers/interview.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UserRole } from '../types';
import { createInterviewSchema, updateInterviewSchema } from '../validators/interview.validator';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(UserRole.COMPANY, UserRole.ADMIN),
  validate(createInterviewSchema),
  interviewController.create
);
router.get('/', interviewController.list);
router.get('/:id', interviewController.getById);
router.get('/:id/calendar.ics', interviewController.calendar);
router.patch('/:id', validate(updateInterviewSchema), interviewController.update);

export default router;

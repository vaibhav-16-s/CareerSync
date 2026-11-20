import { Router } from 'express';
import * as certificateController from '../controllers/certificate.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UserRole } from '../types';
import {
  issueCertificateSchema,
  revokeCertificateSchema,
} from '../validators/certificate.validator';

const router = Router();

// Public verification (no auth) — employers verify authenticity
router.get('/verify/:certificateId', certificateController.verify);

// Student: own certificates
router.get('/me', authenticate, authorize(UserRole.STUDENT), certificateController.myCertificates);

// Company/admin: issue + revoke
router.post(
  '/',
  authenticate,
  authorize(UserRole.COMPANY, UserRole.ADMIN),
  validate(issueCertificateSchema),
  certificateController.issue
);
router.patch(
  '/:id/revoke',
  authenticate,
  authorize(UserRole.COMPANY, UserRole.ADMIN),
  validate(revokeCertificateSchema),
  certificateController.revoke
);

export default router;

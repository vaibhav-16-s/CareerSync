import { Router } from 'express';
import * as companyController from '../controllers/company.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { uploadLogo, verifyFileSignature } from '../middleware/upload';
import { UserRole } from '../types';
import { updateCompanySchema, submitVerificationSchema } from '../validators/company.validator';

const router = Router();

// Public company profile
router.get('/:id', optionalAuth, companyController.getById);

// Company self-management
router.get('/', authenticate, authorize(UserRole.COMPANY), companyController.getMe);
router.put(
  '/',
  authenticate,
  authorize(UserRole.COMPANY),
  validate(updateCompanySchema),
  companyController.updateMe
);
router.post(
  '/logo',
  authenticate,
  authorize(UserRole.COMPANY),
  uploadLogo,
  verifyFileSignature('image'),
  companyController.uploadLogo
);
router.post(
  '/verification',
  authenticate,
  authorize(UserRole.COMPANY),
  validate(submitVerificationSchema),
  companyController.submitVerification
);
router.get('/me/analytics', authenticate, authorize(UserRole.COMPANY), companyController.analytics);
router.get('/me/applicants', authenticate, authorize(UserRole.COMPANY), companyController.applicants);

export default router;

import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UserRole } from '../types';
import { verifyCompanySchema, updateUserStatusSchema } from '../validators/admin.validator';

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/users', adminController.listUsers);
router.patch('/users/:id/status', validate(updateUserStatusSchema), adminController.updateUserStatus);

router.get('/companies/pending', adminController.pendingCompanies);
router.patch('/companies/:id/verify', validate(verifyCompanySchema), adminController.verifyCompany);

router.patch('/internships/:id/moderate', adminController.moderateInternship);

router.get('/analytics', adminController.analytics);

export default router;

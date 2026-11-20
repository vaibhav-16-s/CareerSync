import { Router } from 'express';
import * as publicController from '../controllers/public.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Public, unauthenticated profile pages (SEO + shareable)
router.get('/students/:slug', publicController.student);
router.get('/companies/:slug', publicController.company);

export default router;

// Authenticated visibility toggles + referral live under their own router
export const meRouter = Router();
meRouter.use(authenticate);
meRouter.get('/referral', publicController.myReferral);
meRouter.patch(
  '/students/visibility',
  authorize(UserRole.STUDENT),
  publicController.setStudentVisibility
);
meRouter.patch(
  '/companies/visibility',
  authorize(UserRole.COMPANY),
  publicController.setCompanyVisibility
);

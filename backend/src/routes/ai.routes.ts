import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authenticate, authorize } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate, aiLimiter);

// Student AI features
router.get('/match/:id', authorize(UserRole.STUDENT), aiController.matchScore);
router.get('/skill-gap', authorize(UserRole.STUDENT), aiController.skillGap);
router.get('/recommendations', authorize(UserRole.STUDENT), aiController.recommendations);
router.get('/resume-feedback', authorize(UserRole.STUDENT), aiController.resumeFeedback);

// Company AI feature
router.get(
  '/candidates/:id',
  authorize(UserRole.COMPANY, UserRole.ADMIN),
  aiController.candidateRecommendations
);

export default router;

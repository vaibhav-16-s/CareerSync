import { Router } from 'express';
import * as resumeController from '../controllers/resume.controller';
import { authenticate, authorize } from '../middleware/auth';
import { uploadResume, verifyFileSignature } from '../middleware/upload';
import { aiLimiter } from '../middleware/rateLimiter';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate, authorize(UserRole.STUDENT));

// Upload + analyze (rate-limited: parsing + AI are expensive)
router.post('/', aiLimiter, uploadResume, verifyFileSignature('resume'), resumeController.upload);

// Analyze from raw text (the in-app resume builder) — no file parsing
router.post('/text', aiLimiter, resumeController.analyzeText);

// Reports & history
router.get('/versions', resumeController.versions);
router.get('/latest', resumeController.latest);
router.get('/dashboard', resumeController.dashboard);
router.get('/compare', resumeController.compare);
router.get('/:id', resumeController.getById);
router.post('/:id/rewrite', aiLimiter, resumeController.rewrite);
router.delete('/:id', resumeController.remove);

export default router;

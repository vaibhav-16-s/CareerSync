import { Router } from 'express';
import * as studentController from '../controllers/student.controller';
import * as applicationController from '../controllers/application.controller';
import * as aiController from '../controllers/ai.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { uploadResume, uploadAvatar, verifyFileSignature } from '../middleware/upload';
import { aiLimiter } from '../middleware/rateLimiter';
import { UserRole } from '../types';
import { updateStudentSchema } from '../validators/student.validator';

const router = Router();

router.use(authenticate, authorize(UserRole.STUDENT));

router.get('/me', studentController.getMe);
router.put('/me', validate(updateStudentSchema), studentController.updateMe);
router.post('/me/resume', uploadResume, verifyFileSignature('resume'), studentController.uploadResume);
router.post('/me/avatar', uploadAvatar, verifyFileSignature('image'), studentController.uploadAvatar);
router.delete('/me/avatar', studentController.removeAvatar);
router.get('/me/dashboard', studentController.dashboard);

// Applications
router.get('/me/applications', applicationController.myApplications);

// Saved internships
router.get('/me/saved', studentController.listSaved);
router.post('/me/saved/:internshipId', studentController.saveInternship);
router.delete('/me/saved/:internshipId', studentController.unsaveInternship);

// AI features (student-facing)
router.get('/me/recommendations', aiLimiter, aiController.recommendations);
router.get('/me/skill-gap', aiLimiter, aiController.skillGap);

export default router;

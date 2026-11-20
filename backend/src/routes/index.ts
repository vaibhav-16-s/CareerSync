import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import companyRoutes from './company.routes';
import internshipRoutes from './internship.routes';
import applicationRoutes from './application.routes';
import notificationRoutes from './notification.routes';
import aiRoutes from './ai.routes';
import adminRoutes from './admin.routes';
// V2.0
import reportRoutes from './report.routes';
import interviewRoutes from './interview.routes';
import chatRoutes from './chat.routes';
import certificateRoutes from './certificate.routes';
import publicRoutes, { meRouter } from './public.routes';
import resumeRoutes from './resume.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, data: { name: 'InternBridge API', version: 'v2' } });
});

// V1
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/companies', companyRoutes);
router.use('/internships', internshipRoutes);
router.use('/applications', applicationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);

// V2.0 (additive)
router.use('/reports', reportRoutes);
router.use('/interviews', interviewRoutes);
router.use('/conversations', chatRoutes);
router.use('/certificates', certificateRoutes);
router.use('/public', publicRoutes);
router.use('/me', meRouter);
router.use('/resume', resumeRoutes);

export default router;

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { verifyOrigin } from '../middleware/csrf';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../validators/auth.validator';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', verifyOrigin, authController.refresh);
router.post('/logout', verifyOrigin, authenticate, authController.logout);
router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);
router.post(
  '/change-password',
  authenticate,
  authLimiter,
  validate(changePasswordSchema),
  authController.changePassword
);
router.get('/me', authenticate, authController.me);

export default router;

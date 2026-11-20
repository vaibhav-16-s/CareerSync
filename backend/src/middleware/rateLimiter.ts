import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

const handler = (_req: unknown, res: import('express').Response): void => {
  res.status(429).json({
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later' },
  });
};

export const globalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

// Stricter limiter for auth-sensitive endpoints (login, register, reset)
export const authLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler,
});

// Password-reset: must count successful (always-200) responses, otherwise an
// attacker can flood arbitrary inboxes with reset emails from one IP.
export const passwordResetLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

// AI endpoints are expensive — throttle harder
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

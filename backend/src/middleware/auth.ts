import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { User } from '../models/User';
import { UserRole, UserStatus } from '../types';

/**
 * Authenticates the request via Bearer access token.
 * Loads the user and attaches a minimal AuthUser to req.user.
 */
export const authenticate = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw AppError.unauthorized('Missing or malformed Authorization header');
  }

  const token = header.split(' ')[1];
  const payload = verifyAccessToken(token);

  const user = await User.findById(payload.sub).select('+tokenVersion');
  if (!user) throw AppError.unauthorized('User no longer exists');

  if (user.status === UserStatus.BANNED || user.status === UserStatus.SUSPENDED) {
    throw AppError.forbidden(`Account is ${user.status}`);
  }

  if (typeof payload.tokenVersion === 'number' && payload.tokenVersion !== user.tokenVersion) {
    throw AppError.unauthorized('Token has been revoked');
  }

  req.user = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
    status: user.status,
  };

  next();
});

/**
 * RBAC guard — restricts access to the given roles.
 */
export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(AppError.unauthorized());
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(AppError.forbidden('Your role is not permitted to access this resource'));
      return;
    }
    next();
  };

/**
 * Optional auth — attaches user if a valid token is present, otherwise continues.
 */
export const optionalAuth = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      next();
      return;
    }
    try {
      const payload = verifyAccessToken(header.split(' ')[1]);
      const user = await User.findById(payload.sub).select('+tokenVersion');
      // Mirror the strict-auth checks: active status AND non-revoked token.
      const tokenValid =
        typeof payload.tokenVersion !== 'number' || payload.tokenVersion === user?.tokenVersion;
      if (user && user.status === UserStatus.ACTIVE && tokenValid) {
        req.user = {
          id: user._id.toString(),
          role: user.role,
          email: user.email,
          status: user.status,
        };
      }
    } catch {
      /* ignore invalid token in optional auth — continue as anonymous */
    }
    next();
  }
);

import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as authService from '../services/auth.service';
import { env } from '../config/env';

const REFRESH_COOKIE = 'refreshToken';

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.secure ? 'none' : 'lax',
    domain: env.cookie.domain,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE, { domain: env.cookie.domain, path: '/' });
}

export const register = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  setRefreshCookie(res, refreshToken);
  sendSuccess(res, 201, { user, accessToken });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setRefreshCookie(res, refreshToken);
  sendSuccess(res, 200, { user, accessToken });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  // Cookie-only: never accept the refresh token from the body, so a token
  // leaked to JS/logs cannot be replayed and the CSRF/cookie model holds.
  const token = req.cookies?.[REFRESH_COOKIE];
  try {
    const { accessToken, refreshToken } = await authService.refresh(token);
    setRefreshCookie(res, refreshToken);
    sendSuccess(res, 200, { accessToken });
  } catch (err) {
    // Clear the stale/invalid cookie on any refresh failure. Otherwise the
    // browser keeps a dead cookie that route middleware treats as "logged in",
    // deadlocking the user out of /login and /register.
    clearRefreshCookie(res);
    throw err;
  }
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  if (req.user) await authService.logout(req.user.id);
  clearRefreshCookie(res);
  sendSuccess(res, 200, { message: 'Logged out successfully' });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  sendSuccess(res, 200, {
    message: 'If an account exists for that email, a reset link has been sent',
  });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.token, req.body.password);
  sendSuccess(res, 200, { message: 'Password reset successful, please log in' });
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await authService.changePassword(
    req.user!.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  setRefreshCookie(res, refreshToken);
  sendSuccess(res, 200, { accessToken, message: 'Password changed successfully' });
});

export const me = catchAsync(async (req: Request, res: Response) => {
  sendSuccess(res, 200, { user: req.user });
});

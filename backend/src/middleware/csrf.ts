import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

/**
 * Origin-based CSRF guard for cookie-authenticated, state-changing requests
 * (e.g. POST /auth/refresh, which reads the refresh-token cookie).
 *
 * The rest of the API authenticates with a Bearer access token in the
 * Authorization header, which browsers do not attach automatically — those
 * routes are inherently CSRF-safe and do not need this guard.
 */
export function verifyOrigin(req: Request, _res: Response, next: NextFunction): void {
  const allowed = new Set(env.clientUrl.split(',').map((o) => o.trim()));
  const originHeader = req.get('origin');
  const referer = req.get('referer');

  // A browser always sends `Origin` on cross-site state-changing requests.
  // Trust ONLY the Origin header (Referer is suppressible/spoofable). If there
  // is no Origin but there is a Referer, the request is browser-issued —
  // derive the origin from it. Genuinely headerless requests are non-browser
  // (e.g. curl/server-to-server) and cannot be CSRF'd, so allow them.
  let origin: string | null = null;
  if (originHeader) {
    origin = originHeader;
  } else if (referer) {
    try {
      origin = new URL(referer).origin;
    } catch {
      next(AppError.forbidden('Malformed Referer'));
      return;
    }
  }

  if (!origin) {
    next();
    return;
  }

  // Exact origin match (no prefix matching — blocks app.example.com.evil.com).
  if (!allowed.has(origin)) {
    next(AppError.forbidden('Cross-origin request rejected'));
    return;
  }
  next();
}

import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Edge middleware — coarse, defense-in-depth route gating.
//
// The refresh token is an httpOnly cookie (`refreshToken`) set by the backend.
// We CANNOT verify its signature here without sharing the backend secret with
// the edge runtime (which we deliberately do not), so this is a *presence*
// check only: it prevents the protected app shell from rendering for clearly
// unauthenticated visitors and bounces logged-in users away from /login.
//
// Authoritative authN/authZ still happens in two places:
//   1. The backend on every API call (JWT verify + RBAC).
//   2. The client RoleGuard, which knows the decoded user/role.
// ---------------------------------------------------------------------------

const PROTECTED_PREFIXES = ['/student', '/company', '/admin'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
const REFRESH_COOKIE = 'refreshToken';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has(REFRESH_COOKIE);

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtected && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && hasSession) {
    // Let the client decide the exact role home; default to root which
    // immediately redirects based on the decoded user.
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, static assets and the health route.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)'],
};

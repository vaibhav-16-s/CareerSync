import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

// ---------------------------------------------------------------------------
// Replaces the Next.js edge middleware (middleware.ts).
//
// The original did a *presence* check on the httpOnly `refreshToken` cookie to
// bounce clearly-unauthenticated visitors away from the app shell, and to keep
// logged-in users off /login. A Vite SPA has no server render, so the same
// gate runs on the client here — after AuthProvider's silent refresh, which
// means `isAuthenticated` is authoritative by the time this renders.
//
// Authoritative authN/authZ still happens in two places:
//   1. The backend on every API call (JWT verify + RBAC).
//   2. RoleGuard, which knows the decoded user/role.
// ---------------------------------------------------------------------------

const PROTECTED_PREFIXES = ['/student', '/company', '/admin'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function RouteGuard({ children }) {
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtected && !isAuthenticated) {
    // Preserve the original `?next=` round-trip so the user lands back on the
    // page they asked for after signing in.
    return <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />;
  }

  if (isAuthRoute && isAuthenticated) {
    // Root immediately redirects based on the decoded user's role.
    return <Navigate to="/" replace />;
  }

  return children;
}

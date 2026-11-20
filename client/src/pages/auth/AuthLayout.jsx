import { useEffect } from 'react';
import { Brand } from '@/components/layout/brand';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { AuthAnimation } from '@/components/shared/auth-animation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { goToRoleHome } from '@/lib/utils';
import { Sparkles, Target, ShieldCheck, Home } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
export default function AuthLayout({ children }) {
    const router = useNavigate();
    const pathname = useLocation().pathname;
    const user = useAuthStore((s) => s.user);
    // Login & register share the animated full-page background + centered card.
    const centered = pathname === '/login' || pathname === '/register';
    // Already signed in? Bounce to the role home.
    useEffect(() => {
        if (user)
            goToRoleHome(user.role, router);
    }, [user, router]);
    if (centered) {
        return (<div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-background p-6">
        <AuthAnimation />
        <div className="absolute left-6 top-6 z-10">
          <Brand href="/"/>
        </div>
        <div className="absolute right-6 top-6 z-10 flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <Home className="mr-1.5 h-4 w-4"/> Home
            </Link>
          </Button>
          <ThemeToggle />
        </div>
        <div className="relative z-10 w-full max-w-md py-10">{children}</div>
      </div>);
    }
    // Other auth pages: two-column brand/marketing layout.
    return (<div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Brand href="/" className="text-primary-foreground"/>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Bridge into the internship that fits you.
          </h2>
          <ul className="space-y-4 text-primary-foreground/90">
            <li className="flex items-start gap-3">
              <Target className="mt-0.5 h-5 w-5 shrink-0"/>
              <span>Explainable AI match scores on every internship.</span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0"/>
              <span>Personalised skill-gap analysis and learning paths.</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0"/>
              <span>Verified companies and a clean hiring pipeline.</span>
            </li>
          </ul>
        </div>
        <p className="text-sm text-primary-foreground/70">
          © {new Date().getFullYear()} InternBridge
        </p>
      </div>

      <div className="relative flex items-center justify-center p-6">
        <div className="absolute right-4 top-4 flex items-center gap-2 lg:hidden">
          <Brand href="/"/>
        </div>
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>);
}

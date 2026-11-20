'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brand } from './brand';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { InternshipsMenu } from './internships-menu';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/use-auth';
import { UserRole } from '@/types';
import { ROLE_HOME } from '@/constants';
import { cn } from '@/lib/utils';

const HOME_LINK = { label: 'Home', href: '/' };

const LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'For companies', href: '/#companies' },
  { label: 'About us', href: '/about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
];

export function PublicHeader({ active }: { active?: string }) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Brand href="/about" />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link
            href={HOME_LINK.href}
            className={cn(
              'hover:text-foreground',
              active === HOME_LINK.label && 'font-medium text-primary'
            )}
          >
            {HOME_LINK.label}
          </Link>
          <InternshipsMenu label="Jobs" />
          <InternshipsMenu label="Internships" />
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                'hover:text-foreground',
                active === link.label && 'font-medium text-primary'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              {/* "Sign in" while logged in signs out first, then routes to
                  /login — lets you switch accounts (e.g. an admin, whose
                  in-app dashboard lives in the separate AdminJS panel). */}
              <Button
                variant="ghost"
                disabled={logout.isPending}
                onClick={() => logout.mutate()}
                className="hidden sm:inline-flex"
              >
                Sign in
              </Button>
              {user.role !== UserRole.ADMIN && (
                <Button asChild>
                  <Link href={ROLE_HOME[user.role]}>Go to dashboard</Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

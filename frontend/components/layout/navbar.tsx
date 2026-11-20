'use client';

import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { NotificationCenter } from './notification-center';
import { UserNav } from './user-nav';
import { MobileNav } from './mobile-nav';
import type { NavItem } from './nav-config';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';

export function Navbar({ items, homeHref }: { items: NavItem[]; homeHref: string }) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <MobileNav items={items} homeHref={homeHref} />
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        {user?.role === UserRole.STUDENT && (
          <Button variant="ghost" size="icon" asChild aria-label="Saved internships">
            <Link href="/student/saved">
              <Bookmark className="h-5 w-5" />
            </Link>
          </Button>
        )}
        <ThemeToggle />
        <NotificationCenter />
        <UserNav />
      </div>
    </header>
  );
}

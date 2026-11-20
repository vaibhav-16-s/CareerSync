'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { ProductTour } from '@/components/onboarding/product-tour';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { navForRole } from './nav-config';
import { ROLE_HOME } from '@/constants';
import type { UserRole } from '@/types';

// Shared authenticated shell: sidebar + top navbar + scrollable content area.
// Wrapped in a RoleGuard so only the intended role(s) can reach the portal.
export function AppShell({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const items = navForRole(role);
  const homeHref = ROLE_HOME[role];

  return (
    <RoleGuard allow={[role]}>
      <ProductTour />
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar items={items} homeHref={homeHref} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar items={items} homeHref={homeHref} />
          <main className="w-full flex-1 animate-fade-in space-y-6 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}

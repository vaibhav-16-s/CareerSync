import { AppShell } from '@/components/layout/app-shell';
import { UserRole } from '@/types';

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role={UserRole.COMPANY}>{children}</AppShell>;
}

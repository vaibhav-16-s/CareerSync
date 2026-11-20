import { AppShell } from '@/components/layout/app-shell';
import { UserRole } from '@/types';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role={UserRole.STUDENT}>{children}</AppShell>;
}

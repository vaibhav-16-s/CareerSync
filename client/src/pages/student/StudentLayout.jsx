import { AppShell } from '@/components/layout/app-shell';
import { UserRole } from '@/types';
export default function StudentLayout({ children }) {
    return <AppShell role={UserRole.STUDENT}>{children}</AppShell>;
}

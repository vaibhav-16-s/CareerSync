import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { goToRoleHome } from '@/lib/utils';
import { Loader } from '@/components/ui/loader';
import { useNavigate } from 'react-router-dom';
// Client-side gate. The AuthProvider has already attempted a silent refresh by
// the time this renders, so `user` is authoritative here.
export function RoleGuard({ allow, children }) {
    const router = useNavigate();
    const user = useAuthStore((s) => s.user);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    useEffect(() => {
        if (!isAuthenticated || !user) {
            router('/login', { replace: true });
            return;
        }
        if (!allow.includes(user.role)) {
            goToRoleHome(user.role, router);
        }
    }, [isAuthenticated, user, allow, router]);
    if (!isAuthenticated || !user || !allow.includes(user.role)) {
        return (<div className="flex h-[60vh] items-center justify-center">
        <Loader label="Checking access…"/>
      </div>);
    }
    return <>{children}</>;
}

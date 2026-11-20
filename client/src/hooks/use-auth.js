import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authService } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { goToRoleHome } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
export function useLogin() {
    const router = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    return useMutation({
        mutationFn: (payload) => authService.login(payload),
        onSuccess: ({ user, accessToken }) => {
            setAuth(user, accessToken);
            toast.success(`Welcome back, ${user.email.split('@')[0]}!`);
            goToRoleHome(user.role, router);
        },
    });
}
export function useRegister() {
    const router = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    return useMutation({
        mutationFn: (payload) => authService.register(payload),
        onSuccess: ({ user, accessToken }) => {
            setAuth(user, accessToken);
            toast.success('Account created — welcome to InternBridge!');
            goToRoleHome(user.role, router);
        },
    });
}
export function useLogout() {
    const router = useNavigate();
    const queryClient = useQueryClient();
    const reset = useAuthStore((s) => s.reset);
    const resetUser = useUserStore((s) => s.reset);
    return useMutation({
        mutationFn: () => authService.logout(),
        onSettled: () => {
            reset();
            resetUser();
            queryClient.clear();
            router('/login', { replace: true });
        },
    });
}
export function useForgotPassword() {
    return useMutation({
        mutationFn: (email) => authService.forgotPassword(email),
        onSuccess: (data) => toast.success(data.message),
    });
}
export function useResetPassword() {
    const router = useNavigate();
    return useMutation({
        mutationFn: ({ token, password }) => authService.resetPassword(token, password),
        onSuccess: (data) => {
            toast.success(data.message);
            router('/login', { replace: true });
        },
    });
}

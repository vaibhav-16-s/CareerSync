import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import { qk } from '@/lib/query-keys';
export function useAdminUsers(params) {
    return useQuery({
        queryKey: qk.admin.users(params),
        queryFn: () => adminService.listUsers(params),
    });
}
export function useUpdateUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, reason, }) => adminService.updateUserStatus(id, status, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            toast.success('User status updated');
        },
    });
}
export function usePendingCompanies(params) {
    return useQuery({
        queryKey: qk.admin.pendingCompanies(params),
        queryFn: () => adminService.pendingCompanies(params),
    });
}
export function useVerifyCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, decision, reason, }) => adminService.verifyCompany(id, decision, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'pending-companies'] });
            queryClient.invalidateQueries({ queryKey: qk.admin.analytics });
            toast.success('Company verification updated');
        },
    });
}
export function useAdminAnalytics() {
    return useQuery({
        queryKey: qk.admin.analytics,
        queryFn: () => adminService.analytics(),
    });
}

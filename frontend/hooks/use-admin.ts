'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import { qk } from '@/lib/query-keys';
import type { UserStatus } from '@/types';

export function useAdminUsers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: qk.admin.users(params),
    queryFn: () => adminService.listUsers(params),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: UserStatus;
      reason?: string;
    }) => adminService.updateUserStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User status updated');
    },
  });
}

export function usePendingCompanies(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: qk.admin.pendingCompanies(params),
    queryFn: () => adminService.pendingCompanies(params),
  });
}

export function useVerifyCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      decision,
      reason,
    }: {
      id: string;
      decision: 'verified' | 'rejected';
      reason?: string;
    }) => adminService.verifyCompany(id, decision, reason),
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

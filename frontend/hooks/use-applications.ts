'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { applicationService } from '@/services/application.service';
import { qk } from '@/lib/query-keys';
import type { ApplicationStatus } from '@/types';

export function useMyApplications(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: qk.student.applications(params),
    queryFn: () => applicationService.mine(params),
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationService.withdraw(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'applications'] });
      queryClient.invalidateQueries({ queryKey: qk.student.dashboard });
      toast.success('Application withdrawn');
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: string;
      status: ApplicationStatus;
      note?: string;
    }) => applicationService.updateStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', 'applicants'] });
      queryClient.invalidateQueries({ queryKey: ['internships', 'applications'] });
      queryClient.invalidateQueries({ queryKey: qk.company.analytics });
      toast.success('Status updated');
    },
  });
}

export function useAddApplicationNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      applicationService.addNote(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', 'applicants'] });
      queryClient.invalidateQueries({ queryKey: ['internships', 'applications'] });
      toast.success('Note added');
    },
  });
}

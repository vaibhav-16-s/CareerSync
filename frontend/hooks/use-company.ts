'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { companyService, type CompanyProfileUpdate } from '@/services/company.service';
import { qk } from '@/lib/query-keys';
import { useUserStore } from '@/store/user.store';

export function useCompanyProfile(enabled = true) {
  const setCompanyProfile = useUserStore((s) => s.setCompanyProfile);
  return useQuery({
    queryKey: qk.company.me,
    queryFn: async () => {
      const data = await companyService.getMe();
      setCompanyProfile(data);
      return data;
    },
    enabled,
  });
}

export function usePublicCompany(id: string) {
  return useQuery({
    queryKey: qk.company.byId(id),
    queryFn: () => companyService.getById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const setCompanyProfile = useUserStore((s) => s.setCompanyProfile);
  return useMutation({
    mutationFn: (payload: CompanyProfileUpdate) => companyService.updateMe(payload),
    onSuccess: (data) => {
      setCompanyProfile(data);
      queryClient.setQueryData(qk.company.me, data);
      toast.success('Company profile updated');
    },
  });
}

export function useUploadLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => companyService.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.company.me });
      toast.success('Logo updated');
    },
  });
}

export function useSubmitVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (docs: { name: string; url: string }[]) =>
      companyService.submitVerification(docs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.company.me });
      queryClient.invalidateQueries({ queryKey: qk.company.analytics });
      toast.success('Verification submitted for review');
    },
  });
}

export function useCompanyAnalytics() {
  return useQuery({
    queryKey: qk.company.analytics,
    queryFn: () => companyService.analytics(),
  });
}

export function useCompanyApplicants(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: qk.company.applicants(params),
    queryFn: () => companyService.applicants(params),
  });
}

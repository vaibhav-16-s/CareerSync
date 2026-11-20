'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resumeService } from '@/services/resume.service';

const keys = {
  dashboard: ['resume', 'dashboard'] as const,
  versions: ['resume', 'versions'] as const,
  detail: (id: string) => ['resume', 'detail', id] as const,
};

export function useResumeDashboard() {
  return useQuery({ queryKey: keys.dashboard, queryFn: () => resumeService.dashboard() });
}

export function useResumeVersions() {
  return useQuery({ queryKey: keys.versions, queryFn: () => resumeService.versions() });
}

export function useResumeVersion(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => resumeService.getById(id),
    enabled: Boolean(id),
  });
}

export function useUploadResumeAnalysis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => resumeService.upload(file),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['resume'] });
      qc.invalidateQueries({ queryKey: ['student'] });
      toast.success(`Resume analyzed — score ${data.report?.overallScore ?? '—'}/100`);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? 'Analysis failed';
      toast.error(msg);
    },
  });
}

export function useAnalyzeResumeText() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ text, name }: { text: string; name?: string }) =>
      resumeService.analyzeText(text, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume'] });
      qc.invalidateQueries({ queryKey: ['student'] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? 'Analysis failed';
      toast.error(msg);
    },
  });
}

export function useRewriteResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumeService.rewrite(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) });
      toast.success('Resume rewrite ready');
    },
  });
}

export function useDeleteResumeVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumeService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume'] });
      toast.success('Version deleted');
    },
  });
}

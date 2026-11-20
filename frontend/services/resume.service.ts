import { api, http } from '@/lib/axios';
import type { ApiSuccess, ResumeDashboard, ResumeVersion } from '@/types';

export interface ResumeCompare {
  a: { id: string; version: number; scores: ResumeVersion['scores'] };
  b: { id: string; version: number; scores: ResumeVersion['scores'] };
  overallDelta: number;
  categories: { key: string; label: string; a: number; b: number; delta: number }[];
}

export const resumeService = {
  upload: async (file: File): Promise<ResumeVersion> => {
    const form = new FormData();
    form.append('resume', file);
    const res = await api.post<ApiSuccess<ResumeVersion>>('/resume', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60_000,
    });
    return res.data.data;
  },

  // Analyze a resume built in-app (raw text) — bypasses PDF parsing.
  analyzeText: (text: string, name?: string) =>
    http.post<ResumeVersion>('/resume/text', { text, name }),

  versions: () => http.get<ResumeVersion[]>('/resume/versions'),
  latest: () => http.get<ResumeVersion | null>('/resume/latest'),
  dashboard: () => http.get<ResumeDashboard>('/resume/dashboard'),
  getById: (id: string) => http.get<ResumeVersion>(`/resume/${id}`),
  compare: (a: string, b: string) =>
    http.get<ResumeCompare>('/resume/compare', { params: { a, b } }),
  rewrite: (id: string) => http.post<Record<string, unknown>>(`/resume/${id}/rewrite`),
  remove: (id: string) => http.delete<{ id: string }>(`/resume/${id}`),
};

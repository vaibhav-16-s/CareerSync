import { api, http } from '@/lib/axios';
import type { ApiSuccess, ApplicantBoard, Company, CompanyAnalytics } from '@/types';

export interface CompanyProfileUpdate {
  name?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  founder?: string;
  foundedYear?: number;
  headquarters?: string;
  email?: string;
  socials?: { linkedin?: string; twitter?: string };
  leadership?: { name: string; title?: string }[];
  location?: { city?: string; country?: string };
}

export const companyService = {
  getMe: () => http.get<Company>('/companies'),

  getById: (id: string) => http.get<Company>(`/companies/${id}`),

  updateMe: (payload: CompanyProfileUpdate) => http.put<Company>('/companies', payload),

  uploadLogo: async (file: File) => {
    const form = new FormData();
    form.append('logo', file);
    const res = await api.post<ApiSuccess<{ logoUrl: string }>>(
      '/companies/logo',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data.data;
  },

  submitVerification: (docs: { name: string; url: string }[]) =>
    http.post<Company>('/companies/verification', { docs }),

  analytics: () => http.get<CompanyAnalytics>('/companies/me/analytics'),

  applicants: (params?: Record<string, unknown>) =>
    http.get<ApplicantBoard>('/companies/me/applicants', { params }),
};

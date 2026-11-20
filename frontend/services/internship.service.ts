import { http } from '@/lib/axios';
import type {
  Application,
  Internship,
  InternshipFilters,
  Paginated,
  Proficiency,
} from '@/types';

export interface InternshipInput {
  title: string;
  description: string;
  role?: string;
  requiredSkills: {
    skillId: string;
    name: string;
    weight: number;
    minProficiency: Proficiency;
  }[];
  niceToHaveSkills?: { skillId: string; name: string }[];
  eligibility?: { minYear?: number; maxYear?: number };
  location: { city?: string; remoteOk: boolean };
  stipend: { amount: number; currency: string; period: string };
  duration?: string;
  openings: number;
  deadline?: string;
  status?: string;
}

export const internshipService = {
  list: async (filters?: InternshipFilters): Promise<Paginated<Internship>> => {
    const { data, meta } = await http.getWithMeta<Internship[]>('/internships', {
      params: filters,
    });
    return { items: data, meta: meta ?? {} };
  },

  getById: (id: string) => http.get<Internship>(`/internships/${id}`),

  create: (payload: InternshipInput) => http.post<Internship>('/internships', payload),

  update: (id: string, payload: Partial<InternshipInput>) =>
    http.put<Internship>(`/internships/${id}`, payload),

  remove: (id: string) => http.delete<{ message: string }>(`/internships/${id}`),

  apply: (id: string, coverLetter?: string) =>
    http.post<Application>(`/internships/${id}/apply`, { coverLetter }),

  applications: async (
    id: string,
    params?: Record<string, unknown>
  ): Promise<Paginated<Application>> => {
    const { data, meta } = await http.getWithMeta<Application[]>(
      `/internships/${id}/applications`,
      { params }
    );
    return { items: data, meta: meta ?? {} };
  },
};

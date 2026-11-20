import { http } from '@/lib/axios';
import type { Application, ApplicationStatus, Paginated } from '@/types';

export const applicationService = {
  mine: async (params?: Record<string, unknown>): Promise<Paginated<Application>> => {
    const { data, meta } = await http.getWithMeta<Application[]>('/applications/me', {
      params,
    });
    return { items: data, meta: meta ?? {} };
  },

  withdraw: (id: string) => http.delete<Application>(`/applications/${id}`),

  updateStatus: (id: string, status: ApplicationStatus, note?: string) =>
    http.patch<Application>(`/applications/${id}/status`, { status, note }),

  addNote: (id: string, text: string) =>
    http.post<Application>(`/applications/${id}/notes`, { text }),
};

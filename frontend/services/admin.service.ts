import { http } from '@/lib/axios';
import type {
  AuthUser,
  Company,
  Paginated,
  PlatformAnalytics,
  UserStatus,
} from '@/types';

export const adminService = {
  listUsers: async (params?: Record<string, unknown>): Promise<Paginated<AuthUser>> => {
    const { data, meta } = await http.getWithMeta<AuthUser[]>('/admin/users', {
      params,
    });
    return { items: data, meta: meta ?? {} };
  },

  updateUserStatus: (id: string, status: UserStatus, reason?: string) =>
    http.patch<AuthUser>(`/admin/users/${id}/status`, { status, reason }),

  pendingCompanies: async (
    params?: Record<string, unknown>
  ): Promise<Paginated<Company>> => {
    const { data, meta } = await http.getWithMeta<Company[]>(
      '/admin/companies/pending',
      { params }
    );
    return { items: data, meta: meta ?? {} };
  },

  verifyCompany: (id: string, decision: 'verified' | 'rejected', reason?: string) =>
    http.patch<Company>(`/admin/companies/${id}/verify`, { decision, reason }),

  moderateInternship: (id: string) =>
    http.patch<{ message: string }>(`/admin/internships/${id}/moderate`),

  analytics: () => http.get<PlatformAnalytics>('/admin/analytics'),
};

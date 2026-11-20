import { http } from '@/lib/axios';
export const adminService = {
    listUsers: async (params) => {
        const { data, meta } = await http.getWithMeta('/admin/users', {
            params,
        });
        return { items: data, meta: meta ?? {} };
    },
    updateUserStatus: (id, status, reason) => http.patch(`/admin/users/${id}/status`, { status, reason }),
    pendingCompanies: async (params) => {
        const { data, meta } = await http.getWithMeta('/admin/companies/pending', { params });
        return { items: data, meta: meta ?? {} };
    },
    verifyCompany: (id, decision, reason) => http.patch(`/admin/companies/${id}/verify`, { decision, reason }),
    moderateInternship: (id) => http.patch(`/admin/internships/${id}/moderate`),
    analytics: () => http.get('/admin/analytics'),
};

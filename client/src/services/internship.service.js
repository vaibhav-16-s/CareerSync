import { http } from '@/lib/axios';
export const internshipService = {
    list: async (filters) => {
        const { data, meta } = await http.getWithMeta('/internships', {
            params: filters,
        });
        return { items: data, meta: meta ?? {} };
    },
    getById: (id) => http.get(`/internships/${id}`),
    create: (payload) => http.post('/internships', payload),
    update: (id, payload) => http.put(`/internships/${id}`, payload),
    remove: (id) => http.delete(`/internships/${id}`),
    apply: (id, coverLetter) => http.post(`/internships/${id}/apply`, { coverLetter }),
    applications: async (id, params) => {
        const { data, meta } = await http.getWithMeta(`/internships/${id}/applications`, { params });
        return { items: data, meta: meta ?? {} };
    },
};

import { http } from '@/lib/axios';
export const applicationService = {
    mine: async (params) => {
        const { data, meta } = await http.getWithMeta('/applications/me', {
            params,
        });
        return { items: data, meta: meta ?? {} };
    },
    withdraw: (id) => http.delete(`/applications/${id}`),
    updateStatus: (id, status, note) => http.patch(`/applications/${id}/status`, { status, note }),
    addNote: (id, text) => http.post(`/applications/${id}/notes`, { text }),
};

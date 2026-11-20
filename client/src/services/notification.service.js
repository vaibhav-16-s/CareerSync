import { http } from '@/lib/axios';
export const notificationService = {
    list: async (params) => {
        const { data, meta } = await http.getWithMeta('/notifications', {
            params,
        });
        return { items: data, meta: meta ?? {} };
    },
    markRead: (id) => http.patch(`/notifications/${id}/read`),
    markAllRead: () => http.patch('/notifications/read-all'),
};

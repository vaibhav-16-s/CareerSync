import { http } from '@/lib/axios';
import type { Notification, Paginated } from '@/types';

export const notificationService = {
  list: async (params?: Record<string, unknown>): Promise<Paginated<Notification>> => {
    const { data, meta } = await http.getWithMeta<Notification[]>('/notifications', {
      params,
    });
    return { items: data, meta: meta ?? {} };
  },

  markRead: (id: string) => http.patch<Notification>(`/notifications/${id}/read`),

  markAllRead: () => http.patch<{ updated: number }>('/notifications/read-all'),
};

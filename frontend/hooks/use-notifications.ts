'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';
import { qk } from '@/lib/query-keys';
import { useNotificationStore } from '@/store/notification.store';
import { useAuthStore } from '@/store/auth.store';

export function useNotifications(params?: Record<string, unknown>) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const query = useQuery({
    queryKey: qk.notifications.list(params),
    queryFn: () => notificationService.list(params),
    enabled: isAuthenticated,
    refetchInterval: 60_000,
  });

  useEffect(() => {
    if (query.data) {
      const unread = query.data.items.filter((n) => !n.read).length;
      setUnreadCount(unread);
    }
  }, [query.data, setUnreadCount]);

  return query;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const decrement = useNotificationStore((s) => s.decrement);
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      decrement();
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const clearUnread = useNotificationStore((s) => s.clearUnread);
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      clearUnread();
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
    },
  });
}

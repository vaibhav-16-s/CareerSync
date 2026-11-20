import { create } from 'zustand';

// Lightweight UI state for the notification bell. The list itself is owned by
// TanStack Query; this just mirrors the unread count and drawer open state.
interface NotificationState {
  unreadCount: number;
  drawerOpen: boolean;
  setUnreadCount: (n: number) => void;
  decrement: () => void;
  clearUnread: () => void;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  drawerOpen: false,
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  decrement: () =>
    set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),
  clearUnread: () => set({ unreadCount: 0 }),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
}));

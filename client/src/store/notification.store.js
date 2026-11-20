import { create } from 'zustand';
export const useNotificationStore = create((set) => ({
    unreadCount: 0,
    drawerOpen: false,
    setUnreadCount: (unreadCount) => set({ unreadCount }),
    decrement: () => set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),
    clearUnread: () => set({ unreadCount: 0 }),
    setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
    toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
}));

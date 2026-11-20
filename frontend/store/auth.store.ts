import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AUTH_STORAGE_KEY } from '@/constants';
import { tokenStore } from '@/lib/token';
import type { AuthUser, UserRole } from '@/types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;

  setAuth: (user: AuthUser, accessToken: string) => void;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setHydrated: (v: boolean) => void;
  hasRole: (...roles: UserRole[]) => boolean;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      hydrated: false,

      setAuth: (user, accessToken) => {
        tokenStore.set(accessToken);
        set({ user, accessToken, isAuthenticated: true });
      },

      setUser: (user) =>
        set({ user, isAuthenticated: Boolean(user) }),

      setToken: (token) => {
        tokenStore.set(token);
        set({ accessToken: token });
      },

      setHydrated: (v) => set({ hydrated: v }),

      hasRole: (...roles) => {
        const role = get().user?.role;
        return role ? roles.includes(role) : false;
      },

      reset: () => {
        tokenStore.clear();
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // We persist only the user (a UX convenience). The access token lives in
      // memory and is re-minted via the refresh cookie on reload.
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

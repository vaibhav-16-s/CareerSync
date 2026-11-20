import { api, http } from '@/lib/axios';
import { tokenStore } from '@/lib/token';
import type {
  ApiSuccess,
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '@/types';

export const authService = {
  login: (payload: LoginPayload) =>
    http.post<AuthResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    http.post<AuthResponse>('/auth/register', payload),

  logout: () => http.post<{ message: string }>('/auth/logout'),

  me: () => http.get<{ user: AuthUser }>('/auth/me'),

  forgotPassword: (email: string) =>
    http.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    http.post<{ message: string }>('/auth/reset-password', { token, password }),

  // Authenticated password change — backend re-issues a fresh access token so
  // the current device stays logged in while other sessions are invalidated.
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.post<ApiSuccess<{ accessToken: string; message: string }>>(
      '/auth/change-password',
      { currentPassword, newPassword }
    );
    const token = res.data?.data?.accessToken;
    if (token) tokenStore.set(token);
    return res.data.data;
  },

  // Direct call (bypasses http wrapper) so callers can read accessToken explicitly.
  refresh: async (): Promise<string | null> => {
    const res = await api.post<ApiSuccess<{ accessToken: string }>>(
      '/auth/refresh',
      {}
    );
    return res.data?.data?.accessToken ?? null;
  },
};

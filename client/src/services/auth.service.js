import { api, http } from '@/lib/axios';
import { tokenStore } from '@/lib/token';
export const authService = {
    login: (payload) => http.post('/auth/login', payload),
    register: (payload) => http.post('/auth/register', payload),
    logout: () => http.post('/auth/logout'),
    me: () => http.get('/auth/me'),
    forgotPassword: (email) => http.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => http.post('/auth/reset-password', { token, password }),
    // Authenticated password change — backend re-issues a fresh access token so
    // the current device stays logged in while other sessions are invalidated.
    changePassword: async (currentPassword, newPassword) => {
        const res = await api.post('/auth/change-password', { currentPassword, newPassword });
        const token = res.data?.data?.accessToken;
        if (token)
            tokenStore.set(token);
        return res.data.data;
    },
    // Direct call (bypasses http wrapper) so callers can read accessToken explicitly.
    refresh: async () => {
        const res = await api.post('/auth/refresh', {});
        return res.data?.data?.accessToken ?? null;
    },
};

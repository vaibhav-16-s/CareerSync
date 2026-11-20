import axios from 'axios';
import { API_URL } from '@/constants';
import { tokenStore } from '@/lib/token';
// ---------------------------------------------------------------------------
// Axios instance — withCredentials so the httpOnly refresh cookie travels.
// ---------------------------------------------------------------------------
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30_000,
});
// ---- Request interceptor: attach bearer token ----
api.interceptors.request.use((config) => {
    const token = tokenStore.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// ---------------------------------------------------------------------------
// Refresh-token handling with a single-flight queue.
// On 401 we attempt POST /auth/refresh exactly once; concurrent failures wait
// for the in-flight refresh, then retry with the new token.
// ---------------------------------------------------------------------------
let isRefreshing = false;
let refreshWaiters = [];
function flushWaiters(token) {
    refreshWaiters.forEach((cb) => cb(token));
    refreshWaiters = [];
}
async function performRefresh() {
    try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const token = res.data?.data?.accessToken ?? null;
        tokenStore.set(token);
        return token;
    }
    catch {
        tokenStore.clear();
        return null;
    }
}
api.interceptors.response.use((response) => response, async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || '';
    const isAuthEndpoint = url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/forgot-password') ||
        url.includes('/auth/reset-password');
    if (status === 401 && !original._retry && !isAuthEndpoint) {
        original._retry = true;
        if (isRefreshing) {
            // queue until the in-flight refresh resolves
            return new Promise((resolve, reject) => {
                refreshWaiters.push((token) => {
                    if (!token) {
                        reject(error);
                        return;
                    }
                    original.headers.Authorization = `Bearer ${token}`;
                    resolve(api(original));
                });
            });
        }
        isRefreshing = true;
        const newToken = await performRefresh();
        isRefreshing = false;
        flushWaiters(newToken);
        if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
            return api(original);
        }
        tokenStore.triggerUnauthorized();
    }
    return Promise.reject(error);
});
// ---------------------------------------------------------------------------
// Typed helpers — unwrap the { success, data, meta } envelope.
// ---------------------------------------------------------------------------
export async function unwrap(promise) {
    const res = await promise;
    return res.data.data;
}
export async function unwrapWithMeta(promise) {
    const res = await promise;
    return { data: res.data.data, meta: res.data.meta };
}
export const http = {
    get: (url, config) => unwrap(api.get(url, config)),
    getWithMeta: (url, config) => unwrapWithMeta(api.get(url, config)),
    post: (url, body, config) => unwrap(api.post(url, body, config)),
    put: (url, body, config) => unwrap(api.put(url, body, config)),
    patch: (url, body, config) => unwrap(api.patch(url, body, config)),
    delete: (url, config) => unwrap(api.delete(url, config)),
};

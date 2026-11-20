import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_URL } from '@/constants';
import { tokenStore } from '@/lib/token';
import type { ApiSuccess } from '@/types';

// ---------------------------------------------------------------------------
// Axios instance — withCredentials so the httpOnly refresh cookie travels.
// ---------------------------------------------------------------------------
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// ---- Request interceptor: attach bearer token ----
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
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
let refreshWaiters: Array<(token: string | null) => void> = [];

function flushWaiters(token: string | null) {
  refreshWaiters.forEach((cb) => cb(token));
  refreshWaiters = [];
}

async function performRefresh(): Promise<string | null> {
  try {
    const res = await axios.post<ApiSuccess<{ accessToken: string }>>(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const token = res.data?.data?.accessToken ?? null;
    tokenStore.set(token);
    return token;
  } catch {
    tokenStore.clear();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const url = original?.url || '';

    const isAuthEndpoint =
      url.includes('/auth/login') ||
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
  }
);

// ---------------------------------------------------------------------------
// Typed helpers — unwrap the { success, data, meta } envelope.
// ---------------------------------------------------------------------------
export async function unwrap<T>(
  promise: Promise<{ data: ApiSuccess<T> }>
): Promise<T> {
  const res = await promise;
  return res.data.data;
}

export async function unwrapWithMeta<T>(
  promise: Promise<{ data: ApiSuccess<T> }>
): Promise<{ data: T; meta: ApiSuccess<T>['meta'] }> {
  const res = await promise;
  return { data: res.data.data, meta: res.data.meta };
}

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(api.get(url, config)),
  getWithMeta: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrapWithMeta<T>(api.get(url, config)),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(api.post(url, body, config)),
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(api.put(url, body, config)),
  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(api.patch(url, body, config)),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(api.delete(url, config)),
};

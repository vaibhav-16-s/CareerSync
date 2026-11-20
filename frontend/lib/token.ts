// In-memory access token holder. The Zustand auth store is the source of truth
// for persisted UI state, but the axios interceptors need synchronous access to
// the current token without importing the store (avoids circular dependencies).

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
  setUnauthorizedHandler: (fn: () => void) => {
    onUnauthorized = fn;
  },
  triggerUnauthorized: () => {
    onUnauthorized?.();
  },
};

// In-memory access token holder. The Zustand auth store is the source of truth
// for persisted UI state, but the axios interceptors need synchronous access to
// the current token without importing the store (avoids circular dependencies).
let accessToken = null;
let onUnauthorized = null;
export const tokenStore = {
    get: () => accessToken,
    set: (token) => {
        accessToken = token;
    },
    clear: () => {
        accessToken = null;
    },
    setUnauthorizedHandler: (fn) => {
        onUnauthorized = fn;
    },
    triggerUnauthorized: () => {
        onUnauthorized?.();
    },
};

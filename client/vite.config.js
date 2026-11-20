/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Backend origin used by the dev proxy. Mirrors the `rewrites()` block that
// next.config.mjs used to serve, so `/api/proxy/*` still reaches the API.
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_ORIGIN = new URL(API_URL).origin;
const API_BASE_PATH = new URL(API_URL).pathname.replace(/\/$/, '');

export default defineConfig({
  plugins: [react()],

  resolve: {
    // Preserves the `@/*` -> project-root alias from tsconfig.json, now
    // pointing at client/src so every existing `@/components/...` import
    // keeps working unchanged.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    // Port 3000 is intentional: the backend's CLIENT_URL/CORS origin and the
    // refresh-token cookie are both bound to http://localhost:3000.
    port: 3000,
    strictPort: true,
    proxy: {
      '/api/proxy': {
        target: API_ORIGIN,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, API_BASE_PATH),
      },
    },
  },

  preview: {
    port: 3000,
    strictPort: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    include: ['**/*.{test,spec}.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['**/*.config.*', '**/dist/**', '**/node_modules/**'],
    },
  },
});

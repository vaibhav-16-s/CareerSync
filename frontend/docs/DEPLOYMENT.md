# Deployment Guide

## Prerequisites

- Node.js 20+
- A reachable backend API (set `NEXT_PUBLIC_API_URL`)
- Backend CORS configured to allow the web origin with credentials, and the
  refresh cookie issued as `SameSite=None; Secure` in production.

## Build

```bash
npm ci
npm run lint && npm run type-check && npm run test
npm run build
npm run start        # serves the production build on :3000
```

## Option A — Vercel (recommended for Next.js)

1. Import the repo; set the **root directory** to `frontend/`.
2. Add env vars (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_NAME`).
3. Deploy. `middleware.ts`, `app/api/health` and security headers work natively.
4. Point an uptime monitor at `https://<domain>/api/health`.

## Option B — Docker

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start"]
```

> For the smallest image, enable `output: 'standalone'` in `next.config.mjs` and
> copy `.next/standalone` instead of the full `node_modules`.

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.internbridge.app/api/v1 -t internbridge-web .
docker run -p 3000:3000 internbridge-web
```

## CI gate (suggested)

```yaml
- run: npm ci
- run: npm run lint
- run: npm run type-check
- run: npm run test
- run: npm run build
```

## Post-deploy checklist

- [ ] `/api/health` returns `200` with `backend: "up"`.
- [ ] Login → refresh-token cookie set, `Secure` + `HttpOnly` + `SameSite=None`.
- [ ] Hard refresh on a protected page keeps you signed in (silent refresh).
- [ ] Security headers present (`curl -I` shows HSTS, `X-Frame-Options`, etc.).
- [ ] Uptime monitor wired to `/api/health`.
- [ ] Error monitoring (Sentry/Datadog) DSN added to `app/error.tsx` sink.

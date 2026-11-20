# Deployment Guide

## 1. Prerequisites

- Node.js ≥ 18, MongoDB (Atlas recommended), Cloudinary account, SMTP provider, Gemini API key.
- A reverse proxy / load balancer terminating TLS (the app sets `trust proxy: 1`).

## 2. Local

```bash
cd backend
cp .env.example .env        # fill secrets (see docs/ENVIRONMENT.md)
npm install
npm run seed                # optional demo data
npm run dev                 # http://localhost:5000/api/v1
```

## 3. Build & run (production)

```bash
npm ci
npm run build               # → dist/
NODE_ENV=production node dist/server.js
```

Set `NODE_ENV=production` and `COOKIE_SECURE=true` (requires HTTPS). Run behind a process manager (pm2/systemd) or a container orchestrator.

## 4. Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 5000
USER node
CMD ["node", "dist/server.js"]
```

```bash
docker build -t internbridge-api .
docker run -p 5000:5000 --env-file .env internbridge-api
```

## 5. Health probes (Kubernetes / load balancer)

| Probe | Path | Meaning |
|---|---|---|
| Liveness | `GET /health/live` | Process is up; restart pod if failing. |
| Readiness | `GET /health/ready` | DB reachable (pings Mongo); pull from rotation if `503`. |
| Metrics | `GET /health/metrics` | Admin-only; request/latency/error snapshot. |

```yaml
livenessProbe:
  httpGet: { path: /health/live, port: 5000 }
  initialDelaySeconds: 10
  periodSeconds: 15
readinessProbe:
  httpGet: { path: /health/ready, port: 5000 }
  initialDelaySeconds: 5
  periodSeconds: 10
```

## 6. CI pipeline (recommended)

```yaml
# .github/workflows/ci.yml (sketch)
steps:
  - run: npm ci
  - run: npm run typecheck
  - run: npm run lint
  - run: npm test
  - run: npm run build
```

Gate merges on all four. Add coverage thresholds in `jest.config.js` once the DB-backed suite lands.

## 7. Production checklist

- [ ] Distinct, rotated `*_SECRET` values from a secrets manager (not `.env`).
- [ ] `NODE_ENV=production`, `COOKIE_SECURE=true`, TLS terminated upstream.
- [ ] `CLIENT_URL` set to the real frontend origin(s) — drives CORS + CSRF.
- [ ] MongoDB on a **replica set** with backups; indexes built (`autoIndex` is off in prod — build indexes via a migration or `syncIndexes`).
- [ ] Rate limits tuned; consider a Redis store for `express-rate-limit` across instances.
- [ ] Sentry/OTel wired to `logger` + metrics; alerts on `5xx` rate and readiness failures.
- [ ] Scheduled jobs (`node-cron`) run on exactly **one** instance (or move to a dedicated worker) to avoid duplicate execution.

## 8. Scaling path (summary)

`100 → 1k`: single service + Atlas + LB. `1k → 10k`: read replicas, Redis cache, AI moved to async workers. `10k → 100k`: shard by `studentId`/`companyId`, vector DB for matching, event bus for notifications/analytics, CDN for public listings. Full plan in the product design doc.

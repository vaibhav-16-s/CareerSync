# CareerSync — Frontend

AI-powered internship discovery & matching platform. This is the web client for the
[CareerSync backend API](../backend).

> **Build status (honest):** the foundation, design system, auth flow and the
> student *dashboard / search / internship-detail* journey are complete and
> wired to the API. The remaining student pages and the **company** and
> **admin** portals are scaffolded in navigation but **not yet implemented**.
> See [Roadmap](#roadmap).

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router, RSC) · TypeScript |
| Styling | Tailwind CSS · shadcn/ui (Radix primitives) |
| Data fetching | TanStack Query v5 · Axios |
| Forms | React Hook Form · Zod |
| Client state | Zustand |
| Charts | Recharts |
| Toasts | Sonner |
| Testing | Vitest · Testing Library |

## Quick Start

```bash
cd frontend
cp .env.local.example .env.local     # point NEXT_PUBLIC_API_URL at the backend
npm install
npm run dev                          # http://localhost:3000
```

The backend must be running (default `http://localhost:5000/api/v1`). Seed it with
`npm run seed` to get the demo accounts (`student@example.com` /
`company@example.com` / `admin@internbridge.com`, password `Password123`).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run type-check` | `tsc --noEmit` |
| `npm run test` | Vitest (unit + component) |
| `npm run test:coverage` | Coverage report |

## Architecture

A layered, feature-oriented structure. Data flows in one direction:

```
UI (app/ + features/)
  → hooks/        TanStack Query/Mutation hooks (the only thing pages call)
  → services/     thin, typed API modules (one per backend domain)
  → lib/axios     single client: token attach + refresh rotation + envelope unwrap
  → backend
```

Cross-cutting state lives in `store/` (Zustand). The access token is held **in
memory** (`lib/token.ts`); the refresh token is an **httpOnly cookie** the client
never reads. On load, `AuthProvider` silently refreshes and rehydrates the user.

See [docs/STRUCTURE.md](./docs/STRUCTURE.md) for the full folder guide.

## Security posture

- httpOnly refresh cookie + in-memory access token (no token in `localStorage`).
- Single-flight refresh-token rotation in the Axios interceptor.
- Secure response headers via `next.config.mjs` (`X-Frame-Options`, HSTS,
  `Referrer-Policy`, `Permissions-Policy`, `nosniff`).
- Edge `middleware.ts` gates `/student`, `/company`, `/admin` (defense-in-depth).
- Client `RoleGuard` enforces RBAC per portal.
- `ExternalLink` enforces `rel="noopener noreferrer"` on all off-origin links.
- Zod validation on every form, mirroring the backend contract.

> The authoritative authZ check is always the backend. Frontend gates exist to
> avoid rendering protected UI, not to replace server enforcement.

## Health & monitoring

`GET /api/health` returns web-tier status **and** backend reachability — point an
uptime monitor (UptimeRobot, k8s probe) at it. Returns `503` when the API is down.

## Roadmap

Not yet implemented (navigation links exist but routes 404):

- **Student:** profile, resume, skills, projects, certifications, saved,
  applications, notifications, settings.
- **Company:** entire portal (dashboard, internships CRUD, applicants, pipeline,
  analytics, profile, settings).
- **Admin:** entire panel (dashboard, students, companies, verify, analytics,
  reports, logs).

The patterns to follow already exist: copy `features/internships/*` and the
`student/search` + `student/dashboard` pages, reuse the hooks in `hooks/` and the
shared components in `components/shared/`.

## Documentation

- [Environment variables](./docs/ENVIRONMENT.md)
- [Deployment guide](./docs/DEPLOYMENT.md)
- [Folder structure](./docs/STRUCTURE.md)

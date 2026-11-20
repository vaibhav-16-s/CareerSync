# Folder Structure Guide

```
frontend/
├── app/                      # Next.js App Router (routes + RSC)
│   ├── (auth)/               # Route group: login, register, forgot/reset
│   ├── (student)/            # Route group: student portal (RoleGuard'd shell)
│   ├── api/health/           # Health/uptime probe (route handler)
│   ├── error.tsx             # Segment error boundary
│   ├── global-error.tsx      # Root-layout error boundary
│   ├── loading.tsx           # Suspense fallback
│   ├── layout.tsx            # Root layout + <Providers>
│   └── page.tsx              # Public landing page
│
├── components/
│   ├── ui/                   # shadcn/ui primitives (button, dialog, select…)
│   ├── shared/               # Composed reusables (DataTable, charts, StatCard,
│   │                         #   Pagination, SearchBar, FileUpload, ExternalLink…)
│   ├── layout/               # Shell: sidebar, navbar, nav-config, notification-center
│   └── auth/                 # RoleGuard
│
├── features/                 # Domain UI (vertical slices)
│   ├── internships/          # InternshipCard, filters, apply-dialog, skeletons
│   └── ai/                   # MatchPanel
│
├── hooks/                    # TanStack Query/Mutation hooks — pages call ONLY these
├── services/                 # Thin typed API modules (1 per backend domain)
├── store/                    # Zustand stores (auth, user, notification, internship)
├── lib/                      # axios, token holder, api-error, query-keys, utils, validations
├── providers/                # Query, Theme, Auth, Tooltip + Toaster composition
├── types/                    # Shared TS types mirroring the backend contract
├── constants/                # Enums-as-config, badge metadata, role routes
└── docs/                     # This guide + env + deployment
```

## Conventions & layering rules

1. **Pages never call Axios directly.** They call a hook from `hooks/`, which
   calls a `services/` module, which uses the shared `lib/axios` client.
2. **Services are dumb and typed.** No React, no caching logic — just `http.*`
   calls returning typed data. Caching/invalidation lives in hooks.
3. **Query keys are centralized** in `lib/query-keys.ts` (`qk.*`) so
   invalidation is consistent and refactor-safe.
4. **`features/` = vertical slices.** A feature owns its UI; if a component is
   used by 2+ features it graduates to `components/shared/`.
5. **The API envelope** (`{ success, data, meta }`) is unwrapped once in
   `lib/axios` (`http`/`unwrap`); the rest of the app sees plain typed data.
6. **Validation lives in `lib/validations.ts`** (Zod) and mirrors the backend
   validators — one schema per form, types inferred via `z.infer`.

## Adding a new page (recipe)

1. Add the route under the correct `app/(role)/...` group.
2. Need data? Add a `services/<domain>.ts` method + a `hooks/use-<domain>.ts` hook.
3. Build UI from `components/ui` + `components/shared`; extract a `features/`
   component if it's domain-specific and reusable.
4. Add the nav entry in `components/layout/nav-config.ts`.

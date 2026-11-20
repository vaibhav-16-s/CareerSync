# InternBridge Backend — Production Readiness Audit

Staff-engineer review of the existing backend. Scope: audit, refactor, and harden — **not** a rewrite. Frontend is out of scope (not present in this repo).

---

## 1. Executive Summary

The codebase was already well-structured (clean layering, RBAC, Zod validation, refresh-token rotation). This pass closed the gaps that separate "works on my machine" from "a startup can deploy it": observability, CSRF on the cookie route, output encoding, a repository abstraction, an audit-log helper, cursor pagination, and an automated test suite (**26 tests, all green**).

`tsc --noEmit` is clean; `npm run build` emits; `npm test` passes.

---

## 2. Findings & Resolutions

Severity: 🔴 high · 🟠 medium · 🟢 low/nit.

### Architecture & Code Quality
| # | Sev | Finding | Resolution |
|---|----|---------|------------|
| A1 | 🟠 | Services talked to Mongoose models directly → persistence logic coupled into business logic, hard to unit-test. | Added `BaseRepository<T>` + `NotificationRepository` as the **Repository Pattern** exemplar; refactored `notification.service` onto it. (Pattern documented for the rest to follow incrementally.) |
| A2 | 🟠 | `ActivityLog.create({...})` duplicated inline in 3 admin methods (DRY violation). | Extracted `audit.service.ts` (`audit()`); admin service now calls it. Fire-and-forget so auditing never breaks the primary op. |
| A3 | 🟢 | `requestLogger` was a hand-rolled logger duplicating what Morgan does. | Removed; replaced with **Morgan → Winston** stream. |
| A4 | 🟢 | No metrics surface. | Added dependency-free in-process metrics collector. |

### Security (OWASP-aligned)
| # | Sev | Finding | Resolution |
|---|----|---------|------------|
| S1 | 🔴 | `POST /auth/refresh` reads the refresh cookie → CSRF-able (the one cookie-authenticated mutation; the rest use Bearer headers and are inherently safe). | Added `verifyOrigin` Origin/Referer guard on `/auth/refresh` and `/auth/logout`. |
| S2 | 🟠 | Notification/reset emails interpolated user-controlled strings into HTML → stored-XSS via email client. | Added `escapeHtml()` and applied it in the email path. |
| S3 | 🟠 | HSTS not set; `X-Powered-By` exposed. | Helmet HSTS in production, `referrerPolicy: no-referrer`, `crossOriginResourcePolicy: same-site`, `x-powered-by` disabled. |
| S4 | 🟢 | Metrics endpoint could leak internal data. | Gated `/health/metrics` behind `authenticate + authorize(ADMIN)`. |
| ✓ | — | Already present and verified correct: bcrypt, JWT access+refresh **rotation with reuse-detection** (`tokenVersion`), `express-mongo-sanitize` (NoSQL injection), `hpp`, httpOnly+secure+sameSite cookies, global + per-route rate limiting, Zod validation on every route, centralized error handling, deny-by-default RBAC + ownership scoping, single-use hashed reset tokens. |

### Performance & Scalability
| # | Sev | Finding | Resolution |
|---|----|---------|------------|
| P1 | 🟠 | Only offset (`skip/limit`) pagination — degrades at depth, unstable under inserts; no infinite-scroll primitive. | Added **cursor (keyset) pagination** helpers (`getCursorParams`, `buildCursorMeta`). |
| P2 | 🟢 | Reads already use `.lean()` + projections + compound indexes + denormalized counters — verified good. | No change. |

---

## 3. Known Limitations (documented, not yet code)

These are **honest gaps** a team should schedule, not silently "done":

1. **Skill synonym taxonomy.** `computeMatch` canonicalizes skills by case/punctuation-insensitive `skillId`, but does **not** map synonyms (`react.js` → `react`). A real `skill_taxonomy` alias collection is a design-level item (it's in the design doc, not the code). A unit test documents the actual behavior.
2. **DB-backed integration tests.** The suite covers pure logic + the middleware/error contract (no DB). Full apply/auth flows need a `mongodb-memory-server` suite — scaffolding is in place (`tests/integration`), the DB suite is the next increment.
3. **Transactions.** `register`/`apply` use manual rollback + unique indexes instead of multi-doc transactions (so they run on standalone Mongo). On a replica set, wrapping them in `withTransaction` is stronger.
4. **Repository rollout.** Only `notification` is migrated as the exemplar; `internship/application/company/student/admin` services still call models directly. Migrate incrementally.
5. **AI results are computed on the request path** (with a hard rate limit). At scale, move to the queue+cache design from the architecture doc.
6. **Error monitoring (Sentry) and distributed tracing (OpenTelemetry)** are not wired — `logger`/metrics are ready as integration points.

---

## 4. What Changed in This Pass

```
+ src/config/metrics.ts                  in-process request metrics
+ src/controllers/health.controller.ts   liveness / readiness / metrics
+ src/routes/health.routes.ts
+ src/middleware/csrf.ts                  verifyOrigin (CSRF guard)
+ src/utils/sanitize.ts                   escapeHtml (XSS)
+ src/repositories/base.repository.ts     Repository Pattern
+ src/repositories/notification.repository.ts
+ src/services/audit.service.ts           DRY audit logging
+ src/utils/pagination.ts                 + cursor pagination
+ tests/** (5 suites, 26 tests)           jest + ts-jest + supertest
+ docs/AUDIT.md, DEPLOYMENT.md, ENVIRONMENT.md
~ src/app.ts                              Morgan, metrics, helmet HSTS, health mount
~ src/config/logger.ts                    Morgan stream
~ src/services/notification.service.ts    → repository + escapeHtml
~ src/services/admin.service.ts           → audit helper
- src/middleware/requestLogger.ts         removed (replaced by Morgan)
```

---

## 5. Scorecard (out of 100)

| Dimension | Score | Notes |
|---|------:|-------|
| Architecture | 86 | Clean layering + repository seam introduced; finish repo rollout + extract AI worker. |
| Backend | 88 | Solid services, validation, error contract, tests. |
| Frontend | N/A | Not in this repo. |
| Security | 87 | OWASP-aligned; add Sentry, secrets manager, account lockout, 2FA for admins. |
| Performance | 82 | Good indexes/lean/projection + cursor pagination; add Redis cache for AI + hot reads. |
| Scalability | 80 | Stateless & shardable; move AI off request path, add queue + read replicas. |
| UI/UX | N/A | Not in this repo. |
| Code Quality | 88 | DRY, SOLID seams, typed, tested. |
| **Overall (applicable dims)** | **~85** | **Deployable by a startup; not yet hyperscale.** |

### To reach 95+ (production-grade)
1. Finish the repository migration across all services; add a thin DI seam for testability.
2. Move AI scoring to the **queue + cached** pipeline; add Redis for hot reads.
3. Add **Sentry** (errors) + **OpenTelemetry** (traces) + alerting on the metrics.
4. Add **DB-backed integration tests** (mongodb-memory-server) + CI gate (lint, typecheck, test, coverage).
5. Add **account lockout / progressive delays** on auth, admin **2FA**, and a **secrets manager** (no secrets in env files in prod).
6. Build the **skill taxonomy/alias** service so matching is synonym-aware.
7. Add **read replicas** + shard keys (`studentId`/`companyId`) per the scaling plan.

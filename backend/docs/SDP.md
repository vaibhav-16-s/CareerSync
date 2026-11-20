# InternBridge — Software Development Plan (SDP)

**Owner:** Technical Project Manager · **Audience:** 5-engineer cross-functional team · **Status:** Living document, reviewed each sprint.

This SDP governs how InternBridge is built from its current state (backend V1+V2 implemented & tested; product/architecture designed; **frontend not yet built**) through MVP → Beta → Production → V2.0 GA.

---

## 0. Team & Capacity

| ID | Role | Primary ownership |
|---|---|---|
| **E1** | Tech Lead / Backend | Architecture, code review gate, auth/security, DevOps oversight |
| **E2** | Backend Engineer | Internships, applications, chat, interviews, certificates, reports |
| **E3** | Frontend Engineer | Student portal, public pages, design system |
| **E4** | Frontend Engineer | Company + admin portals, dashboards, PWA/accessibility |
| **E5** | AI/ML Engineer (+ DevOps 30%) | Matching, skill-gap, recommendations, Gemini integration, CI/CD & infra |

**Capacity assumptions:** 2-week sprints, ~8 ideal dev-days per engineer per sprint (after meetings/support), ~10% buffer for unplanned work. Velocity recalibrated after Sprint 2.

---

## 1. Milestones

| Milestone | Goal (exit criteria) | Target |
|---|---|---|
| **M1 — MVP** | Student-first-internship loop works end-to-end in one region with a real frontend: register → profile/résumé → search → apply → company reviews → status → notification. Deterministic match score + skill-gap live. | End of Sprint 6 (Month 3) |
| **M2 — Beta** | Onboard 1–2 pilot colleges + a handful of companies. Recommendation engine, résumé feedback, company Kanban, saved internships, hardened auth/observability, ≥70% core test coverage. | End of Sprint 9 (Month 4.5) |
| **M3 — Production GA** | Public launch: payments/plans, async AI workers + caching, full analytics, fraud/abuse handling, autoscaling, SLA + on-call, scale to 10k users. | End of Sprint 12 (Month 6) |
| **M4 — V2.0 GA** | Real-time chat, interview scheduling, certificates, public profiles, referral, advanced AI (embeddings), mobile/PWA. Scale toward 100k. | End of Sprint 15 (Month 7.5) |

Exit criteria per milestone require the **Definition of Done (§6)** met for every shipped story plus the **Release Checklist (§8)** executed.

---

## 2. Sprint Planning (2-week sprints)

Format per sprint: **Goal · Tasks (owner) · Deliverables · Dependencies · Risks**. Backend V1/V2 already exists, so early sprints front-load the frontend and hardening while backend fills gaps.

### MVP

**Sprint 1 — Foundations & contracts**
- Goal: dev environment, CI skeleton, API contract frozen for MVP, frontend scaffold.
- Tasks: repo/monorepo setup + CI (lint/typecheck/test) (E5); OpenAPI spec from existing routes (E1); Next.js scaffold + design-system tokens + auth pages shell (E3/E4); seed data + Postman/Thunder collection (E2); finalize MVP scope cut-line (E1).
- Deliverables: green CI on an empty PR; published OpenAPI; clickable login/register screens (mocked).
- Dependencies: none. **Blocking for all later FE work:** API contract.

**Sprint 2 — Auth & profile (vertical slice)**
- Goal: real end-to-end auth + student profile.
- Tasks: wire FE auth to `/auth/*` incl. refresh rotation + secure cookie handling (E3); student profile CRUD UI + résumé upload to Cloudinary flow (E3); confirm/adjust backend profile endpoints (E2); RBAC route guards in FE (E4); password reset email flow E2E (E1).
- Deliverables: a user can register, log in, complete a profile, upload a résumé.
- Dependencies: Sprint 1 contract.

**Sprint 3 — Internship discovery**
- Goal: browse/search/apply.
- Tasks: internship list + filters + detail pages (SSR for SEO) (E4); search/sort wiring incl. pagination (E3); apply flow + saved internships UI (E3); backend search refinements + facets stub (E2); match-score display on detail (E5).
- Deliverables: student can find and apply to internships; saved list works.
- Dependencies: Sprints 1–2.

**Sprint 4 — Company portal & pipeline**
- Goal: company can post and review.
- Tasks: company profile + internship posting wizard (E4); applicant Kanban (applied→hired) (E4); status-change → notification path verified (E2); company verification submit UI + admin verify screen (E3); seed verified-company demo (E1).
- Deliverables: company posts internship, reviews applicants, moves pipeline; student gets status notifications.
- Dependencies: Sprint 3.

**Sprint 5 — AI MVP & notifications**
- Goal: differentiators live.
- Tasks: skill-gap analyzer UI + endpoint polish (E5); deterministic recommendations on dashboard (E5); in-app notification center + email templates (E2/E3); student & company dashboards (E3/E4); résumé feedback (rule-based) surface (E5).
- Deliverables: match score, skill-gap plan, recommendations, notifications all visible.
- Dependencies: Sprints 2–4.

**Sprint 6 — MVP hardening & launch**
- Goal: ship M1.
- Tasks: E2E happy-path tests (Playwright) (E4); accessibility pass on core flows (E3); error states/empty states (E3/E4); load smoke test + index review (E5); security review of auth/upload (E1); MVP release checklist (§8) (E1).
- Deliverables: **MVP released to a closed cohort.**
- Dependencies: all prior.

### Beta

**Sprint 7 — Recommendation quality & résumé feedback**
- Tasks: content-based recommendation tuning + reasons (E5); résumé feedback enrichment via Gemini with fallback (E5); company candidate recommendations UI (E4); college bulk-onboarding (CSV import) (E2); FE polish (E3).
- Deliverables: better matches + actionable résumé feedback; first college onboarded.

**Sprint 8 — Analytics & observability**
- Tasks: company analytics dashboard (funnel, time-to-fill) (E4); platform admin analytics (E3); wire Sentry + OpenTelemetry + alerts on `/health/metrics` (E5/E1); structured audit-log viewer for admins (E2); coverage push to ≥70% core (all).
- Deliverables: dashboards live; error monitoring + alerting in place.

**Sprint 9 — Beta hardening & pilot**
- Tasks: notification preferences (E2); rate-limit/abuse tuning (E1); performance pass (query `explain()`, cache hot reads with Redis) (E5); Beta release checklist (E1); pilot feedback loop (TPM).
- Deliverables: **Beta released to 1–2 colleges + companies.**

### Production

**Sprint 10 — Monetization & async AI**
- Tasks: subscription/payments (company premium, college plans) + webhook handling (E2); move AI scoring to queue + cached pipeline (E5); precomputed nightly recommendations (E5); billing UI (E4); plan-gating middleware (E1).
- Deliverables: paid plans purchasable; AI off the request path.

**Sprint 11 — Scale & reliability**
- Tasks: search service (Atlas Search) + facets (E2/E5); read-replica routing for analytics (E1); autoscaling + container hardening (E5); fraud/scam detection on postings/messages (E2); SLOs + on-call runbook (E1).
- Deliverables: 10k-user load validated; reliability targets defined.

**Sprint 12 — Production GA**
- Tasks: full security review + pen-test fixes (E1); DPDP/GDPR data-export & delete (E2); status page + incident process (E5); GA release checklist (E1); marketing-site polish + SEO (E3/E4).
- Deliverables: **Production GA.**

### Version 2.0

**Sprint 13 — Real-time & scheduling (FE)**
- Tasks: chat UI (inbox/thread, typing, unread) on Socket.IO (E3); interview scheduling UI + .ics download + calendar widget (E4); reconnect/Redis-adapter for sockets at scale (E5/E1); chat moderation hooks (E2).
- Deliverables: chat + interviews usable in the product (backend already built).

**Sprint 14 — Certificates, public profiles, referral (FE) + advanced AI**
- Tasks: certificate issue/verify pages + share/QR (E4); public portfolio & company pages (SSR, `noindex` until opt-in) (E3); referral dashboard + ambassador leaderboard (E3); embeddings-based matching + vector store PoC (E5).
- Deliverables: V2 surfaces live; advanced-AI PoC measured against deterministic baseline.

**Sprint 15 — Mobile/PWA, i18n, V2 GA**
- Tasks: PWA (service worker, manifest, web-push) + mobile-first pass (E4); i18n scaffolding + locale templates (E3); accessibility AA audit (axe-core in CI) (E3); V2 release checklist (E1); 100k-readiness review (E5/E1).
- Deliverables: **V2.0 GA.**

---

## 3. Git Strategy

**Branching — trunk-based with short-lived branches** (GitHub Flow, not GitFlow; faster for a small team shipping continuously).

```
main            ← always deployable; protected; deploy to prod via tag
  └─ develop    ← integration branch (optional; drop if CD to staging from main)
       └─ feature/<ticket>-<slug>
       └─ fix/<ticket>-<slug>
       └─ chore/<ticket>-<slug>
release/x.y.z   ← cut for hardening a milestone; only fixes merge in
hotfix/<ticket>-<slug>  ← branched from main, merged to main + back-merged
```

**Naming conventions**
- Branches: `feature/IB-123-resume-upload`, `fix/IB-145-refresh-loop`, `chore/IB-160-bump-deps`, `hotfix/IB-210-cve-patch`.
- Tags/releases: SemVer `vMAJOR.MINOR.PATCH` (e.g. `v1.0.0` MVP, `v2.0.0` V2 GA).

**Commit messages — Conventional Commits**
```
<type>(<scope>): <subject>      # imperative, ≤72 chars

[optional body — what & why, not how]
[optional footer: BREAKING CHANGE:, Refs: IB-123]
```
Types: `feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert`.
Example: `feat(chat): gate conversations behind an existing application`.
Enforced by **commitlint** + Husky `commit-msg` hook. Enables automated changelogs.

**Pull request workflow**
1. Branch from `main` (or `develop`), keep < ~400 lines net where possible.
2. PR template: summary, linked ticket, screenshots/Loom for UI, test notes, checklist (§6).
3. CI must pass (lint, typecheck, unit, integration, build) — required status checks.
4. **≥1 approval** (≥2 for auth/payments/security-touching). Tech Lead is required reviewer for security paths.
5. **Squash-merge** to keep `main` history linear; PR title becomes the conventional commit.
6. Branch auto-deleted on merge. No direct pushes to `main` (branch protection + linear history).

---

## 4. Folder Ownership

Ownership is enforced via a `CODEOWNERS` file (auto-requests reviewers).

| Area | Paths | Owner(s) |
|---|---|---|
| **Backend** | `backend/src/{models,services,controllers,routes,repositories,validators,middleware,utils,jobs}` | E1, E2 |
| **Auth/Security/Infra middleware** | `backend/src/middleware/{auth,csrf,rateLimiter}`, `config/{env,logger}` | E1 (required reviewer) |
| **AI** | `backend/src/services/ai.service.ts`, `config/gemini.ts`, `utils/matching.ts`, vector/embedding modules | E5 |
| **Real-time** | `backend/src/socket/**`, `services/chat.service.ts` | E2 (+E5 scaling) |
| **Frontend — student/public** | `frontend/app/(student)/**`, `frontend/app/(public)/**`, design system | E3 |
| **Frontend — company/admin** | `frontend/app/(company)/**`, `frontend/app/(admin)/**`, dashboards, PWA | E4 |
| **DevOps/CI/CD** | `.github/**`, `Dockerfile`, IaC (`infra/**`), `docs/DEPLOYMENT.md` | E5 (+E1 oversight) |
| **Docs/Contracts** | `docs/**`, OpenAPI spec | E1 (steward), all contribute |
| **Shared types/contracts** | API DTOs / OpenAPI / shared zod schemas | E1 approves changes (breaking-change gate) |

Rule: a contract change (shared DTO/OpenAPI) requires E1 approval and a migration note.

---

## 5. Development Standards

**Languages/stack:** TypeScript everywhere (backend Express, frontend Next.js). `strict: true` already on.

**Coding conventions**
- Layered dependency rule: `routes → controllers → services → repositories → models`; lower never imports upper.
- Controllers thin; business logic in services; no raw Mongoose in controllers.
- Validate every input at the edge with zod; never trust client data.
- Errors via `AppError` + `catchAsync`; never leak stack traces in prod.
- Pure functions in `utils` (unit-tested); no side effects.
- No `any` unless justified with a comment; prefer explicit return types on exported functions.
- Async/await only (no floating promises — lint-enforced).

**ESLint (baseline rules)**
- `@typescript-eslint/recommended` + `eslint-config-prettier` (Prettier owns formatting).
- `no-floating-promises`, `no-misused-promises`, `await-thenable`.
- `@typescript-eslint/no-explicit-any: warn`, `no-unused-vars: error` (args ignored with `_` prefix).
- `import/order` (groups: builtin, external, internal) + no circular deps (`import/no-cycle`).
- Frontend: `eslint-plugin-react-hooks` (`rules-of-hooks: error`, `exhaustive-deps: warn`), `jsx-a11y/recommended`.
- Security: `eslint-plugin-security` for the backend.

**Prettier**
```json
{ "singleQuote": true, "semi": true, "trailingComma": "es5",
  "printWidth": 100, "tabWidth": 2, "arrowParens": "always" }
```
Run via Husky `pre-commit` (lint-staged): `eslint --fix` + `prettier --write` on staged files.

**File naming**
- Backend: `kebab-case` by role suffix — `auth.service.ts`, `auth.controller.ts`, `auth.routes.ts`, `auth.validator.ts`; models `PascalCase` (`User.ts`).
- Tests: `*.test.ts` mirroring `src` under `tests/`.
- Frontend: components `PascalCase.tsx`, hooks `useThing.ts`, route segments `kebab-case`, utils `camelCase.ts`.

**Component naming (frontend)**
- `PascalCase` components; one component per file; co-locate styles/tests.
- Prefix: `use*` hooks, `with*` HOCs, `*Provider` context, `*Page`/`*Layout` for route roots.
- Booleans `is/has/should*`; handlers `handle*`/`on*`; server state via TanStack Query hooks (`useInternshipsQuery`).

---

## 6. Definition of Done (DoD)

A story is **Done** only when **all** apply:

**Code review checklist**
- [ ] Meets acceptance criteria + linked ticket.
- [ ] Follows layering/naming conventions; no dead code; no commented-out blocks.
- [ ] Inputs validated; authz (role + ownership) enforced; no secrets in code.
- [ ] Errors handled via `AppError`; user-facing messages safe.
- [ ] No N+1 queries; indexes exist for new query shapes (`explain()` checked).
- [ ] Backward compatible (or migration + contract note included).

**Testing requirements**
- [ ] Unit tests for new pure logic; **≥70% coverage on services/utils** (core ≥80%).
- [ ] Integration/API test for new endpoints (happy + 1 failure path).
- [ ] E2E (Playwright) for new user-facing critical flows.
- [ ] All CI checks green.

**Documentation requirements**
- [ ] OpenAPI updated for endpoint changes; README/docs updated if behavior changes.
- [ ] Env vars documented in `docs/ENVIRONMENT.md`; changelog entry (auto from commits).

**Performance checklist**
- [ ] P95 < 300ms for non-AI endpoints (AI async/rate-limited); response payloads use projection/pagination.
- [ ] No unbounded queries; lists paginated (offset or cursor).

**Security checklist**
- [ ] OWASP-aligned: injection (zod + mongo-sanitize), authz, rate limiting on sensitive routes.
- [ ] No PII over-exposure (public endpoints whitelist fields); audit log on privileged actions.
- [ ] Dependencies clean (Dependabot/`npm audit` no high/criticals).

---

## 7. Risk Analysis

| # | Risk | Type | Likelihood / Impact | Mitigation |
|---|---|---|---|---|
| R1 | **Cold-start liquidity** — too few internships or students per region. | Business | High / High | Seed via college partnerships (B2B2C); concierge-onboard early companies; focus one region first. |
| R2 | Marketplace abuse — fake postings, **fee-demand scams**. | Business/Security | Med / High | Verification gate (live), reporting+auto-escalation (live), scam-keyword detection (Sprint 11), admin moderation. |
| R3 | AI match quality underwhelms vs. expectations. | Technical | Med / Med | Ship explainable deterministic baseline first; A/B embeddings against it (S14); keep humans-in-loop. |
| R4 | Gemini cost/latency/availability. | Technical | Med / Med | Async + cache + hard rate limits (live); deterministic fallback (live); budget alerts. |
| R5 | Chat scale (Socket.IO single-instance). | Scalability | Med / Med | Redis adapter + sticky sessions (S13); messages append-only + cursor paging. |
| R6 | Mongo hot-collection growth (applications, messages, logs). | Scalability | Med / High | Compound indexes (live), TTL/archival, shard keys `studentId`/`companyId`, read replicas. |
| R7 | Auth/token compromise. | Security | Low / High | Refresh rotation + reuse detection (live), short access TTL, secrets manager, lockout + admin 2FA (prod). |
| R8 | Frontend timeline slip (built from scratch). | Technical/Schedule | Med / High | Freeze API contract early (S1); component library; parallelize student vs company portals (E3/E4). |
| R9 | Key-person dependency (E5 owns AI + DevOps). | Business | Med / Med | Document runbooks; pair on infra; cap DevOps at 30% of E5; cross-train E1. |
| R10 | Compliance (DPDP/GDPR) gaps. | Business/Security | Med / High | Consent flows (live), data export/delete (S12), PII minimization, audit trail. |

Risks reviewed at each sprint retro; owner + status tracked in the risk register.

---

## 8. Release Checklist

**Pre-release**
- [ ] All milestone stories meet DoD; release branch cut (`release/x.y.z`), frozen except fixes.
- [ ] Full regression (unit+integration+E2E) green; coverage thresholds met.
- [ ] Security review + `npm audit` clean; secrets rotated/managed (not in env files).
- [ ] DB migration/index plan reviewed; `syncIndexes` run on staging.
- [ ] Changelog + release notes generated; on-call assigned.

**Deployment**
- [ ] Tag `vX.Y.Z`; CI builds immutable image; deploy to **staging** → smoke test.
- [ ] DB indexes/migrations applied (autoIndex off in prod).
- [ ] Canary/blue-green to prod; readiness probe (`/health/ready`) green before cutover.
- [ ] Feature flags for risky features default-off.

**Post-deployment verification**
- [ ] Smoke the critical paths (register→apply→status; company review; payment if applicable).
- [ ] Dashboards healthy: error rate, P95 latency, readiness, queue depth (`/health/metrics` + Sentry/OTel).
- [ ] Synthetic uptime check + alerts firing correctly.

**Rollback strategy**
- [ ] Keep previous image/tag; rollback = redeploy previous tag (≤10 min).
- [ ] DB changes **backward-compatible / expand-contract** so app rollback never requires data rollback.
- [ ] If a migration must reverse, run the down-migration; restore from backup only as last resort.
- [ ] Post-incident: blameless postmortem within 48h, action items ticketed.

---

## 9. Maintenance Plan

**Bug-fixing process**
- Severity SLAs: **Sev1** (outage/security) page on-call, hotfix ASAP; **Sev2** (major broken flow) next business day; **Sev3** (minor) groomed into a sprint.
- Hotfix: branch from `main` → fix + test → expedited review → tag patch → back-merge.

**Feature-request workflow**
- Intake (users/colleges/companies/internal) → backlog with `feature-request` label → TPM + Tech Lead triage → RICE-scored → roadmap or "won't do" with rationale. Quarterly roadmap review.

**Monitoring** — Sentry (errors), OpenTelemetry traces, `/health/metrics` + Prometheus/Grafana, synthetic uptime checks; alerts on 5xx rate, P95 latency, readiness failures, queue backlog, AI error rate, cost budget.

**Logging** — Structured Winston (JSON in prod) + Morgan access logs shipped to a central store (ELK/Loki); 30–90d hot retention, archive cold; **audit logs durable** (compliance); no PII/secrets in logs.

**Backups** — Managed Mongo (Atlas) continuous backups + PITR; **nightly snapshots, 30-day retention**; Cloudinary assets are the source of truth for files; **quarterly restore drills** (untested backups don't count); document RPO ≤ 24h / RTO ≤ 2h.

**Routine maintenance** — weekly Dependabot review, monthly dependency/security patch window, quarterly index/slow-query audit, capacity review before each milestone.

---

## 10. Final Project Timeline

| Sprint | Weeks | Phase | Headline deliverable |
|---|---|---|---|
| 1 | 1–2 | MVP | CI, API contract, FE scaffold |
| 2 | 3–4 | MVP | Auth + student profile + résumé |
| 3 | 5–6 | MVP | Internship search + apply + saved |
| 4 | 7–8 | MVP | Company portal + pipeline |
| 5 | 9–10 | MVP | AI MVP + notifications + dashboards |
| 6 | 11–12 | MVP | **🚩 MVP release (v1.0)** |
| 7 | 13–14 | Beta | Recommendations + résumé feedback |
| 8 | 15–16 | Beta | Analytics + Sentry/OTel observability |
| 9 | 17–18 | Beta | **🚩 Beta release — pilot colleges** |
| 10 | 19–20 | Prod | Payments + async AI pipeline |
| 11 | 21–22 | Prod | Search service + scale + fraud detection |
| 12 | 23–24 | Prod | **🚩 Production GA (v1.x)** |
| 13 | 25–26 | V2 | Chat + interview scheduling (FE) |
| 14 | 27–28 | V2 | Certificates + public profiles + referral + advanced-AI PoC |
| 15 | 29–30 | V2 | PWA/i18n/a11y → **🚩 V2.0 GA (v2.0)** |

**Total: ~30 weeks (~7.5 months)** from kickoff to V2.0 GA with a 5-engineer team. Dates assume stable scope; the cut-line is defended at sprint planning, and the milestone buffer lives in Sprints 6/9/12/15 (hardening sprints).

---

### Appendix — Cross-references
- Product/architecture: product design document (Steps 1–13).
- Production audit & scorecard: `docs/AUDIT.md`.
- V2 feature designs: `docs/V2-ROADMAP.md`.
- Env/deploy: `docs/ENVIRONMENT.md`, `docs/DEPLOYMENT.md`.

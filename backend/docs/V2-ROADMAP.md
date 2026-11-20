# InternBridge V2.0 — Product & Architecture Roadmap

Product Lead · Principal Architect · Senior Full-Stack view. **Additive only** — no existing functionality is removed; every change is backward-compatible (new collections, new routes, new *optional* fields).

---

## 1. Current Product (V1) — what already ships

Auth (JWT + refresh rotation, RBAC) · Student/Company/Admin roles · Student profile + résumé upload (Cloudinary) · Internship CRUD + search/filter/sort · Applications + pipeline · **Saved internships (bookmarking ✅)** · **In-app + email notifications ✅** · **Company verification workflow ✅** · **Audit logs (ActivityLog) ✅** · **Analytics (company + platform) ✅** · **Admin moderation (basic) ✅** · AI: match score, skill-gap, recommendations, candidate recs, résumé feedback · Health/metrics, tests.

So several "V2" asks already exist in V1 — those become **enhancements**, not net-new (flagged ⤴ below).

---

## 2. Gap Analysis → MoSCoW

| Priority | Feature | Status |
|---|---|---|
| **Must** | Real-time chat (student ↔ company) | NEW — implemented |
| **Must** | Interview scheduling + calendar (.ics) | NEW — implemented |
| **Must** | Reporting & abuse handling | NEW — implemented |
| **Must** | Internship certificates (issue + public verify) | NEW — implemented |
| **Must** | Public student portfolio + public company profile | NEW — implemented (slugs + public reads) |
| **Should** | Referral system | NEW — implemented (codes + tracking) |
| **Should** | Activity timeline (user-facing) | enhancement of ActivityLog — implemented |
| **Should** | AI interview preparation | NEW — designed |
| **Should** | AI résumé improvement suggestions ⤴ | enhance existing résumé feedback — designed |
| **Should** | Search optimization (relevance, typo-tolerance, facets) ⤴ | enhance — designed |
| **Should** | Enhanced analytics dashboards ⤴ | enhance — designed |
| **Should** | Enhanced admin moderation tools ⤴ | enhance — designed |
| **Nice** | Campus ambassador program | designed |
| **Nice** | Multi-language (i18n) | designed |
| **Nice** | Accessibility (WCAG 2.1 AA) | designed (frontend) |
| **Nice** | Mobile-first + PWA | designed (frontend) |
| **Nice** | Email/in-app notification preferences ⤴ | enhance — designed |

---

## 3. Feature Designs

Each feature: **PRD · DB · API · UI/UX · Security · Scalability · Plan**. Implemented features marked ✅.

### 3.1 Real-time Chat ✅ (Must)
- **PRD.** Students and companies message each other, but **only after an application exists** between them (prevents spam/cold outreach). Typing indicators, unread counts, read receipts, history.
- **DB.** `conversations` { participants[{userId,role}], studentId, companyId, internshipId?, applicationId?, lastMessageAt, lastMessageText } ; `messages` { conversationId, senderId, recipientId, text, attachments[], readAt }. Indexes: `conversations.participants.userId`, unique `(studentId,companyId,internshipId)`; `messages {conversationId, createdAt:-1}`, `{recipientId, readAt}`.
- **API.** `POST /conversations` (start, gated by application), `GET /conversations`, `GET /conversations/:id/messages` (cursor paginated), `POST /conversations/:id/messages`, `PATCH /conversations/:id/read`. **WebSocket** (`/socket.io`): `message:new`, `message:read`, `typing`, JWT handshake.
- **UI/UX.** Inbox list (last message + unread badge) → thread view; composer with typing indicator; deep-link from an application.
- **Security.** JWT handshake on socket; per-conversation participant check on every read/write; message body length-capped + `escapeHtml` on render; rate-limit sends; block/report integration.
- **Scalability.** Socket.IO **Redis adapter** for multi-instance fan-out; messages are append-only (shard by conversationId); cursor pagination for history.
- **Plan.** Models → REST service (gating) → Socket.IO server w/ JWT middleware → wire to http server → Redis adapter at scale.

### 3.2 Interview Scheduling + Calendar ✅ (Must)
- **PRD.** Company schedules an interview against an application (online/onsite/phone). Both parties get notified; an **.ics** invite is downloadable; reschedule/cancel/complete lifecycle.
- **DB.** `interviews` { applicationId, internshipId, companyId, studentId, scheduledBy, mode, startAt, endAt, meetingLink?, location?, status, notes, history[] }. Indexes `{studentId,startAt}`, `{companyId,startAt}`, `{applicationId}`.
- **API.** `POST /interviews` (company), `GET /interviews` (role-scoped, upcoming/past), `GET /interviews/:id`, `PATCH /interviews/:id` (reschedule/cancel/complete), `GET /interviews/:id/calendar.ics`.
- **UI/UX.** "Schedule interview" from a shortlisted applicant; student calendar widget; status chips; "Add to Google/Outlook" (the .ics).
- **Security.** Only the owning company/admin schedules; student can only view/cancel own; validation startAt>now, endAt>startAt; notifications use escaped content.
- **Scalability.** Light volume; index on time fields for upcoming queries; .ics generated on the fly (no storage). Future: 2-way Google Calendar OAuth sync.
- **Plan.** Model → service (validation + .ics builder + notifications) → controller/routes → notify both parties.

### 3.3 Reporting & Abuse Handling ✅ (Must)
- **PRD.** Any user can report an internship/company/student/message (scam, spam, harassment, fake, fee-demand). Admin triage queue with status + resolution. Critical for trust (fee-charging scams plague this space).
- **DB.** `reports` { reporterId, targetType, targetId, reason(enum), description, status(open|reviewing|resolved|dismissed), resolution, handledBy, handledAt }. Indexes `{status, createdAt}`, `{targetType, targetId}`, unique `(reporterId,targetType,targetId)` to stop duplicate spam.
- **API.** `POST /reports` (auth), `GET /admin/reports` (filter by status), `PATCH /admin/reports/:id` (triage + action). Auto-flag heuristic: N open reports on one target → escalate.
- **UI/UX.** "Report" affordance on listings/profiles/messages; admin moderation board (Kanban by status) with target preview.
- **Security.** Rate-limit report creation; dedup unique index; only admins read/triage; audit every triage action.
- **Scalability.** Low write volume; counters via aggregation; archival of resolved reports.
- **Plan.** Model → service (create + dedup + admin triage that can suspend user / remove internship) → routes (user + admin).

### 3.4 Internship Certificates ✅ (Must)
- **PRD.** When an intern is marked **hired→completed**, the company issues a verifiable completion certificate with a public **verification URL** (anti-fraud — employers can verify authenticity).
- **DB.** `certificates` { certificateId(public, unique), applicationId, internshipId, studentId, companyId, title, skills[], startDate, endDate, issuedBy, issuedAt, revoked, revokeReason }. Indexes unique `certificateId`, `{studentId}`, unique `applicationId`.
- **API.** `POST /certificates` (company, from a completed application), `GET /certificates/me` (student), `GET /certificates/verify/:certificateId` (**public**, no auth), `PATCH /certificates/:id/revoke` (company/admin).
- **UI/UX.** "Issue certificate" on completed applicants; student "My Certificates" with share link/QR; public verify page showing issuer + validity.
- **Security.** Random unguessable `certificateId`; only issuing company/admin can revoke; public endpoint returns minimal fields; revoked certs clearly flagged.
- **Scalability.** Tiny; public verify is cache-friendly (CDN). Future: PDF render via a worker; optional blockchain anchor.
- **Plan.** Model → service (issue gated on status, generate code) → public verify route (no auth) + authed issue/revoke.

### 3.5 Public Portfolio & Company Profiles ✅ (Must)
- **PRD.** SEO-friendly public pages: a student portfolio (`/u/:slug`) and a company page (`/c/:slug`) showing curated public info. Drives organic acquisition + lets students share a link.
- **DB.** Additive optional fields: `students.slug` (unique, sparse), `students.publicProfile` (bool, default false); same on `companies`. No breaking change.
- **API.** `GET /public/students/:slug`, `GET /public/companies/:slug`, `PATCH /students/me/visibility`, `PATCH /companies/visibility`. Public endpoints return whitelisted fields only.
- **UI/UX.** Toggle "make profile public"; auto-slug from name with collision handling; share button.
- **Security.** Respect `publicProfile`/consent; never expose email/phone; field whitelisting; `noindex` until opted in.
- **Scalability.** Read-mostly → CDN/edge cache; slug uniqueness via sparse unique index.
- **Plan.** Add optional fields + slug generator → public read controller (whitelist) → visibility toggles.

### 3.6 Referral System ✅ (Should)
- **PRD.** Every user gets a referral code; new signups can attribute a referrer; track successful referrals for rewards/leaderboard (feeds the campus-ambassador program).
- **DB.** Additive: `users.referralCode` (unique, sparse), `users.referredBy` (userId). `referrals` { referrerId, referredUserId, status(pending|qualified), qualifiedAt }.
- **API.** `GET /referrals/me` (code + stats), `POST /auth/register` accepts optional `referralCode` (backward-compatible optional field).
- **Security.** Self-referral blocked; code rate-limited; idempotent attribution.
- **Plan.** Code generator on user creation → optional capture at register → stats endpoint.

### 3.7 Activity Timeline ✅ (Should)
- Reuses existing `ActivityLog`. Add `GET /me/activity` (user-scoped, cursor-paginated) and emit user-facing events (applied, status change, interview, certificate). No new collection.

### 3.8 AI Interview Preparation (Should — designed)
- **PRD.** Given an internship + student profile, Gemini generates likely interview questions, model answers, and a focus checklist; optional mock Q&A scoring.
- **DB.** `ai_prep_sessions` (cache) { studentId, internshipId, questions[], generatedAt }.
- **API.** `POST /ai/interview-prep/:internshipId` (rate-limited). Deterministic fallback: questions templated from required skills.
- **Security/Scale.** Reuse `aiLimiter`; cache per (student,internship); async at scale.

### 3.9 AI Résumé Improvement ⤴ (Should — designed)
- Enhance existing `getResumeFeedback`: add per-bullet rewrite suggestions (action verb + quantified impact), ATS keyword diff vs a target role, before/after score. Same endpoint, richer payload; Gemini with rule-based fallback already present.

### 3.10 Search Optimization ⤴ (Should — designed)
- Move from `$text` to **Atlas Search** (fuzzy/typo-tolerant, synonyms via the skill-taxonomy alias table), weighted fields (title>skills>description), facets with counts, relevance + personalized boost (match score). Add `GET /internships/facets`. Index strategy + cursor pagination already in place.

### 3.11 Enhanced Analytics ⤴ (Should — designed)
- Company: funnel conversion %, time-to-fill, applicant skill heatmap, source breakdown. Student: application success rate, profile-view trend, skill-demand radar. Platform: cohort retention, liquidity by region. Precompute nightly into `analytics`.

### 3.12 Enhanced Admin Moderation ⤴ (Should — designed)
- Unified moderation queue (reports + flagged content + pending verifications), bulk actions, scam-pattern detection (fee-demand keyword scan on postings/messages), shadow-ban, full audit. Builds on existing admin + new reports.

### 3.13 Campus Ambassador (Nice — designed)
- Roles for student ambassadors; referral-linked leaderboard; tasks & points; college-level dashboards for TPOs. DB: `ambassadors`, extends referral system.

### 3.14 Multi-language / i18n (Nice — designed)
- Backend: `Accept-Language` → localized notification/email templates; store user `locale`. Frontend: `next-intl`/i18next, message catalogs, RTL support. Content (JD) stays author-language with optional Gemini translation.

### 3.15 Accessibility WCAG 2.1 AA (Nice — designed, frontend)
- Semantic HTML, ARIA, keyboard nav, focus management, contrast tokens, screen-reader labels, reduced-motion. CI: axe-core checks.

### 3.16 Mobile-first + PWA (Nice — designed, frontend)
- Responsive layouts, bottom-tab nav, service worker (offline shell + cached listings), web-push notifications, installable manifest, image optimization (next/image), code-splitting.

---

## 4. Cross-cutting Engineering

- **Backward compatibility:** all new fields optional with defaults; all new routes namespaced; no contract change to existing endpoints.
- **Security:** every new route runs through existing `authenticate/authorize/validate`; new public routes whitelist fields; chat/reports rate-limited; audit on moderation/cert/interview actions.
- **Scalability:** chat needs Socket.IO + **Redis adapter** for horizontal scale; AI prep + search move to async/managed search at volume; public reads behind CDN.
- **Rollout:** ship behind feature flags; migrate slugs/codes lazily (backfill job); monitor via existing `/health/metrics`.

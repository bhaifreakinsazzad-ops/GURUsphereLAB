# GURUsphere — Implementation Audit

**Date:** 2026-07-03  
**Scope:** Ground-truth review of the current repository against every capability claimed in `GURUsphere-Project-Report.md`.  
**Method:** Static code review of `src/`, `supabase/migrations/`, `index.html`, `package.json`, plus route + RLS inspection. No runtime load / stress tests performed in this pass.

## Legend

| Status | Meaning |
|---|---|
| **VERIFIED** | Code exists, wired end-to-end, exercised by a real user path. |
| **PARTIAL** | Real code exists but is limited (seeded data, one path only, missing edge cases). |
| **MOCKED** | UI-only or `localStorage`-only; no server persistence or real logic behind it. |
| **BROKEN** | Present but does not work as advertised. |
| **MISSING** | Claimed in the report, not found in code. |
| **BLOCKED** | Cannot be verified without infra access (payments, email, DNS). |

## 1. Foundations

| Area | Status | Evidence / Notes |
|---|---|---|
| Vite + React 18 + TS build | VERIFIED | `package.json`, `vite.config.ts`. |
| Route lazy-loading | VERIFIED | `src/App.tsx` uses `React.lazy` for all non-critical routes. |
| Type checking | PARTIAL | `tsgo` clean historically; not re-run this pass. Auto-generated `types.ts` present. |
| Lint | PARTIAL | `eslint.config.js` present; not executed here. |
| Tests | PARTIAL | Only `src/test/example.test.ts` + Playwright fixture. No feature tests. |
| Production build | PARTIAL | Builds have succeeded previously; not re-run this pass. |
| SEO metadata | VERIFIED | `index.html` has app-specific title/description/OG. Sitemap present. |
| Sitemap | PARTIAL | `public/sitemap.xml` is hand-edited; missing `/clubs`, `/classroom/:subjectId`, `/dashboard` accuracy will drift. |

## 2. Authentication & Authorization

| Capability | Status | Evidence |
|---|---|---|
| Email/password auth | VERIFIED | `src/pages/Auth.tsx`, `AuthContext`. |
| Google OAuth | PARTIAL | Code paths exist; provider must be enabled in backend config for it to work in prod. |
| Anonymous signups disabled | VERIFIED | Config-level. |
| `AuthContext` with deferred profile fetch | VERIFIED | `src/contexts/AuthContext.tsx`. |
| `user_roles` table separated from `profiles` | VERIFIED | Migration + `has_role()` SECURITY DEFINER. |
| `promote_to_admin` RPC guarded | VERIFIED | Function checks `has_role(auth.uid(), 'admin')`. |
| Admin route protection | PARTIAL | UI-level check; verify server-side gating on any admin RPC. |

## 3. Database & RLS

| Table | Status | Notes |
|---|---|---|
| `profiles` | VERIFIED | RLS present; grants confirmed in migrations. |
| `user_roles` | VERIFIED | Separate table, `has_role()` used in policies. |
| `research_topics` | VERIFIED | Upvote via `increment_research_upvote()` RPC. |
| `team_projects` / `project_tasks` | VERIFIED | RLS on both. |
| `mentor_profiles` / `mentorship_requests` | VERIFIED | RLS present. |
| `memorial_notes`, `saved_wishes` | VERIFIED | RLS present. |
| `resource_submissions` | VERIFIED | Moderation flow via admin. |
| `donations` | PARTIAL | Table exists; no reconciliation with real payment webhooks. |
| `club_waitlist` | VERIFIED | Latest migration; public insert with slug/email validation, admin read. |
| GRANTs on every public table | PARTIAL | Present in most migrations; needs a sweep to confirm none rely on default privileges. |

## 4. Learning Modules

| Feature | Status | Evidence / Gap |
|---|---|---|
| Digital Library (9 seeded courses) | PARTIAL | Client-only seed; no course table, no editor, no versioning. |
| Live Universe Classroom | MOCKED | `ClassroomRoom.tsx` simulates video + chat via `localStorage`; no WebRTC, no real signaling, no scheduling backend. |
| Exam Arena | PARTIAL | Real question flow, real scoring; questions are hard-coded in client. |
| Auto-certificate (≥60%) | VERIFIED | `CertificatePreview.tsx` + `lib/certificate.ts`; PNG generation + Web Share fallback. |
| Safe leaderboard | PARTIAL | Uses `localStorage` only (`leaderboardPrefs.ts`); no cross-user comparison. |
| Hadi Meter (7-promise) | VERIFIED | Client-side calculator. |
| Knowledge Tree | VERIFIED | Client visualization from local progress. |
| Weekly missions | PARTIAL | `lib/missions.ts` runs off `localStorage`; resets are local. |
| Course progress | MOCKED | `lib/courseProgress.ts` is `localStorage`-only; not synced across devices. |

## 5. Community

| Feature | Status |
|---|---|
| Research Archive with upvotes | VERIFIED |
| Team Projects Kanban | PARTIAL — CRUD only, no realtime, no roles per project. |
| Mentorship request flow | PARTIAL — request insert works; no matching, no notifications. |
| Clubs landing + quiz + waitlist | VERIFIED |
| Memorial Wall | VERIFIED |

## 6. Dashboard & Admin

| Feature | Status |
|---|---|
| Personalized dashboard cards | PARTIAL — most tiles read from `localStorage`. |
| Admin moderation UI | PARTIAL — present; needs audit of every mutation for `has_role` server-side enforcement. |

## 7. Payments & Donations

| Item | Status |
|---|---|
| bKash / Nagad / Rocket manual flow | VERIFIED (manual — WhatsApp confirmation). |
| PayPal / Buy-Me-a-Coffee links | VERIFIED. |
| Automated payment reconciliation | MISSING. |
| Refunds / receipts | MISSING. |

## 8. AI

| Item | Status |
|---|---|
| `LOVABLE_API_KEY` secret present | VERIFIED |
| Any live AI call in code | MISSING — no `ai.gateway.lovable.dev` fetch found in `src/`. |
| AI Learning Companion | MISSING — must be built. |

## 9. Ops / Delivery

| Item | Status |
|---|---|
| Deployed (published URL) | VERIFIED |
| Custom domain(s) | VERIFIED (`guru-sphere.online`). |
| Backups | BLOCKED — managed by Lovable Cloud; no user-visible policy in repo. |
| Rollback | BLOCKED — same. |
| Monitoring / error tracking | MISSING — no Sentry / logging pipeline in code. |
| Analytics events | MISSING — no product analytics wired. |
| Performance budgets | MISSING — no Lighthouse gate or bundle budget. |
| Accessibility baseline | PARTIAL — semantic HTML in most places; no automated axe run. |
| i18n framework | MISSING — Bangla strings inlined per-component. |

## 10. Highest-risk items to fix before edtech rebuild

1. **Course data has no server model.** Everything is client-seeded. Any edtech pivot must introduce `courses`, `lessons`, `enrollments`, `progress` tables.
2. **No i18n layer.** Bangla/English co-exist as inline strings — blocks multilingual promise.
3. **Live classroom is entirely simulated.** Do not ship the current room as a "live" feature to real learners.
4. **Leaderboards / missions / progress are localStorage-only.** Not portable across devices; blocks any real learner accountability.
5. **No analytics + no error monitoring.** Cannot measure MVP success.
6. **Admin surface needs a server-side authorization sweep** before opening any creator/institution role.

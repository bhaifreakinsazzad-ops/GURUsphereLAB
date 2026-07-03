# GURUsphere — Transformation Roadmap

**Date:** 2026-07-03  
Combined: sitemap · role map · MVP matrix · route migration · database impact · roadmap · P0/P1/P2 backlog · open decisions.

---

## 1. New Sitemap

```
/
├── /discover                     Search & browse
│   ├── /discover/subjects/:slug  Category page
│   └── /discover/paths/:slug     Learning path detail
├── /learn/:courseSlug            Course detail
│   └── /learn/:courseSlug/lessons/:lessonId   Lesson viewer
├── /communities                  Community index
│   └── /communities/:slug        Community detail (Q&A, showcases)
├── /mentors                      Mentor directory
│   └── /mentors/:handle          Mentor profile
├── /teach                        Educator landing + application
├── /for-organizations
├── /pricing
├── /about
│   └── /memorial                 Origin story (Hadi Wishes narrative)
├── /help
├── /auth                         Sign in / up
├── /onboarding                   Role, interests, goals, language
├── /me                           My Learning workspace
│   ├── /me/continue
│   ├── /me/courses
│   ├── /me/paths
│   ├── /me/saved
│   ├── /me/assessments
│   ├── /me/certificates
│   ├── /me/notifications
│   ├── /me/calendar
│   └── /me/settings
├── /creator                      Educator workspace
│   ├── /creator/courses
│   ├── /creator/courses/:id/edit
│   ├── /creator/learners
│   ├── /creator/analytics
│   ├── /creator/reviews
│   └── /creator/profile
├── /admin                        Platform ops (existing, extended)
└── /*                            NotFound
```

## 2. Existing → New Route Migration

| Old route | New route(s) | Redirect |
|---|---|---|
| `/` | `/` (rebuilt) | 200 |
| `/research-archive` | `/communities/research` | 301 |
| `/team-projects` | `/communities/showcases` | 301 |
| `/mentorship` | `/mentors` | 301 |
| `/exam-arena` | `/me/assessments` (learner) + `/discover/practice` (public sampler) | 301 |
| `/hadi-meter` | `/me/growth-tracker` | 301 |
| `/classroom/:subjectId` | `/learn/:courseSlug/lessons/:lessonId` (real) OR flagged beta | Case-by-case |
| `/clubs` | `/communities` | 301 |
| `/dashboard` | `/me` | 301 |
| `/admin` | `/admin` | 200 |

## 3. User-Role Map

```
role (enum)     : learner | educator | mentor | moderator | admin | org_admin
default on signup: learner
educator        : granted after /teach application approved
mentor          : granted after mentor profile approved
moderator/admin : granted by admin
org_admin       : granted with organization creation
```

All checks server-side via `has_role(auth.uid(), '<role>')`. Never store role on `profiles`. RLS policies use `has_role()`.

## 4. MVP Feature Matrix

| Capability | MVP | Beta | Post-launch | Long-term |
|---|:-:|:-:|:-:|:-:|
| Email + Google auth | ✅ | | | |
| Onboarding (role, interests, goals, locale) | ✅ | | | |
| i18n (EN + BN) | ✅ | | | |
| Discover (search + filters) | ✅ | | | |
| Course & lesson viewer | ✅ | | | |
| Progress sync (server) | ✅ | | | |
| Saved items | ✅ | | | |
| Basic assessments (per lesson) | ✅ | | | |
| Certificates (auto on pass) | ✅ | | | |
| Learner workspace (`/me`) | ✅ | | | |
| Educator application | ✅ | | | |
| Course builder (draft → publish) | ✅ | | | |
| Basic educator analytics | ✅ | | | |
| Admin moderation | ✅ | | | |
| Notifications (in-app) | ✅ | | | |
| Analytics events | ✅ | | | |
| A11y baseline (WCAG AA smoke) | ✅ | | | |
| Communities (Q&A, showcases) | | ✅ | | |
| Mentorship scheduling | | ✅ | | |
| Reviews & ratings | | ✅ | | |
| Payments + creator payouts | | | ✅ | |
| AI Learning Companion | | | ✅ | |
| Live classroom (real video) | | | ✅ | |
| Institutions / private academies | | | | ✅ |
| Native mobile app | | | | ✅ |

## 5. Database Impact Summary

**New tables (public schema, RLS + GRANTs required per project rules):**

| Table | Purpose | Key columns |
|---|---|---|
| `subjects` | Top-level taxonomy | id, slug, name_en, name_bn, icon |
| `learning_paths` | Curated multi-course tracks | id, slug, title, subject_id |
| `courses` | Publishable unit | id, slug, title, summary, creator_id, subject_id, locale, level, status(draft/published) |
| `lessons` | Course children (ordered) | id, course_id, order, title, kind(video/text/interactive), body, media_url |
| `enrollments` | Learner ↔ course | id, user_id, course_id, enrolled_at |
| `lesson_progress` | Sync learner progress | id, user_id, lesson_id, completed_at, seconds_watched |
| `assessments` | Quizzes per lesson/course | id, course_id, lesson_id nullable, title, pass_pct |
| `assessment_questions` | | id, assessment_id, order, prompt, kind, choices(jsonb), correct(jsonb) |
| `assessment_attempts` | | id, user_id, assessment_id, score_pct, passed, submitted_at |
| `certificates` | | id, user_id, course_id, issued_at, code |
| `communities` | | id, slug, subject_id, kind(qa/showcase/circle) |
| `posts` | Discussions, Q&A | id, community_id, author_id, title, body, status |
| `comments` | | id, post_id, author_id, body |
| `notifications` | | id, user_id, kind, payload(jsonb), read_at |
| `creator_applications` | Educator vetting | id, user_id, status, submitted_at, reviewed_by |
| `organizations` *(long-term)* | | id, name, owner_id |
| `org_members` *(long-term)* | | org_id, user_id, role |

**Enum changes:** extend `app_role` with `educator`, `mentor`, `org_admin`.

**Migrations:** one migration per group (taxonomy → content → progress → assessments → community → creator apps). Every migration must include `GRANT` per project rules.

**Data migration:**
- `research_topics` → `posts` (community_id = "research").
- `club_waitlist` → `notifications` (interest signals) or drop after export.

## 6. API Requirements

- Postgres via Supabase; PostgREST for CRUD.
- Edge functions only where necessary (assessment scoring server-side; certificate issuance; educator application review; notifications fan-out).
- Full-text search: Postgres `tsvector` on `courses(title, summary)` + `posts(title, body)`.
- Realtime: `notifications` (per-user channel).

## 7. Technical Transformation Roadmap

**Stage 1 — Discovery & Audit** ✅ (this document set)  
**Stage 2 — Product & Brand Blueprint** — needs approval on brand direction + MVP scope.  
**Stage 3 — UX & Design System** — deliver `/docs/DESIGN-SYSTEM.md`, tokens in `src/index.css`, refactored `ui/*` variants, homepage + core screens (Figma-in-code).  
**Stage 4 — Technical Transformation Plan** — migrations, route map merged, testing strategy, CI budgets.  
**Stage 5 — Implementation** in this order:
1. Foundations + tokens + i18n scaffold.
2. Global navigation + `/auth` + `/onboarding`.
3. Content model migrations + admin seeding.
4. Discover.
5. Course + lesson experience + progress sync.
6. Assessments + certificates (reuse existing pipeline).
7. Learner workspace.
8. Educator application + course builder v1.
9. Admin moderation extensions.
10. Analytics + a11y + performance hardening + beta gate.

## 8. Backlog

**P0 — required before MVP goes live**
- Design tokens documented & applied (`docs/DESIGN-SYSTEM.md`).
- i18n framework + Bangla/English catalogs.
- New content model (subjects/courses/lessons/enrollments/lesson_progress/assessments/certificates) + migrations.
- Server-side progress (retire `localStorage`-only truth for progress & missions).
- New nav + homepage (Direction A / Concept 1).
- `/auth` + `/onboarding` + role assignment.
- `/discover` + course detail + lesson viewer.
- Learner workspace `/me`.
- Educator application + basic course builder.
- Admin: content + educator moderation.
- Analytics event pipeline + error monitoring (Sentry or Lovable-native).
- A11y baseline (axe smoke, keyboard sweep, 44 px targets).
- Sitemap generator (`scripts/generate-sitemap.ts`) replacing hand-edited XML.

**P1**
- Communities (Q&A, showcases) migrated from `research_topics` / `team_projects`.
- Mentor directory + request flow polish.
- Notifications (in-app + email digest).
- Reviews & ratings on courses.
- Bangla content pipeline for first 10 courses.
- Educator analytics v1.

**P2**
- Payments (only after commercial rules approved).
- AI Learning Companion (Lovable AI Gateway) — must be real.
- Live classroom v2 (real WebRTC).
- Organizations & private academies.
- Certificate marketplace / verification page.
- Native mobile app.

## 9. Risks & Dependencies

| Risk | Mitigation |
|---|---|
| Rebuilding blows up scope & timelines | Ship MVP behind a feature flag; keep current site live at `/legacy` during transition. |
| `localStorage`-only progress will conflict with server model | Write one-shot client → server migration on first sign-in post-launch. |
| i18n retrofit is invasive | Introduce `t()` wrapper early; refactor one section at a time. |
| Educator supply cold start | Seed with 5–10 curated educators before public launch. |
| Live classroom expectations set by current mock | Explicitly label it *beta / simulated* until real WebRTC ships, or hide it. |
| Payments compliance in BD | Defer until commercial + legal rules documented. |

## 10. Open Decisions (require product-owner approval)

1. **Brand direction** — approve A / B / C (recommendation: **A "Orbit"**).
2. **Homepage concept** — approve 1 / 2 / 3 (recommendation: **1 Goal-First**).
3. **Rename?** — Keep `GURUsphere`? Confirm.
4. **Memorial placement** — Move to `/memorial` under About, keep small footer link on homepage. Confirm.
5. **Live classroom** — Hide, ship as clearly-labeled beta, or defer entirely?
6. **Payments in MVP** — Confirm out-of-MVP.
7. **AI Companion messaging** — Ship as "Coming" tag, or don't mention until real?
8. **Audio autoplay/toggle** — Recommend removing platform-wide; confirm.
9. **Editorial "Letter" pages** — Keep as story chapters on `/about` and `/memorial` only; confirm.
10. **Donation CTA prominence** — Move from floating global CTA to `/about` + footer; confirm.
11. **Sitemap** — Adopt `scripts/generate-sitemap.ts` generator; confirm.
12. **Analytics vendor** — PostHog / Plausible / Umami — pick one.
13. **Error monitoring** — Sentry vs Lovable-native; pick one.
14. **First 3 subjects to seed** — recommendation: Web Development, English & IELTS, Freelancing/Career.
15. **Educator revenue share model** — needed before payments unblocked.

---

**Next step:** get sign-off on decisions 1–4 + 8–11 so Stage 2 (design tokens + homepage build) can start with locked constraints.

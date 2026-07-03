# Stage 3B — Learner Vertical Slice

**Scope shipped:** Auth + roles + onboarding + learning schema + discovery + course details + enrollment + lesson viewer + `/my-learning`.
**Deferred to 3C:** Educator course builder, admin moderation UI, full role-transition workflows, payments, live classroom, certificates re-integration.

## Routes

| Path | Access | Purpose |
| --- | --- | --- |
| `/` | public | Home |
| `/login`, `/signup` | public | Auth |
| `/auth` | redirect → `/login` | Legacy alias |
| `/forgot-password`, `/reset-password` | public | Password reset |
| `/onboarding` | signed-in | 5-step goal-based wizard, required once |
| `/discover` | public | DB-backed course search + filters (subject, level, language) |
| `/courses/:slug` | public | Course detail, curriculum, enroll CTA |
| `/learn/:courseId/lessons/:lessonId` | signed-in + onboarded | Lesson viewer, mark complete, next/prev |
| `/my-learning` | signed-in + onboarded | Continue learning, enrolled/completed, recommendations |
| `/legacy` + `/exam-arena`, `/hadi-meter`, `/research-archive`, `/team-projects`, `/mentorship`, `/dashboard`, `/admin`, `/classroom/:subjectId`, `/clubs` | as before | Untouched memorial layer |

## Data model (new tables — memorial tables untouched)

- `learner_preferences` — 1 row per user; drives onboarding gate and recommendations.
- `subjects` — public catalog of subject areas.
- `courses` — status workflow enum `draft → submitted → changes_requested → approved → published → archived / rejected`.
- `course_modules`, `lessons` — nested content; `lessons.status` gates public visibility.
- `enrollments` — unique `(user_id, course_id)`; own-row RLS.
- `lesson_progress` — unique `(user_id, lesson_id)`; own-row RLS.

RLS summary:
- Anon + auth read: `subjects (status=active)`, `courses (published + public)`, `course_modules` / `lessons` whose parent course meets that filter.
- Educator can read+edit own courses only while `status IN (draft, submitted, changes_requested)`.
- Admin (via `public.has_role(auth.uid(),'admin')`) can do anything.
- Learners can only see and mutate their own enrollments and progress.

## i18n

`src/lib/i18n.ts` — English source of truth; Bangla falls back to English silently per approved rule. `<html lang>` and dictionary drive from `localStorage['orbit.locale']`. Navbar toggle wired.

## Known follow-ups for 3C

- Educator application table + `/teach/apply` + `/educator/*` workspace.
- Admin moderation table `moderation_actions` + `/admin/courses/:id/review`.
- STAGE-3-SECURITY-VERIFICATION cross-user tests (schema + policies are in place; a scripted verification pass is the next task).
- Full audit trail on course/lesson status transitions.
- Email verification on/off decision (currently follows project auth defaults).

## Seed data

Migration installs 6 subjects and 3 fully structured demo courses (Digital Essentials, Everyday English for Work, Start a Small Business This Month) so Discover, Course Detail, and Lesson Viewer work end-to-end immediately.

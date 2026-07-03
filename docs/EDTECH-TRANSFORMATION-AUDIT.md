# GURUsphere — EdTech Transformation Audit

**Date:** 2026-07-03  
**Purpose:** Classify every existing route, feature, component, DB table, and workflow against the new edtech direction so we reuse — not rebuild — wherever possible.

## Decision key

- **KEEP** — Works as-is in the new product.
- **REFINE** — Keep the code, adjust copy / IA / styling to the edtech frame.
- **REPURPOSE** — Reuse the shell/logic under a new meaning (e.g. Memorial → Community Story).
- **REBUILD** — Concept survives, implementation must be replaced.
- **REMOVE** — Does not fit the edtech direction.
- **NEW** — Not present today; required by the new spec.

---

## Routes

| Route | Current purpose | New edtech purpose | Decision | Required change | Impact | Priority |
|---|---|---|---|---|---|---|
| `/` | Memorial-first landing | Edtech homepage: Discover + Learn + Teach | REBUILD | New IA per §7 of directive; keep memorial as a subtle "story" strip. | High | P0 |
| `/auth` | Sign in/up | Same, plus role selection (learner/educator) at onboarding | REFINE | Add onboarding step, interests, goals. | Med | P0 |
| `/dashboard` | Learner dashboard | "My Learning" workspace | REFINE | Rename, restructure tiles: Continue / Paths / Assessments / Certs. | Med | P0 |
| `/research-archive` | Research topic upvotes | Community: subject-based questions/discussions | REPURPOSE | Rename to `/communities` or `/discussions`; reuse `research_topics` schema. | Med | P1 |
| `/team-projects` | Kanban for projects | Learner project showcases + collaborative challenges | REFINE | Add tagging, visibility, showcase view. | Med | P1 |
| `/mentorship` | Mentor request | Mentors & expert guidance hub | REFINE | Add scheduling, session types, profiles. | High | P1 |
| `/exam-arena` | Practice exams | Assessments engine | REFINE | Move questions to DB; support quizzes per lesson. | High | P0 |
| `/hadi-meter` | 7-promise calculator | Personal goals / study-habit tracker | REPURPOSE | Rebrand as "Growth Tracker"; keep math, drop memorial framing on this page. | Low | P2 |
| `/classroom/:subjectId` | Simulated live room | Real live sessions (educator-hosted) | REBUILD | Replace mock with real video + real chat, or explicitly gate as beta. | High | P2 |
| `/clubs` | Club waitlist + quiz | Learning communities | REPURPOSE | Merge with `/communities`; keep quiz as interest-mapping. | Med | P1 |
| `/admin` | Moderation | Same + creator approvals + content ops | REFINE | Add creator application review, course moderation. | High | P0 |
| — | — | `/discover` — search & browse | NEW | Search across courses, paths, subjects. | High | P0 |
| — | — | `/learn/:pathSlug` | NEW | Course/path detail. | High | P0 |
| — | — | `/lesson/:lessonId` | NEW | Lesson viewer + progress + quiz. | High | P0 |
| — | — | `/teach` | NEW | Educator landing + application. | High | P0 |
| — | — | `/creator` (workspace) | NEW | Course builder, learner mgmt. | High | P1 |
| — | — | `/for-organizations` | NEW | Institutional landing. | Med | P2 |
| — | — | `/pricing`, `/help`, `/about` | NEW | Standard trust pages. | Med | P1 |

---

## Components (`src/components/`)

| Component | Decision | Notes |
|---|---|---|
| `Navbar`, `FooterSection` | REFINE | New IA (Discover / Learn / Communities / Teach / Mentors / My Learning). |
| `HeroSection` | REBUILD | New outcome-driven hero with goal search + dual CTAs. |
| `TrustStrip` | KEEP | Reusable trust primitive. |
| `LetterPage`, `EditorialDivider`, `FilmGrain`, `CandleLogomark` | REPURPOSE | Move under `components/story/` — used only on `/memorial` / `/about` narrative pages. |
| `LegacyTimelineSection`, `MemorialWallSection`, `MemorialBadge` | REPURPOSE | Consolidate into `/memorial` (or About > Origin story). Not on homepage above the fold. |
| `LibrarySection` (9 seeded courses) | REBUILD | Replace with real course grid backed by `courses` table. |
| `ClassroomSection`, `KnowledgeTreeSection`, `ExamSection` | REFINE | Wire to real course/lesson/assessment data. |
| `ResearchHubSection`, `OpenSourceSection`, `PremiumFreeToolsSection` | REPURPOSE | Fold into `/discover` categories. |
| `SubmitResourceSection` | KEEP | Community contribution stays. |
| `WishOfTheWeek`, `Candle`, `HadiRadar` | REMOVE from primary flow | Move to `/memorial` if kept. |
| `UniqueFeatures` | REBUILD | Reframe as "How GURUsphere helps you learn". |
| `CommunityGrid`, `ClubsSection` | MERGE → `/communities` |  |
| `DonationSection`, `FloatingDonateCTA` | REFINE | Keep but reposition — not the primary CTA. |
| `lab/*` primitives (`GlassCard`, `GlowButton`, `LabSectionHeader`) | KEEP | Foundation for new design tokens. |
| `ui/*` (shadcn) | KEEP | Standard primitives. |
| `AudioToggle`, `AudioContext` | REMOVE | Background audio conflicts with edtech tone + a11y. |
| `CertificatePreview` + `lib/certificate.ts` | KEEP | Reuse for assessments engine. |
| `TopicLeaderboard` | REFINE | Move to server data. |

---

## Database

| Table | Decision | Change |
|---|---|---|
| `profiles` | REFINE | Add `role`, `locale`, `country`, `avatar_url`, `bio`, `headline`. |
| `user_roles` (enum) | REFINE | Extend enum: `learner`, `educator`, `mentor`, `moderator`, `admin`, `org_admin`. |
| `research_topics` | REPURPOSE | Rename → `discussions` (subject_id, tags). |
| `team_projects` / `project_tasks` | KEEP | Learner project showcases. |
| `mentor_profiles` | REFINE | Add hourly rate (nullable), timezone, session types. |
| `mentorship_requests` | REFINE | Add status machine, scheduled_at. |
| `memorial_notes`, `saved_wishes` | KEEP | Scoped to `/memorial`. |
| `resource_submissions` | KEEP | Community-submitted resources. |
| `donations` | KEEP |  |
| `club_waitlist` | REPURPOSE | Fold into `community_memberships`. |
| — | NEW | `subjects`, `courses`, `lessons`, `enrollments`, `lesson_progress`, `assessments`, `assessment_attempts`, `certificates`, `communities`, `posts`, `comments`, `notifications`, `creator_applications`, `organizations`, `org_members`. |

---

## Workflows

| Workflow | Decision |
|---|---|
| Sign up → memorial browsing | REBUILD → Sign up → onboarding (role, interests, goals) → Discover. |
| Practice exam (client-only) | REFINE → Real assessment tied to lesson/course. |
| Donation (WhatsApp confirmation) | KEEP for now. |
| Admin moderates resources | REFINE → Extend to courses & creators. |
| Mentor request | REFINE → Add scheduling + notifications. |

---

## Reusable assets we do NOT rebuild

- shadcn `ui/*` primitives
- Auth, profiles, roles table, `has_role()` pattern
- Certificate pipeline
- Mentorship & team-project scaffolding
- Editorial/letter components (relocated to `/memorial`)
- Lab design primitives (become part of the new design system)

---

## What must be built fresh

1. **Content model:** subjects → courses/paths → lessons → assessments → certificates.
2. **Discovery:** search + filters + recommendations.
3. **Learner workspace:** Continue Learning, Enrollments, Progress, Saved.
4. **Educator workspace:** application → profile → course builder → analytics.
5. **i18n layer:** English + Bangla, RTL-ready.
6. **Analytics + error monitoring.**
7. **Design tokens documented in `/docs/DESIGN-SYSTEM.md`.**

# GURUsphere — EdTech Product Specification

**Version:** 1.0 (Blueprint)  
**Date:** 2026-07-03  
**Status:** Draft for product-owner review. No implementation begins until this is approved.

---

## 1. Product Vision

GURUsphere is a **global knowledge and learning operating system** where anyone can learn, teach, mentor, collaborate, and grow through structured knowledge experiences — starting from Bangladesh, built for the world.

## 2. Brand Positioning

- **Name:** GURUsphere
- **Promise:** Make useful knowledge easier to discover, understand, practise, share, and apply.
- **Tagline:** *Learn Anything. Teach Anything. Grow Together.*
- **Category:** Intelligent Learning Ecosystem — not an LMS, not a course marketplace.
- **Voice:** Human, intelligent, optimistic, credible, calm.

## 3. Target Audiences

**Primary (MVP):** Students, self-learners, job seekers, teachers in Bangladesh + South Asia.  
**Secondary (Beta):** Professionals, subject-matter experts, small training organizations.  
**Long-term:** Universities, NGOs, businesses, community-learning initiatives globally.

## 4. Core User Problems

1. Useful, credible learning is scattered across YouTube, PDFs, closed courses.
2. Local learners lack curated, Bangla-first paths from foundations to job-ready skills.
3. Experts have knowledge but no simple way to teach and reach learners.
4. Mentorship is informal, invisible, and inaccessible.
5. Learners cannot prove what they've learned in a portable, credible way.

## 5. Value Propositions

- **For learners:** One place to discover, learn, practise, and prove — in your language, on your device, at your pace.
- **For educators:** A modern, low-friction way to publish knowledge, reach learners, and grow reputation.
- **For mentors:** A trusted surface to offer expert guidance.
- **For organizations:** A hosted foundation to run structured learning for a team, class, or community.

## 6. User Roles

| Role | Capabilities |
|---|---|
| Visitor | Discover, preview courses, view instructors, sign up. |
| Learner | Enroll, learn, assess, save, discuss, earn certificates. |
| Educator | Create courses & lessons, publish, view basic analytics. |
| Mentor | Publish mentor profile, accept sessions. |
| Moderator | Review content, moderate discussions. |
| Admin | Platform ops, approve educators, manage roles. |
| Org Admin *(future)* | Manage org members, assign learning, view org analytics. |

Roles stored in `user_roles` (separate table, `has_role()` SECURITY DEFINER — do not put on `profiles`).

## 7. Core User Journeys

1. **Discover → Learn:** Visitor lands → picks a goal → sees recommended paths → signs up → onboarding → first lesson.
2. **Continue Learning:** Learner returns → "My Learning" → resume last lesson → complete → assessment → progress.
3. **Prove & Share:** Complete assessment ≥ pass → certificate → download/share.
4. **Teach on GURUsphere:** Expert lands `/teach` → applies → approved → creates course → publishes.
5. **Ask & Answer:** Learner asks a question in a subject community → mentor/educator answers → thread ranks.
6. **Mentor Session:** Learner browses mentors → requests session → mentor accepts → session scheduled.

## 8. Feature Architecture

### Learn
Subjects → Paths → Courses → Lessons (video / text / interactive) → Assessments → Certificates.

### AI Learning Companion *(post-MVP, foundations only in MVP)*
Concept explainer, quiz generator, summarizer, gap identifier, personalised plans. **Ships only when non-mocked.**

### Teach & Create
Educator application → profile → course builder → lesson editor → publishing workflow → learner mgmt → reviews → analytics.

### Mentorship
Mentor profile → availability → request → scheduled session → feedback.

### Community
Subject discussions, study circles, project showcases, Q&A.

### Progress & Achievement
Streaks, milestones, assessments, certificates, portfolio.

### Institutions *(long-term)*
Private spaces, assigned learning, org analytics, branded academies.

## 9. Information Architecture

**Primary nav:** Discover · Learn · Communities · Teach · Mentors · My Learning

**Public pages:** Home, Discover, Course/Path detail, Subject category, Instructor profile, Mentor profile, Community preview, Teach on GURUsphere, For Organizations, Pricing, About, Help, Auth.

**Learner workspace:** Learning Home, Continue Learning, My Courses, Paths, Saved, Assessments, Achievements, Certificates, Communities, Notifications, Calendar, Profile & Settings.

**Educator workspace:** Creator Dashboard, Course Builder, Content Library, Learners, Assessments, Community Mgmt, Analytics, Earnings, Reviews, Creator Profile, Publishing.

## 10. Monetization (architecture only, off by default)

Hybrid: free content, premium courses, subscriptions, mentor sessions, institutional licensing, sponsored programs, certificates. **No payment integration until commercial rules are approved.**

## 11. Accessibility Requirements

- WCAG 2.2 AA target.
- Keyboard nav across every interactive element.
- `prefers-reduced-motion` respected.
- All interactive targets ≥ 44×44 px on mobile.
- Screen-reader labels on all icon buttons.
- Color contrast ≥ 4.5:1 for body, 3:1 for large text.
- No color-only status conveyance.

## 12. Localization Strategy

- **Languages at launch:** English + Bangla.
- **Framework:** All UI copy behind an `i18n` layer (`react-i18next` or lightweight message catalog). No inlined Bangla strings in components after migration.
- **Content:** Courses declare a `locale`; UI adapts.
- **RTL-ready:** Layout uses logical CSS properties (`padding-inline-start`) from day one.

## 13. Trust & Safety

- Educator verification before publish.
- Content moderation queue for user-generated content.
- Report & block on discussions, mentors, learners.
- Clear community guidelines page.
- Age gate on account creation (13+).

## 14. Data & Privacy

- Personal data stored server-side under RLS, minimum-necessary principle.
- Learner progress synced (no more `localStorage`-only truth).
- Explicit consent for optional analytics.
- Data export + deletion endpoints for account owners.

## 15. MVP Scope (see MVP matrix in TRANSFORMATION-ROADMAP.md)

**Learner:** Auth, onboarding, discover, course detail, lesson viewer, progress, saved, basic assessments, profile, responsive dashboard.  
**Educator:** Application, profile, basic course/lesson creation, draft→publish, basic analytics.  
**Platform:** Categories, search, roles/permissions, admin moderation, content mgmt, notifications, i18n, a11y baseline, analytics events, security & privacy.

**Explicitly deferred from MVP:** AI Companion, payments, mentorship scheduling, live classroom video, org features, certificates marketplace.

## 16. Post-MVP Roadmap

- **Beta:** Real mentorship scheduling, discussions, certificates v2, real analytics dashboard for educators.
- **Post-launch:** AI Companion (Lovable AI Gateway), payments, creator monetization.
- **Long-term:** Institutions, private academies, live classroom, mobile app.

## 17. Technical Implications

- New content model & migration (see roadmap).
- i18n infra.
- Search infra (Postgres `tsvector` first; upgrade later if needed).
- Server-side progress + assessments.
- Realtime for notifications (Supabase Realtime).
- Analytics event pipeline.
- Error monitoring.
- CI: typecheck + lint + a11y smoke + Lighthouse budget on PRs.

## 18. Success Metrics

- **Activation:** % of signups completing onboarding + starting a lesson within 24 h.
- **Engagement:** Weekly active learners, lessons completed per WAL.
- **Learning outcome:** Assessment pass rate; certificates earned.
- **Supply:** Approved educators; published courses; % courses with ≥ 10 enrollments.
- **Community health:** % questions with ≥ 1 answer < 24 h; report rate.
- **Accessibility:** Automated axe pass rate ≥ 95%; Lighthouse a11y ≥ 95.
- **Performance:** LCP ≤ 2.5 s on 4G mid-range Android; JS ≤ 200 KB gz on route entry.

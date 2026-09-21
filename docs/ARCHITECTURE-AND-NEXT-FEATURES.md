# GURUsphereLab Architecture Review and Next-Feature Plan

**Assessment date:** 21 September 2026  
**Repository:** `bhaifreakinsazzad-ops/GURUsphereLAB`  
**Production project:** `gurusphere-lab` on Vercel

## Executive conclusion

GURUsphereLab has a workable foundation for a Bangladesh-first learning platform. The application is a React 18 and Vite single-page app with TypeScript, Tailwind CSS, React Router, route-level lazy loading, and a typed Supabase client. The current product already includes discovery, authentication, onboarding, courses, lessons, progress, educator workflows, assessments, mentorship, clubs, research, and community surfaces.

The next phase should not add more isolated pages. It should make one learner journey dependable: **choose a goal, discover a relevant Bengali or English path, enroll, study, practice, resume, and see trustworthy progress**. The highest-priority work is testability and learning-record integrity, followed by assessment quality, educator operations, and low-bandwidth delivery.

## Validation results

| Check | Result | Interpretation |
|---|---:|---|
| `npm test -- --reporter=verbose` | Passed: 1 test | The existing unit baseline passes, but the original suite contained only a placeholder test. |
| `npm run build` | Passed | The production Vite build completes. It still reports a large main chunk warning. |
| `npm run lint` | Failed: 27 errors, 14 warnings | Type-safety, hook-dependency, and style-quality issues remain. |
| Playwright smoke suite | Passed: 4 tests | Public routing, auth-form validation, anonymous protected-route redirect, and course-entry behavior passed locally. |
| Live authenticated flows | Not run with a real account | No dedicated test credentials or seeded auth fixture were available. Creating a production test account was intentionally avoided. |

The repository’s original Playwright configuration imported `lovable-agent-playwright-config`, which is not declared or installed in `package.json`. That made browser-test discovery fail before any test could run. The configuration was replaced with a standard Playwright setup, and the smoke suite was added at `e2e/core-flows.spec.ts`.

The passing browser checks verify that the frontend can load the public shell, render discovery, reject malformed sign-in input without submitting, redirect an anonymous visitor from `/my-learning` to `/login`, and reach a course-detail URL. They do **not** prove that Supabase password authentication, email confirmation, enrollment insertion, progress persistence, or RLS behavior succeeds for a signed-in learner. Those paths require a non-production test account or a controlled auth fixture.

## Frontend architecture

### Current structure

The application contains approximately 24 page components, 102 components, 11 library modules, and two React contexts. `src/App.tsx` owns route registration and lazy loading. `src/main.tsx` mounts the application. `AuthContext` owns Supabase session state, user state, profile loading, and sign-out. Feature modules such as `src/lib/learning.ts`, `src/lib/preferences.ts`, and `src/lib/educator.ts` wrap direct Supabase queries. The generated database types live under `src/integrations/supabase/types.ts`.

This is a pragmatic SPA architecture. It is easy to understand and deploy, and the route boundaries already provide a reasonable basis for code splitting. The main weakness is that the application mixes several generations of product behavior. The newer learning features use Supabase-backed records, while older assessment, dashboard, and memorial experiences still contain local or browser-oriented logic. The result is a broad product surface without one consistent domain layer.

### Strengths

The typed Supabase client gives the newer learning code a clear data contract. Course discovery, course detail, enrollment, progress, learner preferences, and educator operations are separated into reusable helpers rather than being entirely embedded in JSX. Protected routes distinguish authentication from onboarding completion. The visual system also has reusable orbit components, shared tokens, and lazy-loaded feature pages.

The product model is broader than a course catalog. It already recognizes that a serious learning platform needs educators, mentorship, practice, clubs, research, and evidence of progress. The Bangladesh-first direction is visible through Bengali typography, bilingual metadata, and a path toward local learner needs.

### Structural risks

The application still has duplicated authentication experiences. `AuthPage.tsx` is the current orbit-style route implementation, while `Auth.tsx` contains another sign-up and sign-in implementation with different validation rules and copy. This creates a risk that `/login` and any future legacy entry point will diverge in behavior.

`AuthContext` starts the auth listener before checking the existing session, which is the correct ordering, but profile-fetch errors are ignored and the loading state is cleared before profile loading completes. The context also performs profile queries directly rather than exposing a typed query state with an explicit error. A transient profile failure can therefore look like a missing profile.

`ProtectedRoute` treats a failed learner-preferences query as if onboarding is incomplete because `getPreferences` has no visible error path in the route guard. That can redirect a valid learner to onboarding during a temporary database or network failure. The guard should distinguish `not found`, `request failed`, and `completed` states.

The learning pages call Supabase directly from the browser. This is acceptable for public reads and low-risk beta workflows, but enrollment, progress, completion, educator publishing, certificates, and assessment scoring should become server-authoritative as soon as they have product consequences.

### Core enrollment and progress findings

The enrollment helper uses an `upsert` keyed by `user_id, course_id`, which is a good idempotency primitive. However, the database policy currently verifies that the user owns the inserted `user_id`; it does not enforce that the course is published and public. A signed-in client that knows another course ID may therefore create an enrollment for a draft or private course unless another control exists outside the client.

The progress helper verifies neither the relationship between `lesson_id` and `course_id` nor whether the lesson belongs to an enrolled course. The foreign keys independently validate that both IDs exist, but they do not enforce that they belong to the same course. The client supplies both IDs, so progress integrity should be enforced by a database function or a composite relationship with a server-side transaction.

Course completion is not automatically derived from lesson completion. `upsertLessonProgress` updates the lesson record and the enrollment activity timestamp, but it does not calculate course completion or set `enrollments.status = 'completed'`. The My Learning page therefore depends on a status that the current learner loop does not appear to produce.

`LessonViewer` queries published lesson content before checking whether the learner is enrolled. The UI hides non-preview lessons from an unenrolled user, but the public read policy for published lessons can still expose their content through the browser request. Access control must be enforced in the database policy, not only in the component.

`MyLearning` performs several asynchronous requests without an error boundary. A failed enrollment, preferences, or recommendation request can leave the page in an ambiguous state. The page also uses `any` casts for enrollment rows, which is a symptom that the generated Supabase relationship types are not being used as the page contract.

## Test strategy required for the next sprint

The current smoke suite is useful for routing and validation regressions, but it is not sufficient for the critical learner loop. The next test layer should use a dedicated Supabase test account or an isolated test project. The fixture should create a learner, complete onboarding, enroll in a seeded published course, mark a lesson complete, and clean up the created records.

The authenticated suite should cover successful sign-up or sign-in, invalid credentials, sign-out, redirect preservation, onboarding completion, course enrollment idempotency, rejection of unauthorized progress writes, lesson completion, automatic course completion, and My Learning resumption. A second role fixture should cover educator application approval and the inability of an unapproved user to create or publish courses.

Database contract tests should run against the same schema used by deployment validation. They should verify that anonymous users can read only public catalog data and preview lessons, that authenticated users can read only their own enrollment and progress, and that educator and administrator policies do not widen access accidentally.

## Prioritized next features

### P0: Make the learner loop trustworthy

The first feature sprint should harden the existing loop rather than add new surface area. Move enrollment and progress mutations behind database functions or a small server-side API. Require the target course to be published and public. Require a progress lesson to belong to the supplied course and require an active enrollment unless the lesson is a preview. Derive course completion transactionally when all required lessons are complete.

Unify `Auth.tsx` and `AuthPage.tsx` into one authentication experience. Add explicit email-confirmation and password-reset states. Preserve the original redirect after onboarding. Make profile and preference-loading failures visible instead of silently treating them as missing data.

Add progress indicators to course detail and My Learning. Show the learner’s next lesson, completed lesson count, percentage complete, and last activity. This gives the platform a concrete retention loop without requiring gamification first.

### P1: Build the assessment and feedback engine

A course needs more than readable lessons. Add a typed assessment model with question banks, multiple-choice and short-answer items, explanations, scoring rules, attempts, answer records, and review states. Keep scoring server-authoritative. Begin with one assessment type and one reliable results page rather than implementing every exam format at once.

Connect assessment results to the learner path. A learner should receive a clear explanation of what was mastered, what needs review, and which lesson or practice set should come next. Certificates should be generated only from durable completion and assessment records.

### P1: Make Bengali a complete product language

The current Bengali support is strongest in typography and selected metadata. The next localization feature should cover navigation, authentication errors, onboarding, empty states, course actions, progress messages, assessment explanations, and support content. Store course-language metadata explicitly and provide a language preference that affects both interface copy and content selection.

The first Bengali content set should focus on high-demand foundational paths: digital skills, English communication, mathematics, career readiness, and entrepreneurship. Content quality review by Bengali educators is more important than translating every legacy page.

### P1: Create an educator quality pipeline

Extend educator applications into a real content-supply workflow. Add educator profiles, course draft versioning, review comments, publish checks, content validation, and basic learner analytics. Require a course to pass metadata, curriculum, accessibility, and language checks before publication.

The educator workspace should show draft status, review feedback, learner enrollments, completion rates, and lesson drop-off. Administrative review should manage content quality and safety, not only community records.

### P2: Improve Bangladesh-first delivery constraints

Optimize the application for low-bandwidth mobile use. Reduce the initial JavaScript payload, lazy-load heavy assessment and visualization routes, avoid loading legacy surfaces on the learning path, and add resilient retry states for Supabase requests. Course content should support lightweight text-first lessons and optional downloadable or cached reading where policy permits.

Add search and filtering that work well with Bengali text. Include subject, language, difficulty, duration, and goal filters. Search should normalize Bengali and English metadata and should not depend only on client-side filtering once the catalog grows.

### P2: Establish learner support and trust

Before collecting more personal data or introducing paid services, add privacy, terms, support, contact, content-reporting, and account-deletion workflows. Add an audit trail for educator approvals, course publication, certificate issuance, and administrator actions. Provide a clear explanation of what progress data is stored and how learners can request correction or deletion.

### P3: Expand communities and sustainable offerings

Once the learner loop and content pipeline are dependable, unify clubs, research, projects, mentorship, and classroom rooms under a community model with moderation, notifications, reporting, and clear role boundaries. Live learning should follow scheduling, attendance, recording, and incident-handling capabilities rather than precede them.

Commercial features should come after trust is established. The strongest candidates are paid cohorts, institutional learning spaces, premium mentorship, educator analytics, and verifiable certificates. The public catalog and foundational learning loop should remain accessible while paid products provide additional structure, feedback, or opportunity.

## Recommended implementation order

1. Add an isolated Supabase test fixture and expand the Playwright suite to authenticated sign-in, enrollment, progress, and sign-out.
2. Harden database access for enrollment, progress, lesson visibility, and course completion.
3. Unify authentication and introduce explicit loading and error states.
4. Add learner progress summaries and a reliable resume flow.
5. Implement the first assessment and feedback vertical slice.
6. Complete localization for the learner journey and publish the first Bengali paths.
7. Expand educator review, versioning, and analytics.
8. Optimize mobile and low-bandwidth performance, then expand community and revenue capabilities.

## Definition of success for the next release

The next release should be considered successful when a new learner can create or sign into an account, complete onboarding, discover a course in English or Bengali, enroll once without duplicate records, open only authorized lesson content, complete a lesson, leave the site, return to the same course, and see accurate progress. A reviewer should be able to verify those behaviors from automated tests against an isolated database without manually editing production data.

## References

[1]: https://github.com/bhaifreakinsazzad-ops/GURUsphereLAB "GURUsphereLab source repository"

[2]: https://supabase.com/docs/guides/database/postgres/row-level-security "Supabase Row Level Security documentation"

[3]: https://supabase.com/docs/guides/auth "Supabase Auth documentation"

[4]: https://playwright.dev/docs/test-intro "Playwright Test documentation"

[5]: https://www.unesco.org/en/open-educational-resources "UNESCO Open Educational Resources"

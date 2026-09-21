# P0/P1 Learner Platform Implementation

**Date:** 21 September 2026

## Delivered

The learner loop now uses Supabase security-definer functions for the critical mutations rather than trusting browser-supplied ownership and relationships. `enroll_in_course` verifies that a course is published and public before performing an idempotent enrollment. `record_lesson_progress` verifies that the lesson belongs to the course, requires an enrollment, validates progress values, updates activity, derives course completion, and creates a certificate eligibility record when all published lessons are complete. `get_course_progress_summary` returns completed lessons, total lessons, percentage, next lesson, and completion state.

The first assessment vertical slice is live in the database and frontend. It includes typed assessments, questions, bilingual choices and explanations, attempts, answer records, server-side scoring, pass thresholds, and a protected assessment route. A published Digital Essentials assessment was seeded with three questions and nine choices. The assessment page supports English and Bangla prompts, records answers through `submit_assessment_attempt`, and displays the server-returned score and pass state.

The learner interface now consumes server-derived progress summaries in My Learning. Course cards show progress percentage and completed lesson counts, and the primary action resumes at the server-derived next lesson. Course detail exposes published assessments after enrollment. Authentication and onboarding use the shared translation catalog for the active learner-facing flow, with Bengali labels, messages, headings, and actions.

## Files and migrations

| Area | Implementation |
|---|---|
| Database schema and RPCs | `supabase/migrations/20260921150000_trustworthy_learning_and_assessments.sql` |
| Seed assessment | `supabase/migrations/20260921150100_seed_digital_essentials_assessment.sql` |
| Learning data layer | `src/lib/learning.ts` |
| Progress and resume UI | `src/pages/MyLearning.tsx`, `src/pages/LessonViewer.tsx` |
| Assessment UI | `src/pages/Assessment.tsx`, `src/pages/CourseDetail.tsx`, `src/App.tsx` |
| Localization | `src/lib/i18n.ts`, `src/pages/AuthPage.tsx`, `src/pages/Onboarding.tsx` |
| Local type contract | `src/integrations/supabase/types.ts` |

Both migrations are applied to Supabase project `ukxqwcyabecummfvomcw`. The database now contains the assessment, question, choice, attempt, answer, and certificate tables. The seed data contains one published assessment, three questions, and nine choices.

## Verification

The production build passes. The unit suite passes its existing test. The Playwright smoke suite passes five tests, including public routing, sign-in validation, protected learner routing, course-detail entry, and protected assessment routing.

ESLint remains non-green because the repository still contains pre-existing errors and warnings in legacy components, course editor code, audio context, configuration, and several pages. The implementation reduces new unsafe casts in the modified learner files, but a separate lint-cleanup sprint is still required before treating lint as a release gate.

Authenticated browser verification is still pending a dedicated isolated Supabase test account or test project. The production database and application code are ready for that fixture, but no production user was created as part of this change.

## Next engineering step

Create an isolated authenticated E2E fixture and verify the complete signed-in journey: account session, onboarding completion, enrollment idempotency, lesson completion, automatic course completion, certificate visibility, assessment submission, and cross-session resume. Then add assessment review persistence and connect certificate display to the durable `certificates` table.

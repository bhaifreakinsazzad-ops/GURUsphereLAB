# Plan: Classroom Room, Auto-Certificates, Topic Leaderboard, Clubs Landing

All four features are client-side and follow the existing GURU'sphere lab + editorial visual language. No new tables required; uses `localStorage` for persistence (matches existing pattern in `learnerHistory.ts`, `missions.ts`, `courseProgress.ts`).

---

## 1. Live Classroom Room (`/classroom/:subjectId`)

A simulated live room reachable from the existing `ClassroomSection` "subject planet" cards. Mobile-first, no real WebRTC needed for MVP.

**New page** `src/pages/ClassroomRoom.tsx` with three panels (stacked on mobile, 3-col on desktop):
- **Teacher video panel** — large 16:9 placeholder (gradient + subject icon, "Live" pulse dot, mute/camera toggle stubs, viewer count). Embeds an HTML5 `<video>` with a sample subject loop or a static cover so the layout works without a stream.
- **Live chat panel** — messages stored in `localStorage` keyed by subject; you type a message, it appears with your display name + a few seeded "classmate" replies on a timer. Profanity filter via simple wordlist. Bilingual placeholder.
- **Scheduled exam mode** — a banner + countdown to the next "exam window" (e.g. 10 min from join). When the window opens, a "Enter Exam" button deep-links to `/exam-arena?cat=<subject>&live=1`. On exit the room logs an attendance entry to `learnerHistory`.

**Edits**:
- `src/components/ClassroomSection.tsx` — wrap each subject card in `<Link to={"/classroom/" + id}>` and add an "Enter Room" CTA; keep the orbiting visual.
- `src/App.tsx` — add lazy `/classroom/:subjectId` route.
- `src/components/Navbar.tsx` — add "Live Room" link under Classroom.

---

## 2. Auto-Certificate Generation After Exams

Today the certificate UI only shows after the user clicks Download manually inside `CertificatePreview`. We will trigger it automatically once an exam ends with a passing score.

**Edits**:
- `src/pages/ExamArena.tsx` — when results screen mounts and `score / total >= 0.6` (and not practice), auto-render a hidden canvas via `renderCertificate` from `src/lib/certificate.ts`, auto-download a PNG, call `recordCertificate(...)`, and show a "🏅 Certificate earned" toast with a Share button. Sub-60% still shows the manual `CertificatePreview` for retry/practice.
- `src/lib/certificate.ts` — add a `generateCertificateBlob()` helper returning a `Blob` for sharing.
- New `src/lib/share.ts` — small wrapper around `navigator.share` (with file) and a clipboard fallback for desktop ("Copy share link" using the Dashboard certificates view).
- `src/components/CertificatePreview.tsx` — add a "Share" button next to Download using the new helper.

PDF: keep PNG as the default (canvas-native, no new deps). Add an optional "Save as PDF" button that wraps the canvas image in a single-page jsPDF. We'll add `jspdf` only if the user wants the PDF option (otherwise PNG is sufficient).

---

## 3. Topic-Based Ranking Leaderboard (Safe / Non-Shaming)

A new section in the Exam Arena and a small widget on the Dashboard.

**New** `src/components/TopicLeaderboard.tsx`:
- Tabs per category (Math, Science, English, etc., from `CATEGORIES`).
- Builds a per-topic leaderboard from `getAttempts()` (your own attempts) plus the existing seeded `LEADERBOARD` mapped to a topic mix.
- **Safe-by-design rules** (this addresses "without shaming"):
  - Show only **top 5** + your **percentile band** ("Top 25%" / "Top 50%" / "Climbing"), never an absolute rank below top 10.
  - Display learner names as initials + first name only ("Rafiq H.") and never show 0-score or failed attempts.
  - Highlight **personal bests / improvements** ("+12% vs last week") rather than comparisons to others.
  - Toggle "Hide me" (stored in localStorage) to opt out of being shown.
  - Encouraging copy in Bangla + English ("সবাই এগিয়ে যাচ্ছে — তুমিও পারবে").

**Edits**:
- `src/pages/ExamArena.tsx` — add a "Topic Leaderboards" tab/section near the existing global leaderboard.
- `src/pages/Dashboard.tsx` — add a compact "Your topic standings" card (3 best topics with percentile band + delta).

---

## 4. Clubs Landing Page (`/clubs`) with Waitlist + Matching Quiz

Replaces the "Coming Soon" `ClubsSection` CTA with a real landing page.

**New** `src/pages/Clubs.tsx` with three sections:
1. **Hero** — bilingual headline, "Find your club" CTA scrolling to the quiz.
2. **6 club cards** (reuses the data in `ClubsSection`) with description, mentor placeholder, and "Join Waitlist" buttons.
3. **Matching quiz** (`src/components/clubs/ClubMatchQuiz.tsx`) — 5 multiple-choice questions (energy level, solo/group preference, creative vs analytical, weekly time, primary goal). Each option carries weights for the 6 clubs; the highest-scoring club is recommended on a result card with "Join the [X] waitlist" CTA.
4. **Waitlist signup** (`src/components/clubs/ClubWaitlistForm.tsx`) — email + display name + chosen club. Saved to a new Supabase table.

**New table** `club_waitlist` (migration):
```
id uuid pk default gen_random_uuid()
created_at timestamptz default now()
email text not null
display_name text
club_slug text not null
quiz_match text -- nullable, the recommended club
notes text
```
RLS:
- `INSERT` allowed for `public` with check: valid email regex, length limits, `club_slug` in known set.
- `SELECT` only for `admin` role (use existing `has_role(auth.uid(), 'admin')`).
- No `UPDATE` / `DELETE` for users.

**Edits**:
- `src/App.tsx` — add lazy `/clubs` route.
- `src/components/ClubsSection.tsx` — keep on homepage but change "Coming Soon" CTA to `<Link to="/clubs">Join the waitlist →</Link>`.
- `src/components/Navbar.tsx` — add "Clubs" link.

---

## Technical Details

- Animation: continue using `framer-motion` (already installed).
- Styling: reuse `src/components/lab/GlassCard.tsx`, `GlowButton.tsx`, `LabSectionHeader.tsx`; respect existing `--lab-cyan`/`--lab-violet` tokens for new lab sections and the editorial gold/green for homepage-adjacent surfaces (per memory).
- Persistence: `localStorage` for chat/attendance/leaderboard opt-out (`gs_classroom_chat_v1`, `gs_lb_optout_v1`); Supabase for `club_waitlist` only.
- No new heavy deps. Optional `jspdf` only if you want PDF certificates in addition to PNG — confirm before adding.
- Type safety: types added next to each module; `tsc --noEmit` should pass.
- Mobile-first: all panels stack under `md:`; chat panel uses sticky bottom input on mobile.

## Open question (will ask after approval)

- Certificates: PNG only (current), or also generate a PDF (adds `jspdf` ~50KB)?


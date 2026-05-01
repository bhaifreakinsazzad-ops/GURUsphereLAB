## Goal

Three connected upgrades to Hadi Wishes / GURU'sphere:

1. **Hadi Meter Pro** — replace the existing 5-minute SJT with the new positive, values-based 7-promise Promise Calculator (uploaded `HadiMeterPro.jsx`).
2. **Weekly Learning Missions** — bonus-XP goals on the Dashboard.
3. **Course Progress Tracking** — completion %, next lesson, and time-spent for enrolled courses.

All work is client-side (localStorage); no DB migration needed. The `/hadi-meter` route already exists and is wired through nav/CTAs, so this is mostly a content-and-mechanics swap rather than a new route.

---

## 1. Hadi Meter Pro (replaces current `/hadi-meter`)

**Why replace:** The current Hadi Meter is an SJT with combative wording ("গুলি কর, তবু মাথা নোয়াবো না", time-penalty timer). The new requirement is positive, inclusive, lawful, non-violent, growth-focused — incompatible with the old questions. Cleanest path is to swap the page contents.

**Files**
- Rewrite `src/pages/HadiMeter.tsx` from the uploaded `HadiMeterPro.jsx`, adapted to TypeScript + project conventions:
  - Replace raw `<main className="bg-slate-950 ...">` with `NebulaShell` so the page inherits the Hadi Wishes deep-green / glass aesthetic, navbar, and floating donate CTA.
  - Keep the 3-screen flow: intro → quiz (one question at a time) → result.
  - Keep all 7 dimensions, weights, options, level tiers, share/copy/retry exactly as in the upload.
  - Result screen keeps: score/100 ring, level title, strongest, focus-next, dimension breakdown bars, 7-day action plan, Share / Copy / Retry.
  - Use `lucide-react` icons already imported in the upload.
  - Add page `<title>` via a small `useEffect` setting `document.title = "Hadi Meter | GURU'sphere"`.
  - Remove the SJT timer, html2canvas download, Facebook share, and combative copy entirely.
- Add a small safety footer: *"This is a self-reflection tool, not an official certification."*
- Hook into learner history: when a learner reaches the result screen, call `recordAttempt(...)` (subject `"Hadi Meter"`, `practice: true`, `xp = Math.round(score / 4)`) so it shows on Dashboard activity but does not inflate ranked XP.

**Navigation**
- `src/components/Navbar.tsx` — add `{ label: "Hadi Meter", href: "/hadi-meter", route: true }` to `navItems` (desktop + mobile menus already iterate this list).
- Homepage CTA: add a compact card row inside `src/components/UniqueFeatures.tsx` (or a new banner above it) titled **"Try Hadi Meter — Calculate your 7 promises."** linking to `/hadi-meter`. Bilingual: Bengali subtitle "তোমার ৭টি অঙ্গীকার মাপো — ২ মিনিটে।"

**Tech notes**
- Convert JSX to TSX: type `Stat`, `MiniInsight` props, the `screen` union (`"intro" | "quiz" | "result"`), `answers` as `Record<string, number>`, etc.
- Tailwind classes used (`from-emerald-500`, `bg-slate-950`, `from-emerald-600 to-sky-600`) already work via the existing Tailwind config; no theme changes required.
- Keep questions/promise text in Bangla per the upload — fits the project's Bengali-first rule for cultural/decorative copy.

---

## 2. Weekly Learning Missions

A rotating set of 4 bonus-XP missions per ISO week, completable from the Dashboard.

**New file** `src/lib/missions.ts`
- `WEEKLY_MISSION_TEMPLATES` — 8–10 mission definitions, e.g.:
  - *Take 3 ranked exams* (+50 XP)
  - *Earn a certificate* (+40 XP)
  - *Maintain a 3-day streak* (+30 XP)
  - *Try Hadi Meter once* (+20 XP)
  - *Save a new course* (+20 XP)
  - *Submit a research topic* (+50 XP)
  - *Post a memorial note* (+15 XP)
  - *Score ≥ 80% on any exam* (+40 XP)
- `getCurrentWeekKey()` → `"2026-W18"` (ISO week)
- `getWeeklyMissions(weekKey)` — deterministically picks 4 templates per week (seeded by week key) so the set is stable for the whole week.
- `evaluateMissions(week, attempts, certs, savedWishesCount, contributionCounts)` — returns each mission with `{ progress, target, completed }`. Pure function; reads from `learnerHistory` + counts already loaded in Dashboard.
- `claimMission(weekKey, missionId)` and `getClaimed(weekKey)` — persist claimed bonus XP in `localStorage` under `gs_missions_v1`.
- `getMissionBonusXp()` — sum of all claimed bonuses across all weeks; added to `totalXp` in Dashboard.

**Dashboard changes** (`src/pages/Dashboard.tsx`)
- New section **"This week's missions"** (under the top stats row, before "My Enrolled Courses"):
  - 4 mission cards in a 2-col grid, each showing icon, title, progress bar (`progress / target`), XP reward chip, and a **Claim +XP** button enabled only when completed and not yet claimed.
  - Header shows the week label + days remaining until reset.
- Toast on claim ("+40 XP claimed!"), updates `totalXp` immediately.
- Include `missionBonusXp` in the `totalXp` calculation that drives Level/Progress.

---

## 3. Course Progress Tracking

Track per-enrolled-course completion %, next lesson, and time spent. All client-side, keyed off `saved_wishes.wish_key`.

**New file** `src/lib/courseProgress.ts`
- Storage key `gs_course_progress_v1` shaped as:
  ```ts
  Record<wishKey, {
    lessonsTotal: number;     // default 10 if unknown
    lessonsDone: number;
    nextLesson: string;       // free-text label, default "Lesson 1"
    minutesSpent: number;
    lastOpened: string;       // ISO
  }>
  ```
- Helpers: `getProgress(key)`, `setProgress(key, patch)`, `tickMinutes(key, n)`, `markLessonDone(key, label?)`, `summary()` (returns avg %, total minutes, courses-completed count for the dashboard header).

**Dashboard changes** (`src/pages/Dashboard.tsx`, "My Enrolled Courses" section)
- Each enrolled-course card now shows:
  - Title (existing)
  - **Progress bar** (`lessonsDone / lessonsTotal`) with `%` label
  - **"Next: {nextLesson}"** line
  - **Time spent**: `⏱ 1h 24m` formatted from `minutesSpent`
  - Two small actions:
    - **+1 lesson** — calls `markLessonDone()`, increments lessonsDone, advances next lesson label to `Lesson N+1`.
    - **+15 min** — calls `tickMinutes(15)` to log study time.
  - "Open" link (existing `wish_url`) — also calls `tickMinutes(5)` and updates `lastOpened` so just opening tracks engagement.
- Add a roll-up stat card to the top stats row: **"Course Progress"** showing avg completion % across all enrolled courses + total study minutes.
- Add a small in-card pill **"Completed ✓"** when `lessonsDone >= lessonsTotal`, and award a one-time +25 XP via the missions/bonus store.

---

## Acceptance checklist

- `/hadi-meter` shows the new positive Promise Calculator (7 dimensions, intro → quiz → result, share / copy / retry, bilingual). No combative wording, no countdown timer, no html2canvas dependency on this page.
- Document title = `Hadi Meter | GURU'sphere`. Safety disclaimer visible.
- Navbar has a "Hadi Meter" link (desktop + mobile). Homepage shows a CTA "Try Hadi Meter — Calculate your 7 promises."
- Dashboard shows a "This week's missions" section with 4 missions, live progress, and working Claim buttons that grant bonus XP.
- "My Enrolled Courses" cards each show progress bar, next lesson, time spent, and `+1 lesson` / `+15 min` controls.
- Top stats row includes a Course Progress card alongside Level / Streak / Ranked XP / Heatmap.
- All new logic is client-side (localStorage); no schema changes.
- TypeScript build passes.

---

## Out of scope

- Server-side persistence / cross-device sync of missions and course progress (still localStorage like existing learner history).
- New Supabase tables.
- Real lesson content / video player — we're tracking progress against externally-linked courses (the `wish_url`), which matches the current "enroll = save wish" model.

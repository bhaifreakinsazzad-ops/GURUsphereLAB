## Goal

Layer a futuristic "GURU'sphere Lab" experience on top of the existing editorial Hadi Wishes site — without breaking any route, auth flow, Supabase logic, or the warm gold/green identity that already ships. All work is **additive**.

## Important calibration

The reference files request a pure cold neon palette (#0a0a0a + cyan + crimson). The live site uses a warm editorial palette (deep navy + candle gold + Bangladesh red + emerald). Replacing it would destroy brand equity and conflict with stored design memory. Instead I will introduce a **scoped "lab" theme** (cyan + violet accents on the existing dark background) that lives only inside new lab sections — homepage editorial flow stays intact.

## What gets built

### 1. New shared UI primitives (`src/components/lab/`)
- `GlassCard.tsx` — `bg-white/5 backdrop-blur-xl border border-white/10`, optional glow color prop
- `GlowButton.tsx` — cyan/violet/gold variants with hover shadow halo
- `LabSectionHeader.tsx` — bilingual eyebrow + title

### 2. Learning Path section (`src/components/lab/LearningPathSection.tsx`)
Mounted on homepage between `KnowledgeTreeSection` and Letter 04.
- 7 nodes: Political Science, Literature, Cinema, Art, Theater, History, Digital Responsibility (Bangla + English labels)
- **Default rendering: lightweight SVG constellation** (animated glowing nodes + connecting lines via Framer Motion). Fast, mobile-safe, zero new deps.
- Click/tap node → glass overlay (Radix Dialog already in project) with topic description + "Start this path" CTA linking to existing routes (`/research-archive`, `/team-projects`, `/exam-arena`) or hash anchors.
- Honors `prefers-reduced-motion`.
- **No `@react-three/fiber` install** in this pass — keeps bundle small and avoids React 19 risk noted in repo guidance. We can add real 3D later behind a lazy import if you want; flagged as follow-up.

### 3. Hadi Meter upgrade (`src/pages/HadiMeter.tsx`)
Keep the existing 7-dimension Promise Calculator logic intact (Learning, Integrity, Moral Courage, Service, Unity, Discipline, Digital Responsibility — already matches the brief exactly). Upgrade the **results screen only**:
- Add lazy-loaded `recharts` Radar chart (recharts already installed) showing the 7 dimensions
- Keep existing bars as fallback below the radar
- Keep score/level/strongest/focus/7-day plan/share/copy/retry
- Keep the educational disclaimer
- No change to scoring, storage, or `learnerHistory.recordAttempt` integration

### 4. CommunityGrid section (`src/components/lab/CommunityGrid.tsx`)
Mounted on homepage just before `ClubsSection`.
- Masonry-ish responsive grid (CSS columns) of glass cards linking to **existing routes only**: Live Classroom (`#classroom`), Library (`#library`), Hadi Meter (`/hadi-meter`), Learning Path (`#learning-path`), Research Archive (`/research-archive`), Team Projects (`/team-projects`), Mentorship (`/mentorship`), Memorial Wall (`#memorial`)
- Hover lift, glow border tinted by category

### 5. Homepage integration (`src/pages/Index.tsx`)
Add two imports and mount `<LearningPathSection id="learning-path" />` and `<CommunityGrid />` in the existing flow. No removals.

### 6. Navigation (`src/components/Navbar.tsx`)
Add one item: `Learning Path → /#learning-path`. Keep all five existing items (Research, Projects, Mentors, Hadi Meter, Memorial) and the Dashboard/Sign-in/Donate behavior untouched.

### 7. Hero CTAs (`src/components/HeroSection.tsx`)
Append two ghost links next to existing "Light a candle" / "Keep his light burning":
- "Try Hadi Meter" → `/hadi-meter`
- "Explore the Archive" → `#learning-path`

Existing CTAs and styling preserved.

### 8. SEO (`index.html`)
Append/refresh `<title>`, `<meta name="description">`, and OG tags to include "The School That Never Closes" wording. Existing metadata kept.

## What is explicitly NOT touched

- `src/integrations/supabase/*`, `.env`, `supabase/config.toml`
- `AuthContext`, `Auth.tsx`, `Dashboard.tsx`, `Admin.tsx`, `ExamArena.tsx`, exam/cert/learner-history logic
- All existing letter pages, memorial wall, donation section, footer
- Color tokens in `index.css` (lab cyan/violet added as new tokens, no overrides)
- Any existing route

## Technical details

```text
src/components/lab/
  GlassCard.tsx
  GlowButton.tsx
  LabSectionHeader.tsx
  LearningPathSection.tsx     (SVG constellation + Radix Dialog overlay)
  CommunityGrid.tsx

Modified (additive only):
  src/index.css               (+ --lab-cyan, --lab-violet tokens, .glass-lab utility)
  src/components/Navbar.tsx   (+ Learning Path link)
  src/components/HeroSection.tsx (+ 2 secondary CTAs)
  src/pages/Index.tsx         (+ 2 sections)
  src/pages/HadiMeter.tsx     (+ lazy radar on results)
  index.html                  (+ refreshed meta/OG)
```

No new npm packages. Recharts, framer-motion, lucide-react, Radix Dialog, Tailwind already present.

## Acceptance

- All existing routes load identically
- Homepage gains Learning Path + Community Grid sections
- `/hadi-meter` results show a radar chart (with dimension-bar fallback if recharts fails to lazy-load)
- Mobile (≤390px): constellation collapses to a tap-friendly card carousel using the same data
- Lighthouse mobile score not regressed (no new heavy deps)
- TypeScript passes

## Follow-ups (not in this pass, ask if you want them)

- Real `@react-three/fiber` constellation behind a desktop-only lazy import
- Particle ambient layer on hero
- Bilingual i18n toggle

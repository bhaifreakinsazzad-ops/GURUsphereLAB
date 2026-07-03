# GURUsphere — Orbit Design System v1

> Status: Foundations frozen for MVP Stage 2. Every subsequent page must consume tokens defined here. No hex, rgb, or arbitrary Tailwind color values in components.

---

## 1. Brand identity — "Orbit"

**Concept.** Knowledge orbits the learner. The learner sits at the center of a small system of subjects, mentors, tools, and communities. Growth is a continuous, gentle motion — not fireworks.

**Personality.**
- Premium, human, intelligent, globally credible
- Calm confidence over neon futurism
- Bangla-first warmth, English-clean precision
- Never sterile SaaS, never gimmicky edtech

**Visual signature.**
- A single **soft-orbit** glyph (a small filled disc with one thin elliptical ring) used sparingly: navbar mark, favicon, empty states, section anchors.
- **No** circular chrome plastered across every screen. Restraint is the brand.

**Logo direction.**
- Wordmark: `GURUsphere` in **Fraunces** Medium, tight tracking (-0.02em), "sphere" set in the italic optical. Sits next to the orbit glyph, never inside it.
- Bangla lockup: `গুরুস্ফিয়ার` in Noto Serif Bengali 600, same baseline.
- Minimum size: 20px glyph, 14px wordmark.
- Clearspace: `1x` glyph height on every side.

---

## 2. Color system

All colors are HSL tokens declared in `:root` (light) and `.dark` scope inside `src/index.css`. Components consume `hsl(var(--token))` — never raw hex.

### 2.1 Neutral surfaces

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background`         | 40 30% 98%  | 224 30% 6%  | Page canvas |
| `--surface`            | 40 25% 96%  | 224 28% 9%  | Cards, sheets |
| `--surface-raised`     | 0 0% 100%   | 224 28% 12% | Elevated panels, modals |
| `--surface-sunken`     | 40 20% 94%  | 224 28% 4%  | Wells, code blocks |
| `--border`             | 40 15% 88%  | 224 20% 18% | Hairlines |
| `--border-strong`      | 40 15% 78%  | 224 20% 28% | Inputs, dividers on light |
| `--foreground`         | 224 30% 10% | 40 20% 96%  | Body text |
| `--foreground-muted`   | 224 15% 40% | 40 10% 68%  | Secondary text |
| `--foreground-subtle`  | 224 12% 55% | 40 8% 52%   | Metadata, captions |

### 2.2 Orbit brand

| Token | Value | Role |
|---|---|---|
| `--orbit-primary`      | 224 76% 48% | Primary action, focus ring, links |
| `--orbit-primary-fg`   | 0 0% 100%   | Text on primary |
| `--orbit-primary-soft` | 224 80% 96% | Primary tint bg (light) / 224 60% 18% dark |
| `--orbit-accent`       | 168 72% 42% | Secondary accent — teal, growth |
| `--orbit-gold`         | 42 88% 55%  | Recognition (certificates, milestones) — **sparingly** |
| `--orbit-plum`         | 268 40% 42% | Editorial highlight, story chapters |

Orbit primary is a considered indigo — trustworthy, ownable, distinct from Duolingo green, Coursera blue, Khan teal.

### 2.3 Semantic status

| Token | Value | Role |
|---|---|---|
| `--success` | 152 62% 40% | Completed, verified |
| `--warning` | 32 92% 52%  | Reminder, deadline |
| `--danger`  | 358 68% 52% | Errors, destructive |
| `--info`    | 200 82% 46% | Tips, neutral notice |

Each has `-fg` and `-soft` variants.

### 2.4 Contrast rules

- Body text vs background ≥ **7:1** (AAA).
- Interactive text vs background ≥ **4.5:1** (AA).
- Primary button `orbit-primary` on `orbit-primary-fg` — verified 8.1:1 in light, 9.2:1 in dark.
- Never use `foreground-subtle` for interactive controls.

---

## 3. Typography

Two families. No third face without design approval.

| Family | Role | Weights loaded |
|---|---|---|
| **Fraunces** (variable serif) | Display, headings, wordmark | 400, 500, 600 + italic |
| **Inter** (variable sans)     | UI, body, labels, numerals   | 400, 500, 600, 700 |
| **Noto Serif Bengali**        | Bangla display               | 500, 600 |
| **Noto Sans Bengali**         | Bangla UI/body               | 400, 500, 600 |

Fraunces replaces Cormorant — same editorial soul, variable file, better small-size legibility, better Bangla pairing.

### 3.1 Type scale (rem, mobile → desktop via clamp)

| Token | Size | Line | Weight | Use |
|---|---|---|---|---|
| `--fs-display`  | clamp(2.5, 5vw, 4.5)rem | 1.02 | 500 italic-optical | Homepage hero only |
| `--fs-h1`       | clamp(2, 3.2vw, 3)rem   | 1.08 | 500 | Page titles |
| `--fs-h2`       | clamp(1.5, 2.2vw, 2)rem | 1.15 | 500 | Section titles |
| `--fs-h3`       | 1.375rem                | 1.25 | 600 | Card titles |
| `--fs-h4`       | 1.125rem                | 1.3  | 600 | Sub-cards |
| `--fs-body-lg`  | 1.125rem                | 1.55 | 400 | Lede, marketing body |
| `--fs-body`     | 1rem                    | 1.55 | 400 | Default body |
| `--fs-body-sm`  | 0.9375rem               | 1.5  | 400 | Dense UI |
| `--fs-caption`  | 0.8125rem               | 1.4  | 500 | Metadata |
| `--fs-eyebrow`  | 0.75rem                 | 1.2  | 600 tracking .18em | Kickers |

### 3.2 Rules
- Only one `display` per page (homepage hero).
- No serif on body text, ever. Serif = headings only.
- Bangla headings use Noto Serif Bengali — never force Fraunces on Bangla text.
- Numerals are tabular in tables (`font-variant-numeric: tabular-nums`).

---

## 4. Spacing, radius, elevation

### Spacing scale (4px base)
`--space-1` 4, `--space-2` 8, `--space-3` 12, `--space-4` 16, `--space-5` 20, `--space-6` 24, `--space-8` 32, `--space-10` 40, `--space-12` 48, `--space-16` 64, `--space-20` 80, `--space-24` 96.

### Radius
`--radius-sm` 6px, `--radius-md` 10px (default), `--radius-lg` 16px (cards), `--radius-xl` 24px (hero blocks), `--radius-pill` 999px.

### Elevation (dark-mode-aware)
- `--shadow-1`: subtle border + `0 1px 2px hsl(224 40% 4% / .08)` — inputs
- `--shadow-2`: `0 4px 16px -6px hsl(224 40% 4% / .12)` — cards
- `--shadow-3`: `0 12px 40px -12px hsl(224 40% 4% / .18)` — dropdowns, modals
- `--shadow-focus`: `0 0 0 3px hsl(var(--orbit-primary) / .3)`

No glow on functional UI. Glow reserved for the memorial `/legacy` route.

---

## 5. Motion

- Default easing: `cubic-bezier(.2, .8, .2, 1)`.
- Duration tokens: `--motion-fast` 120ms, `--motion` 200ms, `--motion-slow` 360ms.
- Enter animations translate ≤ 8px, fade 0→1. Never bounce or overshoot.
- **Respect `prefers-reduced-motion`** — reduce to instant fade or none.

---

## 6. Component principles

1. **Every interactive element has a visible focus ring** (`--shadow-focus`).
2. **Tap targets ≥ 44×44px** on mobile — icon buttons use `min-h-11 min-w-11`.
3. **Labels are always visible** — placeholder is never the only label.
4. **State clarity** — empty, loading, error, success states are designed, not left to defaults.
5. **Bilingual awareness** — every learner-facing string is a translation key, never inlined literal. Component layouts must survive Bangla growing text by ~25%.
6. **Composition over variants** — build with shadcn primitives + tokens, avoid one-off styled components.
7. **Server truth > client cache** — components accept typed props, do not fetch inside render for MVP surfaces that own progress data.

---

## 7. Homepage wireframe (Goal-First)

Full spec in `docs/HOMEPAGE-WIREFRAME.md`. Summary here:

```text
┌──────────────────────────────────────────────────────────┐
│ [◉ GURUsphere]   Learn  Teach  Mentors  Community  EN/BN │
├──────────────────────────────────────────────────────────┤
│                                                          │
│           Learn anything. Teach anything.                │
│                    Grow together.                        │
│                                                          │
│   ┌───────────────────────────────────────────────┐     │
│   │  🔍  What do you want to learn or become?     │     │
│   └───────────────────────────────────────────────┘     │
│      [ IELTS ] [ Web Dev ] [ Freelancing ] [ AI ]      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  Popular pathways                                        │
│  [card] [card] [card] [card]                             │
├──────────────────────────────────────────────────────────┤
│  Browse by subject         →                             │
│  ▢ ▢ ▢ ▢ ▢ ▢                                             │
├──────────────────────────────────────────────────────────┤
│  Teach on GURUsphere  |  Meet a mentor                   │
├──────────────────────────────────────────────────────────┤
│  How it works · Trust · Legacy · Footer                  │
└──────────────────────────────────────────────────────────┘
```

Primary actions: **Start Learning** (goal prompt) and **Teach on GURUsphere**. No donation CTA in hero or nav.

---

## 8. Mobile navigation

- Sticky top bar, 56px, `surface` background at 92% opacity + backdrop blur.
- Left: orbit glyph + `GURUsphere` wordmark.
- Right: search icon + hamburger.
- Sheet menu (right-side drawer, 84vw max 360px):
  - `Learn` → subjects, pathways, saved
  - `Teach`
  - `Mentors`
  - `Community`
  - `— divider —`
  - `Dashboard` (if signed in) / `Sign in`
  - Language switcher `EN / বাংলা`
- Bottom safe-area padding respected via `env(safe-area-inset-bottom)`.

---

## 9. What is deliberately out of scope

Restated from Stage 2 decision doc so no ambiguity slips into build:

- ❌ Donation CTA in hero, nav, or as a floating global button.
- ❌ Live video conferencing built in-house.
- ❌ Payment forms, checkout, payouts.
- ❌ AI companion "coming soon" theatre — only ship what actually works.
- ❌ General social feed.
- ❌ Decorative certificates for opening a lesson.
- ❌ Third font family, purple gradients, glass everywhere.

---

## 10. Migration notes

- Existing "Candlelit" tokens (`--candle`, `--pathshala-*`, `--hadi-red`, `--parchment-*`) are preserved and **only used on `/legacy`** for the memorial experience. Do not import them into new Orbit components.
- Existing `--lab-*` holographic tokens are deprecated for MVP; not removed to avoid breakage of interim pages, but no new usage.
- New pages: import from `@/components/orbit/*` only.

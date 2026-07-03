# Goal-First Homepage — Wireframe & UX Spec

Route: `/`  ·  Layout width: 1200px content max, 24px gutter mobile, 48px desktop.

## Section order

1. **Top nav** (56–64px) — orbit glyph, primary links, language switcher, `Sign in`.
2. **Hero — Goal Prompt** (min 72vh mobile, 84vh desktop, capped 780px)
   - Eyebrow: `AI-powered global learning ecosystem`
   - Display headline: *"Learn anything. Teach anything. Grow together."*
   - Sub-lede: single sentence in English + smaller Bangla mirror line.
   - **Goal input**: large pill input with search icon, placeholder `What do you want to learn, achieve, or become?`
   - Chip row of 4–6 sample goals (deep-linked, keyboard focusable).
   - Below-fold hint: subtle `↓ Explore how it works`.
3. **Popular pathways** — 4 curated learning paths as cards (title, 1-line outcome, estimated weeks, level, `Start` link). Horizontal scroll on mobile.
4. **Browse by subject** — responsive grid, 12 subjects with icon, name, course count. Skeleton for empty state.
5. **How GURUsphere works** — 3-step strip: *Set a goal · Learn with structure · Track your growth.*
6. **Teach on GURUsphere** — split block: value prop + `Become an educator` secondary CTA. No revenue promises (payments post-MVP).
7. **Mentors preview** — 4 mentor cards (name, expertise chip, availability dot). Card is non-transactional; CTA is `See profile`. No booking.
8. **Trust & impact** — three stat cards (learners, courses, mentors), one testimonial, accessibility statement link.
9. **Legacy strip** — small, respectful. One line: *"GURUsphere carries forward the wish of Shaheed Osman Hadi — free knowledge for everyone."* Link → `/legacy`.
10. **Footer** — link columns: Learn / Teach / Company / Language / Legal + language switcher + orbit mark.

## Interaction: Goal Prompt

- Input is a controlled component, `aria-label="What do you want to learn"`.
- Enter or click of arrow button routes to `/discover?q=<encoded>`.
- Chips route to `/discover?q=<chip>` with the same handler.
- No client-side LLM call in MVP — chips + free text route to the discovery page; discovery page owns matching logic.

## Empty & loading

- Pathways/subjects: show 4 shimmering skeletons if data source not ready.
- Never show `undefined`, `null`, or `0 courses` — hide the block if empty.

## Mobile nav

- 56px sticky bar, hamburger opens right sheet (see DESIGN-SYSTEM §8).
- Goal input remains full-width, keeps 44px min height with 16px font (prevents iOS zoom).

## Accessibility

- One `<main>`, one `<h1>` (the display headline).
- Every section is `<section aria-labelledby="…">` with a heading.
- Chip row uses `role="list"` + `role="listitem"`, chips are `<button>` not `<a>`.
- Motion: hero fade-in respects `prefers-reduced-motion`.
- Focus ring token: `--shadow-focus` on every interactive.

## What this page does NOT contain

- No hero video, no autoplaying audio, no parallax, no floating chatbot bubble.
- No donation CTA, no "Limited time" banner, no popups.
- No memorial imagery — memorial content lives on `/legacy`.

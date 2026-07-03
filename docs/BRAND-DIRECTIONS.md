# GURUsphere — Brand & Homepage Directions

**Date:** 2026-07-03  
**Status:** Concepts for selection. No visual assets produced yet — those follow direction approval.

The three identities and three homepage concepts below are intentionally distinct in *personality*, not just palette. Each identity is paired with a compatible homepage concept, but they can be mixed.

---

## Identity Direction A — "Orbit" (Recommended)

**Personality:** Curious, human, globally credible. Feels like Linear × Notion × a modern university press.

- **Symbol logic:** A small solid disc (the learner) with a single elegant orbit arc passing through it — knowledge in motion around a person. Works as favicon down to 16 px. Recognizable without wordmark.
- **Wordmark:** `GURUsphere` in a modern geometric-humanist sans (e.g. *General Sans* / *Söhne*). "GURU" slightly heavier than "sphere" to embed hierarchy.
- **Color system:**
  - Ink `#0B1220` · Paper `#FBFAF7`
  - Primary "Signal Indigo" `#3B4CFF` (calm, intelligent, not the generic SaaS blue)
  - Accent "Warm Ochre" `#E8A238` (human, hopeful — echoes the existing candle warmth without the memorial weight)
  - Neutral scale: 10 stops from ink to paper
  - Semantic: success `#1F9D6B`, warning `#D48A00`, danger `#D9433B`
- **Typography:** Display + UI: General Sans / Inter Tight. Reading: Source Serif 4 (long-form lessons). Bangla: Noto Sans Bengali (retain).
- **Iconography:** 1.5 px stroke, rounded joins, geometric — matches the disc+orbit symbol.
- **Motion:** Subtle orbit micro-interactions on hero + on progress rings. Respect `prefers-reduced-motion`.
- **Applications:** Certificates use the orbit motif as a foil-stamp; course thumbnails use a consistent 3:2 frame with subject-colored orbit accent; dark and light both first-class.
- **Advantages:** Recognizable, professional, mature, globally readable, avoids AI-generated visual clichés.
- **Risks:** Orbit is a known motif — execution quality decides whether it feels premium or generic. Guardrail: never repeat circles gratuitously.

## Identity Direction B — "Constellation"

**Personality:** Community-first, warm, aspirational. Feels like Duolingo × Behance for adults.

- **Symbol logic:** Three small dots connected by two thin lines forming an asymmetric arc — minds connected across a knowledge network.
- **Wordmark:** Rounded geometric sans (*Sohne Kraftig* / *Basier Circle*).
- **Color system:** Deep Night `#0F1230`, cream `#FFF4E6`, primary "Aurora Teal" `#2FB5A0`, accent "Sunrise" `#FF7A59`. More saturated than A.
- **Typography:** Basier Circle (display), Inter (UI), Noto Sans Bengali.
- **Iconography:** Duotone, filled + line combined.
- **Motion:** Constellation lines draw on hover; nodes gently breathe.
- **Advantages:** Warm, inviting, strong for community + mentorship pillars.
- **Risks:** May feel less serious for professional / institutional audiences.

## Identity Direction C — "Prism"

**Personality:** Bold, editorial, confident. Feels like Stripe × MIT Press.

- **Symbol logic:** A single triangular prism refracting one white beam into three tinted beams — one input, many perspectives.
- **Wordmark:** Modern serif (*GT Sectra* / *Tiempos Headline*) for GURU, geometric sans for sphere — literal typographic refraction.
- **Color system:** Off-black `#111`, warm white `#FAF8F3`, primary "Refract Blue" `#2557FF`, secondary "Refract Rose" `#EB5C8A`, secondary "Refract Amber" `#F0A500`.
- **Typography:** Serif display + geometric sans UI. Strong hierarchy, editorial density.
- **Iconography:** Sharp, thin, editorial.
- **Motion:** Minimal — content-first.
- **Advantages:** Distinctive, memorable, institutional-friendly.
- **Risks:** Serif display can misread as academic / heavy on mobile. Requires careful Bangla pairing.

---

## Recommendation

**Adopt Direction A — "Orbit."**  
Rationale:
1. Strongest fit for the promise "*Learn Anything. Teach Anything. Grow Together.*" — a person surrounded by knowledge in motion.
2. Balances warm (ochre) + credible (indigo) without leaning childish or corporate.
3. Compatible with both Bangla and Latin scripts at all sizes.
4. Simple enough to render as a favicon, foil-stamp on certificates, and a monochrome app icon.
5. Preserves narrative continuity with the current warm-gold candlelit identity (ochre echoes it), letting `/memorial` live comfortably inside the new brand instead of clashing.

Directions B and C remain reserve options if the product owner wants a warmer (B) or more editorial (C) posture.

---

## Homepage Concept 1 — "Goal-First" (paired with Direction A)

**Above the fold:**
- Headline: *"Learn what will change your next year."*
- Sub: *"Courses, paths, mentors, and communities — free where it can be, premium where it should be."*
- A single input: *"What do you want to learn?"* with suggested goals as chips (Web Development · IELTS · Data Analysis · UI Design · English Speaking · Freelancing).
- Dual CTA: **Start Learning** (primary), *Teach on GURUsphere* (text link).
- Right side: a compact interactive preview — a "learning path card" that morphs as the user types, showing *from → to* + estimated weeks.

**Below the fold:**
1. **Discover by goal** — subject tiles.
2. **Recommended paths** — 3 curated tracks.
3. **How you'll learn** — Lessons + Practice + Community + Mentors + AI Companion (labeled *Coming*).
4. **Meet educators** — real instructor cards (populated post-onboarding, not fake).
5. **For educators** — inline "Teach on GURUsphere" strip.
6. **For organizations** — one strip.
7. **Trust** — only if real: verified educators count, subject coverage, learner outcomes. Otherwise omit.
8. **Origin story** — small link into `/memorial`.

## Homepage Concept 2 — "Journey"

Scroll-driven narrative. Sections animate like chapters:
- Chapter 1: *"Where you are today."* (learner picks a level)
- Chapter 2: *"Where you want to go."* (goal picker)
- Chapter 3: *"How GURUsphere gets you there."* (paths, practice, mentors)
- Chapter 4: *"And when you're ready — teach it forward."*

Stronger emotional pull, higher build cost, harder for low-bandwidth devices — reduce motion for mobile.

## Homepage Concept 3 — "Marketplace"

Dense grid, discovery-first — like a modern app store for knowledge:
- Sticky search + facet rail.
- Trending / New / Free / By subject.
- Instructor spotlights.

Faster path to browsing at the cost of story. Best if the platform's supply is already large — not our MVP position.

**Recommended homepage: Concept 1 (Goal-First).** It delivers the promise in one screen, works on 4G Android, and does not depend on invented supply metrics.

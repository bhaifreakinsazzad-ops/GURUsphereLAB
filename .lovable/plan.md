

## Hadi Wishes — Full Rebrand Plan

A complete, emotional rebrand of the platform in honor of Shaheed Osman Hadi, transforming it into a free knowledge sanctuary for Bangladeshi students who can't afford expensive education.

### The Vision (Distilled)

**"Hadi Wishes"** — a living memorial that does what he wished he could do: give every curious Bangladeshi student free access to the things that are normally locked behind paywalls. Research papers, premium courses, expensive software tutorials, certifications, books — all free, all curated.

Tagline: **"যা সে চেয়েছিল — তোমার জন্য খোলা।"** *(What he wished for — opened for you.)*

---

### What Changes (Rebrand Scope)

**Identity layer (every page):**
- Replace "GURU'sphere Lab" → **"Hadi Wishes"** in Navbar, Footer, App.tsx loader, index.html title/OG/JSON-LD, 404 page
- Add a subtle memorial line in the footer: *"In loving memory of Shaheed Osman Hadi (১৯৯৮–২০২৪) — তাঁর স্বপ্ন, আমাদের পথ।"*
- Keep the existing color palette, glassmorphism, Bengali-English bilingual feel — design stays, soul deepens

**Hero rewrite:**
- New headline: *"The Wishes He Left Behind."*
- Sub: *"Free research, free courses, free tools — everything Bangladesh's curious students were told they couldn't afford. Open. Forever."*
- Stats updated: "Forever Free • Curated for Bangladesh • Built on His Wish"

---

### New Sections Added (Reusing Existing Patterns)

**1. Research Hub** (new section after ClassroomSection)
Curated free access points — arXiv, MIT OCW papers, Google Scholar shortcuts, Sci-Hub alternatives (legal: CORE, Unpaywall, DOAJ), Bengali academic archives. 6–8 cards, each linking to a real free resource.

**2. Free Courses Library** (replaces/extends existing LibrarySection)
Real curated catalog — MIT OpenCourseWare, Khan Academy Bangla, freeCodeCamp, CS50, Coursera financial aid guide, Stanford Online, fast.ai. Each card = one expensive thing made free. Bengali subtitles per course type.

**3. Premium-Free Tools** (new section)
Things normally costly to BD students: GitHub Student Pack, JetBrains Education, Figma Education, Notion Education, Adobe alternatives (GIMP/Krita/DaVinci), Cloudflare/Vercel free tiers. Each card explains *what's normally paid* and *how to get it free*.

**4. Open Source Projects** (new section)
"Build with the world." — Curated beginner-friendly OSS (First Contributions, Good First Issues, Hacktoberfest), plus a placeholder for community projects we'll host later.

**5. Community / Discussion** (lightweight for now)
Discord/Telegram CTA card + "Coming Soon" forum tease. No backend yet — just a join link placeholder.

**Existing sections kept & gently rethemed:**
- Knowledge Tree → reframed as *"His Tree of Wishes"* (each branch = one wish fulfilled)
- Exam Arena & Hadi Meter → kept as-is (already on-brand)
- Clubs → kept, slight copy refresh
- Footer → memorial line + email signup retained

---

### Files to Modify

| File | Change |
|------|--------|
| `index.html` | Title, meta, OG, JSON-LD → "Hadi Wishes" |
| `src/components/Navbar.tsx` | Brand name + tagline chip |
| `src/components/HeroSection.tsx` | Full copy rewrite |
| `src/components/LibrarySection.tsx` | Replace book data with real free-course catalog |
| `src/components/FooterSection.tsx` | Brand name + memorial line |
| `src/components/KnowledgeTreeSection.tsx` | Light copy reframe |
| `src/components/ClubsSection.tsx` | Light copy refresh |
| `src/pages/Index.tsx` | Add 3 new sections in order |
| `src/pages/NotFound.tsx` | Rebrand |
| `src/App.tsx` | Loader brand name |

### New Files to Create

- `src/components/ResearchHubSection.tsx` — 6 curated research portals
- `src/components/PremiumFreeToolsSection.tsx` — 6–8 normally-paid tools made free
- `src/components/OpenSourceSection.tsx` — beginner-friendly OSS entry points
- `src/components/MemorialBadge.tsx` — small reusable "In his memory" component used in hero + footer

### Page Order (new `Index.tsx`)

```text
Navbar
HeroSection                  (rewritten)
ClassroomSection             (kept)
ResearchHubSection           (NEW)
LibrarySection               (rewritten as Free Courses)
PremiumFreeToolsSection      (NEW)
ExamSection                  (kept)
KnowledgeTreeSection         (light reframe)
OpenSourceSection            (NEW)
UniqueFeatures               (kept)
ClubsSection                 (light refresh)
FooterSection                (rewritten with memorial)
```

---

### Credit-Efficiency Strategy

- **One implementation pass.** All file edits done in a single batched session — no exploratory coding.
- **No new dependencies.** Reuse framer-motion, lucide-react, existing glass-card/gradient utilities. Zero installs.
- **No backend.** All curated links are static `const` arrays — no Supabase, no DB, no auth in this pass.
- **Reuse patterns.** New sections clone the structure of `ClassroomSection` / `ClubsSection` — same `feature-card`, `ScrollReveal`, grid layouts.
- **Skip the video re-analysis.** Working from your distilled brief (research + learn + free expensive things) — no extra tool calls.

---

### Future Suggestions (post-launch)

1. **User accounts (Lovable Cloud)** → save favorite resources, track which wishes you've claimed
2. **Community submissions** → let students suggest new free resources via a form
3. **"Wish of the Week"** → rotating featured free course/tool on hero
4. **Bengali translation toggle** → full BN/EN switch instead of mixed
5. **Memorial wall** → user-submitted notes/dedications to Hadi
6. **Course progress tracker** → mark courses started/completed locally (localStorage first, Cloud later)


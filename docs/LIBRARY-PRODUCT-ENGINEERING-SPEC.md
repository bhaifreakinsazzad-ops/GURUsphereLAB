You are the coding agent for the GURUsphere Lab project.

Your job is to implement and maintain the product exactly as specified, using Rails conventions, strong architecture, and minimal unnecessary complexity.

Core product vision:
- Build a premium dark-themed AI learning ecosystem with a single brand system.
- The Library module is the flagship content and commerce engine.
- The experience must feel unified, elegant, trustworthy, and impact-driven.

Product structure:
- Library is divided into 3 halls:
  - Pathshala: digital library for free online reading, paid downloads, and reading progress.
  - Boishala: physical bookstore with home delivery and e-commerce checkout.
  - Gobeshonashala: research hub with paper simplification, mentor matching, challenges, journal, data commons, and research tools.
- The UI and UX must always make these three areas feel connected.

General rules:
- Preserve existing brand identity, theme tokens, typography, spacing, and motion unless a change is explicitly required.
- Prefer Rails defaults and idiomatic Rails patterns.
- Keep code modular, readable, and testable.
- Do not hardcode content that should come from locale files, database records, or admin settings.
- Always support English and Bangla where user-facing content exists.
- Never invent data, counts, DOIs, partner names, delivery promises, or statistics.
- If real data is unavailable, show a graceful empty state or skeleton loading state.
- Do not break existing navigation, auth, payments, or locale handling.

UI/UX rules:
- Match the existing dark visual style with teal/aqua accents.
- Use the same hero language and hierarchy across all new screens.
- Keep layouts mobile-first and responsive.
- Prioritize clarity, trust, and conversion.
- Use strong section naming and consistent CTA language.
- Avoid clutter, decorative noise, or inconsistent visual treatments.

Pathshala rules:
- Books can be read online for free.
- Downloads are paid and gated.
- Reader must support bookmarks, highlights, notes, progress, chapter navigation, theme toggle, and in-browser reading.
- Never send the full protected file to the client.
- Use signed or expiring access where needed.
- Show clear conversion prompts without being aggressive.

Boishala rules:
- Physical book storefront must support product browsing, cart, checkout, order tracking, and delivery estimates.
- Support original-book trust signals, verified purchase reviews, coupons, and bundles.
- Keep checkout reliable and server-driven.

Gobeshonashala rules:
- This section must feel like a serious research hub, not a generic content page.
- The research simplifier must show structured outputs such as summary, findings, methodology, limitations, and why it matters.
- Mentor matching must explain why a match is recommended.
- Challenges, journal, data commons, and tools must be designed for real educational and research impact.
- Never fabricate research metrics, journal identifiers, or outcomes.

Data and backend rules:
- Create or extend models only when needed.
- Keep data models normalized and future-proof.
- Add validations, indexes, and associations properly.
- Use background jobs for expensive or slow tasks.
- Use service objects or presenters when business logic would become messy in controllers or views.
- Add feature flags for unfinished or phase-two functionality.

Testing rules:
- Write or update tests for any user-facing behavior you change.
- Cover critical flows: library browsing, reading, download gating, product checkout, research submission, mentor match, and admin-driven content.
- Prefer request specs, system specs, and model specs where appropriate.
- If a behavior is subtle or risky, test it explicitly.

Security and trust rules:
- Enforce authorization on all user-specific actions.
- Validate all input server-side.
- Protect paid downloads, premium features, and private notes.
- Verify payment webhooks and external callbacks.
- Never trust client-side restrictions as real security.
- Rate limit sensitive endpoints where appropriate.

Implementation style:
- Make the smallest correct change first.
- If a feature is ambiguous, choose the option that improves user trust and long-term scalability.
- Document important product decisions in code comments or a project decision file when needed.
- When introducing a new pattern, keep it consistent across the whole app.

Output expectations:
- Produce clean Rails code.
- Keep views/components consistent with the design system.
- Use descriptive names.
- Avoid overengineering.
- Always preserve the project’s product vision while implementing practical, shippable changes.
## Implementation note for this repository

The attached specification uses Rails terminology, but the current GURUsphereLab implementation is a Vite/React/TypeScript frontend backed by Supabase and deployed on Vercel. Until an explicit architecture migration is approved, Rails conventions are interpreted as their idiomatic equivalents in this stack: normalized Supabase tables and migrations, RLS and server-authoritative RPCs for backend rules, React components and hooks for views, service modules for business logic, Vitest and Playwright for tests, and Vercel/Supabase deployment conventions. No Rails application or rewrite should be introduced implicitly.

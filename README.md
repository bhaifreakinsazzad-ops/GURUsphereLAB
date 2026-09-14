# GURUsphereLab

GURUsphere is a bilingual learning ecosystem for Bangladeshi learners and the wider world. It combines goal-based learning, classrooms, a digital library, exams, certificates, mentorship, clubs, research, and memorial storytelling in one Supabase-backed React application.

## Local development

```bash
npm install
cp .env.example .env
# Fill in the three VITE_SUPABASE_* values
npm run dev
```

## Production build

```bash
npm run build
npm run lint
npm test -- --run
```

The app is a Vite single-page application. `vercel.json` provides the fallback rewrite required for direct navigation to client-side routes. Configure these environment variables in Vercel for Preview and Production environments:

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`

The publishable/anon key is intended for browser use; access control remains enforced by Supabase Row Level Security policies and database functions. Never commit `.env` or service-role keys.

## Product and revenue readiness

The current experience is designed as a free learning platform and beta. Before charging money, add a documented pricing model, terms/privacy pages, refund policy, payment provider integration, server-side entitlement checks, analytics consent, and a support/contact workflow. The most natural commercial paths are paid cohort courses, educator tools, certificates with verifiable records, institutional learning spaces, and optional premium mentorship—not paywalling core public knowledge.

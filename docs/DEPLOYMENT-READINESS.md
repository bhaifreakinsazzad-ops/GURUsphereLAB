# GURUsphereLab Deployment Readiness

## Status

The GitHub repository is prepared for Vercel as a Vite/React single-page application and the production branch contains commit `49c657d` (`Prepare app for Vercel deployment`). The repository is public at [GURUsphereLab](https://github.com/bhaifreakinsazzad-ops/GURUsphereLAb).

The local production build passes with `npm run build`, and the Vitest suite passes with one test. Vercel-specific SPA routing is configured in `vercel.json`, including a fallback to `index.html` and long-lived caching for built assets. The previously tracked `.env` file was removed from Git tracking and replaced with `.env.example`; configure the three `VITE_SUPABASE_*` variables in Vercel Preview and Production environments.

## Remaining deployment action

The Vercel connector is authenticated to a team scope, but the deployment call was rejected with HTTP 403 because the current connector session is not authorized to access that scope. Re-authenticate the Vercel connector, then create or reuse the Git-linked project `gurusphere-lab` from the `main` branch. After deployment, verify `/`, `/discover`, `/classroom`, `/exams`, `/library`, and `/auth` directly, as well as Supabase sign-in and password recovery.

## Quality observations

The application builds successfully, but the existing ESLint configuration reports 26 errors and 14 warnings, primarily `no-explicit-any`, React refresh export rules, and hook dependency warnings. These do not block the Vite production build but should be reduced before treating the codebase as fully maintainable. Vite also reports a large main JavaScript chunk (about 763 kB minified, 225 kB gzip); route-level lazy loading and vendor chunking are the next performance improvements.

The current product is beta/free-first rather than sales-ready commerce. Before collecting money, add terms and privacy pages, refund/cancellation rules, analytics consent, a support workflow, payment provider integration, server-side entitlements, and verified certificate/payment records. Strong commercial options include paid cohort courses, premium mentorship, educator tools, institutional workspaces, and optional certificate services while keeping core open knowledge accessible.

## Public learning materials

1. **[MIT OpenCourseWare](https://ocw.mit.edu/)** — More than 2,500 free MIT course resource collections across undergraduate and graduate subjects. It is ideal for a rigorous “university track” in GURUsphere because learners can study at their own pace using lectures, notes, assignments, and related materials.
2. **[Harvard CS50x](https://pll.harvard.edu/course/cs50-introduction-computer-science)** — A beginner-friendly, self-paced introduction to computer science and programming. The audit path is free; it covers algorithms, data structures, C, Python, SQL, JavaScript, HTML/CSS, web development, security, and a final project. A verified certificate is optional and paid.
3. **[OER Commons](https://www.oercommons.org/)** — A public digital library where learners can discover open materials and educators can create, adapt, submit, curate, and collaborate on resources. Its subject, level, standards, collection, and hub structure is a useful model for GURUsphere’s digital library taxonomy.
4. **[UNESCO Open Educational Resources](https://www.unesco.org/en/open-educational-resources)** — A policy and practice guide to openly licensed teaching and research materials. UNESCO defines OER as materials that permit no-cost access, reuse, adaptation, and redistribution; this is valuable for shaping GURUsphere’s licensing, attribution, accessibility, and sustainability rules.
5. **[Peace Corps Bengali lessons via Live Lingua](https://www.livelingua.com/project/peace-corps/bengali)** — A free Bengali self-study collection with downloadable lessons and audio. It is particularly relevant to GURUsphere’s Bangladesh-first positioning and can seed a Bengali language pathway, provided the platform links to the original resource and honors its terms.

All external resources should be catalogued with source URL, author/provider, language, difficulty, license/usage terms, last-checked date, and a short learner outcome. Do not mirror copyrighted course files unless the license explicitly permits redistribution.

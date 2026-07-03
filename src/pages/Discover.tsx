import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import OrbitNavbar from "@/components/orbit/OrbitNavbar";
import OrbitFooter from "@/components/orbit/OrbitFooter";

// Seed catalogue — replaced by server-side data in a later phase.
const CATALOGUE = [
  { title: "IELTS Band 7+", subject: "Languages", level: "Intermediate", weeks: 8, tags: ["ielts", "english", "language", "exam", "speaking"] },
  { title: "Become a Web Developer", subject: "Programming", level: "Beginner", weeks: 12, tags: ["web", "html", "css", "javascript", "react", "developer"] },
  { title: "Freelancing on Fiverr & Upwork", subject: "Career", level: "Beginner", weeks: 6, tags: ["freelance", "fiverr", "upwork", "career", "income"] },
  { title: "AI Tools for Everyday Work", subject: "AI & Data", level: "All levels", weeks: 4, tags: ["ai", "chatgpt", "claude", "productivity", "tools"] },
  { title: "English Speaking Fluency", subject: "Languages", level: "Beginner", weeks: 10, tags: ["english", "speaking", "language"] },
  { title: "University Admission Prep (BD)", subject: "Career", level: "Intermediate", weeks: 14, tags: ["university", "admission", "hsc"] },
  { title: "Graphic Design Foundations", subject: "Design", level: "Beginner", weeks: 8, tags: ["design", "figma", "canva", "graphic"] },
  { title: "Python for Data Analysis", subject: "AI & Data", level: "Intermediate", weeks: 10, tags: ["python", "data", "pandas"] },
];

const score = (q: string, item: typeof CATALOGUE[number]) => {
  if (!q) return 1;
  const needle = q.toLowerCase();
  const hay = [item.title, item.subject, ...item.tags].join(" ").toLowerCase();
  if (hay.includes(needle)) return 10;
  const words = needle.split(/\s+/).filter(Boolean);
  return words.reduce((s, w) => s + (hay.includes(w) ? 1 : 0), 0);
};

const Discover = () => {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") ?? params.get("subject") ?? "";
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    document.title = q ? `${q} · Discover — GURUsphere` : "Discover — GURUsphere";
  }, [q]);

  const results = useMemo(() => {
    return CATALOGUE
      .map((c) => ({ c, s: score(q, c) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.c);
  }, [q]);

  return (
    <div className="orbit min-h-screen flex flex-col">
      <OrbitNavbar />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-[1120px] mx-auto">
          <Link to="/" className="orbit-btn orbit-btn-ghost text-[13px] mb-6" style={{ minHeight: 32, padding: "0 0.5rem" }}>
            <ArrowLeft size={14} /> Home
          </Link>

          <div className="orbit-eyebrow mb-3">Discover</div>
          <h1 className="text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight mb-8">
            {q ? <>Results for "<span style={{ color: "hsl(var(--orbit-accent))" }}>{q}</span>"</> : "Explore learning"}
          </h1>

          <div className="mb-10 max-w-[640px]">
            <div
              className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-xl"
              style={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border-strong))" }}
            >
              <Search size={18} style={{ color: "hsl(var(--foreground-subtle))" }} />
              <input
                aria-label="Refine your search"
                value={q}
                onChange={(e) => { setQ(e.target.value); setParams(e.target.value ? { q: e.target.value } : {}); }}
                placeholder="Refine your goal or subject"
                className="flex-1 bg-transparent outline-none py-2.5 text-[15px]"
                style={{ color: "hsl(var(--foreground))" }}
              />
            </div>
          </div>

          {results.length === 0 ? (
            <div className="orbit-card p-10 text-center">
              <p className="text-[16px] mb-2" style={{ color: "hsl(var(--foreground))" }}>
                Nothing matches yet.
              </p>
              <p className="text-[14px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
                Try a broader keyword — "english", "web", "freelance", "ai".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((r) => (
                <article key={r.title} className="orbit-card p-6">
                  <div className="orbit-eyebrow mb-3" style={{ color: "hsl(var(--orbit-accent))" }}>{r.subject}</div>
                  <h2 className="text-[1.125rem] mb-3" style={{ fontWeight: 600 }}>{r.title}</h2>
                  <div className="flex items-center gap-4 text-[12px] mb-5" style={{ color: "hsl(var(--foreground-subtle))" }}>
                    <span>{r.weeks} weeks</span>
                    <span>·</span>
                    <span>{r.level}</span>
                  </div>
                  <button className="orbit-btn orbit-btn-secondary w-full" type="button">Preview path</button>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <OrbitFooter />
    </div>
  );
};

export default Discover;

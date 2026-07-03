import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ArrowLeft, Clock } from "lucide-react";
import OrbitNavbar from "@/components/orbit/OrbitNavbar";
import OrbitFooter from "@/components/orbit/OrbitFooter";
import { fetchPublishedCourses, fetchSubjects, type CourseCard, type SubjectRow, type Difficulty } from "@/lib/learning";

const DIFFICULTIES: (Difficulty | "all")[] = ["all", "beginner", "intermediate", "advanced"];
const LANGS: { value: string; label: string }[] = [
  { value: "all", label: "Any language" },
  { value: "en", label: "English" },
  { value: "bn", label: "বাংলা" },
];

const Discover = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const subject = params.get("subject") ?? "";
  const difficulty = (params.get("level") as Difficulty | null) ?? "";
  const language = params.get("lang") ?? "all";

  const [inputQ, setInputQ] = useState(q);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [results, setResults] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setInputQ(q); }, [q]);
  useEffect(() => { fetchSubjects().then(setSubjects).catch(() => {}); }, []);

  useEffect(() => {
    document.title = q ? `${q} · Discover — GURUsphere` : "Discover — GURUsphere";
    setLoading(true);
    setError(null);
    fetchPublishedCourses({
      q,
      subjectSlug: subject || undefined,
      difficulty: (difficulty || undefined) as Difficulty | undefined,
      language,
      limit: 48,
    })
      .then(setResults)
      .catch((e) => setError(e.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  }, [q, subject, difficulty, language]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value); else next.delete(key);
    setParams(next);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParam("q", inputQ.trim());
  };

  const chip = (active: boolean): React.CSSProperties => ({
    background: active ? "hsl(var(--orbit-primary))" : "hsl(var(--surface))",
    color: active ? "hsl(var(--orbit-on-primary))" : "hsl(var(--foreground))",
    border: `1px solid ${active ? "hsl(var(--orbit-primary))" : "hsl(var(--border-strong))"}`,
    minHeight: 32, padding: "0 0.75rem", fontSize: 12,
  });

  return (
    <div className="orbit min-h-screen flex flex-col">
      <OrbitNavbar />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-[1120px] mx-auto">
          <Link to="/" className="orbit-btn orbit-btn-ghost text-[13px] mb-6" style={{ minHeight: 32, padding: "0 0.5rem" }}>
            <ArrowLeft size={14} /> Home
          </Link>

          <div className="orbit-eyebrow mb-3">Discover</div>
          <h1 className="text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight mb-8" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>
            {q ? <>Results for "<span style={{ color: "hsl(var(--orbit-accent))" }}>{q}</span>"</> : "Explore learning"}
          </h1>

          <form onSubmit={submitSearch} className="mb-6 max-w-[640px]">
            <div className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-xl"
              style={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border-strong))" }}>
              <Search size={18} style={{ color: "hsl(var(--foreground-subtle))" }} />
              <input
                aria-label="Search courses"
                value={inputQ}
                onChange={(e) => setInputQ(e.target.value)}
                placeholder="Search a goal, skill, or subject"
                className="flex-1 bg-transparent outline-none py-2.5 text-[15px]"
                style={{ color: "hsl(var(--foreground))" }}
              />
              <button type="submit" className="orbit-btn orbit-btn-primary" style={{ minHeight: 36 }}>Search</button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Subject filters">
            <button onClick={() => setParam("subject", "")} className="orbit-btn" style={chip(!subject)}>All subjects</button>
            {subjects.map((s) => (
              <button key={s.id} onClick={() => setParam("subject", s.slug)} className="orbit-btn" style={chip(subject === s.slug)}>{s.name}</button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {DIFFICULTIES.map((d) => (
              <button key={d} onClick={() => setParam("level", d)} className="orbit-btn" style={chip((difficulty || "all") === d)}>
                {d === "all" ? "Any level" : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
            <div style={{ width: 1, background: "hsl(var(--border))", margin: "0 0.25rem" }} />
            {LANGS.map((l) => (
              <button key={l.value} onClick={() => setParam("lang", l.value)} className="orbit-btn" style={chip((language || "all") === l.value)}>
                {l.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="orbit-card p-6" style={{ minHeight: 180, opacity: 0.5 }}>
                  <div style={{ height: 12, width: 80, background: "hsl(var(--surface-raised))", borderRadius: 4, marginBottom: 12 }} />
                  <div style={{ height: 20, width: "80%", background: "hsl(var(--surface-raised))", borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ height: 14, width: "60%", background: "hsl(var(--surface-raised))", borderRadius: 4 }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="orbit-card p-10 text-center">
              <p style={{ color: "hsl(var(--foreground))" }}>Couldn't load courses.</p>
              <p className="text-[13px] mt-1" style={{ color: "hsl(var(--foreground-subtle))" }}>{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="orbit-card p-10 text-center">
              <p className="text-[16px] mb-2" style={{ color: "hsl(var(--foreground))" }}>Nothing matches yet.</p>
              <p className="text-[14px]" style={{ color: "hsl(var(--foreground-subtle))" }}>Try broader keywords or clear the filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((r) => (
                <Link key={r.id} to={`/courses/${r.slug}`} className="orbit-card p-6 block">
                  {r.subject && <div className="orbit-eyebrow mb-2" style={{ color: "hsl(var(--orbit-accent))" }}>{r.subject.name}</div>}
                  <h2 className="text-[1.0625rem] mb-2" style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{r.title}</h2>
                  {r.short_description && (
                    <p className="text-[13px] mb-4 line-clamp-2" style={{ color: "hsl(var(--foreground-subtle))" }}>{r.short_description}</p>
                  )}
                  <div className="flex items-center gap-3 text-[12px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
                    <span className="flex items-center gap-1"><Clock size={12} />{Math.round(r.estimated_minutes / 60) || 1}h</span>
                    <span>·</span>
                    <span className="capitalize">{r.difficulty}</span>
                    <span>·</span>
                    <span>{r.language === "bn" ? "বাংলা" : r.language === "both" ? "EN+বাংলা" : "English"}</span>
                  </div>
                </Link>
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

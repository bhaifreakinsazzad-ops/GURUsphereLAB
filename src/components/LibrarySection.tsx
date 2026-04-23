import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { ExternalLink, Search, GraduationCap, X, Filter } from "lucide-react";

type Level = "Beginner" | "Intermediate" | "Advanced";
type Language = "English" | "Bengali" | "Bilingual";

interface Course {
  title: string;
  bengali: string;
  provider: string;
  topic: string;        // e.g. "Computer Science"
  level: Level;
  language: Language;
  normallyPaid: string;
  desc: string;
  url: string;
}

const courses: Course[] = [
  {
    title: "MIT OpenCourseWare",
    bengali: "এমআইটি কোর্স",
    provider: "MIT",
    topic: "Engineering",
    level: "Advanced",
    language: "English",
    normallyPaid: "$60,000/yr at MIT",
    desc: "Full MIT course materials — CS, math, physics, engineering. Lecture videos, notes, exams, all free.",
    url: "https://ocw.mit.edu",
  },
  {
    title: "Khan Academy Bangla",
    bengali: "খান একাডেমি",
    provider: "Khan Academy",
    topic: "K–12",
    level: "Beginner",
    language: "Bengali",
    normallyPaid: "Tutoring: ৳5k+/mo",
    desc: "Math, science, and computing — fully translated to Bengali. From class 1 to university prep.",
    url: "https://bn.khanacademy.org",
  },
  {
    title: "freeCodeCamp",
    bengali: "ফ্রি কোডক্যাম্প",
    provider: "freeCodeCamp",
    topic: "Computer Science",
    level: "Intermediate",
    language: "English",
    normallyPaid: "Bootcamps: $10k+",
    desc: "3,000+ hours of coding curriculum + 12 free certifications. Web, data, ML, Python, JavaScript.",
    url: "https://www.freecodecamp.org",
  },
  {
    title: "CS50 by Harvard",
    bengali: "হার্ভার্ড সিএস৫০",
    provider: "Harvard",
    topic: "Computer Science",
    level: "Beginner",
    language: "English",
    normallyPaid: "$50,000/yr at Harvard",
    desc: "The world's most famous intro to computer science — full Harvard course, free on edX.",
    url: "https://cs50.harvard.edu/x/",
  },
  {
    title: "Stanford Online",
    bengali: "স্ট্যানফোর্ড অনলাইন",
    provider: "Stanford",
    topic: "Computer Science",
    level: "Advanced",
    language: "English",
    normallyPaid: "$56,000/yr at Stanford",
    desc: "Free Stanford lectures: AI, ML, databases, algorithms — taught by the original professors.",
    url: "https://online.stanford.edu/free-courses",
  },
  {
    title: "fast.ai",
    bengali: "ফাস্ট এআই",
    provider: "fast.ai",
    topic: "AI / ML",
    level: "Intermediate",
    language: "English",
    normallyPaid: "ML bootcamps: $5k+",
    desc: "Practical deep learning for coders. Build real AI in weeks, not months. Free, top-down approach.",
    url: "https://www.fast.ai",
  },
  {
    title: "10 Minute School",
    bengali: "১০ মিনিট স্কুল",
    provider: "10MS",
    topic: "K–12",
    level: "Beginner",
    language: "Bengali",
    normallyPaid: "Coaching: ৳3k+/mo",
    desc: "Bangladesh's largest online school — SSC, HSC, admission, IELTS, spoken English. Fully Bengali.",
    url: "https://10minuteschool.com",
  },
  {
    title: "MIT OCW Linear Algebra",
    bengali: "লিনিয়ার অ্যালজেব্রা",
    provider: "MIT (Strang)",
    topic: "Mathematics",
    level: "Advanced",
    language: "English",
    normallyPaid: "$60,000/yr at MIT",
    desc: "Prof. Gilbert Strang's legendary lectures — the definitive linear algebra course on the internet.",
    url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
  },
  {
    title: "Coursera Financial Aid",
    bengali: "কোর্সেরা ফ্রি",
    provider: "Coursera",
    topic: "General",
    level: "Intermediate",
    language: "Bilingual",
    normallyPaid: "$49–$79/mo",
    desc: "Apply for financial aid on any Coursera course. ~95% acceptance for genuine learners — full certificates included.",
    url: "https://www.coursera.org",
  },
];

const ALL_TOPICS = Array.from(new Set(courses.map((c) => c.topic))).sort();
const ALL_LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];
const ALL_LANGS: Language[] = ["English", "Bengali", "Bilingual"];

const LibrarySection = () => {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | "all">("all");
  const [level, setLevel] = useState<Level | "all">("all");
  const [language, setLanguage] = useState<Language | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      if (topic !== "all" && c.topic !== topic) return false;
      if (level !== "all" && c.level !== level) return false;
      if (language !== "all" && c.language !== language) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.bengali.includes(query.trim()) ||
        c.provider.toLowerCase().includes(q) ||
        c.topic.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q)
      );
    });
  }, [query, topic, level, language]);

  const safeActive = Math.min(active, Math.max(filtered.length - 1, 0));
  const current = filtered[safeActive];

  const clearFilters = () => {
    setQuery("");
    setTopic("all");
    setLevel("all");
    setLanguage("all");
    setActive(0);
  };

  const hasActiveFilters =
    query.trim() !== "" || topic !== "all" || level !== "all" || language !== "all";

  return (
    <section id="library" className="py-24 md:py-32 section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, hsl(var(--pathshala-gold) / 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3">
              Free Courses Library
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              MIT. Harvard. Stanford.{" "}
              <span className="text-gradient-gold">All free.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              These are the same courses you'd pay tens of thousands of dollars for at top universities.
              Hadi believed every curious mind deserves them — so here they are.
            </p>
          </div>
        </ScrollReveal>

        {/* Search + Filter bar */}
        <ScrollReveal>
          <div className="mb-8 feature-card !p-4 md:!p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  placeholder="Search courses, providers, topics…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pathshala-gold transition-colors"
                />
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors shrink-0"
                >
                  <X size={14} /> Clear
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="space-y-3">
              <FilterRow label="Topic">
                <Chip active={topic === "all"} onClick={() => { setTopic("all"); setActive(0); }}>All</Chip>
                {ALL_TOPICS.map((t) => (
                  <Chip key={t} active={topic === t} onClick={() => { setTopic(t); setActive(0); }}>
                    {t}
                  </Chip>
                ))}
              </FilterRow>

              <FilterRow label="Level">
                <Chip active={level === "all"} onClick={() => { setLevel("all"); setActive(0); }}>All</Chip>
                {ALL_LEVELS.map((l) => (
                  <Chip key={l} active={level === l} onClick={() => { setLevel(l); setActive(0); }}>
                    {l}
                  </Chip>
                ))}
              </FilterRow>

              <FilterRow label="Language">
                <Chip active={language === "all"} onClick={() => { setLanguage("all"); setActive(0); }}>All</Chip>
                {ALL_LANGS.map((l) => (
                  <Chip key={l} active={language === l} onClick={() => { setLanguage(l); setActive(0); }}>
                    {l}
                  </Chip>
                ))}
              </FilterRow>
            </div>

            <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
              <Filter size={12} />
              Showing <strong className="text-foreground tabular-nums">{filtered.length}</strong> of {courses.length} courses
            </p>
          </div>
        </ScrollReveal>

        {filtered.length === 0 ? (
          <ScrollReveal>
            <div className="feature-card text-center py-16">
              <Search size={28} className="mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">No courses match your filters</h3>
              <p className="text-sm text-muted-foreground mt-1">Try clearing filters or a different search term.</p>
              <button
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border/60 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <X size={14} /> Clear all filters
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Course list */}
            <ScrollReveal direction="left">
              <div className="space-y-3">
                {filtered.map((c, i) => (
                  <motion.button
                    key={c.title}
                    onClick={() => setActive(i)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      safeActive === i ? "glass-card glow-green" : "hover:bg-muted/60"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          safeActive === i
                            ? "bg-pathshala-green text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <GraduationCap size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">{c.title}</p>
                        <p className="bengali-text text-xs text-muted-foreground truncate">{c.bengali}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {c.topic}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{c.level}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </ScrollReveal>

            {/* Active course preview */}
            <ScrollReveal direction="right">
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div
                    key={current.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="feature-card min-h-[360px] flex flex-col sticky top-24"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold tracking-widest uppercase text-pathshala-gold">
                          {current.provider}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs font-medium text-muted-foreground">{current.level}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs font-medium text-muted-foreground">{current.language}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mt-2">
                        {current.title}
                      </h3>
                      <p className="bengali-text text-sm text-muted-foreground mt-1">
                        {current.bengali}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pathshala-gold/10 border border-pathshala-gold/20">
                        <span className="text-xs font-semibold text-pathshala-gold">
                          Normally: {current.normallyPaid}
                        </span>
                      </div>

                      <p className="text-muted-foreground mt-5 leading-relaxed">
                        {current.desc}
                      </p>
                    </div>

                    <div className="mt-6">
                      <a
                        href={current.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-pathshala-green text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
                      >
                        Open free course <ExternalLink size={14} />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollReveal>
          </div>
        )}

        {/* Search hint */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 feature-card flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-xl bg-pathshala-gold/20 flex items-center justify-center shrink-0">
              <Search size={20} className="text-pathshala-gold" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">More on the way</h4>
              <p className="text-sm text-muted-foreground">
                We're adding curated free courses every week — Coursera financial-aid guides,
                Bengali YouTube playlists, IELTS/SAT prep, and government-recognized certificates.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const FilterRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-3 flex-wrap">
    <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground w-20 shrink-0">
      {label}
    </span>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all active:scale-95 ${
      active
        ? "bg-pathshala-gold text-pathshala-deep border-pathshala-gold"
        : "bg-transparent text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

export default LibrarySection;

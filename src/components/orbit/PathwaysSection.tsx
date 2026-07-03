import { ArrowUpRight, Clock, Signal } from "lucide-react";
import { Link } from "react-router-dom";

const PATHWAYS = [
  {
    title: "Become a Web Developer",
    outcome: "Ship your first real website with HTML, CSS, JS, and React.",
    weeks: "12 weeks",
    level: "Beginner",
    tag: "Career",
  },
  {
    title: "IELTS Band 7+",
    outcome: "Structured reading, listening, writing, and speaking practice.",
    weeks: "8 weeks",
    level: "Intermediate",
    tag: "Language",
  },
  {
    title: "Freelancing on Fiverr & Upwork",
    outcome: "Pick a skill, build a portfolio, land your first paid client.",
    weeks: "6 weeks",
    level: "Beginner",
    tag: "Career",
  },
  {
    title: "AI Tools for Everyday Work",
    outcome: "Use ChatGPT, Claude, and design AI to work 3× faster.",
    weeks: "4 weeks",
    level: "All levels",
    tag: "Skill",
  },
];

const PathwaysSection = () => (
  <section id="learn" className="py-20 md:py-28 px-6 md:px-10" aria-labelledby="pathways-title">
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="orbit-eyebrow mb-3">Popular pathways</div>
          <h2 id="pathways-title" className="text-[clamp(1.75rem,3vw,2.25rem)] leading-tight">
            Learning paths that actually take you somewhere.
          </h2>
        </div>
        <Link to="/discover" className="orbit-btn orbit-btn-ghost text-[14px]">
          Browse all <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PATHWAYS.map((p) => (
          <article key={p.title} className="orbit-card p-6 flex flex-col">
            <div className="orbit-eyebrow mb-4" style={{ color: "hsl(var(--orbit-accent))" }}>
              {p.tag}
            </div>
            <h3 className="text-[1.125rem] leading-snug mb-3" style={{ fontWeight: 600 }}>
              {p.title}
            </h3>
            <p className="text-[14px] mb-5 flex-1" style={{ color: "hsl(var(--foreground-muted))", lineHeight: 1.55 }}>
              {p.outcome}
            </p>
            <div className="flex items-center gap-4 text-[12px] mb-5" style={{ color: "hsl(var(--foreground-subtle))" }}>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} /> {p.weeks}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Signal size={13} /> {p.level}
              </span>
            </div>
            <Link
              to={`/discover?q=${encodeURIComponent(p.title)}`}
              className="orbit-btn orbit-btn-secondary w-full"
            >
              Start
            </Link>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default PathwaysSection;

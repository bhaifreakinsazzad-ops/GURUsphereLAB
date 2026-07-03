import { Target, BookOpen, TrendingUp } from "lucide-react";

const STEPS = [
  {
    icon: Target,
    title: "Set a goal",
    body: "Tell us what you want to learn or become. We match you with a structured path.",
  },
  {
    icon: BookOpen,
    title: "Learn with structure",
    body: "Real lessons, practice, and feedback — designed by educators, not endless videos.",
  },
  {
    icon: TrendingUp,
    title: "Track your growth",
    body: "See progress, unlock recognition when you finish, and share what you've built.",
  },
];

const HowItWorksSection = () => (
  <section className="py-20 md:py-28 px-6 md:px-10" aria-labelledby="how-title">
    <div className="max-w-[1200px] mx-auto">
      <div className="max-w-[640px] mb-12">
        <div className="orbit-eyebrow mb-3">How GURUsphere works</div>
        <h2 id="how-title" className="text-[clamp(1.75rem,3vw,2.25rem)] leading-tight">
          A learning ecosystem, not another catalogue of videos.
        </h2>
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ counterReset: "step" }}>
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="orbit-card p-7">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "hsl(var(--orbit-primary-soft))", color: "hsl(var(--orbit-primary))" }}
              >
                <Icon size={18} />
              </div>
              <span
                className="text-[13px] font-semibold"
                style={{ color: "hsl(var(--foreground-subtle))" }}
              >
                Step {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="text-[1.25rem] mb-2" style={{ fontWeight: 600 }}>{title}</h3>
            <p className="text-[15px]" style={{ color: "hsl(var(--foreground-muted))", lineHeight: 1.6 }}>
              {body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorksSection;

import { Link } from "react-router-dom";
import {
  Code, Languages, Palette, Calculator, Beaker, Briefcase,
  Camera, Music, Heart, Globe2, Cpu, PenTool,
} from "lucide-react";

const SUBJECTS = [
  { name: "Programming", icon: Code, count: 42 },
  { name: "Languages", icon: Languages, count: 28 },
  { name: "Design", icon: Palette, count: 24 },
  { name: "Math", icon: Calculator, count: 19 },
  { name: "Science", icon: Beaker, count: 22 },
  { name: "Career", icon: Briefcase, count: 31 },
  { name: "Photography", icon: Camera, count: 12 },
  { name: "Music", icon: Music, count: 9 },
  { name: "Wellbeing", icon: Heart, count: 14 },
  { name: "Global Studies", icon: Globe2, count: 11 },
  { name: "AI & Data", icon: Cpu, count: 17 },
  { name: "Writing", icon: PenTool, count: 15 },
];

const SubjectsSection = () => (
  <section className="py-20 md:py-24 px-6 md:px-10" aria-labelledby="subjects-title" style={{ background: "hsl(var(--surface-sunken))" }}>
    <div className="max-w-[1200px] mx-auto">
      <div className="orbit-eyebrow mb-3">Browse by subject</div>
      <h2 id="subjects-title" className="text-[clamp(1.75rem,3vw,2.25rem)] leading-tight mb-10">
        Every subject, one home.
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SUBJECTS.map(({ name, icon: Icon, count }) => (
          <Link
            key={name}
            to={`/discover?subject=${encodeURIComponent(name)}`}
            className="orbit-card p-5 flex flex-col items-start gap-3 no-underline"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "hsl(var(--orbit-primary-soft))", color: "hsl(var(--orbit-primary))" }}
            >
              <Icon size={18} />
            </div>
            <div>
              <div className="text-[14px] font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                {name}
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: "hsl(var(--foreground-subtle))" }}>
                {count} courses
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default SubjectsSection;

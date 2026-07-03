import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const MENTORS = [
  { name: "Farhana R.", expertise: "IELTS & Academic English", avail: "Available" },
  { name: "Rezaul K.", expertise: "Frontend Engineering", avail: "Limited" },
  { name: "Tanjim H.", expertise: "Freelancing & Career", avail: "Available" },
  { name: "Nusrat A.", expertise: "AI Tools for Study", avail: "Waitlist" },
];

const availColor = (a: string) =>
  a === "Available" ? "hsl(var(--success))" : a === "Limited" ? "hsl(var(--warning))" : "hsl(var(--foreground-subtle))";

const MentorsPreview = () => (
  <section id="community" className="py-20 md:py-24 px-6 md:px-10" aria-labelledby="mentors-title" style={{ background: "hsl(var(--surface-sunken))" }}>
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="orbit-eyebrow mb-3">Mentors</div>
          <h2 id="mentors-title" className="text-[clamp(1.75rem,3vw,2.25rem)] leading-tight">
            Learn beside someone who's been there.
          </h2>
        </div>
        <Link to="/mentorship" className="orbit-btn orbit-btn-ghost text-[14px]">
          See all mentors <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MENTORS.map((m) => (
          <article key={m.name} className="orbit-card p-6">
            <div
              className="w-12 h-12 rounded-full mb-4 flex items-center justify-center text-[16px] font-semibold"
              style={{ background: "hsl(var(--orbit-primary-soft))", color: "hsl(var(--orbit-primary))" }}
              aria-hidden
            >
              {m.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="text-[15px] mb-1" style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{m.name}</div>
            <div className="text-[13px] mb-4" style={{ color: "hsl(var(--foreground-muted))" }}>{m.expertise}</div>
            <div className="flex items-center gap-2 text-[12px]" style={{ color: availColor(m.avail) }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: availColor(m.avail) }} aria-hidden />
              {m.avail}
            </div>
          </article>
        ))}
      </div>

      <p className="text-[13px] mt-8 max-w-[560px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
        Mentor bookings launch after MVP. For now, browse profiles and follow the mentors you want to
        learn from.
      </p>
    </div>
  </section>
);

export default MentorsPreview;

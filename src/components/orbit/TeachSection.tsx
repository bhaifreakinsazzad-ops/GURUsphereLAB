import { Link } from "react-router-dom";
import { ArrowRight, Users, Sparkles, Shield } from "lucide-react";

const BENEFITS = [
  { icon: Users, text: "Reach learners across Bangladesh and beyond." },
  { icon: Sparkles, text: "Modern course builder — draft, publish, iterate." },
  { icon: Shield, text: "Free during beta. No fees, no lock-in." },
];

const TeachSection = () => (
  <section id="teach" className="py-20 md:py-28 px-6 md:px-10" aria-labelledby="teach-title">
    <div className="max-w-[1200px] mx-auto">
      <div
        className="orbit-card p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--orbit-primary-soft)) 0%, hsl(var(--surface-raised)) 100%)",
          borderColor: "hsl(var(--orbit-primary) / 0.3)",
        }}
      >
        <div>
          <div className="orbit-eyebrow mb-3">Teach on GURUsphere</div>
          <h2 id="teach-title" className="text-[clamp(1.5rem,2.8vw,2.25rem)] leading-tight mb-4">
            You know something worth teaching. Share it with the world.
          </h2>
          <p className="text-[16px] mb-6" style={{ color: "hsl(var(--foreground-muted))", lineHeight: 1.6 }}>
            Whether you're a subject teacher, working professional, or self-taught expert — publish
            your first course free. Monetization for educators is coming after MVP.
          </p>
          <Link to="/teach/apply" className="orbit-btn orbit-btn-primary">
            Become an educator <ArrowRight size={16} />
          </Link>
        </div>

        <ul className="space-y-3">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "hsl(var(--surface) / 0.6)" }}>
              <Icon size={18} style={{ color: "hsl(var(--orbit-accent))", flexShrink: 0, marginTop: 2 }} />
              <span className="text-[15px]" style={{ color: "hsl(var(--foreground))" }}>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default TeachSection;

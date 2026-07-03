import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const LegacyStrip = () => (
  <section className="py-16 px-6 md:px-10" aria-label="Legacy">
    <div
      className="max-w-[900px] mx-auto text-center px-8 py-10 rounded-2xl"
      style={{
        background: "hsl(var(--surface-raised))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="orbit-eyebrow mb-3" style={{ color: "hsl(var(--orbit-plum))" }}>
        Our origin
      </div>
      <p
        className="text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed mb-5"
        style={{ color: "hsl(var(--foreground))", fontFamily: "'Fraunces', serif", fontStyle: "italic" }}
      >
        GURUsphere carries forward the wish of Shaheed Osman Hadi — that knowledge should belong to
        everyone, and no dream should stop for lack of a fee.
      </p>
      <Link to="/legacy" className="orbit-btn orbit-btn-ghost text-[14px]">
        Read the legacy <ArrowUpRight size={16} />
      </Link>
    </div>
  </section>
);

export default LegacyStrip;

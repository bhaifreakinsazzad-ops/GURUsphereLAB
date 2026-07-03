import { Link } from "react-router-dom";
import OrbitGlyph from "./OrbitGlyph";

const COLUMNS = [
  {
    title: "Learn",
    links: [
      { label: "Discover", to: "/discover" },
      { label: "Pathways", to: "/#learn" },
      { label: "Subjects", to: "/discover" },
      { label: "Mentors", to: "/mentorship" },
    ],
  },
  {
    title: "Teach",
    links: [
      { label: "Become an educator", to: "/auth" },
      { label: "Course builder", to: "/dashboard" },
      { label: "Community guidelines", to: "/legacy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/legacy" },
      { label: "Legacy", to: "/legacy" },
      { label: "Contact", to: "/legacy" },
    ],
  },
];

const OrbitFooter = () => (
  <footer className="pt-16 pb-10 px-6 md:px-10" style={{ borderTop: "1px solid hsl(var(--border))" }}>
    <div className="max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_repeat(3,1fr)] gap-10 mb-12">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <OrbitGlyph size={26} />
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: "1.125rem", color: "hsl(var(--foreground))" }}>
              GURU<span style={{ fontStyle: "italic", color: "hsl(var(--orbit-accent))" }}>sphere</span>
            </span>
          </Link>
          <p className="text-[14px] max-w-[280px]" style={{ color: "hsl(var(--foreground-muted))", lineHeight: 1.6 }}>
            Learn anything. Teach anything. Grow together. A global learning ecosystem, free during beta.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div className="orbit-eyebrow mb-4" style={{ color: "hsl(var(--foreground-subtle))" }}>
              {col.title}
            </div>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[14px] transition-colors"
                    style={{ color: "hsl(var(--foreground-muted))" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(var(--foreground))")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(var(--foreground-muted))")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 text-[12px]"
        style={{ borderTop: "1px solid hsl(var(--border))", color: "hsl(var(--foreground-subtle))" }}
      >
        <div>© {new Date().getFullYear()} GURUsphere. Free knowledge for everyone.</div>
        <div className="flex items-center gap-4">
          <button type="button" className="hover:text-foreground transition-colors">EN / বাংলা</button>
          <span aria-hidden>·</span>
          <Link to="/legacy" className="hover:text-foreground transition-colors">Legacy</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default OrbitFooter;

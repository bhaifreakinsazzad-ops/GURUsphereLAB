import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getLocale, setLocale, useT } from "@/lib/i18n";
import OrbitGlyph from "./OrbitGlyph";

const primary = [
  { key: "nav.learn", href: "/discover" },
  { key: "nav.teach", href: "/teach/apply" },
  { key: "nav.mentors", href: "/mentorship" },
  { key: "nav.community", href: "/#community" },
];

const OrbitNavbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const t = useT();

  const toggleLang = () => setLocale(getLocale() === "en" ? "bn" : "en");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all"
      style={{
        background: scrolled ? "hsl(224 28% 8% / 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid hsl(var(--border))" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-[64px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 focus-visible:outline-none" aria-label="GURUsphere home">
          <OrbitGlyph size={26} />
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 500,
              fontSize: "1.125rem",
              letterSpacing: "-0.02em",
              color: "hsl(var(--foreground))",
            }}
          >
            GURU<span style={{ fontStyle: "italic", color: "hsl(var(--orbit-accent))" }}>sphere</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {primary.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[14px] font-medium transition-colors"
              style={{ color: "hsl(var(--foreground-muted))" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(var(--foreground))")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(var(--foreground-muted))")}
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="orbit-btn-ghost orbit-btn"
            style={{ minHeight: 36, padding: "0 0.75rem", fontSize: "0.8125rem" }}
            aria-label="Switch language"
            title="Language"
          >
            EN / বাংলা
          </button>
          {user ? (
            <>
              <Link to="/my-learning" className="orbit-btn orbit-btn-secondary" style={{ minHeight: 40 }}>
                {t("nav.dashboard")}
              </Link>
              <button onClick={signOut} className="orbit-btn orbit-btn-ghost" aria-label={t("nav.signout")} style={{ minHeight: 40, padding: "0 0.75rem" }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="orbit-btn orbit-btn-ghost" style={{ minHeight: 40 }}>
                {t("nav.signin")}
              </Link>
              <Link to="/signup" className="orbit-btn orbit-btn-primary" style={{ minHeight: 40 }}>
                {t("nav.start")}
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden orbit-btn-ghost orbit-btn"
          style={{ minHeight: 40, padding: "0 0.5rem" }}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden mx-4 mb-4 rounded-2xl overflow-hidden"
          style={{ background: "hsl(var(--surface-raised))", border: "1px solid hsl(var(--border))" }}
        >
          <nav className="flex flex-col p-2" aria-label="Mobile">
            {primary.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-[15px] font-medium"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {t(item.key)}
              </a>
            ))}
            <div style={{ height: 1, background: "hsl(var(--border))", margin: "0.5rem 0" }} />
            {user ? (
              <>
                <Link to="/my-learning" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-[15px] font-semibold" style={{ color: "hsl(var(--orbit-primary))" }}>
                  {t("nav.dashboard")}
                </Link>
                <button onClick={() => { setOpen(false); signOut(); }} className="text-left px-4 py-3 rounded-lg text-[15px]" style={{ color: "hsl(var(--foreground-muted))" }}>
                  {t("nav.signout")}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-[15px]" style={{ color: "hsl(var(--foreground))" }}>
                  {t("nav.signin")}
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="mx-2 my-2 orbit-btn orbit-btn-primary">
                  {t("nav.start")}
                </Link>
              </>
            )}
            <button onClick={toggleLang} className="px-4 py-3 text-left text-[13px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
              EN / বাংলা
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default OrbitNavbar;

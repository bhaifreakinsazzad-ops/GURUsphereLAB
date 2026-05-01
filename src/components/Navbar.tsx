import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import CandleLogomark from "./CandleLogomark";

const navItems = [
  { label: "Learning Path", href: "/#learning-path", route: false },
  { label: "Research", href: "/research-archive", route: true },
  { label: "Projects", href: "/team-projects", route: true },
  { label: "Mentors", href: "/mentorship", route: true },
  { label: "Hadi Meter", href: "/hadi-meter", route: true },
  { label: "Clubs", href: "/clubs", route: true },
  { label: "Memorial", href: "/#memorial", route: false },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`mx-auto transition-all duration-500 ${
          scrolled ? "max-w-7xl px-4 md:px-8 py-2.5" : "max-w-7xl section-padding py-5"
        }`}
      >
        <div
          className={`relative rounded-2xl px-5 md:px-7 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "glass-card py-2.5" : "py-3.5"
          }`}
          style={
            !scrolled
              ? { background: "transparent", border: "1px solid hsl(var(--candle) / 0.06)" }
              : undefined
          }
        >
          {/* Brand — Bangla-first for BD audience */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="হাদির ইচ্ছা · Hadi Wishes home">
            <CandleLogomark size={22} className="transition-transform group-hover:scale-110" />
            <span className="flex flex-col leading-none">
              <span
                className="bengali-text text-[17px] md:text-[19px] font-semibold tracking-tight"
                style={{ color: "hsl(var(--foreground))" }}
              >
                হাদির <span className="text-gradient-gold">ইচ্ছা</span>
              </span>
              <span
                className="hidden sm:block text-[10px] tracking-[0.22em] uppercase mt-0.5"
                style={{ color: "hsl(var(--candle) / 0.7)", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Hadi Wishes
              </span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) =>
              item.route ? (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-[13px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[13px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </a>
              ),
            )}
            {user && (
              <Link to="/dashboard" className="text-[13px] font-medium text-primary hover:text-primary/80">
                Dashboard
              </Link>
            )}

            {/* divider */}
            <span className="h-4 w-px" style={{ background: "hsl(var(--candle) / 0.2)" }} />

            <a
              href="/#donate"
              className="text-[13px] font-semibold tracking-wide transition-colors"
              style={{ color: "hsl(var(--hadi-red-soft))" }}
            >
              Donate ♥
            </a>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                  <UserIcon size={12} /> {profile?.display_name ?? "you"}
                </span>
                <button
                  onClick={signOut}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--candle)), hsl(35 90% 50%))",
                  color: "hsl(220 50% 6%)",
                }}
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Scroll progress hairline */}
          <motion.div
            className="absolute left-3 right-3 bottom-0 h-px origin-left rounded-full"
            style={{
              scaleX: progress,
              background:
                "linear-gradient(90deg, transparent, hsl(var(--candle) / 0.9), hsl(var(--hadi-red-soft) / 0.7), transparent)",
              opacity: scrolled ? 1 : 0,
              transition: "opacity 0.4s",
            }}
          />
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-2xl mt-2 p-4 md:hidden"
            >
              {navItems.map((item) =>
                item.route ? (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                  >
                    {item.label}
                  </a>
                ),
              )}
              <a
                href="/#donate"
                onClick={() => setOpen(false)}
                className="block py-3 px-4 text-sm font-semibold rounded-xl"
                style={{ color: "hsl(var(--hadi-red-soft))" }}
              >
                Donate ♥
              </a>
              {user && (
                <Link to="/dashboard" onClick={() => setOpen(false)} className="block py-3 px-4 text-sm font-semibold text-primary rounded-xl">
                  Dashboard
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => { setOpen(false); signOut(); }}
                  className="block w-full mt-2 px-5 py-3 rounded-xl text-sm font-semibold text-center bg-muted text-foreground"
                >
                  Sign out ({profile?.display_name})
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="block mt-2 px-5 py-3 rounded-xl text-sm font-semibold text-center"
                  style={{ background: "linear-gradient(135deg, hsl(var(--candle)), hsl(35 90% 50%))", color: "hsl(220 50% 6%)" }}
                >
                  Sign in
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;

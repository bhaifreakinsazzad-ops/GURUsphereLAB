import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, BookOpen, Users, GraduationCap, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NebulaShellProps {
  title: string;
  bengaliTitle?: string;
  subtitle?: string;
  children: ReactNode;
}

const navTabs = [
  { to: "/research-archive", label: "Research", icon: BookOpen },
  { to: "/team-projects", label: "Projects", icon: Users },
  { to: "/mentorship", label: "Mentorship", icon: GraduationCap },
  { to: "/dashboard", label: "Dashboard", icon: User },
];

const NebulaShell = ({ title, bengaliTitle, subtitle, children }: NebulaShellProps) => {
  const { pathname } = useLocation();
  const { user, profile } = useAuth();

  return (
    <div className="nebula-bg">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/40 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <ArrowLeft size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-lg font-bold">
              <span className="text-gradient-gold">Hadi</span>{" "}
              <span className="text-gradient-green">Wishes</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navTabs.map((t) => {
              const active = pathname === t.to;
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-all ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon size={15} /> {t.label}
                </Link>
              );
            })}
          </nav>
          <div className="text-sm text-muted-foreground">
            {user ? profile?.display_name ?? "You" : <Link to="/auth" className="text-primary font-semibold">Sign in</Link>}
          </div>
        </div>
        {/* Mobile tabs */}
        <nav className="md:hidden flex items-center gap-1 px-3 pb-3 overflow-x-auto">
          {navTabs.map((t) => {
            const active = pathname === t.to;
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`px-3 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 shrink-0 ${
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground bg-muted/30"
                }`}
              >
                <Icon size={13} /> {t.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          {bengaliTitle && (
            <p className="bengali-text text-base md:text-lg text-primary/80 mb-1">{bengaliTitle}</p>
          )}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="text-gradient-gold">{title}</span>
          </h1>
          {subtitle && <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-2xl">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
};

export default NebulaShell;

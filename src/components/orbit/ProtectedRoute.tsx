import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPreferences } from "@/lib/preferences";

interface Props {
  children: ReactNode;
  /** When true, redirect authenticated users without completed onboarding to /onboarding. */
  requireOnboarding?: boolean;
}

const ProtectedRoute = ({ children, requireOnboarding = true }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(requireOnboarding);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user || !requireOnboarding) {
        setChecking(false);
        return;
      }
      const prefs = await getPreferences(user.id);
      if (cancelled) return;
      setNeedsOnboarding(!prefs?.onboarding_completed_at);
      setChecking(false);
    })();
    return () => { cancelled = true; };
  }, [user, requireOnboarding]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--surface))" }}>
        <p style={{ color: "hsl(var(--foreground-subtle))" }}>Loading…</p>
      </div>
    );
  }
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  if (needsOnboarding && location.pathname !== "/onboarding") return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;

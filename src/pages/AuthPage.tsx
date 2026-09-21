import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { getPreferences } from "@/lib/preferences";
import { useT } from "@/lib/i18n";
import OrbitGlyph from "@/components/orbit/OrbitGlyph";

interface Props { mode: "signin" | "signup" }
const signupSchema = z.object({ displayName: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name too long"), email: z.string().trim().email("Enter a valid email").max(255), password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password too long") });
const signinSchema = z.object({ email: z.string().trim().email("Enter a valid email").max(255), password: z.string().min(1, "Password is required").max(72) });

const AuthPage = ({ mode }: Props) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/my-learning";
  const { user, loading } = useAuth();
  const t = useT();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    getPreferences(user.id).then((prefs) => navigate(!prefs?.onboarding_completed_at ? "/onboarding" : redirect, { replace: true }));
  }, [user, loading, navigate, redirect]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.safeParse({ displayName, email, password });
        if (!parsed.success) { toast({ title: t("auth.check"), description: parsed.error.issues[0].message, variant: "destructive" }); return; }
        const { error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { emailRedirectTo: `${window.location.origin}/onboarding`, data: { display_name: parsed.data.displayName } } });
        if (error) { toast({ title: t("auth.check"), description: /already registered|already exists/i.test(error.message) ? "An account with that email already exists." : error.message, variant: "destructive" }); return; }
        toast({ title: t("auth.welcome"), description: t("onboarding.subtitle") });
      } else {
        const parsed = signinSchema.safeParse({ email, password });
        if (!parsed.success) { toast({ title: t("auth.check"), description: parsed.error.issues[0].message, variant: "destructive" }); return; }
        const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
        if (error) { toast({ title: t("auth.check"), description: /invalid login/i.test(error.message) ? t("auth.invalid") : error.message, variant: "destructive" }); return; }
        toast({ title: t("auth.welcome") });
      }
    } finally { setSubmitting(false); }
  };

  const inputStyle: React.CSSProperties = { background: "hsl(var(--surface))", border: "1px solid hsl(var(--border-strong))", color: "hsl(var(--foreground))" };
  return <div className="orbit min-h-screen flex items-center justify-center px-6 py-16" style={{ background: "hsl(var(--surface-base))" }}>
    <div className="w-full max-w-[420px]">
      <Link to="/" className="flex items-center justify-center gap-2 mb-8" aria-label="GURUsphere home"><OrbitGlyph size={28} /><span style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: "1.25rem", color: "hsl(var(--foreground))" }}>GURU<span style={{ fontStyle: "italic", color: "hsl(var(--orbit-accent))" }}>sphere</span></span></Link>
      <div className="orbit-card p-8">
        <h1 className="text-[1.5rem] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "hsl(var(--foreground))" }}>{mode === "signup" ? t("auth.signup.title") : t("auth.signin.title")}</h1>
        <p className="text-[14px] mb-6" style={{ color: "hsl(var(--foreground-subtle))" }}>{mode === "signup" ? t("auth.signup.subtitle") : t("auth.signin.subtitle")}</p>
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {mode === "signup" && <div><label htmlFor="name" className="block text-[12px] mb-1.5" style={{ color: "hsl(var(--foreground-muted))" }}>{t("auth.name")}</label><input id="name" type="text" required value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={60} autoComplete="name" className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2" style={inputStyle} /></div>}
          <div><label htmlFor="email" className="block text-[12px] mb-1.5" style={{ color: "hsl(var(--foreground-muted))" }}>{t("auth.email")}</label><input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} maxLength={255} autoComplete="email" className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2" style={inputStyle} /></div>
          <div><label htmlFor="password" className="block text-[12px] mb-1.5" style={{ color: "hsl(var(--foreground-muted))" }}>{t("auth.password")} {mode === "signup" && <span style={{ color: "hsl(var(--foreground-subtle))" }}>(8+ characters)</span>}</label><input id="password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} maxLength={72} autoComplete={mode === "signup" ? "new-password" : "current-password"} className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2" style={inputStyle} /></div>
          <button type="submit" disabled={submitting} className="orbit-btn orbit-btn-primary w-full mt-2" style={{ minHeight: 44 }}>{submitting ? t("auth.wait") : mode === "signup" ? t("auth.create") : t("nav.signin")}</button>
        </form>
        <div className="flex items-center justify-between mt-4 text-[13px]"><Link to={mode === "signup" ? "/login" : "/signup"} style={{ color: "hsl(var(--orbit-primary))" }}>{mode === "signup" ? t("auth.have_account") : t("auth.no_account")}</Link>{mode === "signin" && <Link to="/forgot-password" style={{ color: "hsl(var(--foreground-subtle))" }}>{t("auth.forgot")}</Link>}</div>
      </div>
      <Link to="/" className="block text-center text-[13px] mt-6" style={{ color: "hsl(var(--foreground-subtle))" }}>← Back to home</Link>
    </div>
  </div>;
};
export default AuthPage;

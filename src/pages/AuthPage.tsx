import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { getPreferences } from "@/lib/preferences";
import OrbitGlyph from "@/components/orbit/OrbitGlyph";

interface Props { mode: "signin" | "signup" }

const signupSchema = z.object({
  displayName: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name too long"),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password too long"),
});

const signinSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required").max(72),
});

const AuthPage = ({ mode }: Props) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/my-learning";
  const { user, loading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    // Route to onboarding if not completed, else to redirect target.
    getPreferences(user.id).then((prefs) => {
      if (!prefs?.onboarding_completed_at) navigate("/onboarding", { replace: true });
      else navigate(redirect, { replace: true });
    });
  }, [user, loading, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.safeParse({ displayName, email, password });
        if (!parsed.success) {
          toast({ title: "Please check your details", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: { display_name: parsed.data.displayName },
          },
        });
        if (error) {
          const msg = /already registered|already exists/i.test(error.message)
            ? "An account with that email already exists. Try signing in instead."
            : error.message;
          toast({ title: "Couldn't create account", description: msg, variant: "destructive" });
          return;
        }
        toast({ title: "Welcome to GURUsphere", description: "Let's personalize your learning." });
      } else {
        const parsed = signinSchema.safeParse({ email, password });
        if (!parsed.success) {
          toast({ title: "Please check your details", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) {
          const msg = /invalid login/i.test(error.message)
            ? "That email and password don't match. Try again or reset your password."
            : error.message;
          toast({ title: "Sign-in failed", description: msg, variant: "destructive" });
          return;
        }
        toast({ title: "Welcome back" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    background: "hsl(var(--surface))",
    border: "1px solid hsl(var(--border-strong))",
    color: "hsl(var(--foreground))",
  } as React.CSSProperties;

  return (
    <div className="orbit min-h-screen flex items-center justify-center px-6 py-16" style={{ background: "hsl(var(--surface-base))" }}>
      <div className="w-full max-w-[420px]">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8" aria-label="GURUsphere home">
          <OrbitGlyph size={28} />
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: "1.25rem", color: "hsl(var(--foreground))" }}>
            GURU<span style={{ fontStyle: "italic", color: "hsl(var(--orbit-accent))" }}>sphere</span>
          </span>
        </Link>

        <div className="orbit-card p-8">
          <h1 className="text-[1.5rem] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "hsl(var(--foreground))" }}>
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-[14px] mb-6" style={{ color: "hsl(var(--foreground-subtle))" }}>
            {mode === "signup" ? "Free to join. Learn at your own pace." : "Sign in to continue learning."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="block text-[12px] mb-1.5" style={{ color: "hsl(var(--foreground-muted))" }}>Your name</label>
                <input id="name" type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={60} autoComplete="name"
                  className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2" style={{ ...inputStyle, boxShadow: "none" }} />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-[12px] mb-1.5" style={{ color: "hsl(var(--foreground-muted))" }}>Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2" style={inputStyle} />
            </div>
            <div>
              <label htmlFor="password" className="block text-[12px] mb-1.5" style={{ color: "hsl(var(--foreground-muted))" }}>
                Password {mode === "signup" && <span style={{ color: "hsl(var(--foreground-subtle))" }}>(8+ characters)</span>}
              </label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} maxLength={72}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2" style={inputStyle} />
            </div>

            <button type="submit" disabled={submitting} className="orbit-btn orbit-btn-primary w-full mt-2" style={{ minHeight: 44 }}>
              {submitting ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="flex items-center justify-between mt-4 text-[13px]">
            <Link to={mode === "signup" ? "/login" : "/signup"} style={{ color: "hsl(var(--orbit-primary))" }}>
              {mode === "signup" ? "Have an account? Sign in" : "New here? Create one"}
            </Link>
            {mode === "signin" && (
              <Link to="/forgot-password" style={{ color: "hsl(var(--foreground-subtle))" }}>Forgot password?</Link>
            )}
          </div>
        </div>

        <Link to="/" className="block text-center text-[13px] mt-6" style={{ color: "hsl(var(--foreground-subtle))" }}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default AuthPage;

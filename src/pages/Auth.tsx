import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import MemorialBadge from "@/components/MemorialBadge";

const signupSchema = z.object({
  displayName: z.string().trim().min(2, "Name must be at least 2 characters").max(40, "Name too long"),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const signinSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(1, "Password required").max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.safeParse({ displayName, email, password });
        if (!parsed.success) {
          toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: parsed.data.displayName },
          },
        });
        if (error) {
          toast({ title: "Couldn't create account", description: error.message, variant: "destructive" });
          return;
        }
        toast({ title: "Welcome to Hadi Wishes 🤍", description: "You're signed in." });
        navigate("/", { replace: true });
      } else {
        const parsed = signinSchema.safeParse({ email, password });
        if (!parsed.success) {
          toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) {
          toast({ title: "Sign-in failed", description: error.message, variant: "destructive" });
          return;
        }
        toast({ title: "Welcome back 🤍" });
        navigate("/", { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center section-padding py-20">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-2xl font-bold text-gradient-gold">Hadi</span>
          <span className="text-2xl font-bold text-gradient-green">Wishes</span>
        </Link>

        <div className="glass-card rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <MemorialBadge variant="light" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "hsl(var(--primary-foreground))" }}>
            {mode === "signup" ? "Join Hadi Wishes" : "Welcome back"}
          </h1>
          <p className="text-sm text-center mb-6" style={{ color: "hsl(162 30% 65%)" }}>
            {mode === "signup"
              ? "Save your favorite wishes & honor his memory."
              : "Sign in to continue your journey."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                maxLength={40}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pathshala-gold/50"
                style={{ color: "hsl(var(--primary-foreground))" }}
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              maxLength={255}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pathshala-gold/50"
              style={{ color: "hsl(var(--primary-foreground))" }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (6+ chars)"
              maxLength={72}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pathshala-gold/50"
              style={{ color: "hsl(var(--primary-foreground))" }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.97] disabled:opacity-60"
              style={{ background: "hsl(var(--pathshala-gold))", color: "hsl(var(--pathshala-deep))" }}
            >
              {submitting ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="w-full mt-4 text-sm text-center py-2"
            style={{ color: "hsl(162 30% 65%)" }}
          >
            {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
        </div>

        <Link to="/" className="block text-center text-sm mt-6" style={{ color: "hsl(162 20% 50%)" }}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default Auth;

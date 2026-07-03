import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import OrbitGlyph from "@/components/orbit/OrbitGlyph";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase will process the recovery token from URL hash automatically.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // Fallback: also check current session in case event already fired.
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't update password", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Password updated", description: "You're now signed in." });
    navigate("/my-learning", { replace: true });
  };

  return (
    <div className="orbit min-h-screen flex items-center justify-center px-6 py-16" style={{ background: "hsl(var(--surface-base))" }}>
      <div className="w-full max-w-[420px]">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <OrbitGlyph size={28} />
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: "1.25rem", color: "hsl(var(--foreground))" }}>
            GURU<span style={{ fontStyle: "italic", color: "hsl(var(--orbit-accent))" }}>sphere</span>
          </span>
        </Link>
        <div className="orbit-card p-8">
          <h1 className="text-[1.5rem] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "hsl(var(--foreground))" }}>Set a new password</h1>
          <p className="text-[14px] mb-6" style={{ color: "hsl(var(--foreground-subtle))" }}>
            {ready ? "Choose a new password for your account." : "Verifying reset link…"}
          </p>
          {ready && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password (8+ chars)" maxLength={72}
                autoComplete="new-password"
                className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2"
                style={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border-strong))", color: "hsl(var(--foreground))" }} />
              <button type="submit" disabled={submitting} className="orbit-btn orbit-btn-primary w-full" style={{ minHeight: 44 }}>
                {submitting ? "Saving…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

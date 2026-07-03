import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import OrbitGlyph from "@/components/orbit/OrbitGlyph";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't send reset link", description: error.message, variant: "destructive" });
      return;
    }
    setSent(true);
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
          <h1 className="text-[1.5rem] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "hsl(var(--foreground))" }}>Reset your password</h1>
          <p className="text-[14px] mb-6" style={{ color: "hsl(var(--foreground-subtle))" }}>
            {sent ? "Check your inbox for a reset link." : "Enter your email and we'll send you a reset link."}
          </p>
          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" maxLength={255}
                className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2"
                style={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border-strong))", color: "hsl(var(--foreground))" }} />
              <button type="submit" disabled={submitting} className="orbit-btn orbit-btn-primary w-full" style={{ minHeight: 44 }}>
                {submitting ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}
          <Link to="/login" className="block text-center text-[13px] mt-4" style={{ color: "hsl(var(--foreground-subtle))" }}>
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import OrbitNavbar from "@/components/orbit/OrbitNavbar";
import OrbitFooter from "@/components/orbit/OrbitFooter";
import { getMyApplication, isEducator, submitApplication, type EducatorApplication } from "@/lib/educator";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

const StatusBadge = ({ status }: { status: EducatorApplication["status"] }) => {
  const map = {
    pending: { icon: Clock, label: "Under review", color: "hsl(var(--orbit-accent))" },
    approved: { icon: CheckCircle2, label: "Approved", color: "hsl(160 70% 45%)" },
    rejected: { icon: XCircle, label: "Rejected", color: "hsl(0 70% 55%)" },
    changes_requested: { icon: AlertCircle, label: "Changes requested", color: "hsl(35 90% 55%)" },
  }[status];
  const Icon = map.icon;
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[13px]"
      style={{ background: "hsl(var(--surface-raised))", color: map.color, border: `1px solid ${map.color}` }}>
      <Icon size={14} /> {map.label}
    </span>
  );
};

const TeachApply = () => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [existing, setExisting] = useState<EducatorApplication | null>(null);
  const [alreadyEducator, setAlreadyEducator] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    headline: "",
    expertise: "",
    credentials: "",
    sample_work_url: "",
    linkedin_url: "",
    motivation: "",
    languages: "en",
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [app, edu] = await Promise.all([getMyApplication(user.id), isEducator(user.id)]);
      setExisting(app);
      setAlreadyEducator(edu);
      if (app) {
        setForm({
          full_name: app.full_name,
          headline: app.headline,
          expertise: app.expertise.join(", "),
          credentials: app.credentials,
          sample_work_url: app.sample_work_url ?? "",
          linkedin_url: app.linkedin_url ?? "",
          motivation: app.motivation,
          languages: app.languages.join(", ") || "en",
        });
      }
    })();
  }, [user]);

  if (loading) return null;
  if (!user) {
    nav("/login?redirect=/teach/apply");
    return null;
  }

  const editable = !existing || existing.status === "changes_requested" || existing.status === "rejected";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await submitApplication(user.id, {
        full_name: form.full_name.trim(),
        headline: form.headline.trim(),
        expertise: form.expertise.split(",").map((s) => s.trim()).filter(Boolean),
        credentials: form.credentials.trim(),
        sample_work_url: form.sample_work_url.trim() || null,
        linkedin_url: form.linkedin_url.trim() || null,
        motivation: form.motivation.trim(),
        languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
      });
      toast({ title: "Application submitted", description: "We'll review your application shortly." });
      const app = await getMyApplication(user.id);
      setExisting(app);
    } catch (err: any) {
      toast({ title: "Could not submit", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full px-4 py-3 rounded-lg text-[14px] outline-none";
  const inputStyle = { background: "hsl(var(--surface-raised))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" };

  return (
    <div className="orbit min-h-screen flex flex-col">
      <OrbitNavbar />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-[720px] mx-auto">
          <div className="orbit-eyebrow mb-2">Teach on GURUsphere</div>
          <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] mb-3" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>
            Become an educator
          </h1>
          <p className="mb-8 text-[15px]" style={{ color: "hsl(var(--foreground-muted))" }}>
            Tell us about you and what you'd like to teach. We review each application to keep the catalog high quality.
          </p>

          {alreadyEducator && (
            <div className="orbit-card p-5 mb-6 flex items-center justify-between">
              <span className="text-[14px]" style={{ color: "hsl(var(--foreground))" }}>You're an approved educator.</span>
              <Link to="/educator" className="orbit-btn orbit-btn-primary">Open workspace</Link>
            </div>
          )}

          {existing && (
            <div className="orbit-card p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px]" style={{ color: "hsl(var(--foreground-subtle))" }}>Current status</span>
                <StatusBadge status={existing.status} />
              </div>
              {existing.reviewer_notes && (
                <p className="mt-3 text-[13px]" style={{ color: "hsl(var(--foreground-muted))" }}>
                  <strong>Reviewer note:</strong> {existing.reviewer_notes}
                </p>
              )}
              {!editable && !alreadyEducator && (
                <p className="mt-3 text-[13px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
                  We'll notify you when the review is complete.
                </p>
              )}
            </div>
          )}

          {editable && (
            <form onSubmit={submit} className="orbit-card p-6 md:p-8 space-y-4">
              <div>
                <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Full name</label>
                <input required className={input} style={inputStyle} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Professional headline</label>
                <input required maxLength={120} placeholder="e.g. Senior software engineer at ..." className={input} style={inputStyle} value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
              </div>
              <div>
                <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Areas of expertise (comma-separated)</label>
                <input required placeholder="e.g. React, English writing, Small business" className={input} style={inputStyle} value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
              </div>
              <div>
                <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Credentials & experience</label>
                <textarea required rows={3} className={input} style={inputStyle} value={form.credentials} onChange={(e) => setForm({ ...form, credentials: e.target.value })} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Sample work URL</label>
                  <input type="url" placeholder="https://" className={input} style={inputStyle} value={form.sample_work_url} onChange={(e) => setForm({ ...form, sample_work_url: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>LinkedIn URL</label>
                  <input type="url" placeholder="https://linkedin.com/in/…" className={input} style={inputStyle} value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Teaching languages (comma-separated)</label>
                <input required className={input} style={inputStyle} value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} />
              </div>
              <div>
                <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Why do you want to teach here?</label>
                <textarea required rows={4} className={input} style={inputStyle} value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} />
              </div>
              <button type="submit" disabled={busy} className="orbit-btn orbit-btn-primary w-full">
                {busy ? "Submitting…" : existing ? "Resubmit application" : "Submit application"}
              </button>
            </form>
          )}
        </div>
      </main>
      <OrbitFooter />
    </div>
  );
};

export default TeachApply;

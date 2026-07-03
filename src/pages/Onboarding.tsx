import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { completeOnboarding, getPreferences, savePreferences } from "@/lib/preferences";
import { fetchSubjects, type SubjectRow } from "@/lib/learning";
import { setLocale } from "@/lib/i18n";
import { toast } from "@/hooks/use-toast";
import OrbitGlyph from "@/components/orbit/OrbitGlyph";

const styles = [
  { id: "short", label: "Short daily lessons" },
  { id: "structured", label: "Structured courses" },
  { id: "project", label: "Practical projects" },
  { id: "exam", label: "Exam preparation" },
  { id: "career", label: "Career-focused" },
  { id: "explore", label: "Explore freely" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [goal, setGoal] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced" | "unsure">("beginner");
  const [style, setStyle] = useState<string>("structured");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [minutes, setMinutes] = useState<number>(60);
  const [career, setCareer] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/login?redirect=/onboarding", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchSubjects().then(setSubjects).catch(() => setSubjects([]));
  }, []);

  useEffect(() => {
    if (!user) return;
    getPreferences(user.id).then((prefs) => {
      if (!prefs) return;
      if (prefs.onboarding_completed_at) navigate("/my-learning", { replace: true });
      if (prefs.primary_goal) setGoal(prefs.primary_goal);
      if (prefs.interests?.length) setInterests(prefs.interests);
      if (prefs.experience_level) setLevel(prefs.experience_level);
      if (prefs.preferred_language) setLanguage(prefs.preferred_language);
      if (prefs.learning_style) setStyle(prefs.learning_style);
      if (prefs.weekly_minutes) setMinutes(prefs.weekly_minutes);
      if (prefs.career_objective) setCareer(prefs.career_objective);
    });
  }, [user, navigate]);

  const totalSteps = 5;
  const progress = useMemo(() => Math.round((step / totalSteps) * 100), [step]);

  const toggleInterest = (slug: string) => {
    setInterests((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  };

  const persist = async (finish: boolean) => {
    if (!user) return;
    setSaving(true);
    try {
      const patch = {
        primary_goal: goal || null,
        interests,
        experience_level: level,
        preferred_language: language,
        learning_style: style,
        weekly_minutes: minutes,
        career_objective: career || null,
      };
      if (finish) {
        await completeOnboarding(user.id, patch);
        setLocale(language);
        toast({ title: "You're all set", description: "Recommendations updated." });
        navigate("/my-learning", { replace: true });
      } else {
        await savePreferences(user.id, patch);
      }
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message ?? String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const skip = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await completeOnboarding(user.id, {
        primary_goal: goal || null,
        interests,
        experience_level: level,
        preferred_language: language,
        learning_style: style,
        weekly_minutes: minutes,
      });
      navigate("/my-learning", { replace: true });
    } finally { setSaving(false); }
  };

  const canNext =
    (step === 1) ||
    (step === 2 && interests.length > 0) ||
    step === 3 || step === 4 || step === 5;

  const inputStyle: React.CSSProperties = {
    background: "hsl(var(--surface))",
    border: "1px solid hsl(var(--border-strong))",
    color: "hsl(var(--foreground))",
  };

  return (
    <div className="orbit min-h-screen py-16 px-6" style={{ background: "hsl(var(--surface-base))" }}>
      <div className="max-w-[640px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <OrbitGlyph size={22} />
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "hsl(var(--foreground))" }}>GURUsphere</span>
          </div>
          <button onClick={skip} disabled={saving} className="orbit-btn orbit-btn-ghost text-[13px]" style={{ minHeight: 32, padding: "0 0.75rem" }}>
            Skip for now
          </button>
        </div>

        <div className="h-1 rounded-full mb-8" style={{ background: "hsl(var(--border))" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "hsl(var(--orbit-primary))" }} />
        </div>

        <div className="orbit-card p-8">
          <div className="orbit-eyebrow mb-3">Step {step} of {totalSteps}</div>

          {step === 1 && (
            <>
              <h1 className="text-[1.75rem] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "hsl(var(--foreground))" }}>
                What do you want to learn or become?
              </h1>
              <p className="text-[14px] mb-6" style={{ color: "hsl(var(--foreground-subtle))" }}>
                One sentence is enough. We'll refine as we go.
              </p>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                maxLength={240}
                rows={3}
                placeholder="e.g. Get IELTS 7.5, land a freelance client, become a web developer…"
                className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 resize-none"
                style={inputStyle}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-[1.75rem] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "hsl(var(--foreground))" }}>
                Which subjects interest you?
              </h1>
              <p className="text-[14px] mb-6" style={{ color: "hsl(var(--foreground-subtle))" }}>Pick as many as you like.</p>
              <div className="flex flex-wrap gap-2">
                {subjects.map((s) => {
                  const active = interests.includes(s.slug);
                  return (
                    <button key={s.id} type="button" onClick={() => toggleInterest(s.slug)}
                      className="orbit-btn text-[14px]"
                      style={{
                        background: active ? "hsl(var(--orbit-primary))" : "hsl(var(--surface))",
                        color: active ? "hsl(var(--orbit-on-primary))" : "hsl(var(--foreground))",
                        border: `1px solid ${active ? "hsl(var(--orbit-primary))" : "hsl(var(--border-strong))"}`,
                        minHeight: 40,
                      }}>
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-[1.75rem] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "hsl(var(--foreground))" }}>
                Where are you starting?
              </h1>
              <p className="text-[14px] mb-6" style={{ color: "hsl(var(--foreground-subtle))" }}>Be honest — we'll match courses to fit.</p>
              <div className="grid grid-cols-2 gap-2">
                {(["beginner","intermediate","advanced","unsure"] as const).map((l) => {
                  const active = level === l;
                  return (
                    <button key={l} onClick={() => setLevel(l)} className="orbit-btn text-[14px]"
                      style={{
                        background: active ? "hsl(var(--orbit-primary))" : "hsl(var(--surface))",
                        color: active ? "hsl(var(--orbit-on-primary))" : "hsl(var(--foreground))",
                        border: `1px solid ${active ? "hsl(var(--orbit-primary))" : "hsl(var(--border-strong))"}`,
                        minHeight: 48, textTransform: "capitalize",
                      }}>
                      {l === "unsure" ? "Not sure" : l}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="text-[1.75rem] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "hsl(var(--foreground))" }}>
                How do you like to learn?
              </h1>
              <p className="text-[14px] mb-6" style={{ color: "hsl(var(--foreground-subtle))" }}>Pick the option that fits you best today.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {styles.map((s) => {
                  const active = style === s.id;
                  return (
                    <button key={s.id} onClick={() => setStyle(s.id)} className="orbit-btn text-[14px] text-left justify-start"
                      style={{
                        background: active ? "hsl(var(--orbit-primary))" : "hsl(var(--surface))",
                        color: active ? "hsl(var(--orbit-on-primary))" : "hsl(var(--foreground))",
                        border: `1px solid ${active ? "hsl(var(--orbit-primary))" : "hsl(var(--border-strong))"}`,
                        minHeight: 48, padding: "0 1rem",
                      }}>
                      {s.label}
                    </button>
                  );
                })}
              </div>
              <div>
                <label className="block text-[12px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>
                  Time per week: <strong>{minutes} minutes</strong>
                </label>
                <input type="range" min={15} max={600} step={15} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}
                  className="w-full" aria-label="Weekly minutes" />
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h1 className="text-[1.75rem] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "hsl(var(--foreground))" }}>
                Preferred language & goal
              </h1>
              <p className="text-[14px] mb-6" style={{ color: "hsl(var(--foreground-subtle))" }}>You can change these anytime.</p>
              <label className="block text-[12px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Interface language</label>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {(["en", "bn"] as const).map((l) => {
                  const active = language === l;
                  return (
                    <button key={l} onClick={() => setLanguage(l)} className="orbit-btn text-[14px]"
                      style={{
                        background: active ? "hsl(var(--orbit-primary))" : "hsl(var(--surface))",
                        color: active ? "hsl(var(--orbit-on-primary))" : "hsl(var(--foreground))",
                        border: `1px solid ${active ? "hsl(var(--orbit-primary))" : "hsl(var(--border-strong))"}`,
                        minHeight: 48,
                      }}>
                      {l === "en" ? "English" : "বাংলা"}
                    </button>
                  );
                })}
              </div>
              <label className="block text-[12px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>
                Career or personal objective (optional)
              </label>
              <input value={career} onChange={(e) => setCareer(e.target.value)} maxLength={240}
                placeholder="e.g. Land my first freelance client in 3 months"
                className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2" style={inputStyle} />
            </>
          )}

          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid hsl(var(--border))" }}>
            <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1 || saving}
              className="orbit-btn orbit-btn-ghost" style={{ minHeight: 40 }}>Back</button>
            {step < totalSteps ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={!canNext || saving} className="orbit-btn orbit-btn-primary" style={{ minHeight: 40 }}>
                Next
              </button>
            ) : (
              <button onClick={() => persist(true)} disabled={saving} className="orbit-btn orbit-btn-primary" style={{ minHeight: 40 }}>
                {saving ? "Saving…" : "Finish and explore"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

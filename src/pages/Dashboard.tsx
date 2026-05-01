import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen, Users, GraduationCap, Heart, Sparkles, FileText,
  Flame, Zap, Trophy, Award, TrendingUp, Calendar, ExternalLink,
  Target, Clock, Plus, CheckCircle2, Gift,
} from "lucide-react";
import NebulaShell from "@/components/NebulaShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  ExamAttempt, CertificateRecord,
  getAttempts, getCertificates, computeStreak, totalRankedXp, activityHeatmap,
} from "@/lib/learnerHistory";
import {
  evaluateWeekly, claimMission, getCurrentWeekKey, daysLeftInWeek,
  getMissionBonusXp, type EvaluatedMission,
} from "@/lib/missions";
import {
  getProgress, tickMinutes, markLessonDone, markCompletedAwarded,
  summary as courseSummary, formatMinutes, type CourseProgress,
} from "@/lib/courseProgress";

interface SavedWish {
  id: string;
  wish_key: string;
  wish_type: string;
  wish_title: string;
  wish_url: string | null;
  created_at: string;
}

interface Counts {
  research: number;
  projects: number;
  mentorRequestsIn: number;
  mentorRequestsOut: number;
  notes: number;
  submissions: number;
  isMentor: boolean;
}

const themeSwatch: Record<CertificateRecord["theme"], string> = {
  gold: "#C8A24B",
  green: "#2EA88A",
  blue: "#3D7DD8",
};

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [bio, setBio] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const [enrolled, setEnrolled] = useState<SavedWish[]>([]);

  // Local learner history (per-browser)
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [certs, setCerts] = useState<CertificateRecord[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    setAttempts(getAttempts());
    setCerts(getCertificates());
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [r, p, mIn, mOut, n, s, mp, sw] = await Promise.all([
        supabase.from("research_topics").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("team_projects").select("id", { count: "exact", head: true }).eq("owner_id", user.id),
        supabase.from("mentorship_requests").select("id", { count: "exact", head: true }).eq("mentor_id", user.id),
        supabase.from("mentorship_requests").select("id", { count: "exact", head: true }).eq("student_id", user.id),
        supabase.from("memorial_notes").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("resource_submissions").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("mentor_profiles").select("id", { head: true, count: "exact" }).eq("user_id", user.id),
        supabase.from("saved_wishes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(12),
      ]);
      setCounts({
        research: r.count ?? 0,
        projects: p.count ?? 0,
        mentorRequestsIn: mIn.count ?? 0,
        mentorRequestsOut: mOut.count ?? 0,
        notes: n.count ?? 0,
        submissions: s.count ?? 0,
        isMentor: (mp.count ?? 0) > 0,
      });
      setEnrolled((sw.data as SavedWish[] | null) ?? []);

      const { data: prof } = await supabase.from("profiles").select("bio").eq("id", user.id).maybeSingle();
      setBio(prof?.bio ?? "");
    })();
  }, [user]);

  const saveBio = async () => {
    if (!user) return;
    setSavingBio(true);
    const { error } = await supabase.from("profiles").update({ bio: bio.slice(0, 400) }).eq("id", user.id);
    setSavingBio(false);
    if (error) toast.error(error.message);
    else toast.success("Bio updated");
  };

  /* ── Mission claim refresh tick ── */
  const [missionTick, setMissionTick] = useState(0);
  const bumpMissions = () => setMissionTick((n) => n + 1);

  /* ── Per-course progress (local) ── */
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({});
  const refreshProgress = (keys: string[]) => {
    const next: Record<string, CourseProgress> = {};
    keys.forEach((k) => { next[k] = getProgress(k); });
    setProgressMap(next);
  };
  useEffect(() => {
    refreshProgress(enrolled.map((e) => e.wish_key));
  }, [enrolled]);

  /* ── Derived: XP, streak, ranking history ── */
  const examXp = useMemo(() => totalRankedXp(attempts), [attempts]);
  const contributionXp =
    (counts?.research ?? 0) * 20 +
    (counts?.projects ?? 0) * 30 +
    (counts?.notes ?? 0) * 5 +
    (counts?.submissions ?? 0) * 15;
  const missionXp = useMemo(() => getMissionBonusXp(), [missionTick]);
  const totalXp = examXp + contributionXp + missionXp;
  const level = Math.floor(totalXp / 100) + 1;
  const streak = useMemo(() => computeStreak(attempts), [attempts]);
  const heatmap = useMemo(() => activityHeatmap(28, attempts), [attempts]);

  /* ── Course progress roll-up ── */
  const courseStats = useMemo(
    () => courseSummary(enrolled.map((e) => e.wish_key)),
    [enrolled, progressMap],
  );

  /* ── Weekly missions ── */
  const weekKey = getCurrentWeekKey();
  const evaluatedMissions: EvaluatedMission[] = useMemo(() => {
    return evaluateWeekly({
      attempts,
      certs,
      enrolledCount: enrolled.length,
      contributions: {
        research: counts?.research ?? 0,
        projects: counts?.projects ?? 0,
        notes: counts?.notes ?? 0,
        submissions: counts?.submissions ?? 0,
      },
      weekStart: (() => { const d = new Date(); d.setUTCHours(0,0,0,0); const day=(d.getUTCDay()+6)%7; d.setUTCDate(d.getUTCDate()-day); return d; })(),
    }, weekKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempts, certs, enrolled.length, counts, weekKey, missionTick]);

  const handleClaim = (m: EvaluatedMission) => {
    if (!m.completed || m.claimed) return;
    claimMission(m.template.id, m.template.xp, weekKey);
    bumpMissions();
    toast.success(`+${m.template.xp} XP claimed — ${m.template.title}`);
  };

  const handleLessonDone = (key: string) => {
    const next = markLessonDone(key);
    setProgressMap((p) => ({ ...p, [key]: next }));
    if (next.lessonsDone >= next.lessonsTotal && !next.completedAwarded) {
      markCompletedAwarded(key);
      // award one-time +25 XP via mission store under a synthetic key
      claimMission(`course-complete-${key}`, 25, weekKey);
      bumpMissions();
      toast.success("Course complete! +25 XP awarded 🎉");
    } else {
      toast.success("Lesson logged");
    }
  };
  const handleAddMinutes = (key: string, mins: number) => {
    const next = tickMinutes(key, mins);
    setProgressMap((p) => ({ ...p, [key]: next }));
    toast.success(`+${mins} min logged`);
  };
  const handleOpenCourse = (key: string) => {
    const next = tickMinutes(key, 5);
    setProgressMap((p) => ({ ...p, [key]: next }));
  };

  const rankedHistory = useMemo(() => {
    const ranked = attempts.filter((a) => !a.practice);
    let cum = 0;
    return ranked.map((a) => {
      cum += a.xp;
      return { ...a, cumulativeXp: cum };
    });
  }, [attempts]);

  const recentCerts = useMemo(
    () => [...certs].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 6),
    [certs],
  );
  const recentRanked = useMemo(
    () => [...rankedHistory].slice(-8).reverse(),
    [rankedHistory],
  );

  if (authLoading || !user) {
    return <NebulaShell title="Dashboard"><p className="text-muted-foreground">Loading…</p></NebulaShell>;
  }

  const stats = counts ? [
    { label: "Research published", value: counts.research, icon: BookOpen, link: "/research-archive" },
    { label: "Projects launched", value: counts.projects, icon: Users, link: "/team-projects" },
    { label: "Mentor requests received", value: counts.mentorRequestsIn, icon: GraduationCap, link: "/mentorship" },
    { label: "Mentor requests sent", value: counts.mentorRequestsOut, icon: Sparkles, link: "/mentorship" },
    { label: "Memorial notes", value: counts.notes, icon: Heart, link: "/#memorial" },
    { label: "Resources shared", value: counts.submissions, icon: FileText, link: "/#submit" },
  ] : [];

  const maxHeat = Math.max(1, ...heatmap.map((d) => d.count));

  return (
    <NebulaShell
      title={`Hello, ${profile?.display_name ?? "Friend"}`}
      bengaliTitle="তোমার যাত্রা"
      subtitle="Your courses, XP, certificates & ranking — all in one place."
    >
      {/* ── Top row: Level / Streak / XP ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="nebula-card p-6 md:col-span-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Level</div>
          <div className="text-5xl font-bold text-gradient-gold">{level}</div>
          <div className="text-sm text-muted-foreground mt-2">{totalXp.toLocaleString()} XP total</div>
          <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-pathshala-gold-light" style={{ width: `${totalXp % 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{100 - (totalXp % 100)} XP to level {level + 1}</p>
        </div>

        <div className="nebula-card p-6 md:col-span-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-1">
            <Flame size={13} className="text-pathshala-gold" /> Streak
          </div>
          <div className="text-5xl font-bold text-gradient-gold tabular-nums">{streak.current}</div>
          <div className="text-sm text-muted-foreground mt-2">day{streak.current === 1 ? "" : "s"} in a row</div>
          <p className="text-xs text-muted-foreground mt-2">Longest: <span className="text-foreground font-semibold">{streak.longest}</span> days</p>
        </div>

        <div className="nebula-card p-6 md:col-span-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-1">
            <Zap size={13} className="text-pathshala-emerald" /> Ranked XP
          </div>
          <div className="text-5xl font-bold text-gradient-green tabular-nums">{examXp.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground mt-2">From {rankedHistory.length} ranked exam{rankedHistory.length === 1 ? "" : "s"}</div>
          <Link to="/exam-arena" className="text-xs text-primary hover:underline mt-2 inline-block">Take an exam →</Link>
        </div>

        <div className="nebula-card p-6 md:col-span-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3">
            <Calendar size={13} /> Last 28 days
          </div>
          <div className="grid grid-cols-7 gap-1">
            {heatmap.map((d) => {
              const intensity = d.count / maxHeat;
              return (
                <div
                  key={d.date}
                  title={`${d.date} · ${d.count} attempt${d.count === 1 ? "" : "s"}`}
                  className="aspect-square rounded-sm border border-border/30"
                  style={{
                    background: d.count
                      ? `hsl(162 60% ${Math.max(20, 55 - intensity * 30)}% / ${0.35 + intensity * 0.65})`
                      : "hsl(var(--muted) / 0.4)",
                  }}
                />
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            {streak.lastActive ? `Last active ${streak.lastActive}` : "No activity yet — start today!"}
          </p>
        </div>
      </div>

      {/* ── Enrolled courses ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen size={18} className="text-primary" /> My Enrolled Courses
          </h2>
          <Link to="/#wishes" className="text-xs text-primary hover:underline">Browse more →</Link>
        </div>
        {enrolled.length === 0 ? (
          <div className="nebula-card p-6 text-sm text-muted-foreground">
            You haven't enrolled in any courses yet. Visit the homepage and tap “Save”/“Enroll” on any wish to add it here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolled.map((w) => {
              const inner = (
                <>
                  <div className="text-[10px] uppercase tracking-wider text-pathshala-gold mb-2">{w.wish_type}</div>
                  <h3 className="font-semibold leading-snug mb-3 line-clamp-2">{w.wish_title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(w.created_at).toLocaleDateString()}</span>
                    {w.wish_url && <ExternalLink size={13} className="text-primary" />}
                  </div>
                </>
              );
              return w.wish_url ? (
                <a key={w.id} href={w.wish_url} target="_blank" rel="noopener noreferrer"
                  className="nebula-card p-5 hover:scale-[1.02] transition-transform block">
                  {inner}
                </a>
              ) : (
                <div key={w.id} className="nebula-card p-5">{inner}</div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Recent certificates ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award size={18} className="text-pathshala-gold" /> Recent Certificates
          </h2>
          <Link to="/exam-arena" className="text-xs text-primary hover:underline">Earn another →</Link>
        </div>
        {recentCerts.length === 0 ? (
          <div className="nebula-card p-6 text-sm text-muted-foreground">
            No certificates yet. Finish an exam in the Exam Arena and download your themed certificate to see it here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCerts.map((c) => {
              const pct = Math.round((c.score / Math.max(c.total, 1)) * 100);
              return (
                <div key={c.id} className="nebula-card p-5 relative overflow-hidden">
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: themeSwatch[c.theme] }}
                  />
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.theme} theme</div>
                      <h3 className="font-semibold leading-snug">{c.subject}</h3>
                    </div>
                    {c.practice && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pathshala-emerald/15 text-pathshala-emerald">Practice</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">For <span className="text-foreground">{c.name}</span></p>
                  <div className="flex items-baseline gap-3 text-sm">
                    <span className="text-2xl font-bold text-gradient-gold tabular-nums">{pct}%</span>
                    <span className="text-muted-foreground tabular-nums">{c.score}/{c.total}</span>
                    <span className="text-muted-foreground">· {c.rankTitle}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-3">
                    Issued {new Date(c.date).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Ranking history ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp size={18} className="text-pathshala-emerald" /> Ranking History
          </h2>
          <span className="text-xs text-muted-foreground">{rankedHistory.length} ranked attempts</span>
        </div>
        {recentRanked.length === 0 ? (
          <div className="nebula-card p-6 text-sm text-muted-foreground">
            No ranked attempts yet. Practice mode is great to warm up — but only ranked exams build your tier.
          </div>
        ) : (
          <div className="nebula-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                    <th className="text-left px-4 py-3 font-medium">Subject</th>
                    <th className="text-right px-4 py-3 font-medium">Score</th>
                    <th className="text-right px-4 py-3 font-medium">XP</th>
                    <th className="text-right px-4 py-3 font-medium">Total XP</th>
                    <th className="text-left px-4 py-3 font-medium">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRanked.map((a) => (
                    <tr key={a.id} className="border-t border-border/40">
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {new Date(a.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium">{a.categoryLabel}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{a.score}/{a.total}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-pathshala-emerald font-semibold">
                        +{a.xp}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-gradient-gold font-bold">
                        {a.cumulativeXp.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pathshala-gold/15 text-xs text-pathshala-gold">
                          <Trophy size={11} /> {a.rankTitle}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Bio ── */}
      <div className="nebula-card p-6 mb-8">
        <h3 className="font-bold mb-3">Your bio</h3>
        <textarea
          className="nebula-input w-full min-h-[100px] resize-y"
          placeholder="A line or two about you (max 400 chars)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={400}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-muted-foreground">{bio.length}/400</span>
          <button onClick={saveBio} disabled={savingBio} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
            {savingBio ? "Saving…" : "Save bio"}
          </button>
        </div>
        {counts && !counts.isMentor && (
          <Link to="/mentorship" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            ✨ Become a mentor →
          </Link>
        )}
      </div>

      {/* ── Contributions ── */}
      <h2 className="text-xl font-bold mb-4">Your contributions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} to={s.link} className="nebula-card p-5 hover:scale-[1.02] transition-transform">
              <Icon size={20} className="text-primary mb-3" />
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </Link>
          );
        })}
      </div>
    </NebulaShell>
  );
};

export default Dashboard;

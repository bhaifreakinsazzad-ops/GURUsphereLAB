import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Users, GraduationCap, Heart, Sparkles, FileText } from "lucide-react";
import NebulaShell from "@/components/NebulaShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Counts {
  research: number;
  projects: number;
  mentorRequestsIn: number;
  mentorRequestsOut: number;
  notes: number;
  submissions: number;
  isMentor: boolean;
}

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [bio, setBio] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [r, p, mIn, mOut, n, s, mp] = await Promise.all([
        supabase.from("research_topics").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("team_projects").select("id", { count: "exact", head: true }).eq("owner_id", user.id),
        supabase.from("mentorship_requests").select("id", { count: "exact", head: true }).eq("mentor_id", user.id),
        supabase.from("mentorship_requests").select("id", { count: "exact", head: true }).eq("student_id", user.id),
        supabase.from("memorial_notes").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("resource_submissions").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("mentor_profiles").select("id", { head: true, count: "exact" }).eq("user_id", user.id),
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

  if (authLoading || !user) {
    return <NebulaShell title="Dashboard"><p className="text-muted-foreground">Loading…</p></NebulaShell>;
  }

  const xp = (counts?.research ?? 0) * 20 + (counts?.projects ?? 0) * 30 + (counts?.notes ?? 0) * 5 + (counts?.submissions ?? 0) * 15;
  const level = Math.floor(xp / 100) + 1;

  const stats = counts ? [
    { label: "Research published", value: counts.research, icon: BookOpen, link: "/research-archive" },
    { label: "Projects launched", value: counts.projects, icon: Users, link: "/team-projects" },
    { label: "Mentor requests received", value: counts.mentorRequestsIn, icon: GraduationCap, link: "/mentorship" },
    { label: "Mentor requests sent", value: counts.mentorRequestsOut, icon: Sparkles, link: "/mentorship" },
    { label: "Memorial notes", value: counts.notes, icon: Heart, link: "/#memorial" },
    { label: "Resources shared", value: counts.submissions, icon: FileText, link: "/#submit" },
  ] : [];

  return (
    <NebulaShell title={`Hello, ${profile?.display_name ?? "Friend"}`} bengaliTitle="তোমার যাত্রা" subtitle="Your contributions to Hadi's living legacy.">
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="nebula-card p-6 md:col-span-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Level</div>
          <div className="text-5xl font-bold text-gradient-gold">{level}</div>
          <div className="text-sm text-muted-foreground mt-2">{xp} XP earned</div>
          <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-pathshala-gold-light" style={{ width: `${xp % 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{100 - (xp % 100)} XP to level {level + 1}</p>
        </div>

        <div className="nebula-card p-6 md:col-span-2">
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
      </div>

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

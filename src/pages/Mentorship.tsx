import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, X, GraduationCap, MessageCircle } from "lucide-react";
import NebulaShell from "@/components/NebulaShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

interface Mentor {
  id: string;
  user_id: string;
  expertise: string;
  bio: string;
  availability: string;
  contact_method: string | null;
  display_name?: string;
}

const mentorSchema = z.object({
  expertise: z.string().trim().min(3).max(120),
  bio: z.string().trim().min(20).max(600),
  availability: z.string().min(1),
  contact_method: z.string().max(120).optional(),
});

const Mentorship = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ expertise: "", bio: "", availability: "open", contact_method: "" });
  const [requestingFor, setRequestingFor] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    const { data: mentorRows, error } = await supabase
      .from("mentor_profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast.error(error.message); setLoading(false); return; }

    const userIds = (mentorRows ?? []).map((m) => m.user_id);
    let nameMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profs } = await supabase.from("profiles").select("id, display_name").in("id", userIds);
      nameMap = Object.fromEntries((profs ?? []).map((p) => [p.id, p.display_name]));
    }
    setMentors((mentorRows ?? []).map((m) => ({ ...m, display_name: nameMap[m.user_id] ?? "Mentor" })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submitMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Sign in first"); return; }
    const parsed = mentorSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    const { error } = await supabase.from("mentor_profiles").upsert({
      user_id: user.id,
      expertise: parsed.data.expertise,
      bio: parsed.data.bio,
      availability: parsed.data.availability,
      contact_method: parsed.data.contact_method || null,
    }, { onConflict: "user_id" });
    if (error) { toast.error(error.message); return; }
    toast.success("You're now listed as a mentor 🌟");
    setForm({ expertise: "", bio: "", availability: "open", contact_method: "" });
    setShowForm(false);
    load();
  };

  const sendRequest = async (mentorUserId: string) => {
    if (!user) { toast.error("Sign in first"); return; }
    if (mentorUserId === user.id) { toast.error("You can't request yourself"); return; }
    if (message.trim().length < 10) { toast.error("Write at least 10 characters"); return; }
    const { error } = await supabase.from("mentorship_requests").insert({
      student_id: user.id, mentor_id: mentorUserId, message: message.trim(),
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Request sent 💌");
    setRequestingFor(null);
    setMessage("");
  };

  return (
    <NebulaShell
      title="Mentorship Board"
      bengaliTitle="মেন্টরশিপ বোর্ড"
      subtitle="Find a guide. Be a guide. Hadi believed every learner deserves someone who's been a step ahead."
    >
      <div className="flex justify-end mb-5">
        <button
          onClick={() => user ? setShowForm((s) => !s) : toast.error("Sign in to become a mentor")}
          className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Close" : "Become a Mentor"}
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submitMentor} className="nebula-card p-5 mb-6 space-y-3">
          <input className="nebula-input w-full" placeholder="Expertise (e.g. CS @ MIT, ML, GMAT)" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} maxLength={120} />
          <textarea className="nebula-input w-full min-h-[100px]" placeholder="Brief bio — what can you guide students on?" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={600} />
          <div className="grid md:grid-cols-2 gap-3">
            <select className="nebula-input" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
              <option value="open">Open to requests</option>
              <option value="limited">Limited slots</option>
              <option value="closed">Currently closed</option>
            </select>
            <input className="nebula-input" placeholder="Preferred contact (email/handle)" value={form.contact_method} onChange={(e) => setForm({ ...form, contact_method: e.target.value })} maxLength={120} />
          </div>
          <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold">Publish Profile</button>
        </motion.form>
      )}

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading…</div>
      ) : mentors.length === 0 ? (
        <div className="text-center py-20 nebula-card">
          <p className="text-muted-foreground mb-3">No mentors yet. Be the first.</p>
          {!user && <Link to="/auth" className="text-primary font-semibold">Sign in →</Link>}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentors.map((m) => {
            const open = m.availability === "open";
            return (
              <div key={m.id} className="nebula-card p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="size-10 rounded-full bg-primary/15 inline-flex items-center justify-center text-primary">
                    <GraduationCap size={18} />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${open ? "bg-pathshala-green/15 text-pathshala-green-light" : "bg-muted text-muted-foreground"}`}>
                    {m.availability}
                  </span>
                </div>
                <h3 className="font-bold text-base">{m.display_name}</h3>
                <p className="text-xs text-primary/80 font-semibold mb-2">{m.expertise}</p>
                <p className="text-sm text-muted-foreground flex-1">{m.bio}</p>

                {requestingFor === m.user_id ? (
                  <div className="mt-3 space-y-2">
                    <textarea className="nebula-input w-full text-sm" placeholder="Tell them why you'd like guidance…" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={600} rows={3} />
                    <div className="flex gap-2">
                      <button onClick={() => sendRequest(m.user_id)} className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-semibold">Send</button>
                      <button onClick={() => { setRequestingFor(null); setMessage(""); }} className="px-3 bg-muted rounded-lg text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => user ? setRequestingFor(m.user_id) : toast.error("Sign in to request mentorship")}
                    disabled={!open}
                    className="mt-3 inline-flex items-center justify-center gap-2 bg-primary/15 text-primary py-2 rounded-lg text-sm font-semibold hover:bg-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <MessageCircle size={14} /> Request guidance
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </NebulaShell>
  );
};

export default Mentorship;

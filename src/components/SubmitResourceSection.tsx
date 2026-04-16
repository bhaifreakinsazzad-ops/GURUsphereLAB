import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { ExternalLink, Send, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface SubmissionRow {
  id: string;
  user_id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  created_at: string;
  display_name: string;
}

const submissionSchema = z.object({
  title: z.string().trim().min(2).max(120),
  url: z.string().trim().url("Must be a valid URL").max(500),
  category: z.string().trim().min(2).max(50),
  description: z.string().trim().min(10, "At least 10 characters").max(500),
});

const CATEGORIES = ["Course", "Research", "Tool", "Book", "Tutorial", "Scholarship", "Other"];

const SubmitResourceSection = () => {
  const { user, profile } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", category: "Course", description: "" });

  const fetchSubs = async () => {
    const { data: rows } = await supabase
      .from("resource_submissions")
      .select("id, user_id, title, url, category, description, created_at")
      .order("created_at", { ascending: false })
      .limit(12);
    if (!rows) return;
    const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);
    const nameMap = new Map(profiles?.map((p) => [p.id, p.display_name]) ?? []);
    setSubmissions(rows.map((r) => ({ ...r, display_name: nameMap.get(r.user_id) ?? "Friend" })));
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = submissionSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check the form", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("resource_submissions").insert([{
      user_id: user.id,
      ...parsed.data,
    }]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't submit", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Thank you 🤍", description: "Your suggestion is now visible to everyone." });
    setForm({ title: "", url: "", category: "Course", description: "" });
    setOpen(false);
    fetchSubs();
  };

  return (
    <section id="submit" className="py-24 md:py-32 section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, hsl(var(--pathshala-green) / 0.1) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3">
              Community Submissions
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Found something free?{" "}
              <span className="text-gradient-green">Share the wish.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
              You discovered a free course, research portal, or expensive tool that's actually free?
              Drop the link — we'll add it for everyone.
            </p>

            <div className="mt-6">
              {user ? (
                <button
                  onClick={() => setOpen(!open)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pathshala-gold text-pathshala-deep text-sm font-semibold active:scale-[0.97]"
                >
                  <Sparkles size={16} />
                  {open ? "Cancel" : "Suggest a resource"}
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pathshala-gold text-pathshala-deep text-sm font-semibold active:scale-[0.97]"
                >
                  Sign in to submit
                </Link>
              )}
            </div>
          </div>
        </ScrollReveal>

        <AnimatePresence>
          {open && user && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="feature-card mb-10 space-y-3 overflow-hidden"
            >
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title (e.g. Coursera financial aid)"
                maxLength={120}
                className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-pathshala-gold/50"
              />
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..."
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-pathshala-gold/50"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-pathshala-gold/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Why is this valuable? What's normally paid? (10–500 chars)"
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-pathshala-gold/50 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Posting as <span className="text-foreground font-medium">{profile?.display_name ?? "you"}</span>
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-pathshala-green text-primary-foreground text-sm font-semibold disabled:opacity-50 active:scale-[0.97] inline-flex items-center gap-2"
                >
                  <Send size={14} />
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {submissions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-4">
              Recent community wishes
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {submissions.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="feature-card group block"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pathshala-gold/15 text-pathshala-gold">
                      {s.category}
                    </span>
                    <ExternalLink size={13} className="text-muted-foreground group-hover:text-pathshala-gold" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm line-clamp-2">{s.title}</h4>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{s.description}</p>
                  <p className="text-[11px] text-pathshala-gold/80 mt-3">— {s.display_name}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SubmitResourceSection;

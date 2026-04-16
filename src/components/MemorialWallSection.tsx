import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Heart, Trash2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface NoteRow {
  id: string;
  user_id: string;
  note: string;
  created_at: string;
  display_name: string;
}

const noteSchema = z.string().trim().min(1, "Write something").max(280, "Max 280 characters");

const MemorialWallSection = () => {
  const { user, profile } = useAuth();
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    const { data: rows } = await supabase
      .from("memorial_notes")
      .select("id, user_id, note, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    if (!rows) {
      setLoading(false);
      return;
    }
    const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);
    const nameMap = new Map(profiles?.map((p) => [p.id, p.display_name]) ?? []);
    setNotes(rows.map((r) => ({ ...r, display_name: nameMap.get(r.user_id) ?? "Friend" })));
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = noteSchema.safeParse(text);
    if (!parsed.success) {
      toast({ title: "Note too short or too long", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("memorial_notes").insert({ user_id: user.id, note: parsed.data });
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't post", description: error.message, variant: "destructive" });
      return;
    }
    setText("");
    toast({ title: "Posted to the wall 🤍" });
    fetchNotes();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("memorial_notes").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't delete", variant: "destructive" });
      return;
    }
    setNotes((n) => n.filter((x) => x.id !== id));
  };

  return (
    <section id="memorial" className="py-24 md:py-32 section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, hsl(var(--pathshala-gold) / 0.1) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3">
              Memorial Wall
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              A line. A memory.{" "}
              <span className="text-gradient-gold">A wish kept alive.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg bengali-text">
              শহীদ ওসমান হাদীর জন্য কয়েকটি কথা — তোমার শ্রদ্ধা, তোমার প্রতিশ্রুতি।
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="feature-card mb-8">
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a short note in his memory... (max 280 chars)"
                  maxLength={280}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-pathshala-gold/50 resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Posting as <span className="text-foreground font-medium">{profile?.display_name ?? "you"}</span> · {280 - text.length} left
                  </span>
                  <button
                    type="submit"
                    disabled={submitting || !text.trim()}
                    className="px-5 py-2 rounded-xl bg-pathshala-gold text-pathshala-deep text-sm font-semibold disabled:opacity-50 active:scale-[0.97]"
                  >
                    <Heart size={14} className="inline mr-1.5 fill-current" />
                    {submitting ? "Posting..." : "Post note"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">Sign in to leave a note in his memory.</p>
                <Link
                  to="/auth"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-pathshala-gold text-pathshala-deep text-sm font-semibold active:scale-[0.97]"
                >
                  Sign in to post
                </Link>
              </div>
            )}
          </div>
        </ScrollReveal>

        {loading ? (
          <p className="text-center text-muted-foreground text-sm">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">Be the first to leave a note 🤍</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {notes.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="feature-card group"
                >
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                    {n.note}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-pathshala-gold font-medium">— {n.display_name}</span>
                    <span className="text-muted-foreground">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {user?.id === n.user_id && (
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                      aria-label="Delete note"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default MemorialWallSection;

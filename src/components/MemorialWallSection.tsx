import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Heart, Trash2, Flame } from "lucide-react";
import SectionHeader from "./SectionHeader";
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
  fresh?: boolean;
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
    const { data: inserted, error } = await supabase
      .from("memorial_notes")
      .insert([{ user_id: user.id, note: parsed.data }])
      .select("id, user_id, note, created_at")
      .single();
    setSubmitting(false);
    if (error || !inserted) {
      toast({ title: "Couldn't post", description: error?.message ?? "Try again", variant: "destructive" });
      return;
    }
    setText("");
    toast({ title: "Posted to the wall 🤍" });
    setNotes((n) => [
      { ...inserted, display_name: profile?.display_name ?? "you", fresh: true },
      ...n,
    ]);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("memorial_notes").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't delete", variant: "destructive" });
      return;
    }
    setNotes((n) => n.filter((x) => x.id !== id));
  };

  // Pseudo-random width pattern for gallery feel (deterministic by index)
  const widthClass = (i: number) => {
    const pattern = ["sm:col-span-1", "sm:col-span-2 lg:col-span-1", "sm:col-span-1", "sm:col-span-1 lg:col-span-2"];
    return pattern[i % pattern.length];
  };

  return (
    <section id="memorial" className="py-24 md:py-32 section-padding relative overflow-hidden">
      {/* Candle bokeh */}
      <div className="absolute inset-0 candle-bokeh opacity-60 pointer-events-none" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, hsl(var(--candle) / 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <SectionHeader
          variant="centered"
          eyebrow="The Memorial Wall · live"
          heading={
            <>
              A line. A memory.{" "}
              <span className="text-gradient-candle">A wish kept alive.</span>
            </>
          }
          lede="শহীদ ওসমান হাদীর জন্য কয়েকটি কথা — তোমার শ্রদ্ধা, তোমার প্রতিশ্রুতি।"
        />

        <ScrollReveal>
          <div className="feature-card mb-12 max-w-2xl mx-auto">
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a short note in his memory... (max 280 chars)"
                  maxLength={280}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-pathshala-gold/50 resize-none handwritten"
                  style={{ fontSize: "1.0625rem" }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Posting as <span className="text-foreground font-medium">{profile?.display_name ?? "you"}</span> · {280 - text.length} left
                  </span>
                  <button
                    type="submit"
                    disabled={submitting || !text.trim()}
                    className="px-5 py-2 rounded-xl bg-pathshala-gold text-pathshala-deep text-sm font-semibold disabled:opacity-50 active:scale-[0.97] inline-flex items-center gap-1.5"
                  >
                    <Flame size={13} className="fill-current" />
                    {submitting ? "Lighting..." : "Light a candle"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {notes.map((n, i) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className={`relative group rounded-md p-6 ${widthClass(i)} ${n.fresh ? "fresh-lit" : ""}`}
                  style={{
                    background:
                      "linear-gradient(160deg, hsl(38 50% 88%) 0%, hsl(34 42% 80%) 100%)",
                    color: "hsl(var(--ink))",
                    boxShadow:
                      "0 1px 0 hsl(40 80% 95% / 0.55) inset, 0 -1px 0 hsl(30 30% 60% / 0.25) inset, 0 18px 36px -16px hsl(220 50% 0% / 0.55), 0 0 32px -16px hsl(var(--candle) / 0.4)",
                    transform: `rotate(${(i % 3) - 1}deg)`,
                  }}
                >
                  {/* Lit-candle corner mark */}
                  <Flame
                    size={14}
                    className="absolute top-3 left-3 animate-flicker"
                    style={{ color: "hsl(var(--hadi-red))" }}
                  />

                  <p
                    className="handwritten leading-snug whitespace-pre-wrap break-words pl-6 pt-1"
                    style={{ fontSize: "1.125rem" }}
                  >
                    {n.note}
                  </p>

                  <div
                    className="mt-5 flex items-center justify-between text-[11px] tracking-wide pt-3 border-t"
                    style={{ borderColor: "hsl(220 50% 12% / 0.15)" }}
                  >
                    <span
                      className="font-medium uppercase"
                      style={{ color: "hsl(220 50% 18%)", letterSpacing: "0.12em" }}
                    >
                      — {n.display_name}
                    </span>
                    <span style={{ color: "hsl(220 30% 35%)" }}>
                      {new Date(n.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {user?.id === n.user_id && (
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      style={{ color: "hsl(var(--hadi-red-deep))" }}
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

import { useState } from "react";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CLUB_LABELS, type ClubSlug } from "./ClubMatchQuiz";
import { toast } from "@/hooks/use-toast";

const ClubSlugEnum = z.enum(["debate", "science", "writers", "code", "art", "music"]);

const Schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(254),
  display_name: z.string().trim().max(80).optional().or(z.literal("")),
  club_slug: ClubSlugEnum,
  quiz_match: ClubSlugEnum.optional(),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

interface Props {
  defaultClub?: ClubSlug;
  quizMatch?: ClubSlug;
}

const ClubWaitlistForm = ({ defaultClub = "debate", quizMatch }: Props) => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [clubSlug, setClubSlug] = useState<ClubSlug>(defaultClub);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Schema.safeParse({
      email,
      display_name: displayName || undefined,
      club_slug: clubSlug,
      quiz_match: quizMatch,
      notes: notes || undefined,
    });
    if (!parsed.success) {
      toast({
        title: "Check your details",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("club_waitlist").insert({
      email: parsed.data.email,
      display_name: parsed.data.display_name || null,
      club_slug: parsed.data.club_slug,
      quiz_match: parsed.data.quiz_match || null,
      notes: parsed.data.notes || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not join waitlist", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "You're on the list! ✨", description: "We'll notify you when this club goes live." });
  };

  if (done) {
    return (
      <div className="rounded-3xl p-8 text-center border border-pathshala-emerald/40 bg-pathshala-emerald/5">
        <CheckCircle2 className="mx-auto text-pathshala-emerald mb-3" size={32} />
        <h3 className="text-xl font-bold">You're on the waitlist</h3>
        <p className="text-sm text-muted-foreground mt-2">
          We'll email you when <strong>{CLUB_LABELS[clubSlug].name}</strong> opens.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl p-6 md:p-8 border border-border/40 bg-muted/20 space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.slice(0, 254))}
          required
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-pathshala-gold"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Display name <span className="text-muted-foreground/60">(optional)</span>
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value.slice(0, 80))}
          placeholder="e.g. Rafiq H."
          className="w-full px-4 py-3 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-pathshala-gold"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Pick a club
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(CLUB_LABELS) as ClubSlug[]).map((slug) => {
            const c = CLUB_LABELS[slug];
            const sel = clubSlug === slug;
            return (
              <button
                type="button"
                key={slug}
                onClick={() => setClubSlug(slug)}
                className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98] ${
                  sel
                    ? "border-pathshala-gold bg-pathshala-gold/10 text-foreground"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="mr-1.5">{c.emoji}</span> {c.name}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          A note for the mentor <span className="text-muted-foreground/60">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 500))}
          rows={3}
          placeholder="Tell us why this club excites you…"
          className="w-full px-4 py-3 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-pathshala-gold resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] disabled:opacity-60 inline-flex items-center justify-center gap-2"
        style={{ background: "hsl(var(--pathshala-gold))", color: "hsl(var(--pathshala-deep))" }}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Join the waitlist
      </button>
      <p className="text-[11px] text-center text-muted-foreground">
        We'll only email you about this club. No spam — ever.
      </p>
    </form>
  );
};

export default ClubWaitlistForm;

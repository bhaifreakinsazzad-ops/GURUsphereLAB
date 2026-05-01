import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Users } from "lucide-react";
import ClubMatchQuiz, { CLUB_LABELS, type ClubSlug } from "@/components/clubs/ClubMatchQuiz";
import ClubWaitlistForm from "@/components/clubs/ClubWaitlistForm";

const CLUB_DESCRIPTIONS: Record<ClubSlug, string> = {
  debate:  "Sharpen your voice. Weekly debates, mock parliaments, and rhetoric labs.",
  science: "Hands-on experiments, journal clubs, and citizen science projects.",
  writers: "Short stories, poetry, journaling — find your voice on the page.",
  code:    "Pair-programming, kata nights, and shipping small open-source tools.",
  art:     "Sketchbook circles, weekly prompts, and gentle peer critiques.",
  music:   "Jam sessions, theory crash-courses, and listening clubs.",
};

const Clubs = () => {
  const [match, setMatch] = useState<ClubSlug | undefined>(undefined);
  const [defaultClub, setDefaultClub] = useState<ClubSlug>("debate");
  const formRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Clubs · GURU'sphere — Find your circle";
  }, []);

  const onMatch = (slug: ClubSlug) => {
    setMatch(slug);
    setDefaultClub(slug);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Home
          </Link>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">GURU'sphere · Clubs</span>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 md:px-8 py-16 md:py-24 text-center max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3"
        >
          Community · Joining soon
        </motion.p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
          Find your <span className="text-gradient-gold">circle.</span>
        </h1>
        <p className="bengali-text text-lg mt-3" style={{ color: "hsl(var(--pathshala-gold-light))" }}>
          তোমার ক্লাব খুঁজে নাও
        </p>
        <p className="text-muted-foreground mt-5 max-w-xl mx-auto">
          Six clubs are opening in waves. Take the 1-minute matching quiz to discover where you belong,
          then join the waitlist for early access.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => quizRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold active:scale-[0.97] transition-all"
            style={{ background: "hsl(var(--pathshala-gold))", color: "hsl(var(--pathshala-deep))" }}
          >
            <Sparkles size={14} /> Take the quiz
          </button>
          <button
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border border-border/60 hover:bg-muted active:scale-[0.97] transition-all"
          >
            <Users size={14} /> Join waitlist directly
          </button>
        </div>
      </section>

      {/* Club cards */}
      <section className="px-4 md:px-8 pb-20 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Our six clubs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(CLUB_LABELS) as ClubSlug[]).map((slug, i) => {
            const c = CLUB_LABELS[slug];
            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl border border-border/40 p-6 bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="text-4xl mb-3">{c.emoji}</div>
                <h3 className="text-lg font-bold">{c.name}</h3>
                <p className="bengali-text text-xs text-muted-foreground mt-0.5">{c.bengali}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{CLUB_DESCRIPTIONS[slug]}</p>
                <button
                  onClick={() => {
                    setDefaultClub(slug);
                    setMatch(undefined);
                    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                  }}
                  className="mt-4 text-xs font-semibold text-pathshala-gold hover:underline"
                >
                  Join waitlist →
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quiz */}
      <section ref={quizRef} className="px-4 md:px-8 pb-20 max-w-3xl mx-auto scroll-mt-20">
        <p className="text-xs uppercase tracking-widest text-pathshala-gold text-center mb-2">Step 1</p>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Find your match</h2>
        <ClubMatchQuiz onResult={onMatch} />
      </section>

      {/* Waitlist form */}
      <section ref={formRef} className="px-4 md:px-8 pb-24 max-w-3xl mx-auto scroll-mt-20">
        <p className="text-xs uppercase tracking-widest text-pathshala-gold text-center mb-2">Step 2</p>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Join the waitlist</h2>
        <ClubWaitlistForm defaultClub={defaultClub} quizMatch={match} />
      </section>
    </div>
  );
};

export default Clubs;

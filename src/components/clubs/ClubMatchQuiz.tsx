import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";

export type ClubSlug = "debate" | "science" | "writers" | "code" | "art" | "music";

export const CLUB_LABELS: Record<ClubSlug, { name: string; bengali: string; emoji: string }> = {
  debate:  { name: "Debate Club",   bengali: "বিতর্ক ক্লাব",  emoji: "🎤" },
  science: { name: "Science Lab",   bengali: "বিজ্ঞান ল্যাব", emoji: "🔬" },
  writers: { name: "Writers' Den",  bengali: "লেখকদের আড্ডা", emoji: "✍️" },
  code:    { name: "Code Dojo",     bengali: "কোড ডোজো",   emoji: "💻" },
  art:     { name: "Art Studio",    bengali: "শিল্প স্টুডিও",  emoji: "🎨" },
  music:   { name: "Music Room",    bengali: "সংগীত কক্ষ",  emoji: "🎵" },
};

interface QOption {
  label: string;
  weights: Partial<Record<ClubSlug, number>>;
}
interface Question {
  q: string;
  options: QOption[];
}

const QUESTIONS: Question[] = [
  {
    q: "Which sounds more like your weekend plan?",
    options: [
      { label: "Debating an idea over chai", weights: { debate: 3, writers: 1 } },
      { label: "Building a small experiment", weights: { science: 3, code: 2 } },
      { label: "Sketching, painting, or making music", weights: { art: 3, music: 2 } },
      { label: "Writing a story, poem or essay", weights: { writers: 3, debate: 1 } },
    ],
  },
  {
    q: "Pick the work you enjoy most",
    options: [
      { label: "Cracking logic puzzles", weights: { code: 3, science: 2 } },
      { label: "Performing on stage", weights: { music: 3, debate: 2 } },
      { label: "Researching unknown topics", weights: { science: 3, writers: 1 } },
      { label: "Designing visuals", weights: { art: 3, code: 1 } },
    ],
  },
  {
    q: "Your superpower is…",
    options: [
      { label: "Persuading people", weights: { debate: 3, writers: 1 } },
      { label: "Imagining new worlds", weights: { writers: 2, art: 2, music: 1 } },
      { label: "Solving step-by-step", weights: { code: 3, science: 2 } },
      { label: "Spotting patterns", weights: { science: 2, code: 2, art: 1 } },
    ],
  },
  {
    q: "How much time per week can you give a club?",
    options: [
      { label: "1–2 hours", weights: { writers: 1, art: 1, music: 1 } },
      { label: "3–5 hours", weights: { debate: 2, science: 2, code: 1 } },
      { label: "6+ hours", weights: { code: 3, science: 2, music: 2 } },
    ],
  },
  {
    q: "What's the goal you secretly want?",
    options: [
      { label: "Speak with confidence", weights: { debate: 3, music: 1 } },
      { label: "Build something real", weights: { code: 3, science: 2 } },
      { label: "Be heard creatively", weights: { writers: 2, art: 2, music: 2 } },
      { label: "Discover how things work", weights: { science: 3 } },
    ],
  },
];

interface Props {
  onResult: (slug: ClubSlug) => void;
}

const ClubMatchQuiz = ({ onResult }: Props) => {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<ClubSlug, number>>({
    debate: 0, science: 0, writers: 0, code: 0, art: 0, music: 0,
  });
  const [match, setMatch] = useState<ClubSlug | null>(null);

  const choose = (opt: QOption) => {
    const next = { ...scores };
    (Object.entries(opt.weights) as [ClubSlug, number][]).forEach(([k, v]) => {
      next[k] = (next[k] ?? 0) + v;
    });
    setScores(next);
    if (step + 1 >= QUESTIONS.length) {
      const top = (Object.entries(next) as [ClubSlug, number][]).sort((a, b) => b[1] - a[1])[0][0];
      setMatch(top);
      onResult(top);
    } else {
      setStep((s) => s + 1);
    }
  };

  const reset = () => {
    setStep(0);
    setScores({ debate: 0, science: 0, writers: 0, code: 0, art: 0, music: 0 });
    setMatch(null);
  };

  if (match) {
    const m = CLUB_LABELS[match];
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-8 text-center border border-border/40 bg-muted/30"
      >
        <Sparkles className="mx-auto mb-3 text-pathshala-gold" size={28} />
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Your match</p>
        <div className="text-5xl my-3">{m.emoji}</div>
        <h3 className="text-2xl font-bold">{m.name}</h3>
        <p className="bengali-text text-sm text-muted-foreground mt-1">{m.bengali}</p>
        <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
          You'll thrive here. Join the waitlist below to be among the first invited.
        </p>
        <button
          onClick={reset}
          className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <RefreshCw size={12} /> Retake quiz
        </button>
      </motion.div>
    );
  }

  const cur = QUESTIONS[step];
  const pct = ((step) / QUESTIONS.length) * 100;
  return (
    <div className="rounded-3xl p-6 md:p-8 border border-border/40 bg-muted/20">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span>Question {step + 1} of {QUESTIONS.length}</span>
        <span className="tabular-nums">{Math.round(pct)}%</span>
      </div>
      <div className="h-1 rounded-full bg-muted mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-pathshala-gold"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="text-lg md:text-xl font-bold mb-5">{cur.q}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {cur.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => choose(opt)}
                className="text-left px-4 py-3.5 rounded-2xl border border-border/60 hover:border-pathshala-gold/60 hover:bg-pathshala-gold/5 text-sm font-medium transition-all active:scale-[0.98]"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ClubMatchQuiz;

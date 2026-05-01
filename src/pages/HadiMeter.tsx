import { useEffect, useMemo, useState } from "react";
import {
  Award, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Compass,
  Copy, Flag, HeartHandshake, Info, Leaf, RefreshCw, Share2,
  ShieldCheck, Sparkles, Target, Trophy, Users, type LucideIcon,
} from "lucide-react";
import NebulaShell from "@/components/NebulaShell";
import { recordAttempt } from "@/lib/learnerHistory";

/* ── Question Bank ── */
type Question = {
  id: string;
  bn: string;
  en: string;
  weight: number;
  icon: LucideIcon;
  gradient: string;
  softBg: string;
  border: string;
  text: string;
  promise: string;
  description: string;
  question: string;
  options: { label: string; value: number }[];
};

const QUESTIONS: Question[] = [
  {
    id: "knowledge", bn: "জ্ঞানচর্চা", en: "Learning", weight: 18, icon: BookOpen,
    gradient: "from-emerald-500 to-teal-600", softBg: "bg-emerald-50",
    border: "border-emerald-200", text: "text-emerald-700",
    promise: "প্রতিদিন অন্তত ২০ মিনিট শেখার অভ্যাস গড়ব।",
    description: "নিজেকে উন্নত করার জন্য নিয়মিত পড়া, শেখা ও প্রশ্ন করা।",
    question: "আপনি সপ্তাহে কতদিন নিয়মিত শেখার জন্য সময় দেন?",
    options: [
      { label: "প্রায় দিই না", value: 15 },
      { label: "১–২ দিন", value: 40 },
      { label: "৩–৪ দিন", value: 70 },
      { label: "৫+ দিন", value: 100 },
    ],
  },
  {
    id: "integrity", bn: "সততা", en: "Integrity", weight: 17, icon: ShieldCheck,
    gradient: "from-blue-500 to-indigo-600", softBg: "bg-blue-50",
    border: "border-blue-200", text: "text-blue-700",
    promise: "ভুল তথ্য, নকল কাজ ও অন্যায়ের সুবিধা নেব না।",
    description: "সত্য যাচাই, নিজের ভুল স্বীকার, এবং কাজের মধ্যে স্বচ্ছতা রাখা।",
    question: "কেউ ভুল তথ্য ছড়ালে আপনি সাধারণত কী করেন?",
    options: [
      { label: "এড়িয়ে যাই", value: 20 },
      { label: "মনে মনে বুঝি কিন্তু বলি না", value: 45 },
      { label: "ভদ্রভাবে সংশোধন করি", value: 80 },
      { label: "প্রমাণসহ নিরাপদভাবে সচেতন করি", value: 100 },
    ],
  },
  {
    id: "courage", bn: "নৈতিক সাহস", en: "Moral Courage", weight: 15, icon: Flag,
    gradient: "from-rose-500 to-orange-500", softBg: "bg-rose-50",
    border: "border-rose-200", text: "text-rose-700",
    promise: "অন্যায় দেখলে শান্তিপূর্ণ ও নিরাপদ পথে কথা বলব।",
    description: "সম্মানজনক, আইনসম্মত ও অহিংস পদ্ধতিতে সত্যের পক্ষে দাঁড়ানো।",
    question: "অন্যায় দেখলে আপনার সবচেয়ে কাছের আচরণ কোনটি?",
    options: [
      { label: "চুপ থাকি", value: 20 },
      { label: "বিশ্বাসযোগ্য কাউকে জানাই", value: 55 },
      { label: "ভদ্রভাবে আপত্তি জানাই", value: 80 },
      { label: "প্রমাণ রেখে নিরাপদভাবে সমাধানের চেষ্টা করি", value: 100 },
    ],
  },
  {
    id: "service", bn: "সেবা", en: "Service", weight: 14, icon: HeartHandshake,
    gradient: "from-fuchsia-500 to-pink-600", softBg: "bg-pink-50",
    border: "border-pink-200", text: "text-pink-700",
    promise: "পরিবার, বন্ধু বা সমাজের জন্য নিয়মিত ছোট ভালো কাজ করব।",
    description: "কথার চেয়ে কাজে মানুষের পাশে দাঁড়ানোর অভ্যাস।",
    question: "গত ৭ দিনে আপনি কাউকে শেখানো/সাহায্য করার কাজ করেছেন?",
    options: [
      { label: "না", value: 20 },
      { label: "১ বার", value: 50 },
      { label: "২–৩ বার", value: 80 },
      { label: "প্রায় প্রতিদিন", value: 100 },
    ],
  },
  {
    id: "unity", bn: "ঐক্য ও সম্মান", en: "Unity", weight: 13, icon: Users,
    gradient: "from-amber-500 to-yellow-500", softBg: "bg-amber-50",
    border: "border-amber-200", text: "text-amber-700",
    promise: "ভিন্নমত শুনব, অপমান নয়—যুক্তি দিয়ে কথা বলব।",
    description: "ভিন্ন মতের মানুষকেও মর্যাদা দিয়ে সহযোগিতা করা।",
    question: "ভিন্নমতের মানুষের সাথে আলোচনা হলে আপনি কী করেন?",
    options: [
      { label: "তর্ক এড়াই বা রেগে যাই", value: 20 },
      { label: "শুনি, কিন্তু অস্বস্তি লাগে", value: 50 },
      { label: "সম্মান রেখে কথা বলি", value: 80 },
      { label: "কমন গ্রাউন্ড খুঁজে কাজ করি", value: 100 },
    ],
  },
  {
    id: "discipline", bn: "শৃঙ্খলা", en: "Discipline", weight: 12, icon: Target,
    gradient: "from-violet-500 to-purple-600", softBg: "bg-violet-50",
    border: "border-violet-200", text: "text-violet-700",
    promise: "শেখা, কাজ ও সময় ব্যবস্থাপনায় ধারাবাহিক হব।",
    description: "ছোট কাজ নিয়মিত করার শক্তি তৈরি করা।",
    question: "আপনি নিজের লক্ষ্য ট্র্যাক করেন কীভাবে?",
    options: [
      { label: "করি না", value: 20 },
      { label: "মনে রাখি", value: 45 },
      { label: "নোট/লিস্ট রাখি", value: 75 },
      { label: "সাপ্তাহিকভাবে রিভিউ করি", value: 100 },
    ],
  },
  {
    id: "digital", bn: "ডিজিটাল দায়িত্ব", en: "Digital Responsibility", weight: 11, icon: Compass,
    gradient: "from-cyan-500 to-sky-600", softBg: "bg-cyan-50",
    border: "border-cyan-200", text: "text-cyan-700",
    promise: "অনলাইনে শেয়ার করার আগে যাচাই করব।",
    description: "গুজব, ঘৃণা ও বিভ্রান্তি এড়িয়ে জ্ঞানভিত্তিক অনলাইন আচরণ।",
    question: "কোনো ভাইরাল পোস্ট দেখলে আপনি কী করেন?",
    options: [
      { label: "দেখেই শেয়ার করি", value: 10 },
      { label: "সন্দেহ হলে শেয়ার করি না", value: 55 },
      { label: "সোর্স যাচাই করি", value: 80 },
      { label: "যাচাই করে অন্যকেও সচেতন করি", value: 100 },
    ],
  },
];

const LEVELS = [
  { min: 90, bn: "আলোকবর্তিকা", en: "Torchbearer", emoji: "🌟", message: "আপনার প্রতিশ্রুতি শক্তিশালী। এখন নেতৃত্ব মানে সেবা—অন্যদেরও শেখার পথে আনুন।" },
  { min: 75, bn: "প্রতিশ্রুতিশীল নির্মাতা", en: "Promise Builder", emoji: "🌳", message: "দারুণ অগ্রগতি। ধারাবাহিকতা ধরে রাখলে আপনার প্রভাব আরও বাড়বে।" },
  { min: 60, bn: "সচেতন শিক্ষার্থী", en: "Conscious Learner", emoji: "🌱", message: "ভালো ভিত্তি তৈরি হচ্ছে। একটি দুর্বল দিক বেছে নিয়ে ৭ দিনের চ্যালেঞ্জ শুরু করুন।" },
  { min: 40, bn: "শুরু করা পথিক", en: "Starter", emoji: "🧭", message: "শুরুটাই সবচেয়ে বড় পদক্ষেপ। ছোট প্রতিশ্রুতি দিয়ে আজ থেকেই গতি তৈরি করুন।" },
  { min: 0, bn: "নতুন অঙ্গীকার", en: "New Promise", emoji: "✨", message: "এটা কোনো বিচার নয়—এটা নিজের সাথে নতুন চুক্তি করার সুযোগ।" },
];

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
const getLevel = (s: number) => LEVELS.find((l) => s >= l.min) || LEVELS[LEVELS.length - 1];

type Screen = "intro" | "quiz" | "result";

export default function HadiMeter() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [promises, setPromises] = useState<Record<string, boolean>>(() =>
    QUESTIONS.reduce<Record<string, boolean>>((acc, q) => { acc[q.id] = true; return acc; }, {}),
  );
  const [copied, setCopied] = useState(false);
  const [recorded, setRecorded] = useState(false);

  useEffect(() => { document.title = "Hadi Meter | GURU'sphere"; }, []);

  const active = QUESTIONS[index];
  const ActiveIcon = active.icon;
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);

  const dimensionScores = useMemo(
    () => QUESTIONS.map((q) => ({ ...q, score: answers[q.id] ?? 0 })),
    [answers],
  );

  const score = useMemo(() => {
    const total = QUESTIONS.reduce((sum, q) => sum + q.weight, 0);
    const weighted = QUESTIONS.reduce((sum, q) => {
      const a = answers[q.id] ?? 0;
      const bonus = promises[q.id] ? 4 : 0;
      return sum + clamp(a + bonus) * q.weight;
    }, 0);
    return Math.round(weighted / total);
  }, [answers, promises]);

  const level = getLevel(score);
  const checkedPromises = QUESTIONS.filter((q) => promises[q.id]);
  const sorted = [...dimensionScores].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];
  const allAnswered = answeredCount === QUESTIONS.length;
  const selectedValue = answers[active.id];

  // Record on entering result screen (once)
  useEffect(() => {
    if (screen === "result" && !recorded) {
      try {
        recordAttempt({
          category: "hadi-meter",
          categoryLabel: "Hadi Meter",
          score,
          total: 100,
          xp: Math.round(score / 4),
          rankTitle: level.en,
          practice: true,
        });
      } catch { /* ignore */ }
      setRecorded(true);
    }
  }, [screen, recorded, score, level.en]);

  const buildShareText = () =>
    `আমি GURU'sphere Hadi Meter-এ ${score}% (${level.bn}) স্কোর করেছি। আজকের অঙ্গীকার: ${checkedPromises.length}টি promise. #HadiMeter #GURUsphere`;

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch { /* */ }
  };

  const shareResult = async () => {
    const text = buildShareText();
    if (navigator.share) {
      try { await navigator.share({ title: "GURU'sphere Hadi Meter", text }); } catch { /* cancelled */ }
    } else {
      copyResult();
    }
  };

  const reset = () => {
    setScreen("intro");
    setIndex(0);
    setAnswers({});
    setPromises(QUESTIONS.reduce<Record<string, boolean>>((acc, q) => { acc[q.id] = true; return acc; }, {}));
    setRecorded(false);
    setCopied(false);
  };

  const next = () => {
    if (index < QUESTIONS.length - 1) setIndex((i) => i + 1);
    else setScreen("result");
  };
  const back = () => {
    if (index > 0) setIndex((i) => i - 1);
    else setScreen("intro");
  };

  return (
    <NebulaShell
      title="Hadi Meter"
      bengaliTitle="৭টি অঙ্গীকার · Promise Calculator"
      subtitle="A safe, educational self-reflection tool. Your score is not a judgement — it's an invitation to your next promise."
    >
      {screen === "intro" && (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="nebula-card p-6 md:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              GURU&apos;sphere Interactive Lab
            </div>

            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Promise Calculator
              <span className="block text-gradient-green mt-1">আমরা সবাই হাদী হব</span>
            </h2>

            <p className="mt-4 text-base md:text-lg leading-7 text-muted-foreground">
              ৭টি মাত্রায় (জ্ঞান, সততা, সাহস, সেবা, ঐক্য, শৃঙ্খলা, ডিজিটাল দায়িত্ব) নিজের প্রতিশ্রুতি মাপুন।
              এখানে স্কোর মানে বিচার নয়—স্কোর মানে নিজের অঙ্গীকার বুঝে পরবর্তী পদক্ষেপ নেওয়া।
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Stat label="Dimensions" value="7" />
              <Stat label="Promise mode" value="On" />
              <Stat label="Time" value="2 min" />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setScreen("quiz")}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-4 text-base font-bold shadow-xl transition hover:-translate-y-0.5"
              >
                Start Hadi Meter
                <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>
              <a
                href="#promise-map"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background/40 backdrop-blur px-6 py-4 text-base font-bold text-foreground transition hover:bg-muted/50"
              >
                <Info className="h-5 w-5" /> View promises
              </a>
            </div>

            <p className="mt-5 text-xs leading-6 text-muted-foreground">
              Note: This is a self-reflection tool, not an official certification. Designed to be respectful, lawful, non-violent and inclusive for all learners.
            </p>
          </div>

          <div id="promise-map" className="nebula-card p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-pathshala-gold">Promise Map</p>
                <h3 className="text-2xl font-black bengali-text">৭টি অঙ্গীকার</h3>
              </div>
              <Leaf className="h-7 w-7 text-pathshala-emerald" />
            </div>

            <div className="grid gap-3">
              {QUESTIONS.map((q) => {
                const Icon = q.icon;
                return (
                  <div key={q.id} className="rounded-2xl border border-border/40 bg-background/30 p-4 transition hover:bg-background/50">
                    <div className="flex items-start gap-3">
                      <div className={`rounded-2xl bg-gradient-to-br ${q.gradient} p-3 text-white shadow-lg shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold bengali-text">{q.bn}</h4>
                          <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground">{q.weight}%</span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground bengali-text">{q.promise}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {screen === "quiz" && (
        <div className="mx-auto w-full max-w-3xl nebula-card p-5 md:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <button
              onClick={back}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted/40"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <div className="text-right">
              <p className="text-xs font-bold text-muted-foreground">Progress</p>
              <p className="text-lg font-black">{progress}%</p>
            </div>
          </div>

          <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={`rounded-2xl border ${active.border} ${active.softBg} p-5 text-slate-800`}>
            <div className="flex items-start gap-4">
              <div className={`rounded-2xl bg-gradient-to-br ${active.gradient} p-3.5 text-white shadow-lg shrink-0`}>
                <ActiveIcon className="h-6 w-6" />
              </div>
              <div>
                <p className={`text-xs font-black uppercase tracking-wide ${active.text}`}>{active.en}</p>
                <h3 className="mt-1 text-2xl md:text-3xl font-black bengali-text">{active.bn}</h3>
                <p className="mt-2 leading-7 text-slate-600 bengali-text">{active.description}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-bold text-muted-foreground">Question {index + 1} of {QUESTIONS.length}</p>
            <h4 className="mt-2 text-xl md:text-2xl font-black leading-snug bengali-text">{active.question}</h4>

            <div className="mt-4 grid gap-3">
              {active.options.map((option) => {
                const selected = selectedValue === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setAnswers((p) => ({ ...p, [active.id]: option.value }))}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground shadow-xl"
                        : "border-border bg-background/40 text-foreground hover:-translate-y-0.5 hover:bg-muted/40"
                    }`}
                  >
                    <span className="font-bold bengali-text">{option.label}</span>
                    {selected
                      ? <CheckCircle2 className="h-5 w-5" />
                      : <span className="text-xs font-black text-muted-foreground">+{option.value}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4">
            <input
              type="checkbox"
              checked={!!promises[active.id]}
              onChange={(e) => setPromises((p) => ({ ...p, [active.id]: e.target.checked }))}
              className="mt-1 h-5 w-5 rounded border-border accent-primary"
            />
            <span>
              <span className="block font-black">Today&apos;s promise</span>
              <span className="block text-sm leading-6 text-muted-foreground bengali-text">{active.promise}</span>
            </span>
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">Promise bonus adds a small boost — real score comes from daily habits.</p>
            <button
              onClick={next}
              disabled={selectedValue === undefined}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-sky-600 px-6 py-3.5 font-black text-white shadow-xl transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {index === QUESTIONS.length - 1 ? "Show result" : "Next"}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {screen === "result" && (
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="nebula-card p-6 md:p-8 text-center">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-500 via-sky-500 to-violet-600 text-5xl shadow-xl">
              {level.emoji}
            </div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">Your Hadi Meter</p>
            <h3 className="mt-2 text-3xl md:text-4xl font-black bengali-text text-gradient-gold">{level.bn}</h3>
            <p className="mt-1 text-base font-bold text-muted-foreground">{level.en}</p>

            <div className="relative mx-auto mt-7 h-52 w-52">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
                <circle
                  cx="60" cy="60" r="52" stroke="url(#hmGrad)" strokeWidth="10" strokeLinecap="round"
                  fill="none" strokeDasharray={`${(score / 100) * 326.73} 326.73`}
                />
                <defs>
                  <linearGradient id="hmGrad" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black">{score}</span>
                <span className="text-xs font-bold text-muted-foreground">out of 100</span>
              </div>
            </div>

            <p className="mt-5 rounded-2xl bg-muted/40 p-4 text-left leading-7 text-muted-foreground bengali-text">{level.message}</p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-left">
              <MiniInsight icon={Trophy} label="Strongest" value={strongest?.bn || "—"} />
              <MiniInsight icon={Target} label="Focus next" value={weakest?.bn || "—"} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button onClick={shareResult} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-4 py-3 font-bold transition hover:opacity-90">
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button onClick={copyResult} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 font-bold text-foreground transition hover:bg-muted/40">
                <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 font-bold text-foreground transition hover:bg-muted/40">
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="nebula-card p-6 md:p-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-pathshala-emerald">Breakdown</p>
                  <h3 className="text-2xl font-black bengali-text">মাত্রাভিত্তিক বিশ্লেষণ</h3>
                </div>
                <Award className="h-7 w-7 text-pathshala-gold" />
              </div>

              <div className="space-y-4">
                {dimensionScores.map((q) => {
                  const Icon = q.icon;
                  const finalValue = clamp((answers[q.id] ?? 0) + (promises[q.id] ? 4 : 0));
                  return (
                    <div key={q.id}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-xl bg-gradient-to-br ${q.gradient} p-2 text-white`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-black bengali-text">{q.bn}</p>
                            <p className="text-[11px] font-semibold text-muted-foreground">{q.en} · weight {q.weight}%</p>
                          </div>
                        </div>
                        <span className="font-black tabular-nums">{finalValue}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full rounded-full bg-gradient-to-r ${q.gradient}`} style={{ width: `${finalValue}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="nebula-card p-6 md:p-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-sky-500">Action Plan</p>
                  <h3 className="text-2xl font-black bengali-text">৭ দিনের ছোট চ্যালেঞ্জ</h3>
                </div>
                <CheckCircle2 className="h-7 w-7 text-sky-500" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {checkedPromises.map((q) => (
                  <div key={q.id} className={`rounded-2xl border ${q.border} ${q.softBg} p-4 text-slate-800`}>
                    <p className={`text-[11px] font-black uppercase tracking-wide ${q.text}`}>{q.en}</p>
                    <p className="mt-1 text-sm font-bold leading-6 bengali-text">{q.promise}</p>
                  </div>
                ))}
              </div>

              {!allAnswered && (
                <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  You skipped some questions. For the most accurate result, retry and answer all dimensions.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </NebulaShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 backdrop-blur p-4">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
    </div>
  );
}

function MiniInsight({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 backdrop-blur p-4">
      <Icon className="mb-2 h-4 w-4 text-muted-foreground" />
      <p className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-black bengali-text">{value}</p>
    </div>
  );
}

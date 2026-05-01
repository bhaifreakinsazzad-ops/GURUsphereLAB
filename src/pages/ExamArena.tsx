import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Zap, Crown, Shield, Flame, Star, Target, Award,
  Clock, Users, ChevronRight, ArrowLeft, Check, X as XIcon,
  Medal, Swords, TrendingUp, Brain, BookOpen, Code, Globe,
  Atom, Calculator, Palette, Music, History, GraduationCap, Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import CertificatePreview from "@/components/CertificatePreview";
import TopicLeaderboard from "@/components/TopicLeaderboard";
import { recordAttempt, recordCertificate } from "@/lib/learnerHistory";
import { renderCertificate, downloadCertificate } from "@/lib/certificate";
import { toast } from "@/hooks/use-toast";

/* ─── Rank Tiers ─── */
const RANKS = [
  { title: "Seedling", bengali: "বীজ", icon: "🌱", min: 0, max: 499, color: "hsl(150 40% 50%)" },
  { title: "Sapling", bengali: "চারা", icon: "🌿", min: 500, max: 1499, color: "hsl(155 50% 40%)" },
  { title: "Tree", bengali: "বৃক্ষ", icon: "🌳", min: 1500, max: 2999, color: "hsl(162 60% 30%)" },
  { title: "Banyan", bengali: "বটগাছ", icon: "🏛️", min: 3000, max: 4999, color: "hsl(42 80% 50%)" },
  { title: "Sun", bengali: "সূর্য", icon: "☀️", min: 5000, max: 7999, color: "hsl(35 90% 55%)" },
  { title: "Legend", bengali: "কিংবদন্তি", icon: "👑", min: 8000, max: Infinity, color: "hsl(340 60% 55%)" },
];

/* ─── Exam Categories ─── */
const CATEGORIES = [
  { id: "math", label: "Mathematics", bengali: "গণিত", icon: Calculator, questions: 30, time: "45 min", difficulty: "Mixed", color: "hsl(var(--pathshala-gold))" },
  { id: "science", label: "Science", bengali: "বিজ্ঞান", icon: Atom, questions: 25, time: "40 min", difficulty: "Mixed", color: "hsl(var(--pathshala-emerald))" },
  { id: "english", label: "English", bengali: "ইংরেজি", icon: BookOpen, questions: 35, time: "50 min", difficulty: "Mixed", color: "hsl(162 60% 35%)" },
  { id: "bangla", label: "বাংলা", bengali: "বাংলা", icon: Globe, questions: 30, time: "45 min", difficulty: "Mixed", color: "hsl(var(--pathshala-green))" },
  { id: "coding", label: "Coding", bengali: "কোডিং", icon: Code, questions: 15, time: "60 min", difficulty: "Hard", color: "hsl(250 50% 55%)" },
  { id: "gk", label: "General Knowledge", bengali: "সাধারণ জ্ঞান", icon: Brain, questions: 40, time: "30 min", difficulty: "Easy", color: "hsl(20 70% 55%)" },
  { id: "history", label: "History", bengali: "ইতিহাস", icon: History, questions: 25, time: "35 min", difficulty: "Medium", color: "hsl(280 40% 50%)" },
  { id: "art", label: "Arts & Music", bengali: "শিল্পকলা", icon: Palette, questions: 20, time: "25 min", difficulty: "Easy", color: "hsl(340 55% 55%)" },
];

/* ─── Leaderboard ─── */
const LEADERBOARD = [
  { rank: 1, name: "Rafiq Hasan", score: 8247, tier: "Legend", streak: 42 },
  { rank: 2, name: "Ayesha Siddiqua", score: 7631, tier: "Sun", streak: 38 },
  { rank: 3, name: "Nusrat Jahan", score: 6510, tier: "Sun", streak: 31 },
  { rank: 4, name: "Karim Uddin", score: 5398, tier: "Sun", streak: 27 },
  { rank: 5, name: "Fatima Begum", score: 4245, tier: "Banyan", streak: 22 },
  { rank: 6, name: "Imran Ahmed", score: 3892, tier: "Banyan", streak: 19 },
  { rank: 7, name: "Sadia Akter", score: 3120, tier: "Banyan", streak: 15 },
  { rank: 8, name: "Tariqul Islam", score: 2780, tier: "Tree", streak: 12 },
  { rank: 9, name: "Rumana Parveen", score: 2340, tier: "Tree", streak: 9 },
  { rank: 10, name: "Jubayer Hossain", score: 1890, tier: "Tree", streak: 7 },
];

/* ─── Question Bank by Category ─── */
const QUESTION_BANK: Record<string, { q: string; options: string[]; correct: number }[]> = {
  math: [
    { q: "What is the derivative of x³?", options: ["3x", "x²", "3x²", "2x³"], correct: 2 },
    { q: "What is 15% of 200?", options: ["20", "25", "30", "35"], correct: 2 },
    { q: "Solve: 2x + 5 = 17", options: ["x = 4", "x = 5", "x = 6", "x = 7"], correct: 2 },
    { q: "What is the area of a circle with radius 7? (π ≈ 22/7)", options: ["144", "154", "164", "174"], correct: 1 },
    { q: "What is √144?", options: ["10", "11", "12", "14"], correct: 2 },
  ],
  science: [
    { q: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
    { q: "What is the chemical symbol for water?", options: ["HO", "H₂O", "OH₂", "H₃O"], correct: 1 },
    { q: "Which planet is closest to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correct: 2 },
    { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Body"], correct: 2 },
    { q: "Speed of light is approximately?", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correct: 1 },
  ],
  english: [
    { q: "'To be or not to be' — who wrote this?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correct: 1 },
    { q: "What is the past tense of 'go'?", options: ["Goed", "Gone", "Went", "Going"], correct: 2 },
    { q: "Which is a synonym of 'brave'?", options: ["Timid", "Courageous", "Lazy", "Angry"], correct: 1 },
    { q: "Identify the noun: 'The cat sat on the mat.'", options: ["sat", "on", "the", "cat"], correct: 3 },
    { q: "'Break a leg' means?", options: ["Get injured", "Good luck", "Run fast", "Be careful"], correct: 1 },
  ],
  bangla: [
    { q: "বাংলা ভাষার উৎপত্তি কোন ভাষা থেকে?", options: ["সংস্কৃত", "পালি", "প্রাকৃত", "মাগধী প্রাকৃত"], correct: 3 },
    { q: "'সোনার তরী' কবিতার রচয়িতা কে?", options: ["কাজী নজরুল ইসলাম", "রবীন্দ্রনাথ ঠাকুর", "জীবনানন্দ দাশ", "মাইকেল মধুসূদন দত্ত"], correct: 1 },
    { q: "বাংলা বর্ণমালায় মোট বর্ণ কয়টি?", options: ["৪৭", "৪৯", "৫০", "৫২"], correct: 2 },
    { q: "'অভিধান' শব্দের অর্থ কী?", options: ["গল্পের বই", "শব্দকোষ", "ব্যাকরণ", "ছড়ার বই"], correct: 1 },
    { q: "কোনটি যুক্তবর্ণ?", options: ["ক", "খ", "ক্ষ", "গ"], correct: 2 },
  ],
  coding: [
    { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0 },
    { q: "Which keyword declares a variable in JavaScript?", options: ["var", "int", "string", "define"], correct: 0 },
    { q: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correct: 1 },
    { q: "Which symbol is used for comments in Python?", options: ["//", "/* */", "#", "--"], correct: 2 },
    { q: "What is the output of: print(2 ** 3)?", options: ["6", "8", "5", "9"], correct: 1 },
  ],
  gk: [
    { q: "Which river is the longest in Bangladesh?", options: ["Padma", "Meghna", "Jamuna", "Surma"], correct: 1 },
    { q: "What is the capital of Japan?", options: ["Beijing", "Seoul", "Tokyo", "Bangkok"], correct: 2 },
    { q: "Who is known as the Father of the Nation of Bangladesh?", options: ["Zia ur Rahman", "Bangabandhu Sheikh Mujibur Rahman", "A.K. Fazlul Huq", "Maulana Bhashani"], correct: 1 },
    { q: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
    { q: "International Mother Language Day is observed on?", options: ["21 March", "21 February", "26 March", "16 December"], correct: 1 },
  ],
  history: [
    { q: "When did Bangladesh gain independence?", options: ["1947", "1952", "1971", "1975"], correct: 2 },
    { q: "Who discovered America?", options: ["Vasco da Gama", "Christopher Columbus", "Ferdinand Magellan", "Marco Polo"], correct: 1 },
    { q: "The Language Movement of Bangladesh took place in?", options: ["1947", "1952", "1966", "1971"], correct: 1 },
    { q: "World War II ended in?", options: ["1942", "1943", "1944", "1945"], correct: 3 },
    { q: "The Mughal Empire was founded by?", options: ["Akbar", "Babur", "Shah Jahan", "Aurangzeb"], correct: 1 },
  ],
  art: [
    { q: "Who painted the Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Van Gogh"], correct: 1 },
    { q: "How many strings does a standard guitar have?", options: ["4", "5", "6", "8"], correct: 2 },
    { q: "Which instrument has 88 keys?", options: ["Guitar", "Violin", "Piano", "Flute"], correct: 2 },
    { q: "Rabindra Sangeet was composed by?", options: ["Kazi Nazrul Islam", "Rabindranath Tagore", "Lalon Shah", "Hason Raja"], correct: 1 },
    { q: "What are the three primary colors?", options: ["Red, Green, Blue", "Red, Yellow, Blue", "Red, Orange, Purple", "Blue, Green, Yellow"], correct: 1 },
  ],
};

/* Helper to get questions for a category */
function getQuestionsForCategory(catId: string) {
  return QUESTION_BANK[catId] || QUESTION_BANK.gk;
}

const SAMPLE_QUESTIONS_FALLBACK = QUESTION_BANK.gk;

function getRank(score: number) {
  return RANKS.find((r) => score >= r.min && score <= r.max) || RANKS[0];
}

/* ═══════════════════════════════════════════════ */

const ExamArena = () => {
  const [activeView, setActiveView] = useState<"home" | "exam">("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [practiceMode, setPracticeMode] = useState(false);
  const [activePractice, setActivePractice] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const recordedRef = useRef<string | null>(null);
  const autoCertRef = useRef<string | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const questions = selectedCategory ? getQuestionsForCategory(selectedCategory) : SAMPLE_QUESTIONS_FALLBACK;
  const activeCategoryMeta = CATEGORIES.find((c) => c.id === selectedCategory);
  // Practice earns half XP and does not affect ranking
  const xpPerCorrect = activePractice ? 25 : 50;

  const startExam = (catId: string) => {
    setSelectedCategory(catId);
    setActivePractice(practiceMode);
    setActiveView("exam");
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(0);
    setShowCertificate(false);
    recordedRef.current = null;
  };

  // Record the attempt exactly once when the final question is answered.
  useEffect(() => {
    if (
      activeView === "exam" &&
      selectedCategory &&
      currentQ === questions.length - 1 &&
      showResult &&
      recordedRef.current !== `${selectedCategory}-${currentQ}-${answered}`
    ) {
      recordedRef.current = `${selectedCategory}-${currentQ}-${answered}`;
      recordAttempt({
        category: selectedCategory,
        categoryLabel: activeCategoryMeta?.label ?? selectedCategory,
        score,
        total: questions.length,
        xp: score * xpPerCorrect,
        rankTitle: getRank(score * xpPerCorrect).title,
        practice: activePractice,
      });
    }
  }, [activeView, selectedCategory, currentQ, showResult, answered, score, questions.length, xpPerCorrect, activePractice, activeCategoryMeta]);

  // Auto-generate + auto-download a certificate when learner passes (≥ 60%) and not practice.
  useEffect(() => {
    if (
      activeView !== "exam" ||
      !selectedCategory ||
      currentQ !== questions.length - 1 ||
      !showResult ||
      activePractice
    ) return;
    const key = `cert-${selectedCategory}-${score}-${questions.length}`;
    if (autoCertRef.current === key) return;
    const pct = score / Math.max(questions.length, 1);
    if (pct < 0.6) return;
    autoCertRef.current = key;

    const subject = activeCategoryMeta?.label || "General Knowledge";
    const rankTitle = getRank(score * xpPerCorrect).title;
    const learnerName = "Anonymous Learner";
    const canvas = hiddenCanvasRef.current ?? document.createElement("canvas");
    hiddenCanvasRef.current = canvas;
    renderCertificate(
      canvas,
      { name: learnerName, subject, score, total: questions.length, rankTitle, practice: false },
      "gold",
    );
    setTimeout(() => {
      try {
        downloadCertificate(canvas, `${learnerName}_${subject}_certificate`);
        recordCertificate({
          name: learnerName,
          subject,
          score,
          total: questions.length,
          rankTitle,
          theme: "gold",
          practice: false,
        });
        toast({
          title: "🏅 Certificate earned!",
          description: "Downloaded automatically. Personalize the name and re-share below.",
        });
      } catch {
        /* ignore */
      }
    }, 60);
  }, [activeView, selectedCategory, currentQ, showResult, score, questions.length, activePractice, xpPerCorrect, activeCategoryMeta]);


  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    setAnswered((p) => p + 1);
    if (idx === questions[currentQ].correct) {
      setScore((p) => p + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const exitExam = () => {
    setActiveView("home");
    setSelectedCategory(null);
    setShowCertificate(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl section-padding py-4">
          <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <ArrowLeft size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-xl font-bold text-gradient-green">GURU'sphere</span>
              <span className="text-xs font-medium text-muted-foreground">LAB</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 text-xs font-medium text-muted-foreground">
                <Flame size={14} className="text-pathshala-gold" />
                <span className="tabular-nums">0 day streak</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 text-xs font-medium text-muted-foreground">
                <Zap size={14} className="text-pathshala-emerald" />
                <span className="tabular-nums">0 XP</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {activeView === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Hero ── */}
            <section className="pt-32 pb-16 md:pt-40 md:pb-24 section-padding relative overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at 50% 20%, hsl(var(--pathshala-green) / 0.06) 0%, transparent 60%)",
                }}
              />
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <ScrollReveal>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-6"
                  >
                    <Swords size={16} />
                    No Mercy. Only Truth.
                  </motion.div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.92] mb-4">
                    Know Your{" "}
                    <span className="relative inline-block">
                      <span className="text-gradient-gold">Aukaat</span>
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                        style={{ background: "hsl(var(--pathshala-gold))" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </span>
                  </h1>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <p className="bengali-text text-lg mb-2" style={{ color: "hsl(var(--pathshala-gold-light))" }}>
                    তোমার আসল জায়গা কোথায়? — Where do you truly stand?
                  </p>
                  <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                    Take brutal, honest exams. Earn XP. Climb ranks. Get certified.
                    This isn't school — this is where you find out what you're made of.
                  </p>
                </ScrollReveal>
              </div>
            </section>

            {/* ── Rank Tiers ── */}
            <section className="pb-16 md:pb-24 section-padding">
              <div className="max-w-5xl mx-auto">
                <ScrollReveal>
                  <div className="text-center mb-10">
                    <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-2">
                      Rank System
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      Six tiers. One throne.
                    </h2>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {RANKS.map((rank, i) => (
                    <ScrollReveal key={rank.title} delay={i * 0.07}>
                      <motion.div
                        className="feature-card p-4 text-center group cursor-default"
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="text-3xl mb-2">{rank.icon}</div>
                        <p className="font-bold text-sm text-foreground">{rank.title}</p>
                        <p className="bengali-text text-xs mt-0.5" style={{ color: rank.color }}>
                          {rank.bengali}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-2 tabular-nums">
                          {rank.max === Infinity ? `${rank.min.toLocaleString()}+ XP` : `${rank.min.toLocaleString()}–${rank.max.toLocaleString()} XP`}
                        </p>
                      </motion.div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Exam Categories ── */}
            <section className="pb-16 md:pb-24 section-padding">
              <div className="max-w-5xl mx-auto">
                <ScrollReveal>
                  <div className="text-center mb-6">
                    <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-2">
                      Choose Your Battlefield
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      Pick a subject. Face the truth.
                    </h2>
                  </div>
                </ScrollReveal>

                {/* Practice mode toggle */}
                <ScrollReveal>
                  <div className="max-w-md mx-auto mb-10 feature-card !p-4 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "hsl(var(--pathshala-emerald) / 0.15)" }}
                    >
                      <GraduationCap size={18} className="text-pathshala-emerald" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground flex items-center gap-2">
                        Practice Mode
                        {practiceMode && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pathshala-emerald/20 text-pathshala-emerald">ON</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground leading-snug">
                        No ranking impact · Half XP · Try freely
                      </p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={practiceMode}
                      onClick={() => setPracticeMode((p) => !p)}
                      className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
                        practiceMode ? "bg-pathshala-emerald" : "bg-muted"
                      }`}
                    >
                      <span
                        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow transition-transform"
                        style={{ transform: practiceMode ? "translateX(24px)" : "translateX(0)" }}
                      />
                    </button>
                  </div>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {CATEGORIES.map((cat, i) => (
                    <ScrollReveal key={cat.id} delay={i * 0.06}>
                      <motion.button
                        onClick={() => startExam(cat.id)}
                        className="feature-card p-6 text-left w-full group"
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                          style={{ background: `${cat.color}20` }}
                        >
                          <cat.icon size={20} style={{ color: cat.color }} />
                        </div>
                        <h3 className="font-bold text-foreground text-sm">{cat.label}</h3>
                        <p className="bengali-text text-xs mt-0.5" style={{ color: cat.color }}>
                          {cat.bengali}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Target size={12} /> {cat.questions}Q
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {cat.time}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all duration-200" style={{ color: cat.color }}>
                          Start Exam <ChevronRight size={14} />
                        </div>
                      </motion.button>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Leaderboard ── */}
            <section className="pb-16 md:pb-24 section-padding">
              <div className="max-w-3xl mx-auto">
                <ScrollReveal>
                  <div className="text-center mb-10">
                    <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-2">
                      Global Leaderboard
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      The top minds. Are you next?
                    </h2>
                  </div>
                </ScrollReveal>

                {/* Top 3 podium */}
                <ScrollReveal>
                  <div className="flex items-end justify-center gap-3 mb-8">
                    {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((player, i) => {
                      const heights = ["h-28", "h-36", "h-24"];
                      const badges = ["🥈", "🥇", "🥉"];
                      const widths = ["w-24", "w-28", "w-24"];
                      return (
                        <motion.div
                          key={player.name}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className={`${widths[i]} ${heights[i]} feature-card !p-3 flex flex-col items-center justify-end text-center`}
                        >
                          <span className="text-2xl mb-1">{badges[i]}</span>
                          <p className="text-xs font-bold text-foreground truncate w-full">{player.name.split(" ")[0]}</p>
                          <p className="text-[10px] text-muted-foreground tabular-nums">{player.score.toLocaleString()} XP</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollReveal>

                {/* Rest of leaderboard */}
                <ScrollReveal>
                  <div className="feature-card !p-0 overflow-hidden">
                    {LEADERBOARD.slice(3).map((player, i) => {
                      const rank = getRank(player.score);
                      return (
                        <motion.div
                          key={player.name}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center gap-4 px-6 py-4 border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors"
                        >
                          <span className="w-7 text-sm font-bold text-muted-foreground tabular-nums">
                            #{player.rank}
                          </span>
                          <span className="text-lg">{rank.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{player.name}</p>
                            <p className="text-xs text-muted-foreground">{rank.title} · {player.streak} day streak</p>
                          </div>
                          <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: rank.color }}>
                            {player.score.toLocaleString()}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* ── Rewards & Certificates ── */}
            <section className="pb-24 md:pb-32 section-padding">
              <div className="max-w-5xl mx-auto">
                <ScrollReveal>
                  <div className="text-center mb-10">
                    <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-2">
                      Rewards
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      Earn real proof. Not just grades.
                    </h2>
                  </div>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Award,
                      title: "Verified Certificates",
                      desc: "Pass a subject exam with 80%+ to earn a blockchain-verified digital certificate. Share it anywhere — LinkedIn, portfolio, your mother's fridge.",
                      accent: "hsl(var(--pathshala-gold))",
                    },
                    {
                      icon: Crown,
                      title: "Rank Badges",
                      desc: "Every rank upgrade earns you a unique badge. From Seedling to Legend — your profile tells your whole story without a single word.",
                      accent: "hsl(var(--pathshala-emerald))",
                    },
                    {
                      icon: Flame,
                      title: "Streak Rewards",
                      desc: "Take at least one exam every day. Build an unbreakable streak. Hit milestones (7, 30, 100 days) for exclusive rewards and XP multipliers.",
                      accent: "hsl(340 60% 55%)",
                    },
                  ].map((reward, i) => (
                    <ScrollReveal key={reward.title} delay={i * 0.1}>
                      <div className="feature-card relative overflow-hidden h-full">
                        <div
                          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
                          style={{ background: reward.accent }}
                        />
                        <reward.icon size={28} style={{ color: reward.accent }} className="mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">{reward.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{reward.desc}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                {/* Certificate Preview */}
                <ScrollReveal delay={0.2}>
                  <div className="mt-8 feature-card relative overflow-hidden text-center">
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        background: `repeating-linear-gradient(45deg, hsl(var(--pathshala-gold)) 0px, hsl(var(--pathshala-gold)) 1px, transparent 1px, transparent 20px)`,
                      }}
                    />
                    <div className="relative z-10 py-6">
                      <Award size={40} className="mx-auto mb-3 text-pathshala-gold" />
                      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
                        GURU'sphere Lab · Certificate of Excellence
                      </p>
                      <p className="bengali-text text-sm mb-4" style={{ color: "hsl(var(--pathshala-gold))" }}>
                        শ্রেষ্ঠত্বের সনদ
                      </p>
                      <div className="w-48 h-px mx-auto mb-4" style={{ background: "hsl(var(--pathshala-gold) / 0.3)" }} />
                      <p className="text-2xl font-bold text-foreground mb-1">Your Name Here</p>
                      <p className="text-sm text-muted-foreground">
                        has demonstrated exceptional mastery in <strong className="text-foreground">Mathematics</strong>
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pathshala-gold/10 text-pathshala-gold text-xs font-semibold">
                        <Shield size={12} /> Verified · Shareable
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          </motion.div>
        ) : (
          /* ═══════════ EXAM VIEW ═══════════ */
          <motion.div
            key="exam"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pt-32 pb-16 section-padding"
          >
            <div className="max-w-2xl mx-auto">
              {/* Exam Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={exitExam}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                >
                  <ArrowLeft size={16} /> Exit
                </button>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground tabular-nums">
                    {currentQ + 1}/{questions.length}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-pathshala-gold tabular-nums">
                    <Zap size={14} /> {score * xpPerCorrect} XP
                  </span>
                </div>
              </div>

              {/* Practice mode banner */}
              {activePractice && (
                <div className="mb-6 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-pathshala-emerald/30 bg-pathshala-emerald/10">
                  <Sparkles size={16} className="text-pathshala-emerald shrink-0" />
                  <p className="text-xs text-foreground">
                    <strong className="text-pathshala-emerald">Practice round</strong>
                    <span className="text-muted-foreground"> · No ranking impact · Earning {xpPerCorrect} XP per correct answer</span>
                  </p>
                </div>
              )}

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-muted rounded-full mb-10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "hsl(var(--pathshala-gold))" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8 leading-snug">
                    {questions[currentQ].q}
                  </h2>

                  <div className="space-y-3">
                    {questions[currentQ].options.map((opt, idx) => {
                      const isCorrect = idx === questions[currentQ].correct;
                      const isSelected = idx === selectedAnswer;
                      let optionStyle = "border-border/60 hover:border-pathshala-green-light/50 hover:bg-muted/40";

                      if (showResult) {
                        if (isCorrect) optionStyle = "border-pathshala-emerald bg-pathshala-emerald/10";
                        else if (isSelected && !isCorrect) optionStyle = "border-destructive bg-destructive/10";
                        else optionStyle = "border-border/30 opacity-50";
                      }

                      return (
                        <motion.button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 active:scale-[0.98] disabled:cursor-default ${optionStyle}`}
                          whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                            showResult && isCorrect
                              ? "bg-pathshala-emerald/20 text-pathshala-emerald"
                              : showResult && isSelected && !isCorrect
                                ? "bg-destructive/20 text-destructive"
                                : "bg-muted text-muted-foreground"
                          }`}>
                            {showResult && isCorrect ? (
                              <Check size={16} />
                            ) : showResult && isSelected && !isCorrect ? (
                              <XIcon size={16} />
                            ) : (
                              String.fromCharCode(65 + idx)
                            )}
                          </span>
                          <span className="font-medium text-foreground">{opt}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Result feedback */}
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-8"
                    >
                      {selectedAnswer === questions[currentQ].correct ? (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-pathshala-emerald/10 border border-pathshala-emerald/20">
                          <div className="w-8 h-8 rounded-full bg-pathshala-emerald/20 flex items-center justify-center">
                            <Zap size={16} className="text-pathshala-emerald" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">+{xpPerCorrect} XP — Correct!</p>
                            <p className="text-xs text-muted-foreground">You know your stuff.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                          <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                            <XIcon size={16} className="text-destructive" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">Wrong answer</p>
                            <p className="text-xs text-muted-foreground">
                              Correct: {questions[currentQ].options[questions[currentQ].correct]}
                            </p>
                          </div>
                        </div>
                      )}

                      {currentQ < questions.length - 1 ? (
                        <button
                          onClick={nextQuestion}
                          className="mt-4 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.97]"
                          style={{
                            background: "hsl(var(--pathshala-gold))",
                            color: "hsl(var(--pathshala-deep))",
                          }}
                        >
                          Next Question →
                        </button>
                      ) : (
                        <div className="mt-6">
                          <div className="feature-card !p-8 text-center">
                            <Trophy size={36} className="mx-auto mb-3 text-pathshala-gold" />
                            <h3 className="text-xl font-bold text-foreground mb-1">
                              {activePractice ? "Practice Round Complete" : "Exam Complete"}
                            </h3>
                            <p className="text-3xl font-bold text-gradient-gold tabular-nums mb-1">
                              {score}/{questions.length}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                              You earned <strong className="text-pathshala-gold">{score * xpPerCorrect} XP</strong>
                              {activePractice && (
                                <span className="block text-xs mt-1 text-pathshala-emerald">
                                  Practice mode — ranking unaffected
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mb-5">
                              Rank tier: <strong className="text-foreground">{getRank(score * xpPerCorrect).title}</strong> {getRank(score * xpPerCorrect).icon}
                            </p>

                            {!showCertificate ? (
                              <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                  onClick={exitExam}
                                  className="flex-1 py-3 rounded-xl border-2 border-border/60 font-semibold text-sm text-foreground hover:bg-muted transition-colors active:scale-[0.97]"
                                >
                                  Back to Arena
                                </button>
                                <button
                                  onClick={() => startExam(selectedCategory || "")}
                                  className="flex-1 py-3 rounded-xl border-2 border-pathshala-gold/40 font-semibold text-sm text-foreground hover:bg-pathshala-gold/10 transition-colors active:scale-[0.97]"
                                >
                                  Retry
                                </button>
                                <button
                                  onClick={() => setShowCertificate(true)}
                                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.97]"
                                  style={{
                                    background: "hsl(var(--pathshala-gold))",
                                    color: "hsl(var(--pathshala-deep))",
                                  }}
                                >
                                  <Award size={14} /> Get Certificate
                                </button>
                              </div>
                            ) : (
                              <div className="text-left mt-2">
                                <CertificatePreview
                                  data={{
                                    name: "",
                                    subject: activeCategoryMeta?.label || "General Knowledge",
                                    score,
                                    total: questions.length,
                                    rankTitle: getRank(score * xpPerCorrect).title,
                                    practice: activePractice,
                                  }}
                                  onDownload={({ name, theme }) =>
                                    recordCertificate({
                                      name,
                                      subject: activeCategoryMeta?.label || "General Knowledge",
                                      score,
                                      total: questions.length,
                                      rankTitle: getRank(score * xpPerCorrect).title,
                                      theme,
                                      practice: activePractice,
                                    })
                                  }
                                />
                                <button
                                  onClick={() => setShowCertificate(false)}
                                  className="mt-3 w-full py-2.5 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  ← Back to summary
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamArena;

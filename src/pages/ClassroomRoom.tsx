import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mic, MicOff, Video, VideoOff, Users, Send,
  Radio, Clock, Trophy, Sparkles,
} from "lucide-react";
import { recordAttempt } from "@/lib/learnerHistory";

const SUBJECTS: Record<string, { name: string; bengali: string; icon: string; color: string; teacher: string }> = {
  math:        { name: "Mathematics", bengali: "গণিত",      icon: "∑", color: "hsl(42 85% 55%)",  teacher: "Sir Hasan" },
  science:     { name: "Science",     bengali: "বিজ্ঞান",     icon: "⚛", color: "hsl(162 80% 35%)", teacher: "Apa Nusrat" },
  literature:  { name: "Literature",  bengali: "সাহিত্য",     icon: "✎", color: "hsl(340 60% 55%)", teacher: "Sir Karim" },
  technology:  { name: "Technology",  bengali: "প্রযুক্তি",    icon: "⌘", color: "hsl(200 70% 50%)", teacher: "Apa Sadia" },
  arts:        { name: "Arts",        bengali: "শিল্প",      icon: "◎", color: "hsl(280 50% 55%)", teacher: "Sir Imran" },
  history:     { name: "History",     bengali: "ইতিহাস",     icon: "⏳", color: "hsl(25 70% 50%)",  teacher: "Apa Fatima" },
};

interface ChatMsg {
  id: string;
  user: string;
  text: string;
  ts: number;
  self?: boolean;
  teacher?: boolean;
}

const PROFANITY = ["fuck", "shit", "damn", "bitch", "asshole"];
function clean(text: string) {
  let out = text;
  PROFANITY.forEach((w) => {
    const rx = new RegExp(`\\b${w}\\b`, "gi");
    out = out.replace(rx, "•".repeat(w.length));
  });
  return out;
}

const SEED_REPLIES = [
  "thanks teacher 🙌",
  "অনেক সুন্দর ব্যাখ্যা",
  "can you repeat that please?",
  "got it ✨",
  "এই অংশটা আবার বলবেন?",
  "joining from Sylhet",
  "joining from Dhaka",
  "noted!",
];

const SEED_PEERS = ["Rafiq", "Ayesha", "Nusrat", "Karim", "Sadia", "Imran"];

const STORAGE_KEY = (sid: string) => `gs_classroom_chat_v1_${sid}`;

const ClassroomRoom = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const nav = useNavigate();
  const subject = (subjectId && SUBJECTS[subjectId]) || SUBJECTS.math;
  const sid = subjectId && SUBJECTS[subjectId] ? subjectId : "math";

  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [viewers, setViewers] = useState(127);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Load chat history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY(sid));
      if (raw) setMsgs(JSON.parse(raw) as ChatMsg[]);
    } catch { /* ignore */ }
  }, [sid]);

  // Save chat history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY(sid), JSON.stringify(msgs.slice(-100)));
    } catch { /* ignore */ }
  }, [msgs, sid]);

  // Autoscroll
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  // Viewer fluctuation
  useEffect(() => {
    const id = window.setInterval(() => setViewers((v) => Math.max(80, v + Math.round((Math.random() - 0.5) * 6))), 4500);
    return () => window.clearInterval(id);
  }, []);

  // Seeded peer messages
  useEffect(() => {
    const id = window.setInterval(() => {
      if (Math.random() < 0.55) {
        const peer = SEED_PEERS[Math.floor(Math.random() * SEED_PEERS.length)];
        const txt = SEED_REPLIES[Math.floor(Math.random() * SEED_REPLIES.length)];
        setMsgs((prev) => [...prev, { id: crypto.randomUUID?.() ?? String(Date.now()), user: peer, text: txt, ts: Date.now() }]);
      }
    }, 9000);
    return () => window.clearInterval(id);
  }, []);

  // Scheduled exam — opens 10 min after page load
  const [now, setNow] = useState(() => Date.now());
  const examAt = useMemo(() => Date.now() + 10 * 60 * 1000, []);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const remaining = Math.max(0, examAt - now);
  const examOpen = remaining === 0;
  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  const send = () => {
    const t = clean(draft.trim()).slice(0, 240);
    if (!t) return;
    setMsgs((prev) => [...prev, { id: crypto.randomUUID?.() ?? String(Date.now()), user: "You", text: t, ts: Date.now(), self: true }]);
    setDraft("");
  };

  const enterExam = () => {
    // Log attendance as a 0-score practice attempt (no shaming, no XP impact)
    recordAttempt({
      category: sid,
      categoryLabel: subject.name,
      score: 0,
      total: 0,
      xp: 0,
      rankTitle: "Classroom Attendance",
      practice: true,
    });
    nav(`/exam-arena?cat=${sid}&live=1`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to home</span>
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-destructive/10 text-destructive font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              LIVE
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-muted text-muted-foreground">
              <Users size={12} /> {viewers}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid lg:grid-cols-3 gap-6">
        {/* Teacher video */}
        <div className="lg:col-span-2 space-y-4">
          <div
            className="relative rounded-2xl overflow-hidden border border-border/40 aspect-video"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, ${subject.color}33 0%, hsl(var(--background)) 70%)`,
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-4 shadow-lg"
                style={{ background: `${subject.color}22`, color: subject.color, border: `1px solid ${subject.color}55` }}
              >
                {subject.icon}
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Now teaching</p>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">{subject.name}</h1>
              <p className="bengali-text text-sm mt-0.5" style={{ color: subject.color }}>
                {subject.bengali} · {subject.teacher}
              </p>
              {camOff && (
                <p className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-2">
                  <VideoOff size={12} /> Your camera is off
                </p>
              )}
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-2 py-1.5 bg-background/80 backdrop-blur border border-border/40">
              <button
                onClick={() => setMuted((m) => !m)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  muted ? "bg-destructive/20 text-destructive" : "bg-muted text-foreground"
                }`}
                aria-label="Toggle mic"
              >
                {muted ? <MicOff size={15} /> : <Mic size={15} />}
              </button>
              <button
                onClick={() => setCamOff((c) => !c)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  camOff ? "bg-destructive/20 text-destructive" : "bg-muted text-foreground"
                }`}
                aria-label="Toggle camera"
              >
                {camOff ? <VideoOff size={15} /> : <Video size={15} />}
              </button>
              <button
                onClick={() => nav("/")}
                className="px-3 h-9 rounded-full text-xs font-semibold bg-destructive text-destructive-foreground"
              >
                Leave
              </button>
            </div>
          </div>

          {/* Scheduled exam panel */}
          <div className="rounded-2xl border border-border/40 p-5 bg-muted/20">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${subject.color}22`, color: subject.color }}
                >
                  <Trophy size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold inline-flex items-center gap-2">
                    Scheduled Exam Mode
                    {examOpen && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pathshala-emerald/20 text-pathshala-emerald">
                        OPEN NOW
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {examOpen
                      ? "The teacher has opened the live test. Enter to attempt."
                      : "An in-class quiz will open shortly. Stay tuned."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1">
                    <Clock size={11} /> Opens in
                  </p>
                  <p className="text-2xl font-bold tabular-nums">
                    {mm}:{ss}
                  </p>
                </div>
                <button
                  onClick={enterExam}
                  disabled={!examOpen}
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: subject.color, color: "hsl(var(--pathshala-deep))" }}
                >
                  {examOpen ? "Enter Exam →" : "Locked"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="rounded-2xl border border-border/40 bg-muted/20 flex flex-col h-[60vh] lg:h-auto lg:max-h-[calc(100vh-120px)] lg:sticky lg:top-20">
          <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
            <p className="text-sm font-bold inline-flex items-center gap-2">
              <Radio size={14} className="text-pathshala-emerald" /> Live Chat
            </p>
            <span className="text-[10px] text-muted-foreground">{msgs.length} messages</span>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            <AnimatePresence initial={false}>
              {msgs.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex flex-col ${m.self ? "items-end" : "items-start"}`}
                >
                  <p className="text-[10px] text-muted-foreground mb-0.5">{m.user}</p>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm max-w-[85%] break-words ${
                      m.self
                        ? "bg-pathshala-gold/20 text-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {msgs.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-8 inline-flex flex-col items-center gap-2 w-full">
                <Sparkles size={16} />
                Say hello — be the first.
              </p>
            )}
          </div>
          <div className="p-3 border-t border-border/40 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, 240))}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Type a message · বার্তা লিখুন"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-pathshala-gold transition-colors"
              maxLength={240}
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="px-3.5 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all active:scale-[0.97]"
              style={{ background: "hsl(var(--pathshala-gold))", color: "hsl(var(--pathshala-deep))" }}
              aria-label="Send"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomRoom;

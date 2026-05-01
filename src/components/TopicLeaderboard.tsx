import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Eye, EyeOff } from "lucide-react";
import { getAttempts } from "@/lib/learnerHistory";
import { isOptedOut, setOptedOut } from "@/lib/leaderboardPrefs";

export interface TopicLBCategory {
  id: string;
  label: string;
  bengali: string;
  color: string;
}

interface Props {
  categories: TopicLBCategory[];
  /** Seeded "classmate" entries to mix in so the board isn't lonely. */
  seedNames?: string[];
}

/** Convert "Rafiq Hasan" -> "Rafiq H." (no shaming, no full names). */
function shortName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

function percentileBand(rank: number, total: number): { label: string; tone: string } {
  if (total <= 1) return { label: "First steps", tone: "hsl(var(--pathshala-emerald))" };
  const pct = (rank / total) * 100;
  if (pct <= 10) return { label: "Top 10%", tone: "hsl(var(--candle))" };
  if (pct <= 25) return { label: "Top 25%", tone: "hsl(var(--pathshala-gold))" };
  if (pct <= 50) return { label: "Top 50%", tone: "hsl(var(--pathshala-emerald))" };
  return { label: "Climbing", tone: "hsl(var(--lab-cyan))" };
}

const SEED_DEFAULT = [
  "Rafiq Hasan", "Ayesha Siddiqua", "Nusrat Jahan", "Karim Uddin",
  "Fatima Begum", "Imran Ahmed", "Sadia Akter", "Tariqul Islam",
];

const TopicLeaderboard = ({ categories, seedNames = SEED_DEFAULT }: Props) => {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const [optOut, _setOptOut] = useState<boolean>(() => isOptedOut());
  const attempts = useMemo(() => getAttempts(), []);

  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  // Build per-topic board: only positive entries, never failures.
  const board = useMemo(() => {
    if (!active) return [] as { name: string; pct: number; you: boolean }[];
    const my = attempts
      .filter((a) => a.category === active.id && a.score > 0)
      .map((a) => Math.round((a.score / Math.max(a.total, 1)) * 100));
    const myBest = my.length ? Math.max(...my) : 0;

    // Deterministic seed scores from category id
    const hash = Array.from(active.id).reduce((s, c) => s + c.charCodeAt(0), 0);
    const seeds = seedNames.slice(0, 8).map((name, i) => {
      const base = 60 + ((hash + i * 13) % 38); // 60..97
      return { name: shortName(name), pct: base, you: false };
    });

    const list = [...seeds];
    if (myBest > 0 && !optOut) {
      list.push({ name: "You", pct: myBest, you: true });
    }
    return list.sort((a, b) => b.pct - a.pct).slice(0, 10);
  }, [active, attempts, optOut, seedNames]);

  // Personal trend: latest pct vs previous best in this topic
  const trend = useMemo(() => {
    if (!active) return null;
    const list = attempts
      .filter((a) => a.category === active.id)
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));
    if (list.length < 2) return null;
    const last = list[list.length - 1];
    const prev = list.slice(0, -1);
    const lastPct = (last.score / Math.max(last.total, 1)) * 100;
    const prevBest = Math.max(...prev.map((p) => (p.score / Math.max(p.total, 1)) * 100));
    return { delta: Math.round(lastPct - prevBest) };
  }, [active, attempts]);

  const yourRank = board.findIndex((b) => b.you);
  const band = yourRank >= 0 ? percentileBand(yourRank + 1, board.length) : null;

  if (!active) return null;

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:thin]">
        {categories.map((c) => {
          const sel = c.id === active.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                sel
                  ? "border-transparent text-foreground"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
              style={sel ? { background: `${c.color}22`, borderColor: `${c.color}55` } : undefined}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{active.label}</p>
          <p className="bengali-text text-sm" style={{ color: active.color }}>
            সবাই এগিয়ে যাচ্ছে — তুমিও পারবে
          </p>
        </div>
        <button
          onClick={() => {
            const v = !optOut;
            _setOptOut(v);
            setOptedOut(v);
          }}
          className="text-[11px] inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground"
          aria-label="Toggle visibility on leaderboard"
        >
          {optOut ? <EyeOff size={12} /> : <Eye size={12} />}
          {optOut ? "Hidden" : "Visible"}
        </button>
      </div>

      {/* Personal band + trend (only positive framing) */}
      {(band || trend) && (
        <div className="grid grid-cols-2 gap-3">
          {band && (
            <div
              className="rounded-xl p-3 border"
              style={{ borderColor: `${band.tone}55`, background: `${band.tone}11` }}
            >
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Your band</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: band.tone }}>
                {band.label}
              </p>
            </div>
          )}
          {trend && (
            <div className="rounded-xl p-3 border border-border/60 bg-muted/30">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Personal trend</p>
              <p className="text-sm font-bold mt-0.5 inline-flex items-center gap-1.5 text-foreground">
                {trend.delta >= 0 ? (
                  <>
                    <TrendingUp size={14} className="text-pathshala-emerald" />
                    +{trend.delta}% best
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-pathshala-gold" />
                    Keep going — every try counts
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Top 5 only — never display ranks below 10 to avoid shaming */}
      <div className="rounded-2xl border border-border/60 overflow-hidden bg-muted/20">
        {board.slice(0, 5).map((row, i) => (
          <motion.div
            key={`${row.name}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-center gap-3 px-4 py-3 border-b border-border/40 last:border-b-0 ${
              row.you ? "bg-pathshala-gold/10" : ""
            }`}
          >
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums"
              style={{ background: `${active.color}22`, color: active.color }}
            >
              {i + 1}
            </span>
            <span className="flex-1 text-sm font-semibold text-foreground truncate">
              {row.name}
              {row.you && (
                <span className="ml-2 text-[10px] uppercase tracking-wider text-pathshala-gold">you</span>
              )}
            </span>
            <span className="text-sm tabular-nums text-muted-foreground">{row.pct}%</span>
          </motion.div>
        ))}
        {board.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            Be the first to score in {active.label}.
          </div>
        )}
      </div>

      <p className="text-[11px] text-center text-muted-foreground">
        Only top 5 are shown. Lower scores are never displayed — your effort, not your rank, defines you.
      </p>
    </div>
  );
};

export default TopicLeaderboard;

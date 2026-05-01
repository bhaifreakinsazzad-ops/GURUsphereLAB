/**
 * Weekly Learning Missions — bonus-XP goals that rotate every ISO week.
 * Stored client-side in localStorage. Pure helpers + a tiny claim store.
 */

import type { ExamAttempt, CertificateRecord } from "./learnerHistory";

export type MissionTemplate = {
  id: string;
  title: string;
  bengali: string;
  xp: number;
  target: number;
  /** Returns current progress (0..target+) given the inputs. */
  evaluate: (ctx: MissionContext) => number;
  hint?: string;
};

export interface MissionContext {
  attempts: ExamAttempt[];
  certs: CertificateRecord[];
  enrolledCount: number;
  contributions: {
    research: number;
    projects: number;
    notes: number;
    submissions: number;
  };
  weekStart: Date; // start of ISO week
}

const inThisWeek = (iso: string, weekStart: Date) => {
  const d = +new Date(iso);
  const start = +weekStart;
  const end = start + 7 * 86_400_000;
  return d >= start && d < end;
};

export const WEEKLY_MISSION_TEMPLATES: MissionTemplate[] = [
  {
    id: "ranked3",
    title: "Take 3 ranked exams",
    bengali: "৩টি র‍্যাঙ্কড পরীক্ষা দাও",
    xp: 50,
    target: 3,
    evaluate: ({ attempts, weekStart }) =>
      attempts.filter((a) => !a.practice && inThisWeek(a.date, weekStart)).length,
  },
  {
    id: "cert1",
    title: "Earn a certificate",
    bengali: "একটি সার্টিফিকেট অর্জন করো",
    xp: 40,
    target: 1,
    evaluate: ({ certs, weekStart }) =>
      certs.filter((c) => inThisWeek(c.date, weekStart)).length,
  },
  {
    id: "streak3",
    title: "Maintain a 3-day streak",
    bengali: "৩ দিনের ধারা ধরে রাখো",
    xp: 30,
    target: 3,
    evaluate: ({ attempts, weekStart }) => {
      const days = new Set(
        attempts
          .filter((a) => inThisWeek(a.date, weekStart))
          .map((a) => new Date(a.date).toISOString().slice(0, 10)),
      );
      return Math.min(days.size, 3);
    },
  },
  {
    id: "hadi1",
    title: "Try Hadi Meter once",
    bengali: "একবার হাদি মিটার চেষ্টা করো",
    xp: 20,
    target: 1,
    evaluate: ({ attempts, weekStart }) =>
      attempts.filter(
        (a) => a.category === "hadi-meter" && inThisWeek(a.date, weekStart),
      ).length,
  },
  {
    id: "saveCourse",
    title: "Enroll in a new course",
    bengali: "নতুন একটি কোর্সে যোগ দাও",
    xp: 20,
    target: 1,
    evaluate: ({ enrolledCount }) => Math.min(enrolledCount, 1),
    hint: "Save any wish from the homepage",
  },
  {
    id: "research1",
    title: "Submit a research topic",
    bengali: "একটি গবেষণা প্রস্তাব দাও",
    xp: 50,
    target: 1,
    evaluate: ({ contributions }) => Math.min(contributions.research, 1),
  },
  {
    id: "memorial1",
    title: "Post a memorial note",
    bengali: "একটি স্মৃতিনোট লেখো",
    xp: 15,
    target: 1,
    evaluate: ({ contributions }) => Math.min(contributions.notes, 1),
  },
  {
    id: "high80",
    title: "Score ≥ 80% on any exam",
    bengali: "যেকোনো পরীক্ষায় ৮০%+ স্কোর",
    xp: 40,
    target: 1,
    evaluate: ({ attempts, weekStart }) =>
      attempts.filter(
        (a) => inThisWeek(a.date, weekStart) && a.total > 0 && a.score / a.total >= 0.8,
      ).length > 0
        ? 1
        : 0,
  },
  {
    id: "share1",
    title: "Share resources with others",
    bengali: "অন্যদের সাথে রিসোর্স শেয়ার করো",
    xp: 25,
    target: 1,
    evaluate: ({ contributions }) => Math.min(contributions.submissions, 1),
  },
  {
    id: "project1",
    title: "Launch a team project",
    bengali: "একটি টিম প্রজেক্ট চালু করো",
    xp: 60,
    target: 1,
    evaluate: ({ contributions }) => Math.min(contributions.projects, 1),
  },
];

/* ── Week helpers (ISO week, Mon..Sun) ── */

export function getWeekStart(d = new Date()): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  const day = (x.getUTCDay() + 6) % 7; // 0 = Mon
  x.setUTCDate(x.getUTCDate() - day);
  return x;
}

export function getCurrentWeekKey(d = new Date()): string {
  // ISO week-numbering year & week
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((+t - +firstThursday) / 86_400_000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7,
    );
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function daysLeftInWeek(d = new Date()): number {
  const start = getWeekStart(d);
  const end = +start + 7 * 86_400_000;
  return Math.max(0, Math.ceil((end - +d) / 86_400_000));
}

/* ── Deterministic weekly pick ── */

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h >>> 0;
}

export function getWeeklyMissions(weekKey = getCurrentWeekKey()): MissionTemplate[] {
  const seed = hashString(weekKey);
  const pool = [...WEEKLY_MISSION_TEMPLATES];
  // Fisher-Yates with seeded RNG
  let s = seed || 1;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 4);
}

/* ── Claim persistence ── */

const KEY_CLAIMS = "gs_missions_v1";

interface ClaimStore {
  // weekKey -> missionId -> xp claimed
  [weekKey: string]: { [missionId: string]: number };
}

function readClaims(): ClaimStore {
  try {
    return JSON.parse(localStorage.getItem(KEY_CLAIMS) || "{}");
  } catch {
    return {};
  }
}
function writeClaims(c: ClaimStore) {
  try {
    localStorage.setItem(KEY_CLAIMS, JSON.stringify(c));
  } catch {
    /* quota */
  }
}

export function getClaimed(weekKey = getCurrentWeekKey()): Record<string, number> {
  return readClaims()[weekKey] ?? {};
}

export function isClaimed(missionId: string, weekKey = getCurrentWeekKey()): boolean {
  return !!getClaimed(weekKey)[missionId];
}

export function claimMission(missionId: string, xp: number, weekKey = getCurrentWeekKey()) {
  const all = readClaims();
  const week = all[weekKey] ?? {};
  if (week[missionId]) return;
  week[missionId] = xp;
  all[weekKey] = week;
  writeClaims(all);
}

export function getMissionBonusXp(): number {
  const all = readClaims();
  let sum = 0;
  for (const w of Object.values(all))
    for (const v of Object.values(w)) sum += v;
  return sum;
}

/* ── Evaluation helper for the dashboard ── */

export interface EvaluatedMission {
  template: MissionTemplate;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export function evaluateWeekly(ctx: MissionContext, weekKey = getCurrentWeekKey()): EvaluatedMission[] {
  const claimed = getClaimed(weekKey);
  return getWeeklyMissions(weekKey).map((t) => {
    const progress = Math.min(t.evaluate(ctx), t.target);
    return {
      template: t,
      progress,
      completed: progress >= t.target,
      claimed: !!claimed[t.id],
    };
  });
}

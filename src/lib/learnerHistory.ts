/**
 * Lightweight client-side learner history (per-browser).
 * Tracks: exam attempts, ranking history, daily activity / streak,
 * and recent certificate metadata. Stored in localStorage so the
 * personalized dashboard works without extra DB tables.
 */

export interface ExamAttempt {
  id: string;
  date: string; // ISO
  category: string; // e.g. "math"
  categoryLabel: string;
  score: number;
  total: number;
  xp: number;
  rankTitle: string;
  practice: boolean;
}

export interface CertificateRecord {
  id: string;
  date: string;
  name: string;
  subject: string;
  score: number;
  total: number;
  rankTitle: string;
  theme: "gold" | "green" | "blue";
  practice: boolean;
}

const KEY_ATTEMPTS = "gs_exam_attempts_v1";
const KEY_CERTS = "gs_certificates_v1";

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value.slice(-200)));
  } catch {
    /* quota — ignore */
  }
}

export function getAttempts(): ExamAttempt[] {
  return read<ExamAttempt>(KEY_ATTEMPTS);
}

export function recordAttempt(a: Omit<ExamAttempt, "id" | "date"> & { date?: string }) {
  const list = getAttempts();
  list.push({
    ...a,
    id: crypto.randomUUID?.() ?? String(Date.now()),
    date: a.date ?? new Date().toISOString(),
  });
  write(KEY_ATTEMPTS, list);
}

export function getCertificates(): CertificateRecord[] {
  return read<CertificateRecord>(KEY_CERTS);
}

export function recordCertificate(c: Omit<CertificateRecord, "id" | "date"> & { date?: string }) {
  const list = getCertificates();
  list.push({
    ...c,
    id: crypto.randomUUID?.() ?? String(Date.now()),
    date: c.date ?? new Date().toISOString(),
  });
  write(KEY_CERTS, list);
}

/** Compute current streak (consecutive UTC days with at least one non-practice attempt). */
export function computeStreak(attempts: ExamAttempt[] = getAttempts()): {
  current: number;
  longest: number;
  lastActive: string | null;
} {
  if (!attempts.length) return { current: 0, longest: 0, lastActive: null };
  const days = new Set(
    attempts.map((a) => new Date(a.date).toISOString().slice(0, 10)),
  );
  const sorted = Array.from(days).sort();
  // Longest run
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T00:00:00Z").getTime();
    const cur = new Date(sorted[i] + "T00:00:00Z").getTime();
    if (cur - prev === 86_400_000) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }
  // Current streak (ending today or yesterday)
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  let current = 0;
  let cursor = days.has(today) ? today : days.has(yesterday) ? yesterday : null;
  while (cursor) {
    current += 1;
    const prev = new Date(new Date(cursor + "T00:00:00Z").getTime() - 86_400_000)
      .toISOString()
      .slice(0, 10);
    cursor = days.has(prev) ? prev : null;
  }
  return { current, longest, lastActive: sorted[sorted.length - 1] };
}

/** Total ranked XP (excludes practice). */
export function totalRankedXp(attempts: ExamAttempt[] = getAttempts()): number {
  return attempts.filter((a) => !a.practice).reduce((sum, a) => sum + a.xp, 0);
}

/** Heatmap of last N days, value = attempt count. */
export function activityHeatmap(days = 28, attempts: ExamAttempt[] = getAttempts()) {
  const out: { date: string; count: number }[] = [];
  const map = new Map<string, number>();
  attempts.forEach((a) => {
    const d = new Date(a.date).toISOString().slice(0, 10);
    map.set(d, (map.get(d) ?? 0) + 1);
  });
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    out.push({ date: d, count: map.get(d) ?? 0 });
  }
  return out;
}

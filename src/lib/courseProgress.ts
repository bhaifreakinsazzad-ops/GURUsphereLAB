/**
 * Per-course progress tracker (client-side, keyed by saved_wishes.wish_key).
 */

const KEY = "gs_course_progress_v1";

export interface CourseProgress {
  lessonsTotal: number;
  lessonsDone: number;
  nextLesson: string;
  minutesSpent: number;
  lastOpened: string;
  completedAwarded?: boolean;
}

type Store = Record<string, CourseProgress>;

function read(): Store {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
function write(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota */
  }
}

const defaults = (): CourseProgress => ({
  lessonsTotal: 10,
  lessonsDone: 0,
  nextLesson: "Lesson 1",
  minutesSpent: 0,
  lastOpened: new Date().toISOString(),
});

export function getProgress(key: string): CourseProgress {
  const s = read();
  return s[key] ?? defaults();
}

export function setProgress(key: string, patch: Partial<CourseProgress>): CourseProgress {
  const s = read();
  const cur = s[key] ?? defaults();
  const next = { ...cur, ...patch };
  s[key] = next;
  write(s);
  return next;
}

export function tickMinutes(key: string, n: number): CourseProgress {
  const cur = getProgress(key);
  return setProgress(key, {
    minutesSpent: cur.minutesSpent + n,
    lastOpened: new Date().toISOString(),
  });
}

export function markLessonDone(key: string): CourseProgress {
  const cur = getProgress(key);
  const done = Math.min(cur.lessonsDone + 1, cur.lessonsTotal);
  const nextLesson =
    done >= cur.lessonsTotal ? "All lessons complete 🎉" : `Lesson ${done + 1}`;
  return setProgress(key, {
    lessonsDone: done,
    nextLesson,
    lastOpened: new Date().toISOString(),
  });
}

export function markCompletedAwarded(key: string) {
  setProgress(key, { completedAwarded: true });
}

export function summary(keys: string[]): {
  avgPercent: number;
  totalMinutes: number;
  completed: number;
} {
  if (!keys.length) return { avgPercent: 0, totalMinutes: 0, completed: 0 };
  const all = read();
  let pct = 0;
  let mins = 0;
  let completed = 0;
  for (const k of keys) {
    const p = all[k] ?? defaults();
    pct += (p.lessonsDone / Math.max(p.lessonsTotal, 1)) * 100;
    mins += p.minutesSpent;
    if (p.lessonsDone >= p.lessonsTotal && p.lessonsTotal > 0) completed += 1;
  }
  return {
    avgPercent: Math.round(pct / keys.length),
    totalMinutes: mins,
    completed,
  };
}

export function formatMinutes(m: number): string {
  if (m <= 0) return "0m";
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h && min) return `${h}h ${min}m`;
  if (h) return `${h}h`;
  return `${min}m`;
}

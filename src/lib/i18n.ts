// Lightweight i18n. English is source of truth. Bangla falls back to English silently
// when a key isn't translated yet (per approved Stage 3 fallback rule).
import { useEffect, useState, useSyncExternalStore } from "react";

export type Locale = "en" | "bn";

const LS_KEY = "orbit.locale";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

const read = (): Locale => {
  if (typeof window === "undefined") return "en";
  const v = window.localStorage.getItem(LS_KEY);
  return v === "bn" ? "bn" : "en";
};

export const setLocale = (l: Locale) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, l);
  document.documentElement.lang = l;
  emit();
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const dict: Record<string, { en: string; bn?: string }> = {
  "nav.learn": { en: "Learn", bn: "শিখুন" },
  "nav.teach": { en: "Teach", bn: "শেখান" },
  "nav.mentors": { en: "Mentors", bn: "মেন্টর" },
  "nav.community": { en: "Community", bn: "কমিউনিটি" },
  "nav.dashboard": { en: "My learning", bn: "আমার শেখা" },
  "nav.signin": { en: "Sign in", bn: "সাইন ইন" },
  "nav.start": { en: "Start learning", bn: "শুরু করুন" },
  "nav.signout": { en: "Sign out", bn: "সাইন আউট" },

  "auth.signup.title": { en: "Create your account", bn: "অ্যাকাউন্ট খুলুন" },
  "auth.signin.title": { en: "Welcome back", bn: "স্বাগতম" },
  "auth.email": { en: "Email", bn: "ইমেইল" },
  "auth.password": { en: "Password", bn: "পাসওয়ার্ড" },
  "auth.name": { en: "Your name" },
  "auth.forgot": { en: "Forgot password?", bn: "পাসওয়ার্ড ভুলে গেছেন?" },
  "auth.no_account": { en: "New here? Create an account" },
  "auth.have_account": { en: "Already have an account? Sign in" },

  "onboarding.title": { en: "Let's personalize your journey" },
  "onboarding.subtitle": { en: "Answer a few quick questions — you can change anything later." },
  "onboarding.skip": { en: "Skip for now" },
  "onboarding.finish": { en: "Finish and explore" },
  "onboarding.next": { en: "Next" },
  "onboarding.back": { en: "Back" },

  "discover.title": { en: "Explore learning" },
  "discover.placeholder": { en: "Search a goal, skill, or subject" },
  "discover.empty": { en: "Nothing matches yet. Try a broader keyword." },
  "discover.filter.all": { en: "All subjects" },
  "discover.filter.language": { en: "Language" },
  "discover.filter.level": { en: "Level" },

  "course.enroll": { en: "Enroll — it's free" },
  "course.continue": { en: "Continue learning" },
  "course.enrolled": { en: "You're enrolled" },
  "course.outcomes": { en: "What you'll learn" },
  "course.prereq": { en: "Prerequisites" },
  "course.curriculum": { en: "Curriculum" },
  "course.about": { en: "About this course" },
  "lesson.complete": { en: "Mark complete" },
  "lesson.completed": { en: "Completed" },
  "lesson.next": { en: "Next lesson" },
  "lesson.prev": { en: "Previous" },
  "lesson.back": { en: "Back to course" },

  "my.title": { en: "My learning" },
  "my.continue": { en: "Continue where you left off" },
  "my.enrolled": { en: "Enrolled courses" },
  "my.recommended": { en: "Recommended for you" },
  "my.empty": { en: "You haven't enrolled in a course yet." },
  "my.browse": { en: "Browse courses" },
  "my.prefs": { en: "Update learning preferences" },
};

export const useLocale = (): Locale => useSyncExternalStore(subscribe, read, () => "en");

export const useT = () => {
  const locale = useLocale();
  return (key: keyof typeof dict | string): string => {
    const entry = dict[key as string];
    if (!entry) return key as string;
    if (locale === "bn" && entry.bn) return entry.bn;
    return entry.en;
  };
};

// Initialise <html lang="..."> on load
export const initLocale = () => {
  if (typeof document !== "undefined") document.documentElement.lang = read();
};

export const getLocale = read;

// Hook wrapper for components that don't need reactivity
export const useCurrentLocale = () => {
  const [l, setL] = useState<Locale>(read());
  useEffect(() => {
    const unsub = subscribe(() => setL(read()));
    return () => { unsub(); };
  }, []);
  return l;
};

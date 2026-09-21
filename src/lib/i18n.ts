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
  "my.empty_hint": { en: "Pick one and start today — everything is free.", bn: "একটি কোর্স বেছে নিয়ে আজই শুরু করুন — সবকিছু বিনামূল্যে।" },
  "my.completed": { en: "Completed", bn: "সম্পন্ন" },
  "my.lessons": { en: "lessons", bn: "টি পাঠ" },
  "my.browse": { en: "Browse courses" },
  "my.prefs": { en: "Update learning preferences" },
  "common.loading": { en: "Loading…", bn: "লোড হচ্ছে…" },
  "common.save": { en: "Save", bn: "সংরক্ষণ করুন" },
  "common.back": { en: "Back", bn: "ফিরে যান" },
  "auth.signup.subtitle": { en: "Free to join. Learn at your own pace.", bn: "যোগ দিন বিনামূল্যে। নিজের গতিতে শিখুন।" },
  "auth.signin.subtitle": { en: "Sign in to continue learning.", bn: "শেখা চালিয়ে যেতে সাইন ইন করুন।" },
  "auth.create": { en: "Create account", bn: "অ্যাকাউন্ট খুলুন" },
  "auth.wait": { en: "Please wait…", bn: "অপেক্ষা করুন…" },
  "auth.check": { en: "Please check your details", bn: "আপনার তথ্য যাচাই করুন" },
  "auth.invalid": { en: "That email and password don't match. Try again or reset your password.", bn: "ইমেইল ও পাসওয়ার্ড মিলছে না। আবার চেষ্টা করুন বা পাসওয়ার্ড রিসেট করুন।" },
  "auth.welcome": { en: "Welcome back", bn: "আবারও স্বাগতম" },
  "onboarding.step": { en: "Step", bn: "ধাপ" },
  "onboarding.of": { en: "of", bn: "এর" },
  "onboarding.goal": { en: "What do you want to learn or become?", bn: "আপনি কী শিখতে বা হতে চান?" },
  "onboarding.goal_hint": { en: "One sentence is enough. We'll refine as we go.", bn: "একটি বাক্যই যথেষ্ট। পরে আমরা আরও পরিষ্কার করব।" },
  "onboarding.subjects": { en: "Which subjects interest you?", bn: "কোন বিষয়গুলো আপনার আগ্রহের?" },
  "onboarding.subjects_hint": { en: "Pick as many as you like.", bn: "ইচ্ছেমতো একাধিক বেছে নিন।" },
  "onboarding.level": { en: "Where are you starting?", bn: "আপনি কোন স্তর থেকে শুরু করছেন?" },
  "onboarding.level_hint": { en: "We'll match courses to fit.", bn: "আপনার জন্য উপযুক্ত কোর্স সাজানো হবে।" },
  "onboarding.style": { en: "How do you like to learn?", bn: "আপনি কীভাবে শিখতে পছন্দ করেন?" },
  "onboarding.language": { en: "Preferred language & goal", bn: "পছন্দের ভাষা ও লক্ষ্য" },
  "assessment.title": { en: "Knowledge check", bn: "জ্ঞান যাচাই" },
  "assessment.submit": { en: "Submit answers", bn: "উত্তর জমা দিন" },
  "assessment.passed": { en: "You passed", bn: "আপনি পাস করেছেন" },
  "assessment.review": { en: "Review explanations and try again", bn: "ব্যাখ্যাগুলো দেখে আবার চেষ্টা করুন" },
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

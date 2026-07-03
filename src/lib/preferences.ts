import { supabase } from "@/integrations/supabase/client";

export interface LearnerPreferences {
  user_id: string;
  primary_goal: string | null;
  interests: string[];
  experience_level: "beginner" | "intermediate" | "advanced" | "unsure" | null;
  preferred_language: "en" | "bn";
  learning_style: string | null;
  weekly_minutes: number | null;
  career_objective: string | null;
  onboarding_completed_at: string | null;
}

export async function getPreferences(userId: string): Promise<LearnerPreferences | null> {
  const { data } = await supabase
    .from("learner_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as LearnerPreferences | null) ?? null;
}

export async function savePreferences(userId: string, patch: Partial<LearnerPreferences>) {
  const { error } = await supabase
    .from("learner_preferences")
    .upsert({ user_id: userId, ...patch, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw error;
}

export async function completeOnboarding(userId: string, patch: Partial<LearnerPreferences>) {
  await savePreferences(userId, { ...patch, onboarding_completed_at: new Date().toISOString() });
}

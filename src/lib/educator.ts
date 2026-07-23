import { supabase } from "@/integrations/supabase/client";

export type ApplicationStatus = "pending" | "approved" | "rejected" | "changes_requested";
export type CourseStatus = "draft" | "submitted" | "changes_requested" | "approved" | "published" | "archived" | "rejected";

export interface EducatorApplication {
  id: string;
  user_id: string;
  full_name: string;
  headline: string;
  expertise: string[];
  credentials: string;
  sample_work_url: string | null;
  linkedin_url: string | null;
  motivation: string;
  languages: string[];
  status: ApplicationStatus;
  reviewer_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function getMyApplication(userId: string): Promise<EducatorApplication | null> {
  const { data } = await supabase
    .from("educator_applications")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as EducatorApplication | null) ?? null;
}

export async function submitApplication(
  userId: string,
  payload: Omit<EducatorApplication, "id" | "user_id" | "status" | "reviewer_notes" | "reviewed_at" | "created_at" | "updated_at">,
) {
  const existing = await getMyApplication(userId);
  if (existing) {
    const { error } = await supabase
      .from("educator_applications")
      .update({ ...payload, status: "pending" })
      .eq("id", existing.id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase
    .from("educator_applications")
    .insert({ ...payload, user_id: userId, status: "pending" });
  if (error) throw error;
}

export async function isEducator(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "educator")
    .maybeSingle();
  return !!data;
}

/* ---------- Courses ---------- */

export interface EducatorCourseRow {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  status: CourseStatus;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  updated_at: string;
  subject_id: string | null;
}

export async function listMyCourses(userId: string): Promise<EducatorCourseRow[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, short_description, status, language, difficulty, updated_at, subject_id")
    .eq("educator_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as EducatorCourseRow[];
}

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || `course-${Date.now()}`;
}

export async function createDraftCourse(userId: string, title: string, subjectId: string | null) {
  const base = slugify(title);
  const slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  const { data, error } = await supabase
    .from("courses")
    .insert({
      educator_id: userId,
      title,
      slug,
      status: "draft",
      visibility: "public",
      subject_id: subjectId,
      difficulty: "beginner",
      language: "en",
      estimated_minutes: 0,
    })
    .select("id, slug")
    .single();
  if (error) throw error;
  return data;
}

export async function updateCourseDraft(id: string, patch: Partial<{
  title: string;
  short_description: string;
  description: string;
  subject_id: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  language: string;
  estimated_minutes: number;
  outcomes: string[];
  prerequisites: string[];
  thumbnail_url: string;
}>) {
  const { error } = await supabase.from("courses").update(patch).eq("id", id);
  if (error) throw error;
}

export async function submitCourseForReview(id: string) {
  const { error } = await supabase
    .from("courses")
    .update({ status: "submitted" })
    .eq("id", id);
  if (error) throw error;
}

/* ---------- Modules & Lessons ---------- */

export interface ModuleRow {
  id: string;
  title: string;
  description: string | null;
  position: number;
}

export interface LessonRow {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  lesson_type: "text" | "video" | "link" | "embed";
  content: string | null;
  resource_url: string | null;
  estimated_minutes: number;
  position: number;
  status: "draft" | "ready" | "published" | "archived";
  is_preview: boolean;
}

export async function fetchCourseForEdit(courseId: string) {
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .maybeSingle();
  if (error) throw error;
  if (!course) return null;
  const { data: modules } = await supabase
    .from("course_modules")
    .select("id, title, description, position")
    .eq("course_id", courseId)
    .order("position");
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, module_id, slug, title, lesson_type, content, resource_url, estimated_minutes, position, status, is_preview")
    .eq("course_id", courseId)
    .order("position");
  return { course, modules: (modules ?? []) as ModuleRow[], lessons: (lessons ?? []) as LessonRow[] };
}

export async function addModule(courseId: string, title: string, position: number) {
  const { data, error } = await supabase
    .from("course_modules")
    .insert({ course_id: courseId, title, position })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function deleteModule(id: string) {
  const { error } = await supabase.from("course_modules").delete().eq("id", id);
  if (error) throw error;
}

export async function addLesson(courseId: string, moduleId: string, title: string, position: number) {
  const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 5)}`;
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      course_id: courseId,
      module_id: moduleId,
      title,
      slug,
      lesson_type: "text",
      status: "draft",
      position,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateLesson(id: string, patch: Partial<LessonRow>) {
  const { error } = await supabase.from("lessons").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteLesson(id: string) {
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) throw error;
}

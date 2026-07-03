import { supabase } from "@/integrations/supabase/client";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface SubjectRow {
  id: string;
  slug: string;
  name: string;
  name_bn: string | null;
  description: string | null;
  icon: string | null;
  display_order: number;
}

export interface CourseCard {
  id: string;
  slug: string;
  title: string;
  title_bn: string | null;
  short_description: string | null;
  difficulty: Difficulty;
  language: string;
  estimated_minutes: number;
  thumbnail_url: string | null;
  subject_id: string | null;
  subject?: { slug: string; name: string } | null;
}

export interface CourseDetail extends CourseCard {
  description: string | null;
  outcomes: string[];
  prerequisites: string[];
  published_at: string | null;
}

export interface LessonRow {
  id: string;
  slug: string;
  title: string;
  lesson_type: "text" | "video" | "link" | "embed";
  content: string | null;
  resource_url: string | null;
  estimated_minutes: number;
  position: number;
  is_preview: boolean;
  module_id: string;
}

export interface ModuleWithLessons {
  id: string;
  title: string;
  description: string | null;
  position: number;
  lessons: LessonRow[];
}

export async function fetchSubjects(): Promise<SubjectRow[]> {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, slug, name, name_bn, description, icon, display_order")
    .eq("status", "active")
    .order("display_order");
  if (error) throw error;
  return data ?? [];
}

export interface DiscoverFilters {
  q?: string;
  subjectSlug?: string;
  difficulty?: Difficulty;
  language?: string;
  limit?: number;
}

export async function fetchPublishedCourses(f: DiscoverFilters = {}): Promise<CourseCard[]> {
  let query = supabase
    .from("courses")
    .select("id, slug, title, title_bn, short_description, difficulty, language, estimated_minutes, thumbnail_url, subject_id, subjects!inner(slug, name)")
    .eq("status", "published")
    .eq("visibility", "public");

  if (f.subjectSlug) query = query.eq("subjects.slug", f.subjectSlug);
  if (f.difficulty) query = query.eq("difficulty", f.difficulty);
  if (f.language && f.language !== "all") {
    query = query.in("language", f.language === "en" ? ["en", "both"] : ["bn", "both"]);
  }
  if (f.q && f.q.trim()) {
    const term = f.q.trim().replace(/[%_]/g, "\\$&");
    query = query.or(`title.ilike.%${term}%,short_description.ilike.%${term}%,description.ilike.%${term}%`);
  }
  query = query.order("published_at", { ascending: false }).limit(f.limit ?? 24);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    ...row,
    subject: row.subjects ? { slug: row.subjects.slug, name: row.subjects.name } : null,
  }));
}

export async function fetchCourseBySlug(slug: string): Promise<{ course: CourseDetail; modules: ModuleWithLessons[] } | null> {
  const { data: course, error: e1 } = await supabase
    .from("courses")
    .select("id, slug, title, title_bn, short_description, description, difficulty, language, estimated_minutes, thumbnail_url, subject_id, outcomes, prerequisites, published_at, subjects(slug, name)")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("visibility", "public")
    .maybeSingle();
  if (e1) throw e1;
  if (!course) return null;

  const { data: modules, error: e2 } = await supabase
    .from("course_modules")
    .select("id, title, description, position")
    .eq("course_id", course.id)
    .order("position");
  if (e2) throw e2;

  const { data: lessons, error: e3 } = await supabase
    .from("lessons")
    .select("id, slug, title, lesson_type, content, resource_url, estimated_minutes, position, is_preview, module_id")
    .eq("course_id", course.id)
    .eq("status", "published")
    .order("position");
  if (e3) throw e3;

  const byModule = new Map<string, LessonRow[]>();
  (lessons ?? []).forEach((l: any) => {
    const arr = byModule.get(l.module_id) ?? [];
    arr.push(l);
    byModule.set(l.module_id, arr);
  });

  const modulesWithLessons: ModuleWithLessons[] = (modules ?? []).map((m: any) => ({
    ...m,
    lessons: byModule.get(m.id) ?? [],
  }));

  const detail: CourseDetail = {
    ...(course as any),
    subject: (course as any).subjects ? { slug: (course as any).subjects.slug, name: (course as any).subjects.name } : null,
  };
  return { course: detail, modules: modulesWithLessons };
}

export async function fetchLessonById(courseId: string, lessonId: string) {
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("id, slug, title, lesson_type, content, resource_url, estimated_minutes, position, module_id, course_id, status")
    .eq("id", lessonId)
    .eq("course_id", courseId)
    .maybeSingle();
  if (error) throw error;
  return lesson;
}

export async function enrollInCourse(userId: string, courseId: string) {
  const { error } = await supabase
    .from("enrollments")
    .upsert({ user_id: userId, course_id: courseId, status: "active", last_activity_at: new Date().toISOString() }, { onConflict: "user_id,course_id" });
  if (error) throw error;
}

export async function getEnrollment(userId: string, courseId: string) {
  const { data } = await supabase
    .from("enrollments")
    .select("id, status, enrolled_at, completed_at, last_activity_at")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  return data;
}

export async function fetchMyEnrollments(userId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("id, status, enrolled_at, last_activity_at, completed_at, courses(id, slug, title, short_description, estimated_minutes, thumbnail_url, subjects(name))")
    .eq("user_id", userId)
    .order("last_activity_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function upsertLessonProgress(userId: string, courseId: string, lessonId: string, completed: boolean) {
  const payload = {
    user_id: userId,
    course_id: courseId,
    lesson_id: lessonId,
    state: completed ? ("completed" as const) : ("in_progress" as const),
    progress_value: completed ? 100 : 50,
    completed_at: completed ? new Date().toISOString() : null,
  };
  const { error } = await supabase
    .from("lesson_progress")
    .upsert(payload, { onConflict: "user_id,lesson_id" });
  if (error) throw error;
  await supabase
    .from("enrollments")
    .update({ last_activity_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("course_id", courseId);
}

export async function fetchCourseProgress(userId: string, courseId: string) {
  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id, state, completed_at")
    .eq("user_id", userId)
    .eq("course_id", courseId);
  return data ?? [];
}

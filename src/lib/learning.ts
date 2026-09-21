import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";

export type Difficulty = Database["public"]["Enums"]["course_difficulty"];
export type ProgressState = Database["public"]["Enums"]["progress_state"];

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
  subject?: { slug: string; name: string; name_bn?: string | null } | null;
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
  lesson_type: Database["public"]["Enums"]["lesson_type"];
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

export interface EnrollmentRow {
  id: string;
  status: Database["public"]["Enums"]["enrollment_status"];
  enrolled_at: string;
  last_activity_at: string;
  completed_at: string | null;
  course_id: string;
  courses: {
    id: string;
    slug: string;
    title: string;
    title_bn: string | null;
    short_description: string | null;
    estimated_minutes: number;
    thumbnail_url: string | null;
    subjects: { name: string; name_bn: string | null } | null;
  } | null;
}

export interface ProgressSummary {
  course_id: string;
  completed_lessons: number;
  total_lessons: number;
  progress_percent: number;
  next_lesson_id: string | null;
  course_completed: boolean;
}

export interface AssessmentChoice {
  id: string;
  label: string;
  label_bn: string | null;
  position: number;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  prompt_bn: string | null;
  explanation: string | null;
  explanation_bn: string | null;
  position: number;
  points: number;
  choices: AssessmentChoice[];
}

export interface Assessment {
  id: string;
  course_id: string;
  title: string;
  title_bn: string | null;
  description: string | null;
  description_bn: string | null;
  passing_score: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentResult {
  attempt_id: string;
  score: number;
  passed: boolean;
  passing_score: number;
}

type CourseSelectRow = CourseCard & { subjects: { slug: string; name: string; name_bn: string | null } | null };
type CourseDetailSelectRow = CourseDetail & { subjects: { slug: string; name: string; name_bn: string | null } | null };

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
    .select("id, slug, title, title_bn, short_description, difficulty, language, estimated_minutes, thumbnail_url, subject_id, subjects!inner(slug, name, name_bn)")
    .eq("status", "published")
    .eq("visibility", "public");
  if (f.subjectSlug) query = query.eq("subjects.slug", f.subjectSlug);
  if (f.difficulty) query = query.eq("difficulty", f.difficulty);
  if (f.language && f.language !== "all") query = query.in("language", f.language === "en" ? ["en", "both"] : ["bn", "both"]);
  if (f.q?.trim()) {
    const term = f.q.trim().replace(/[%_]/g, "\\$&");
    query = query.or(`title.ilike.%${term}%,short_description.ilike.%${term}%,description.ilike.%${term}%`);
  }
  const { data, error } = await query.order("published_at", { ascending: false }).limit(f.limit ?? 24);
  if (error) throw error;
  return (data ?? []).map((row) => {
    const typed = row as unknown as CourseSelectRow;
    return { ...typed, subject: typed.subjects ? { slug: typed.subjects.slug, name: typed.subjects.name, name_bn: typed.subjects.name_bn } : null };
  });
}

export async function fetchCourseBySlug(slug: string): Promise<{ course: CourseDetail; modules: ModuleWithLessons[] } | null> {
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, slug, title, title_bn, short_description, description, difficulty, language, estimated_minutes, thumbnail_url, subject_id, outcomes, prerequisites, published_at, subjects(slug, name, name_bn)")
    .eq("slug", slug).eq("status", "published").eq("visibility", "public").maybeSingle();
  if (courseError) throw courseError;
  if (!course) return null;
  const { data: modules, error: moduleError } = await supabase.from("course_modules").select("id, title, description, position").eq("course_id", course.id).order("position");
  if (moduleError) throw moduleError;
  const { data: lessons, error: lessonError } = await supabase.from("lessons").select("id, slug, title, lesson_type, content, resource_url, estimated_minutes, position, is_preview, module_id").eq("course_id", course.id).eq("status", "published").order("position");
  if (lessonError) throw lessonError;
  const byModule = new Map<string, LessonRow[]>();
  (lessons ?? []).forEach((lesson) => {
    const list = byModule.get(lesson.module_id) ?? [];
    list.push(lesson);
    byModule.set(lesson.module_id, list);
  });
  const modulesWithLessons = (modules ?? []).map((module) => ({ ...module, lessons: byModule.get(module.id) ?? [] }));
  const typedCourse = course as unknown as CourseDetailSelectRow;
  return {
    course: { ...typedCourse, subject: typedCourse.subjects ? { slug: typedCourse.subjects.slug, name: typedCourse.subjects.name, name_bn: typedCourse.subjects.name_bn } : null },
    modules: modulesWithLessons,
  };
}

export async function enrollInCourse(courseId: string) {
  const { data, error } = await supabase.rpc("enroll_in_course", { p_course_id: courseId });
  if (error) throw error;
  return data;
}

export async function getEnrollment(userId: string, courseId: string) {
  const { data, error } = await supabase.from("enrollments").select("id, status, enrolled_at, completed_at, last_activity_at").eq("user_id", userId).eq("course_id", courseId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchMyEnrollments(userId: string): Promise<EnrollmentRow[]> {
  const { data, error } = await supabase.from("enrollments").select("id, status, enrolled_at, last_activity_at, completed_at, course_id, courses(id, slug, title, title_bn, short_description, estimated_minutes, thumbnail_url, subjects(name, name_bn))").eq("user_id", userId).order("last_activity_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as EnrollmentRow[];
}

export async function upsertLessonProgress(courseId: string, lessonId: string, completed: boolean) {
  const { data, error } = await supabase.rpc("record_lesson_progress", {
    p_course_id: courseId,
    p_lesson_id: lessonId,
    p_state: completed ? "completed" : "in_progress",
    p_progress_value: completed ? 100 : 50,
    p_last_position: 0,
  });
  if (error) throw error;
  return data as { course_completed: boolean; completed_lessons: number; total_lessons: number; certificate_id?: string };
}

export async function fetchCourseProgress(userId: string, courseId: string) {
  const { data, error } = await supabase.from("lesson_progress").select("lesson_id, state, completed_at, last_position, progress_value").eq("user_id", userId).eq("course_id", courseId);
  if (error) throw error;
  return data ?? [];
}

export async function fetchCourseProgressSummary(courseId: string): Promise<ProgressSummary> {
  const { data, error } = await supabase.rpc("get_course_progress_summary", { p_course_id: courseId });
  if (error) throw error;
  const summary = data?.[0];
  return summary ?? { course_id: courseId, completed_lessons: 0, total_lessons: 0, progress_percent: 0, next_lesson_id: null, course_completed: false };
}

export async function fetchAssessmentsForCourse(courseId: string): Promise<Assessment[]> {
  const { data: assessments, error } = await supabase.from("assessments").select("id, course_id, title, title_bn, description, description_bn, passing_score").eq("course_id", courseId).eq("status", "published").order("created_at");
  if (error) throw error;
  const results: Assessment[] = [];
  for (const assessment of assessments ?? []) {
    const { data: questions, error: questionError } = await supabase.from("assessment_questions").select("id, prompt, prompt_bn, explanation, explanation_bn, position, points").eq("assessment_id", assessment.id).order("position");
    if (questionError) throw questionError;
    const questionResults: AssessmentQuestion[] = [];
    for (const question of questions ?? []) {
      const { data: choices, error: choiceError } = await supabase.from("assessment_choices").select("id, label, label_bn, position").eq("question_id", question.id).order("position");
      if (choiceError) throw choiceError;
      questionResults.push({ ...question, choices: choices ?? [] });
    }
    results.push({ ...assessment, questions: questionResults });
  }
  return results;
}

export async function submitAssessmentAttempt(assessmentId: string, answers: Array<{ question_id: string; choice_id?: string }>): Promise<AssessmentResult> {
  const payload: Json[] = answers.map((answer) => ({ question_id: answer.question_id, choice_id: answer.choice_id ?? null }));
  const { data, error } = await supabase.rpc("submit_assessment_attempt", { p_assessment_id: assessmentId, p_answers: payload });
  if (error) throw error;
  return data as unknown as AssessmentResult;
}

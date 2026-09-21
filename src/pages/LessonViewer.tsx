import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCourseBySlug, fetchCourseProgress, getEnrollment, upsertLessonProgress, type CourseDetail, type LessonRow, type ModuleWithLessons } from "@/lib/learning";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import OrbitGlyph from "@/components/orbit/OrbitGlyph";

const LessonViewer = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [enrolled, setEnrolled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      setLoading(true);
      // Look up the course by id (slug is used in fetchCourseBySlug — we need id-based)
      const { data: c } = await supabase
        .from("courses")
        .select("slug")
        .eq("id", courseId)
        .eq("status", "published")
        .eq("visibility", "public")
        .maybeSingle();
      if (!c) { setLoading(false); return; }
      const result = await fetchCourseBySlug(c.slug);
      if (result) { setCourse(result.course); setModules(result.modules); }
      setLoading(false);
    })();
  }, [courseId]);

  useEffect(() => {
    if (!user || !courseId) return;
    getEnrollment(user.id, courseId).then((e) => setEnrolled(!!e));
    fetchCourseProgress(user.id, courseId).then((rows) =>
      setCompleted(new Set(rows.filter((r) => r.state === "completed").map((r) => r.lesson_id)))
    );
  }, [user, courseId, lessonId]);

  const flatLessons: LessonRow[] = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);
  const currentIndex = flatLessons.findIndex((l) => l.id === lessonId);
  const current = flatLessons[currentIndex];
  const prev = flatLessons[currentIndex - 1];
  const next = flatLessons[currentIndex + 1];

  useEffect(() => { if (current) document.title = `${current.title} — GURUsphere`; }, [current]);

  const canAccess = current?.is_preview || enrolled;

  const handleComplete = async () => {
    if (!user || !current || !courseId) { navigate(`/login?redirect=/learn/${courseId}/lessons/${lessonId}`); return; }
    setSaving(true);
    try {
      const result = await upsertLessonProgress(courseId, current.id, true);
      setCompleted((s) => new Set(s).add(current.id));
      toast({ title: result.course_completed ? "Course completed" : "Marked complete", description: result.course_completed ? "Your completion record is ready for certification." : undefined });
      if (next) navigate(`/learn/${courseId}/lessons/${next.id}`);
    } catch (e: unknown) {
      toast({ title: "Couldn't save progress", description: e instanceof Error ? e.message : "Please try again.", variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (loading || authLoading) {
    return <div className="orbit min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--surface-base))" }}>
      <p style={{ color: "hsl(var(--foreground-subtle))" }}>Loading lesson…</p>
    </div>;
  }
  if (!course || !current) {
    return (
      <div className="orbit min-h-screen flex items-center justify-center px-6" style={{ background: "hsl(var(--surface-base))" }}>
        <div className="text-center">
          <h1 className="text-2xl mb-3" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>Lesson unavailable</h1>
          <Link to="/discover" className="orbit-btn orbit-btn-primary">Browse courses</Link>
        </div>
      </div>
    );
  }
  if (!canAccess) {
    return (
      <div className="orbit min-h-screen flex items-center justify-center px-6" style={{ background: "hsl(var(--surface-base))" }}>
        <div className="text-center max-w-md">
          <h1 className="text-2xl mb-3" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>Enroll to access</h1>
          <p className="mb-6" style={{ color: "hsl(var(--foreground-muted))" }}>This lesson is available after you enroll — it's free.</p>
          <Link to={`/courses/${course.slug}`} className="orbit-btn orbit-btn-primary">Go to course</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orbit min-h-screen flex flex-col" style={{ background: "hsl(var(--surface-base))" }}>
      <header className="sticky top-0 z-40" style={{ background: "hsl(var(--surface))", borderBottom: "1px solid hsl(var(--border))" }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to={`/courses/${course.slug}`} aria-label="Back to course" className="orbit-btn orbit-btn-ghost" style={{ minHeight: 32, padding: "0 0.5rem" }}>
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              <OrbitGlyph size={18} />
              <span className="truncate text-[13px]" style={{ color: "hsl(var(--foreground-muted))" }}>{course.title}</span>
            </div>
          </div>
          <div className="text-[12px] hidden sm:block" style={{ color: "hsl(var(--foreground-subtle))" }}>
            Lesson {currentIndex + 1} of {flatLessons.length}
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] max-w-[1200px] w-full mx-auto">
        <aside className="border-r hidden lg:block px-4 py-6 max-h-[calc(100vh-56px)] overflow-y-auto" style={{ borderColor: "hsl(var(--border))" }}>
          <nav aria-label="Course lessons">
            {modules.map((m) => (
              <div key={m.id} className="mb-4">
                <div className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "hsl(var(--foreground-subtle))" }}>{m.title}</div>
                <ul className="space-y-0.5">
                  {m.lessons.map((l) => {
                    const active = l.id === current.id;
                    const done = completed.has(l.id);
                    return (
                      <li key={l.id}>
                        <Link to={`/learn/${courseId}/lessons/${l.id}`}
                          className="flex items-center gap-2 px-2 py-1.5 rounded text-[13px]"
                          style={{
                            background: active ? "hsl(var(--surface-raised))" : "transparent",
                            color: active ? "hsl(var(--foreground))" : "hsl(var(--foreground-muted))",
                            fontWeight: active ? 600 : 400,
                          }}>
                          {done ? <CheckCircle2 size={14} style={{ color: "hsl(var(--orbit-primary))" }} /> : <span style={{ width: 14, height: 14, borderRadius: 9999, border: "1px solid hsl(var(--border-strong))" }} />}
                          <span className="truncate">{l.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="px-6 md:px-12 py-10 max-w-[720px] mx-auto w-full">
          <div className="orbit-eyebrow mb-3">{current.estimated_minutes} min read</div>
          <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-tight mb-6" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>
            {current.title}
          </h1>

          {current.lesson_type === "video" && current.resource_url && (
            <div className="aspect-video mb-6 rounded-xl overflow-hidden" style={{ background: "hsl(var(--surface))" }}>
              <iframe src={current.resource_url} title={current.title} className="w-full h-full" allowFullScreen />
            </div>
          )}

          <article className="prose max-w-none" style={{ color: "hsl(var(--foreground-muted))", fontSize: 16, lineHeight: 1.75 }}>
            {(current.content ?? "").split("\n\n").map((para, i) => (
              <p key={i} className="mb-4">{para}</p>
            ))}
            {current.resource_url && current.lesson_type === "link" && (
              <p><a href={current.resource_url} target="_blank" rel="noreferrer" style={{ color: "hsl(var(--orbit-primary))" }}>Open resource →</a></p>
            )}
          </article>

          <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: "1px solid hsl(var(--border))" }}>
            <button
              onClick={() => prev && navigate(`/learn/${courseId}/lessons/${prev.id}`)}
              disabled={!prev}
              className="orbit-btn orbit-btn-ghost"
              style={{ minHeight: 40, opacity: prev ? 1 : 0.4 }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            {completed.has(current.id) ? (
              <button onClick={() => next && navigate(`/learn/${courseId}/lessons/${next.id}`)}
                className="orbit-btn orbit-btn-primary" style={{ minHeight: 40 }} disabled={!next}>
                Next lesson <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleComplete} disabled={saving} className="orbit-btn orbit-btn-primary" style={{ minHeight: 40 }}>
                {saving ? "Saving…" : "Mark complete"}
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonViewer;

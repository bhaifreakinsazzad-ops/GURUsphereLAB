import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Clock, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import OrbitNavbar from "@/components/orbit/OrbitNavbar";
import OrbitFooter from "@/components/orbit/OrbitFooter";
import { fetchCourseBySlug, enrollInCourse, getEnrollment, fetchCourseProgress, fetchAssessmentsForCourse, type Assessment, type CourseDetail, type ModuleWithLessons } from "@/lib/learning";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const CourseDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [enrolling, setEnrolling] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchCourseBySlug(slug).then((result) => {
      if (!result) { setNotFound(true); return; }
      setCourse(result.course);
      setModules(result.modules);
      fetchAssessmentsForCourse(result.course.id).then(setAssessments).catch(() => setAssessments([]));
      document.title = `${result.course.title} — GURUsphere`;
    }).catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!user || !course) return;
    getEnrollment(user.id, course.id).then((e) => setEnrolled(!!e));
    fetchCourseProgress(user.id, course.id).then((rows) => {
      setCompletedLessons(new Set(rows.filter((r) => r.state === "completed").map((r) => r.lesson_id)));
    });
  }, [user, course]);

  const firstLesson = useMemo(() => modules.flatMap((m) => m.lessons)[0], [modules]);
  const totalLessons = useMemo(() => modules.reduce((n, m) => n + m.lessons.length, 0), [modules]);

  const handleEnroll = async () => {
    if (!user) { navigate(`/login?redirect=/courses/${slug}`); return; }
    if (!course) return;
    setEnrolling(true);
    try {
      await enrollInCourse(user.id, course.id);
      setEnrolled(true);
      toast({ title: "You're enrolled", description: "Start with the first lesson." });
      if (firstLesson) navigate(`/learn/${course.id}/lessons/${firstLesson.id}`);
    } catch (e: unknown) {
      toast({ title: "Couldn't enroll", description: e instanceof Error ? e.message : "Please try again.", variant: "destructive" });
    } finally { setEnrolling(false); }
  };

  if (loading) {
    return <div className="orbit min-h-screen"><OrbitNavbar /><div className="pt-40 text-center" style={{ color: "hsl(var(--foreground-subtle))" }}>Loading course…</div></div>;
  }
  if (notFound || !course) {
    return (
      <div className="orbit min-h-screen"><OrbitNavbar />
        <div className="pt-40 pb-20 text-center px-6">
          <h1 className="text-2xl mb-3" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>Course not found</h1>
          <Link to="/discover" className="orbit-btn orbit-btn-primary">Browse courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orbit min-h-screen flex flex-col">
      <OrbitNavbar />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div>
            {course.subject && (
              <Link to={`/discover?subject=${course.subject.slug}`} className="orbit-eyebrow inline-block mb-3" style={{ color: "hsl(var(--orbit-accent))" }}>
                {course.subject.name}
              </Link>
            )}
            <h1 className="text-[clamp(1.75rem,4vw,3rem)] leading-tight mb-4" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>
              {course.title}
            </h1>
            {course.short_description && (
              <p className="text-[17px] mb-6" style={{ color: "hsl(var(--foreground-muted))" }}>{course.short_description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-[13px] mb-8" style={{ color: "hsl(var(--foreground-subtle))" }}>
              <span className="capitalize">{course.difficulty}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={14} />{Math.round(course.estimated_minutes / 60) || 1}h</span>
              <span>·</span>
              <span>{totalLessons} lessons</span>
              <span>·</span>
              <span>{course.language === "bn" ? "বাংলা" : course.language === "both" ? "EN + বাংলা" : "English"}</span>
            </div>

            {course.description && (
              <section className="mb-10">
                <h2 className="text-[1.25rem] mb-3" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>About this course</h2>
                <p className="text-[15px] leading-relaxed" style={{ color: "hsl(var(--foreground-muted))" }}>{course.description}</p>
              </section>
            )}

            {course.outcomes.length > 0 && (
              <section className="mb-10">
                <h2 className="text-[1.25rem] mb-3" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>What you'll learn</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-[14px]" style={{ color: "hsl(var(--foreground-muted))" }}>
                      <Sparkles size={16} style={{ color: "hsl(var(--orbit-accent))", flexShrink: 0, marginTop: 2 }} /> {o}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {course.prerequisites.length > 0 && (
              <section className="mb-10">
                <h2 className="text-[1.25rem] mb-3" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>Prerequisites</h2>
                <ul className="list-disc pl-5 space-y-1 text-[14px]" style={{ color: "hsl(var(--foreground-muted))" }}>
                  {course.prerequisites.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-[1.25rem] mb-4" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>Curriculum</h2>
              <div className="space-y-4">
                {modules.map((m) => (
                  <div key={m.id} className="orbit-card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-[1rem]" style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{m.title}</h3>
                        {m.description && <p className="text-[13px] mt-1" style={{ color: "hsl(var(--foreground-subtle))" }}>{m.description}</p>}
                      </div>
                      <span className="text-[12px]" style={{ color: "hsl(var(--foreground-subtle))" }}>{m.lessons.length} lessons</span>
                    </div>
                    <ul className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
                      {m.lessons.map((l) => {
                        const done = completedLessons.has(l.id);
                        const accessible = enrolled || l.is_preview;
                        return (
                          <li key={l.id}>
                            {accessible ? (
                              <Link to={`/learn/${course.id}/lessons/${l.id}`} className="flex items-center justify-between py-2.5 hover:opacity-90">
                                <div className="flex items-center gap-3 text-[14px]" style={{ color: "hsl(var(--foreground))" }}>
                                  {done ? <CheckCircle2 size={16} style={{ color: "hsl(var(--orbit-primary))" }} /> : <span style={{ width: 16, height: 16, borderRadius: 9999, border: "1px solid hsl(var(--border-strong))" }} />}
                                  <span>{l.title}</span>
                                  {l.is_preview && !enrolled && <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: "hsl(var(--surface-raised))", color: "hsl(var(--foreground-subtle))" }}>Preview</span>}
                                </div>
                                <div className="flex items-center gap-2 text-[12px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
                                  <span>{l.estimated_minutes}m</span>
                                  <ChevronRight size={14} />
                                </div>
                              </Link>
                            ) : (
                              <div className="flex items-center justify-between py-2.5 opacity-60">
                                <div className="flex items-center gap-3 text-[14px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
                                  <span style={{ width: 16, height: 16, borderRadius: 9999, border: "1px solid hsl(var(--border-strong))" }} />
                                  <span>{l.title}</span>
                                </div>
                                <span className="text-[12px]" style={{ color: "hsl(var(--foreground-subtle))" }}>{l.estimated_minutes}m</span>
                              </div>
                            )}
                          </li>
                        );
                      })}
                      {m.lessons.length === 0 && <li className="py-2 text-[13px]" style={{ color: "hsl(var(--foreground-subtle))" }}>No lessons yet.</li>}
                    </ul>
                  </div>
                ))}
                {modules.length === 0 && (
                  <p className="text-[14px]" style={{ color: "hsl(var(--foreground-subtle))" }}>Curriculum coming soon.</p>
                )}
              </div>
            </section>
            {enrolled && assessments.length > 0 && (
              <section className="mt-10">
                <h2 className="text-[1.25rem] mb-4" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>Practice & feedback</h2>
                <div className="space-y-3">
                  {assessments.map((assessment) => (
                    <Link key={assessment.id} to={`/learn/${course.id}/assessment/${assessment.id}`} className="orbit-card p-5 flex items-center justify-between gap-4">
                      <div><h3 className="text-[15px]" style={{ color: "hsl(var(--foreground))" }}>{assessment.title}</h3><p className="text-[13px] mt-1" style={{ color: "hsl(var(--foreground-subtle))" }}>{assessment.questions.length} questions · Pass mark {assessment.passing_score}%</p></div>
                      <ChevronRight size={16} style={{ color: "hsl(var(--orbit-primary))" }} />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside>
            <div className="orbit-card p-6 sticky" style={{ top: 96 }}>
              <div className="orbit-eyebrow mb-2">Free</div>
              <div className="text-[1.5rem] mb-4" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>
                Start today
              </div>
              {enrolled ? (
                <button
                  onClick={() => firstLesson && navigate(`/learn/${course.id}/lessons/${firstLesson.id}`)}
                  className="orbit-btn orbit-btn-primary w-full mb-3"
                  style={{ minHeight: 44 }}
                >
                  Continue learning
                </button>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling} className="orbit-btn orbit-btn-primary w-full mb-3" style={{ minHeight: 44 }}>
                  {enrolling ? "Enrolling…" : "Enroll — it's free"}
                </button>
              )}
              <ul className="text-[13px] space-y-2" style={{ color: "hsl(var(--foreground-muted))" }}>
                <li>✓ Lifetime access</li>
                <li>✓ Learn at your pace</li>
                <li>✓ Progress saved automatically</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <OrbitFooter />
    </div>
  );
};

export default CourseDetailPage;

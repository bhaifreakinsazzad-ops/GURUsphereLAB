import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import OrbitNavbar from "@/components/orbit/OrbitNavbar";
import OrbitFooter from "@/components/orbit/OrbitFooter";
import { fetchCourseProgressSummary, fetchMyEnrollments, fetchPublishedCourses, type CourseCard, type EnrollmentRow, type ProgressSummary } from "@/lib/learning";
import { getPreferences, type LearnerPreferences } from "@/lib/preferences";
import { useT } from "@/lib/i18n";

const MyLearning = () => {
  const { user } = useAuth();
  const t = useT();
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [summaries, setSummaries] = useState<Record<string, ProgressSummary>>({});
  const [prefs, setPrefs] = useState<LearnerPreferences | null>(null);
  const [recommended, setRecommended] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [enrs, pref] = await Promise.all([fetchMyEnrollments(user.id), getPreferences(user.id)]);
        if (cancelled) return;
        setEnrollments(enrs);
        setPrefs(pref);
        const nextSummaries = await Promise.all(enrs.map(async (enrollment) => [enrollment.course_id, await fetchCourseProgressSummary(enrollment.course_id)] as const));
        if (cancelled) return;
        setSummaries(Object.fromEntries(nextSummaries));
        const recs = await fetchPublishedCourses({ subjectSlug: pref?.interests?.[0], limit: 6 });
        const enrolledIds = new Set(enrs.map((enrollment) => enrollment.course_id));
        if (!cancelled) setRecommended(recs.filter((course) => !enrolledIds.has(course.id)).slice(0, 3));
      } catch (requestError) {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Unable to load your learning data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const inProgress = enrollments.filter((enrollment) => enrollment.status === "active");
  const done = enrollments.filter((enrollment) => enrollment.status === "completed");

  const courseLink = (enrollment: EnrollmentRow) => {
    const summary = summaries[enrollment.course_id];
    return summary?.next_lesson_id ? `/learn/${enrollment.course_id}/lessons/${summary.next_lesson_id}` : `/courses/${enrollment.courses?.slug ?? ""}`;
  };

  return (
    <div className="orbit min-h-screen flex flex-col">
      <OrbitNavbar />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-[1120px] mx-auto">
          <div className="orbit-eyebrow mb-2">{t("my.title")}</div>
          <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] mb-8" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>
            {prefs?.primary_goal ?? t("my.continue")}
          </h1>

          {error && <div role="alert" className="orbit-card p-4 mb-6 text-sm" style={{ color: "hsl(var(--destructive))" }}>{error}</div>}
          {loading ? <p style={{ color: "hsl(var(--foreground-subtle))" }}>{t("common.loading")}</p> : enrollments.length === 0 ? (
            <div className="orbit-card p-10 text-center">
              <h2 className="text-[1.25rem] mb-2" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>{t("my.empty")}</h2>
              <p className="mb-6 text-[14px]" style={{ color: "hsl(var(--foreground-subtle))" }}>{t("my.empty_hint")}</p>
              <Link to="/discover" className="orbit-btn orbit-btn-primary">{t("my.browse")}</Link>
            </div>
          ) : (
            <>
              {inProgress.length > 0 && <section className="mb-12">
                <h2 className="text-[1.125rem] mb-4" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>{t("my.continue")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {inProgress.map((enrollment) => {
                    const summary = summaries[enrollment.course_id];
                    const course = enrollment.courses;
                    if (!course) return null;
                    return <Link key={enrollment.id} to={courseLink(enrollment)} className="orbit-card p-6 block hover:-translate-y-0.5 transition-transform">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        {course.subjects && <div className="orbit-eyebrow" style={{ color: "hsl(var(--orbit-accent))" }}>{course.subjects.name}</div>}
                        <PlayCircle size={18} style={{ color: "hsl(var(--orbit-primary))" }} />
                      </div>
                      <h3 className="text-[1rem] mb-2" style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{course.title}</h3>
                      <p className="text-[13px] mb-4 line-clamp-2" style={{ color: "hsl(var(--foreground-subtle))" }}>{course.short_description}</p>
                      <div className="h-1.5 rounded-full mb-2" style={{ background: "hsl(var(--border))" }}><div className="h-full rounded-full" style={{ width: `${summary?.progress_percent ?? 0}%`, background: "hsl(var(--orbit-primary))" }} /></div>
                      <div className="flex justify-between text-[12px]" style={{ color: "hsl(var(--foreground-subtle))" }}><span>{summary?.completed_lessons ?? 0}/{summary?.total_lessons ?? 0} {t("my.lessons")}</span><span>{summary?.progress_percent ?? 0}%</span></div>
                    </Link>;
                  })}
                </div>
              </section>}

              {done.length > 0 && <section className="mb-12">
                <h2 className="text-[1.125rem] mb-4" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>{t("my.completed")}</h2>
                <ul className="space-y-2">{done.map((enrollment) => enrollment.courses && <li key={enrollment.id}><Link to={`/courses/${enrollment.courses.slug}`} className="flex items-center gap-2 text-[14px]" style={{ color: "hsl(var(--foreground))" }}><CheckCircle2 size={16} style={{ color: "hsl(var(--orbit-primary))" }} />{enrollment.courses.title}</Link></li>)}</ul>
              </section>}
            </>
          )}

          {recommended.length > 0 && <section className="mb-12"><h2 className="text-[1.125rem] mb-4" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>{t("my.recommended")}</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{recommended.map((course) => <Link key={course.id} to={`/courses/${course.slug}`} className="orbit-card p-6 block"><div className="flex items-center gap-1 text-[12px] mb-2" style={{ color: "hsl(var(--foreground-subtle))" }}><Clock size={12} /> {Math.round(course.estimated_minutes / 60) || 1}h</div><h3 className="text-[1rem] mb-2" style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{course.title}</h3><p className="text-[13px] line-clamp-2" style={{ color: "hsl(var(--foreground-subtle))" }}>{course.short_description}</p></Link>)}</div></section>}
          <Link to="/onboarding" className="text-[13px]" style={{ color: "hsl(var(--foreground-subtle))" }}>{t("my.prefs")} →</Link>
        </div>
      </main>
      <OrbitFooter />
    </div>
  );
};

export default MyLearning;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import OrbitNavbar from "@/components/orbit/OrbitNavbar";
import OrbitFooter from "@/components/orbit/OrbitFooter";
import { fetchMyEnrollments, fetchPublishedCourses, type CourseCard } from "@/lib/learning";
import { getPreferences, type LearnerPreferences } from "@/lib/preferences";

interface EnrollmentRow {
  id: string;
  status: string;
  last_activity_at: string;
  completed_at: string | null;
  courses: {
    id: string; slug: string; title: string; short_description: string | null;
    estimated_minutes: number; thumbnail_url: string | null;
    subjects: { name: string } | null;
  } | null;
}

const MyLearning = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [prefs, setPrefs] = useState<LearnerPreferences | null>(null);
  const [recommended, setRecommended] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [enrs, pref] = await Promise.all([
        fetchMyEnrollments(user.id),
        getPreferences(user.id),
      ]);
      setEnrollments(enrs as unknown as EnrollmentRow[]);
      setPrefs(pref);
      // rules-based recommendation: pick from first interested subject, else popular
      const subjectSlug = pref?.interests?.[0];
      const recs = await fetchPublishedCourses({ subjectSlug, limit: 6 });
      const enrolledIds = new Set((enrs as any).map((e: any) => e.courses?.id).filter(Boolean));
      setRecommended(recs.filter((c) => !enrolledIds.has(c.id)).slice(0, 3));
      setLoading(false);
    })();
  }, [user]);

  const inProgress = enrollments.filter((e) => e.status === "active");
  const done = enrollments.filter((e) => e.status === "completed");

  return (
    <div className="orbit min-h-screen flex flex-col">
      <OrbitNavbar />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-[1120px] mx-auto">
          <div className="orbit-eyebrow mb-2">My learning</div>
          <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] mb-8" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>
            {prefs?.primary_goal ? prefs.primary_goal : "Keep going"}
          </h1>

          {loading ? (
            <p style={{ color: "hsl(var(--foreground-subtle))" }}>Loading…</p>
          ) : enrollments.length === 0 ? (
            <div className="orbit-card p-10 text-center">
              <h2 className="text-[1.25rem] mb-2" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>
                You haven't enrolled in a course yet
              </h2>
              <p className="mb-6 text-[14px]" style={{ color: "hsl(var(--foreground-subtle))" }}>Pick one and start today — everything is free.</p>
              <Link to="/discover" className="orbit-btn orbit-btn-primary">Browse courses</Link>
            </div>
          ) : (
            <>
              {inProgress.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-[1.125rem] mb-4" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>Continue learning</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {inProgress.map((e) => e.courses && (
                      <Link key={e.id} to={`/courses/${e.courses.slug}`} className="orbit-card p-6 block">
                        {e.courses.subjects && <div className="orbit-eyebrow mb-2" style={{ color: "hsl(var(--orbit-accent))" }}>{e.courses.subjects.name}</div>}
                        <h3 className="text-[1rem] mb-2" style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{e.courses.title}</h3>
                        <p className="text-[13px] mb-4 line-clamp-2" style={{ color: "hsl(var(--foreground-subtle))" }}>{e.courses.short_description}</p>
                        <div className="flex items-center gap-1 text-[12px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
                          <Clock size={12} /> {Math.round(e.courses.estimated_minutes / 60) || 1}h
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {done.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-[1.125rem] mb-4" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>Completed</h2>
                  <ul className="space-y-2">
                    {done.map((e) => e.courses && (
                      <li key={e.id}>
                        <Link to={`/courses/${e.courses.slug}`} className="text-[14px]" style={{ color: "hsl(var(--foreground))" }}>
                          {e.courses.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}

          {recommended.length > 0 && (
            <section className="mb-12">
              <h2 className="text-[1.125rem] mb-4" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>Recommended for you</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommended.map((c) => (
                  <Link key={c.id} to={`/courses/${c.slug}`} className="orbit-card p-6 block">
                    {c.subject && <div className="orbit-eyebrow mb-2" style={{ color: "hsl(var(--orbit-accent))" }}>{c.subject.name}</div>}
                    <h3 className="text-[1rem] mb-2" style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{c.title}</h3>
                    <p className="text-[13px] mb-4 line-clamp-2" style={{ color: "hsl(var(--foreground-subtle))" }}>{c.short_description}</p>
                    <div className="text-[12px] capitalize" style={{ color: "hsl(var(--foreground-subtle))" }}>{c.difficulty}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8">
            <Link to="/onboarding" className="text-[13px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
              Update learning preferences →
            </Link>
          </div>
        </div>
      </main>
      <OrbitFooter />
    </div>
  );
};

export default MyLearning;

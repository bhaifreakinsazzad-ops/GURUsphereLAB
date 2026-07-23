import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import OrbitNavbar from "@/components/orbit/OrbitNavbar";
import OrbitFooter from "@/components/orbit/OrbitFooter";
import { createDraftCourse, isEducator, listMyCourses, type EducatorCourseRow, type CourseStatus } from "@/lib/educator";
import { fetchSubjects, type SubjectRow } from "@/lib/learning";
import { toast } from "@/hooks/use-toast";

const STATUS_LABEL: Record<CourseStatus, string> = {
  draft: "Draft",
  submitted: "Under review",
  changes_requested: "Changes requested",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
  rejected: "Rejected",
};

const STATUS_COLOR: Record<CourseStatus, string> = {
  draft: "hsl(var(--foreground-subtle))",
  submitted: "hsl(35 90% 55%)",
  changes_requested: "hsl(35 90% 55%)",
  approved: "hsl(160 70% 45%)",
  published: "hsl(160 70% 45%)",
  archived: "hsl(var(--foreground-subtle))",
  rejected: "hsl(0 70% 55%)",
};

const EducatorWorkspace = () => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [courses, setCourses] = useState<EducatorCourseRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { nav("/login?redirect=/educator"); return; }
    (async () => {
      const ok = await isEducator(user.id);
      setAllowed(ok);
      if (ok) {
        const [c, s] = await Promise.all([listMyCourses(user.id), fetchSubjects()]);
        setCourses(c); setSubjects(s);
      }
    })();
  }, [user, loading, nav]);

  const create = async () => {
    if (!user || !newTitle.trim()) return;
    setBusy(true);
    try {
      const c = await createDraftCourse(user.id, newTitle.trim(), newSubject || null);
      nav(`/educator/courses/${c.id}`);
    } catch (e: any) {
      toast({ title: "Could not create", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  if (allowed === null) {
    return (
      <div className="orbit min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--surface))" }}>
        <p style={{ color: "hsl(var(--foreground-subtle))" }}>Loading…</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="orbit min-h-screen flex flex-col">
        <OrbitNavbar />
        <main className="flex-1 pt-32 pb-20 px-6 flex items-center justify-center">
          <div className="orbit-card p-8 max-w-[520px] text-center">
            <h1 className="text-[1.5rem] mb-3" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>
              Educator access required
            </h1>
            <p className="mb-6 text-[14px]" style={{ color: "hsl(var(--foreground-muted))" }}>
              To create courses on GURUsphere, apply to become an educator. Approval usually takes a few days.
            </p>
            <Link to="/teach/apply" className="orbit-btn orbit-btn-primary">Apply now</Link>
          </div>
        </main>
        <OrbitFooter />
      </div>
    );
  }

  const input = "w-full px-4 py-3 rounded-lg text-[14px] outline-none";
  const inputStyle = { background: "hsl(var(--surface-raised))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" };

  return (
    <div className="orbit min-h-screen flex flex-col">
      <OrbitNavbar />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-[1120px] mx-auto">
          <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
            <div>
              <div className="orbit-eyebrow mb-2">Educator workspace</div>
              <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)]" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>
                Your courses
              </h1>
            </div>
            <button onClick={() => setShowNew((s) => !s)} className="orbit-btn orbit-btn-primary">
              <Plus size={16} /> New course
            </button>
          </div>

          {showNew && (
            <div className="orbit-card p-6 mb-8 space-y-4">
              <div>
                <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Course title</label>
                <input autoFocus className={input} style={inputStyle} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Subject</label>
                <select className={input} style={inputStyle} value={newSubject} onChange={(e) => setNewSubject(e.target.value)}>
                  <option value="">— Choose a subject —</option>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button disabled={busy || !newTitle.trim()} onClick={create} className="orbit-btn orbit-btn-primary">
                  {busy ? "Creating…" : "Create draft"}
                </button>
                <button onClick={() => setShowNew(false)} className="orbit-btn">Cancel</button>
              </div>
            </div>
          )}

          {courses.length === 0 ? (
            <div className="orbit-card p-10 text-center">
              <p className="text-[14px]" style={{ color: "hsl(var(--foreground-subtle))" }}>No courses yet. Click "New course" to start your first draft.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((c) => (
                <Link key={c.id} to={`/educator/courses/${c.id}`} className="orbit-card p-6 block">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] uppercase tracking-wide" style={{ color: STATUS_COLOR[c.status] }}>
                      {STATUS_LABEL[c.status]}
                    </span>
                    <span className="text-[11px] capitalize" style={{ color: "hsl(var(--foreground-subtle))" }}>{c.difficulty}</span>
                  </div>
                  <h3 className="text-[1rem] mb-2" style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{c.title}</h3>
                  {c.short_description && (
                    <p className="text-[13px] line-clamp-2" style={{ color: "hsl(var(--foreground-subtle))" }}>{c.short_description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <OrbitFooter />
    </div>
  );
};

export default EducatorWorkspace;

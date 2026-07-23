import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import OrbitNavbar from "@/components/orbit/OrbitNavbar";
import OrbitFooter from "@/components/orbit/OrbitFooter";
import {
  addLesson, addModule, deleteLesson, deleteModule,
  fetchCourseForEdit, submitCourseForReview, updateCourseDraft, updateLesson,
  type LessonRow, type ModuleRow, type CourseStatus,
} from "@/lib/educator";
import { fetchSubjects, type SubjectRow } from "@/lib/learning";
import { toast } from "@/hooks/use-toast";

const STATUS_LABEL: Record<CourseStatus, string> = {
  draft: "Draft",
  submitted: "Under review",
  changes_requested: "Changes requested",
  approved: "Approved (awaiting publish)",
  published: "Published",
  archived: "Archived",
  rejected: "Rejected",
};

const CourseEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!id) return;
    try {
      const r = await fetchCourseForEdit(id);
      if (!r) { setLoadErr("Course not found or you don't have access."); return; }
      setCourse(r.course); setModules(r.modules); setLessons(r.lessons);
    } catch (e: any) { setLoadErr(e.message); }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) { nav("/login"); return; }
    load();
    fetchSubjects().then(setSubjects);
  }, [id, user, loading, nav]);

  if (loadErr) {
    return (
      <div className="orbit min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--surface))" }}>
        <div className="orbit-card p-8 max-w-md text-center">
          <p className="mb-4 text-[14px]" style={{ color: "hsl(var(--foreground-muted))" }}>{loadErr}</p>
          <Link to="/educator" className="orbit-btn orbit-btn-primary">Back to workspace</Link>
        </div>
      </div>
    );
  }
  if (!course) return null;

  const editable = ["draft", "submitted", "changes_requested"].includes(course.status);
  const canEditFields = ["draft", "changes_requested"].includes(course.status);

  const saveCourse = async (patch: any) => {
    setSaving(true);
    try {
      await updateCourseDraft(course.id, patch);
      setCourse({ ...course, ...patch });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const submit = async () => {
    if (!course.short_description || !course.description) {
      toast({ title: "Add descriptions", description: "Short and full descriptions are required before submitting.", variant: "destructive" }); return;
    }
    if (lessons.length === 0) {
      toast({ title: "Add at least one lesson", variant: "destructive" }); return;
    }
    try {
      await submitCourseForReview(course.id);
      toast({ title: "Submitted for review" });
      load();
    } catch (e: any) { toast({ title: "Submit failed", description: e.message, variant: "destructive" }); }
  };

  const input = "w-full px-4 py-3 rounded-lg text-[14px] outline-none";
  const inputStyle = { background: "hsl(var(--surface-raised))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" };

  return (
    <div className="orbit min-h-screen flex flex-col">
      <OrbitNavbar />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-[900px] mx-auto">
          <Link to="/educator" className="inline-flex items-center gap-2 text-[13px] mb-6" style={{ color: "hsl(var(--foreground-subtle))" }}>
            <ArrowLeft size={14} /> Back to workspace
          </Link>

          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div>
              <div className="orbit-eyebrow mb-2">Course editor</div>
              <h1 className="text-[clamp(1.5rem,3vw,2rem)]" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>
                {course.title}
              </h1>
              <p className="mt-1 text-[13px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
                Status: <strong style={{ color: "hsl(var(--foreground))" }}>{STATUS_LABEL[course.status as CourseStatus]}</strong>
              </p>
            </div>
            {course.status === "draft" || course.status === "changes_requested" ? (
              <button onClick={submit} className="orbit-btn orbit-btn-primary"><Send size={14} /> Submit for review</button>
            ) : null}
          </div>

          {!editable && (
            <div className="orbit-card p-4 mb-6 text-[13px]" style={{ color: "hsl(var(--foreground-muted))" }}>
              This course is locked while it's {STATUS_LABEL[course.status as CourseStatus].toLowerCase()}.
              {course.status === "published" && " Publicly visible on Discover."}
            </div>
          )}

          {/* Course fields */}
          <section className="orbit-card p-6 mb-6 space-y-4">
            <h2 className="text-[1rem] mb-2" style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>Details</h2>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Title</label>
              <input disabled={!canEditFields} className={input} style={inputStyle} defaultValue={course.title}
                onBlur={(e) => e.target.value !== course.title && saveCourse({ title: e.target.value })} />
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Short description (1–2 lines)</label>
              <input disabled={!canEditFields} maxLength={200} className={input} style={inputStyle} defaultValue={course.short_description ?? ""}
                onBlur={(e) => e.target.value !== (course.short_description ?? "") && saveCourse({ short_description: e.target.value })} />
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Full description</label>
              <textarea disabled={!canEditFields} rows={5} className={input} style={inputStyle} defaultValue={course.description ?? ""}
                onBlur={(e) => e.target.value !== (course.description ?? "") && saveCourse({ description: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Subject</label>
                <select disabled={!canEditFields} className={input} style={inputStyle} value={course.subject_id ?? ""}
                  onChange={(e) => saveCourse({ subject_id: e.target.value || null })}>
                  <option value="">—</option>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Difficulty</label>
                <select disabled={!canEditFields} className={input} style={inputStyle} value={course.difficulty}
                  onChange={(e) => saveCourse({ difficulty: e.target.value })}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] mb-2" style={{ color: "hsl(var(--foreground-muted))" }}>Language</label>
                <select disabled={!canEditFields} className={input} style={inputStyle} value={course.language}
                  onChange={(e) => saveCourse({ language: e.target.value })}>
                  <option value="en">English</option>
                  <option value="bn">Bangla</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
            {saving && <p className="text-[12px]" style={{ color: "hsl(var(--foreground-subtle))" }}>Saving…</p>}
          </section>

          {/* Curriculum */}
          <section className="orbit-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[1rem]" style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>Curriculum</h2>
              {canEditFields && (
                <button
                  onClick={async () => {
                    const title = prompt("Module title");
                    if (!title) return;
                    await addModule(course.id, title.trim(), modules.length);
                    load();
                  }}
                  className="orbit-btn"><Plus size={14} /> Add module</button>
              )}
            </div>

            {modules.length === 0 && <p className="text-[13px]" style={{ color: "hsl(var(--foreground-subtle))" }}>No modules yet.</p>}

            <div className="space-y-6">
              {modules.map((m) => {
                const mLessons = lessons.filter((l) => l.module_id === m.id);
                return (
                  <div key={m.id} className="p-4 rounded-lg" style={{ border: "1px solid hsl(var(--border))" }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[15px]" style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{m.title}</h3>
                      {canEditFields && (
                        <button
                          onClick={async () => {
                            if (confirm("Delete this module and all its lessons?")) {
                              await deleteModule(m.id); load();
                            }
                          }}
                          className="p-1" title="Delete module"><Trash2 size={14} style={{ color: "hsl(0 70% 55%)" }} /></button>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {mLessons.map((l) => (
                        <li key={l.id} className="flex items-center gap-2">
                          <input
                            disabled={!canEditFields}
                            className="flex-1 px-3 py-2 rounded text-[13px]"
                            style={inputStyle}
                            defaultValue={l.title}
                            onBlur={(e) => e.target.value !== l.title && updateLesson(l.id, { title: e.target.value }).then(load)}
                          />
                          <select
                            disabled={!canEditFields}
                            className="px-2 py-2 rounded text-[13px]"
                            style={inputStyle}
                            value={l.status}
                            onChange={(e) => updateLesson(l.id, { status: e.target.value as any }).then(load)}
                          >
                            <option value="draft">Draft</option>
                            <option value="ready">Ready</option>
                            <option value="published">Published</option>
                          </select>
                          {canEditFields && (
                            <button onClick={async () => { if (confirm("Delete lesson?")) { await deleteLesson(l.id); load(); } }} className="p-1">
                              <Trash2 size={14} style={{ color: "hsl(0 70% 55%)" }} />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                    {canEditFields && (
                      <button
                        onClick={async () => {
                          const title = prompt("Lesson title");
                          if (!title) return;
                          await addLesson(course.id, m.id, title.trim(), mLessons.length);
                          load();
                        }}
                        className="mt-3 text-[13px]" style={{ color: "hsl(var(--orbit-accent))" }}>+ Add lesson</button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <p className="mt-6 text-[12px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
            Lessons must be set to <strong>Published</strong> for learners to see them once the course is approved and published by an admin.
          </p>
        </div>
      </main>
      <OrbitFooter />
    </div>
  );
};

export default CourseEditor;

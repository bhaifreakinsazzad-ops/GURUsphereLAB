import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, X, Users as UsersIcon, ChevronRight } from "lucide-react";
import NebulaShell from "@/components/NebulaShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

interface Project {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  max_members: number;
  created_at: string;
}

interface Task {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  status: string;
  position: number;
}

const COLUMNS: { key: "todo" | "doing" | "done"; label: string; tint: string }[] = [
  { key: "todo", label: "To do", tint: "border-muted" },
  { key: "doing", label: "In progress", tint: "border-nebula-cyan/50" },
  { key: "done", label: "Done", tint: "border-pathshala-green/50" },
];

const projectSchema = z.object({
  title: z.string().trim().min(5).max(120),
  description: z.string().trim().min(20).max(800),
  category: z.string().min(1),
});

const TeamProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "Web Dev" });
  const [newTask, setNewTask] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("team_projects").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setProjects(data ?? []);
    setLoading(false);
  };

  const loadTasks = async (pid: string) => {
    const { data, error } = await supabase.from("project_tasks").select("*").eq("project_id", pid).order("position");
    if (error) toast.error(error.message);
    else setTasks(data ?? []);
  };

  useEffect(() => { loadProjects(); }, []);
  useEffect(() => { if (activeId) loadTasks(activeId); }, [activeId]);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Sign in first"); return; }
    const parsed = projectSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    const { error } = await supabase.from("team_projects").insert([{
      owner_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
    }]);
    if (error) { toast.error(error.message); return; }
    toast.success("Project launched 🚀");
    setForm({ title: "", description: "", category: "Web Dev" });
    setShowForm(false);
    loadProjects();
  };

  const addTask = async () => {
    if (!user || !activeId || !newTask.trim()) return;
    const { error } = await supabase.from("project_tasks").insert({
      project_id: activeId, user_id: user.id, title: newTask.trim(), status: "todo",
      position: tasks.filter((t) => t.status === "todo").length,
    });
    if (error) { toast.error(error.message); return; }
    setNewTask("");
    loadTasks(activeId);
  };

  const moveTask = async (id: string, status: string) => {
    const { error } = await supabase.from("project_tasks").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    if (activeId) loadTasks(activeId);
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("project_tasks").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    if (activeId) loadTasks(activeId);
  };

  const active = projects.find((p) => p.id === activeId);

  return (
    <NebulaShell
      title="Team Projects"
      bengaliTitle="দলগত প্রজেক্ট"
      subtitle="Build with peers worldwide. Share an idea, collect a team, run a Kanban board."
    >
      {!activeId ? (
        <>
          <div className="flex justify-end mb-5">
            <button
              onClick={() => user ? setShowForm((s) => !s) : toast.error("Sign in to launch a project")}
              className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Close" : "Launch Project"}
            </button>
          </div>

          {showForm && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={createProject} className="nebula-card p-5 mb-6 space-y-3">
              <input className="nebula-input w-full" placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} />
              <textarea className="nebula-input w-full min-h-[100px]" placeholder="What are you building? Who do you need?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={800} />
              <select className="nebula-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {["Web Dev", "Mobile", "AI/ML", "Data Science", "Design", "Research", "Social Impact", "Other"].map((c) => <option key={c}>{c}</option>)}
              </select>
              <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold">Launch</button>
            </motion.form>
          )}

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading…</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 nebula-card">
              <p className="text-muted-foreground mb-3">No projects yet. Be the first to launch one.</p>
              {!user && <Link to="/auth" className="text-primary font-semibold">Sign in →</Link>}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p) => (
                <button key={p.id} onClick={() => setActiveId(p.id)} className="nebula-card p-5 text-left group">
                  <span className="text-xs uppercase tracking-wider text-primary/80 font-semibold">{p.category}</span>
                  <h3 className="text-lg font-bold my-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><UsersIcon size={12} /> Max {p.max_members}</span>
                    <span className="inline-flex items-center gap-1 text-primary group-hover:gap-2 transition-all">Open board <ChevronRight size={14} /></span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <button onClick={() => setActiveId(null)} className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1">
            ← All projects
          </button>
          {active && (
            <div className="nebula-card p-5 mb-6">
              <span className="text-xs uppercase tracking-wider text-primary/80 font-semibold">{active.category}</span>
              <h2 className="text-2xl font-bold mt-1">{active.title}</h2>
              <p className="text-muted-foreground mt-2">{active.description}</p>
            </div>
          )}

          {user && (
            <div className="flex gap-2 mb-5">
              <input
                className="nebula-input flex-1"
                placeholder="Add a task to To-do…"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                maxLength={200}
              />
              <button onClick={addTask} className="bg-primary text-primary-foreground px-4 rounded-lg text-sm font-semibold">Add</button>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.key);
              return (
                <div key={col.key} className={`nebula-card p-4 border-t-4 ${col.tint}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm uppercase tracking-wider">{col.label}</h4>
                    <span className="text-xs text-muted-foreground">{colTasks.length}</span>
                  </div>
                  <div className="space-y-2 min-h-[60px]">
                    {colTasks.map((t) => (
                      <div key={t.id} className="bg-background/50 border border-border/50 rounded-lg p-3 text-sm">
                        <p className="mb-2">{t.title}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {COLUMNS.filter((c) => c.key !== col.key).map((c) => (
                            <button key={c.key} onClick={() => moveTask(t.id, c.key)} className="text-[10px] px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                              → {c.label}
                            </button>
                          ))}
                          {(t.user_id === user?.id || active?.owner_id === user?.id) && (
                            <button onClick={() => deleteTask(t.id)} className="text-[10px] px-2 py-0.5 rounded bg-destructive/20 text-destructive hover:bg-destructive/30">Delete</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </NebulaShell>
  );
};

export default TeamProjects;

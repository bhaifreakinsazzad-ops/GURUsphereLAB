import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Shield, RefreshCw } from "lucide-react";
import NebulaShell from "@/components/NebulaShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Tab = "research" | "projects" | "mentors" | "notes";

interface Row {
  id: string;
  title?: string;
  abstract?: string;
  description?: string;
  bio?: string;
  expertise?: string;
  note?: string;
  category?: string;
  user_id?: string;
  owner_id?: string;
  created_at: string;
}

const TABS: { key: Tab; label: string; table: "research_topics" | "team_projects" | "mentor_profiles" | "memorial_notes" }[] = [
  { key: "research", label: "Research", table: "research_topics" },
  { key: "projects", label: "Projects", table: "team_projects" },
  { key: "mentors", label: "Mentors", table: "mentor_profiles" },
  { key: "notes", label: "Memorial notes", table: "memorial_notes" },
];

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("research");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [promoteEmail, setPromoteEmail] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [user, authLoading, navigate]);

  const load = async () => {
    setLoading(true);
    const meta = TABS.find((t) => t.key === tab)!;
    const { data, error } = await supabase
      .from(meta.table)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) toast.error(error.message);
    else setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [tab, isAdmin]);

  const remove = async (id: string) => {
    const meta = TABS.find((t) => t.key === tab)!;
    if (!confirm("Permanently delete this entry?")) return;
    const { error } = await supabase.from(meta.table).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  const promote = async () => {
    if (!promoteEmail.trim()) return;
    const { error } = await supabase.rpc("promote_to_admin", { _email: promoteEmail.trim() });
    if (error) { toast.error(error.message); return; }
    toast.success(`${promoteEmail} is now an admin 🛡️`);
    setPromoteEmail("");
  };

  if (authLoading || isAdmin === null) {
    return <NebulaShell title="Admin"><p className="text-muted-foreground">Loading…</p></NebulaShell>;
  }
  if (!isAdmin) {
    return (
      <NebulaShell title="Admin">
        <div className="nebula-card p-8 text-center">
          <Shield size={36} className="mx-auto text-destructive mb-3" />
          <h2 className="text-xl font-bold mb-2">Access denied</h2>
          <p className="text-muted-foreground">You don't have admin rights. Ask an existing admin to promote you.</p>
        </div>
      </NebulaShell>
    );
  }

  const renderRowText = (r: Row) => r.title ?? r.expertise ?? r.note ?? "(no title)";
  const renderRowSub = (r: Row) => r.abstract ?? r.description ?? r.bio ?? r.note ?? "";

  return (
    <NebulaShell title="Admin Moderation" bengaliTitle="মডারেশন প্যানেল" subtitle="Review and remove inappropriate content. Use sparingly — Hadi believed in trust.">
      <div className="nebula-card p-5 mb-6">
        <h3 className="font-bold mb-3 inline-flex items-center gap-2"><Shield size={16} /> Promote a user to admin</h3>
        <div className="flex gap-2">
          <input
            className="nebula-input flex-1"
            placeholder="user@email.com"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            type="email"
          />
          <button onClick={promote} className="bg-primary text-primary-foreground px-4 rounded-lg text-sm font-semibold">Promote</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
        <button onClick={load} className="ml-auto px-3 py-2 rounded-lg text-sm bg-muted/40 inline-flex items-center gap-1.5 hover:bg-muted">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-12">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground text-center py-12 nebula-card">Nothing to moderate. ✨</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="nebula-card p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  {r.category && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{r.category}</span>}
                </div>
                <p className="font-semibold truncate">{renderRowText(r)}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{renderRowSub(r)}</p>
              </div>
              <button
                onClick={() => remove(r.id)}
                className="shrink-0 p-2 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors"
                aria-label="Delete"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </NebulaShell>
  );
};

export default Admin;

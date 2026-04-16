import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, ExternalLink, Tag, X, ArrowUp } from "lucide-react";
import NebulaShell from "@/components/NebulaShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

interface Topic {
  id: string;
  user_id: string;
  title: string;
  abstract: string;
  category: string;
  tags: string[] | null;
  link: string | null;
  upvotes: number;
  created_at: string;
}

const CATEGORIES = ["All", "Computer Science", "Medicine", "Physics", "Mathematics", "Climate", "Economics", "Bangladesh Studies", "Other"];

const submitSchema = z.object({
  title: z.string().trim().min(5, "At least 5 characters").max(200),
  abstract: z.string().trim().min(20, "At least 20 characters").max(2000),
  category: z.string().min(1, "Pick a category"),
  tags: z.string().max(200).optional(),
  link: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

const ResearchArchive = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ title: "", abstract: "", category: "Computer Science", tags: "", link: "" });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("research_topics")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setTopics(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // Realtime — broadcast upvote count changes to every viewer
    const channel = supabase
      .channel("research_topics_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "research_topics" },
        (payload) => {
          const updated = payload.new as Topic;
          setTopics((prev) => prev.map((t) => (t.id === updated.id ? { ...t, upvotes: updated.upvotes } : t)));
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "research_topics" },
        () => load()
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "research_topics" },
        (payload) => {
          setTopics((prev) => prev.filter((t) => t.id !== (payload.old as Topic).id));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const upvote = async (id: string) => {
    if (!user) { toast.error("Sign in to upvote"); return; }
    // Optimistic
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t)));
    const { error } = await supabase.rpc("increment_research_upvote", { _topic_id: id });
    if (error) {
      toast.error(error.message);
      // Rollback
      setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, upvotes: Math.max(0, t.upvotes - 1) } : t)));
    }
  };

  const filtered = useMemo(() => {
    return topics.filter((t) => {
      const matchCat = cat === "All" || t.category === cat;
      const q = query.toLowerCase().trim();
      const matchQ = !q ||
        t.title.toLowerCase().includes(q) ||
        t.abstract.toLowerCase().includes(q) ||
        (t.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [topics, cat, query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in"); return; }
    const parsed = submitSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }

    setSubmitting(true);
    const tags = form.tags.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8);
    const { error } = await supabase.from("research_topics").insert({
      user_id: user.id,
      title: parsed.data.title,
      abstract: parsed.data.abstract,
      category: parsed.data.category,
      tags,
      link: parsed.data.link || null,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Research added 🎉");
    setForm({ title: "", abstract: "", category: "Computer Science", tags: "", link: "" });
    setShowForm(false);
    load();
  };

  return (
    <NebulaShell
      title="Research Archive"
      bengaliTitle="গবেষণার আর্কাইভ"
      subtitle="Open-access research summarized by students, for students. Add what you've found, find what others have shared."
    >
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, abstract, tag…"
            className="nebula-input w-full pl-10"
          />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="nebula-input md:w-56">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={() => user ? setShowForm((s) => !s) : toast.error("Sign in to contribute")}
          className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Close" : "Add Research"}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="nebula-card p-5 md:p-6 mb-6 space-y-3"
        >
          <input className="nebula-input w-full" placeholder="Title (5-200 chars)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} />
          <textarea className="nebula-input w-full min-h-[120px] resize-y" placeholder="Abstract / summary (20-2000 chars)" value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} maxLength={2000} />
          <div className="grid md:grid-cols-2 gap-3">
            <select className="nebula-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
            </select>
            <input className="nebula-input" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <input className="nebula-input w-full" placeholder="Link (optional, e.g. arXiv URL)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
          <button disabled={submitting} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50">
            {submitting ? "Submitting…" : "Publish Research"}
          </button>
        </motion.form>
      )}

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 nebula-card">
          <p className="text-muted-foreground mb-3">No research yet matching that filter.</p>
          {!user && <Link to="/auth" className="text-primary font-semibold">Sign in to be the first contributor →</Link>}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <motion.article key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="nebula-card p-5 flex flex-col">
              <span className="text-xs uppercase tracking-wider text-primary/80 font-semibold mb-2">{t.category}</span>
              <h3 className="text-lg font-bold mb-2 leading-snug">{t.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-4 flex-1">{t.abstract}</p>
              {t.tags && t.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {t.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground inline-flex items-center gap-1">
                      <Tag size={9} /> {tag}
                    </span>
                  ))}
                </div>
              )}
              {t.link && (
                <a href={t.link} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm text-primary inline-flex items-center gap-1 hover:underline">
                  Read source <ExternalLink size={12} />
                </a>
              )}
            </motion.article>
          ))}
        </div>
      )}
    </NebulaShell>
  );
};

export default ResearchArchive;

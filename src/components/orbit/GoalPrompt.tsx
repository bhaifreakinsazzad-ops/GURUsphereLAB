import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";

const SAMPLE_GOALS = [
  "Prepare for IELTS",
  "Learn web development",
  "Start freelancing",
  "Master AI tools",
  "Improve English speaking",
  "Get into university",
];

const GoalPrompt = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const go = (q: string) => {
    const clean = q.trim();
    if (!clean) return;
    navigate(`/discover?q=${encodeURIComponent(clean)}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go(value);
  };

  return (
    <div className="w-full max-w-[720px] mx-auto">
      <form onSubmit={onSubmit} className="relative">
        <label htmlFor="goal-input" className="sr-only">
          What do you want to learn, achieve, or become?
        </label>
        <div
          className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-2xl transition-all"
          style={{
            background: "hsl(var(--surface))",
            border: "1px solid hsl(var(--border-strong))",
            boxShadow: "var(--shadow-2)",
          }}
        >
          <Search size={20} style={{ color: "hsl(var(--foreground-subtle))", flexShrink: 0 }} aria-hidden />
          <input
            id="goal-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="What do you want to learn, achieve, or become?"
            className="flex-1 bg-transparent outline-none py-3 text-[16px] md:text-[17px]"
            style={{ color: "hsl(var(--foreground))", fontFamily: "'Inter', sans-serif" }}
            autoComplete="off"
          />
          <button
            type="submit"
            className="orbit-btn orbit-btn-primary"
            style={{ minHeight: 44, padding: "0 1rem" }}
            aria-label="Explore learning paths"
            disabled={!value.trim()}
          >
            <span className="hidden sm:inline">Explore</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap justify-center gap-2" role="list" aria-label="Popular goals">
        {SAMPLE_GOALS.map((g) => (
          <button
            key={g}
            role="listitem"
            onClick={() => go(g)}
            className="orbit-chip"
            type="button"
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GoalPrompt;

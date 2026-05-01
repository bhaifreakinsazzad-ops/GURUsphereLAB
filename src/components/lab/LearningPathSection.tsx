import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight, Landmark, BookOpen, Film, Palette, Drama, Scroll, ShieldCheck, type LucideIcon } from "lucide-react";
import LabSectionHeader from "./LabSectionHeader";
import GlassCard from "./GlassCard";

type Node = {
  id: string;
  en: string;
  bn: string;
  description: string;
  cta: { label: string; to: string; external?: boolean };
  icon: LucideIcon;
  color: string; // hsl var
  // Position on a 1000x600 viewBox
  x: number;
  y: number;
};

const NODES: Node[] = [
  { id: "polsci", en: "Political Science", bn: "রাষ্ট্রচিন্তা", description: "Civic ideas, ethics of power, and the responsibility of citizens — from Plato to modern Bangladesh.", cta: { label: "Explore the Archive", to: "/research-archive" }, icon: Landmark, color: "var(--lab-cyan)", x: 160, y: 200 },
  { id: "literature", en: "Literature", bn: "সাহিত্য", description: "Read deeply — Tagore, Nazrul, world classics. Stories that shape conscience.", cta: { label: "Open the Library", to: "/#library" }, icon: BookOpen, color: "var(--lab-violet)", x: 350, y: 110 },
  { id: "cinema", en: "Cinema", bn: "চলচ্চিত্র", description: "Frame, light, edit. Visual storytelling as a tool for truth.", cta: { label: "Start this path", to: "/team-projects" }, icon: Film, color: "var(--candle)", x: 560, y: 170 },
  { id: "art", en: "Art", bn: "শিল্প", description: "From the Bengal School to digital art — see, feel, make.", cta: { label: "Join a circle", to: "/mentorship" }, icon: Palette, color: "var(--hadi-red-soft)", x: 760, y: 110 },
  { id: "theater", en: "Theater", bn: "নাটক", description: "Stage, voice, body. The oldest classroom for empathy.", cta: { label: "Find a project", to: "/team-projects" }, icon: Drama, color: "var(--pathshala-green)", x: 880, y: 300 },
  { id: "history", en: "History", bn: "ইতিহাস", description: "1947, 1952, 1971, 2024 — and why every line matters today.", cta: { label: "Open the Archive", to: "/research-archive" }, icon: Scroll, color: "var(--candle-soft)", x: 620, y: 410 },
  { id: "digital", en: "Digital Responsibility", bn: "ডিজিটাল দায়িত্ব", description: "Verify before you share. Build, don't burn. Self-test in the Hadi Meter.", cta: { label: "Open Hadi Meter", to: "/hadi-meter" }, icon: ShieldCheck, color: "var(--lab-cyan)", x: 320, y: 430 },
];

// Lines connecting story-related nodes
const EDGES: [string, string][] = [
  ["polsci", "literature"],
  ["literature", "cinema"],
  ["cinema", "art"],
  ["art", "theater"],
  ["theater", "history"],
  ["history", "digital"],
  ["digital", "polsci"],
  ["literature", "history"],
  ["cinema", "history"],
];

const LearningPathSection = ({ id = "learning-path" }: { id?: string }) => {
  const [active, setActive] = useState<Node | null>(null);
  const reduce = useReducedMotion();
  const nodeMap = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);

  return (
    <section id={id} className="relative py-24 md:py-32 px-4 md:px-8">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, hsl(var(--lab-cyan) / 0.10), transparent 55%), radial-gradient(ellipse at 80% 80%, hsl(var(--lab-violet) / 0.10), transparent 55%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <LabSectionHeader
          eyebrow="GURU'sphere Lab · Interactive Learning Path"
          title="Walk the constellation of knowledge."
          bengaliTitle="জ্ঞানের নক্ষত্রপথ"
          subtitle="Seven domains Hadi loved — political thought, literature, cinema, art, theater, history, and digital responsibility. Tap a star to begin."
        />

        {/* Desktop / tablet: SVG constellation */}
        <div className="hidden md:block relative">
          <GlassCard glow="violet" className="p-4 md:p-6">
            <svg viewBox="0 0 1000 540" className="w-full h-auto" role="img" aria-label="Learning path constellation">
              {/* Edges */}
              {EDGES.map(([a, b], i) => {
                const A = nodeMap[a]; const B = nodeMap[b];
                return (
                  <line
                    key={i}
                    x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                    stroke="hsl(var(--lab-cyan) / 0.25)"
                    strokeWidth={1}
                    strokeDasharray="4 6"
                  />
                );
              })}
              {/* Nodes */}
              {NODES.map((n, i) => (
                <motion.g
                  key={n.id}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActive(n)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${n.en}`}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActive(n); }}
                >
                  {/* Outer glow */}
                  <circle cx={n.x} cy={n.y} r={36} fill={`hsl(${n.color} / 0.10)`} />
                  <motion.circle
                    cx={n.x} cy={n.y} r={26}
                    fill={`hsl(${n.color} / 0.18)`}
                    stroke={`hsl(${n.color} / 0.8)`}
                    strokeWidth={1.2}
                    animate={reduce ? undefined : { r: [26, 30, 26], opacity: [1, 0.85, 1] }}
                    transition={{ duration: 4 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Core */}
                  <circle cx={n.x} cy={n.y} r={6} fill={`hsl(${n.color})`} />
                  {/* Label */}
                  <text
                    x={n.x} y={n.y + 56}
                    textAnchor="middle"
                    className="fill-foreground"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600 }}
                  >
                    {n.en}
                  </text>
                  <text
                    x={n.x} y={n.y + 74}
                    textAnchor="middle"
                    style={{ fontFamily: "'Noto Serif Bengali', sans-serif", fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  >
                    {n.bn}
                  </text>
                </motion.g>
              ))}
            </svg>
          </GlassCard>
        </div>

        {/* Mobile: card carousel fallback */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4">
          {NODES.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                onClick={() => setActive(n)}
                className="snap-start shrink-0 w-[78%]"
              >
                <GlassCard glow="cyan" hoverLift className="p-5 text-left h-full">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `hsl(${n.color} / 0.15)`, color: `hsl(${n.color})` }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{n.en}</h3>
                  <p className="bengali-text text-sm mt-1" style={{ color: `hsl(${n.color})` }}>{n.bn}</p>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{n.description}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color: "hsl(var(--lab-cyan))" }}>
                    Open <ChevronRight size={12} />
                  </span>
                </GlassCard>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="border-white/10 bg-background/85 backdrop-blur-2xl">
          {active && (
            <>
              <DialogHeader>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `hsl(${active.color} / 0.18)`, color: `hsl(${active.color})` }}
                >
                  <active.icon size={22} />
                </div>
                <DialogTitle className="text-2xl">
                  {active.en}
                  <span className="bengali-text block text-base font-normal mt-1" style={{ color: `hsl(${active.color})` }}>
                    {active.bn}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground leading-relaxed pt-2">
                  {active.description}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2">
                {active.cta.to.startsWith("/") && !active.cta.to.includes("#") ? (
                  <Link
                    to={active.cta.to}
                    onClick={() => setActive(null)}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
                    style={{
                      background: `hsl(${active.color} / 0.15)`,
                      color: `hsl(${active.color})`,
                      border: `1px solid hsl(${active.color} / 0.5)`,
                    }}
                  >
                    {active.cta.label} <ChevronRight size={16} />
                  </Link>
                ) : (
                  <a
                    href={active.cta.to}
                    onClick={() => setActive(null)}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
                    style={{
                      background: `hsl(${active.color} / 0.15)`,
                      color: `hsl(${active.color})`,
                      border: `1px solid hsl(${active.color} / 0.5)`,
                    }}
                  >
                    {active.cta.label} <ChevronRight size={16} />
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default LearningPathSection;

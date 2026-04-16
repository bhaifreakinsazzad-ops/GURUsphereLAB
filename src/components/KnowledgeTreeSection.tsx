import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const branches = [
  { name: "Beginner", bengali: "শুরু", progress: 100, color: "hsl(162 80% 35%)" },
  { name: "Explorer", bengali: "অনুসন্ধানী", progress: 72, color: "hsl(162 70% 40%)" },
  { name: "Scholar", bengali: "পণ্ডিত", progress: 45, color: "hsl(42 80% 55%)" },
  { name: "Master", bengali: "ওস্তাদ", progress: 18, color: "hsl(42 85% 60%)" },
  { name: "Legend", bengali: "কিংবদন্তী", progress: 0, color: "hsl(340 60% 55%)" },
];

const KnowledgeTreeSection = () => {
  return (
    <section id="knowledge-tree" className="py-24 md:py-32 section-padding relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, hsl(var(--background)), hsl(var(--pathshala-cream)), hsl(var(--background)))",
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3">
              His Tree of Wishes
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Every wish he had —{" "}
              <span className="text-gradient-green">becomes a branch.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
              Each lesson learned, each free resource claimed, each project shipped —
              the tree grows. His wish, lived through you.
            </p>
          </div>
        </ScrollReveal>

        {/* Tree visualization */}
        <div className="relative max-w-lg mx-auto">
          {/* Central trunk line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-pathshala-green via-pathshala-gold to-muted" />

          <div className="space-y-6">
            {branches.map((branch, i) => (
              <ScrollReveal key={branch.name} delay={i * 0.1}>
                <div className={`flex items-center gap-6 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                    <h4 className="font-semibold text-foreground">{branch.name}</h4>
                    <p className="bengali-text text-sm text-muted-foreground">{branch.bengali}</p>
                  </div>

                  {/* Node */}
                  <div className="relative z-10">
                    <motion.div
                      className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                      style={{
                        borderColor: branch.color,
                        background: branch.progress > 0
                          ? `${branch.color.replace(")", " / 0.15)")}`
                          : "hsl(var(--muted))",
                      }}
                      whileInView={{
                        scale: [0.8, 1.05, 1],
                      }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <span className="text-xs font-bold" style={{ color: branch.color }}>
                        {branch.progress > 0 ? `${branch.progress}%` : "🔒"}
                      </span>
                    </motion.div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: branch.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${branch.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeTreeSection;

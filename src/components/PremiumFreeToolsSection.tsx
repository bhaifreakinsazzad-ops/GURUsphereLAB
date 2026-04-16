import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { ExternalLink, Github, Code2, Palette, FileText, Cloud, Sparkles } from "lucide-react";

const tools = [
  {
    name: "GitHub Student Pack",
    normallyPaid: "$200+/yr in tools",
    desc: "Free domains, cloud credits, IDEs, and 100+ premium dev tools — just verify you're a student.",
    url: "https://education.github.com/pack",
    icon: Github,
  },
  {
    name: "JetBrains Education",
    normallyPaid: "$249/yr",
    desc: "All JetBrains IDEs (IntelliJ, PyCharm, WebStorm) free for students.",
    url: "https://www.jetbrains.com/community/education/",
    icon: Code2,
  },
  {
    name: "Figma Education",
    normallyPaid: "$15/mo",
    desc: "Full Figma Professional plan — design, prototype, collaborate. Free with .edu or student ID.",
    url: "https://www.figma.com/education/",
    icon: Palette,
  },
  {
    name: "Notion Education",
    normallyPaid: "$10/mo",
    desc: "Notion Plus free for students — unlimited blocks, AI, and team collaboration.",
    url: "https://www.notion.so/product/notion-for-education",
    icon: FileText,
  },
  {
    name: "Cloudflare + Vercel",
    normallyPaid: "$20–100/mo",
    desc: "Host websites, run edge functions, and serve global traffic — generous free tiers forever.",
    url: "https://vercel.com",
    icon: Cloud,
  },
  {
    name: "Adobe Alternatives",
    normallyPaid: "$60/mo Adobe CC",
    desc: "GIMP (Photoshop), Krita (Illustrator), DaVinci Resolve (Premiere) — pro-grade and free.",
    url: "https://www.gimp.org",
    icon: Sparkles,
  },
];

const PremiumFreeToolsSection = () => {
  return (
    <section id="tools" className="py-24 md:py-32 section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 30% 70%, hsl(var(--pathshala-gold) / 0.1) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3">
              Premium → Free
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              The tools they said you{" "}
              <span className="text-gradient-gold">couldn't afford.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              For Bangladeshi students, ৳25,000/year for one IDE is impossible.
              These are the same tools — completely free, just hidden behind a verification step.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.06}>
              <motion.a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="feature-card block group h-full"
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-pathshala-gold/15 flex items-center justify-center">
                    <t.icon size={20} className="text-pathshala-gold" />
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-pathshala-gold transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground">{t.name}</h3>
                <p className="text-xs font-medium text-pathshala-gold mt-1">
                  Normally: {t.normallyPaid}
                </p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{t.desc}</p>
              </motion.a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumFreeToolsSection;

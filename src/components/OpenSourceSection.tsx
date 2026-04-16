import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Sparkles, Users, Code } from "lucide-react";

const projects = [
  {
    name: "First Contributions",
    bengali: "প্রথম অবদান",
    desc: "Make your first open-source PR in under 5 minutes. Designed for absolute beginners.",
    url: "https://github.com/firstcontributions/first-contributions",
    icon: GitBranch,
  },
  {
    name: "Good First Issues",
    bengali: "সহজ ইস্যু",
    desc: "Curated beginner-friendly issues across thousands of real open-source projects.",
    url: "https://goodfirstissue.dev",
    icon: Sparkles,
  },
  {
    name: "Hacktoberfest",
    bengali: "হ্যাকটোবরফেস্ট",
    desc: "Yearly global event — make 4 PRs in October, get free swag and recognition.",
    url: "https://hacktoberfest.com",
    icon: Users,
  },
  {
    name: "Awesome for Beginners",
    bengali: "নতুনদের জন্য",
    desc: "A massive curated list of projects actively welcoming beginner contributors.",
    url: "https://github.com/MunGell/awesome-for-beginners",
    icon: Code,
  },
];

const OpenSourceSection = () => {
  return (
    <section id="open-source" className="py-24 md:py-32 section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(var(--pathshala-green) / 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3">
              Open Source
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Build with{" "}
              <span className="text-gradient-green">the world.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
              You don't need permission to contribute to the code that runs the internet.
              Start small. Ship something real. Get hired.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <ScrollReveal key={p.name} delay={i * 0.08}>
              <motion.a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="feature-card block group h-full"
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-pathshala-green/15 flex items-center justify-center">
                    <p.icon size={20} className="text-pathshala-green" />
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-pathshala-gold transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                <p className="bengali-text text-xs text-pathshala-gold/80 mt-0.5">{p.bengali}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{p.desc}</p>
              </motion.a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;

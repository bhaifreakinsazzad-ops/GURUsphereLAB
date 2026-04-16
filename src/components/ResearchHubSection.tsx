import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { ExternalLink, FileText, BookMarked, Globe, Database, Library, GraduationCap } from "lucide-react";

const resources = [
  {
    name: "arXiv",
    bengali: "গবেষণাপত্র",
    desc: "2M+ open-access research papers in physics, math, CS, biology.",
    url: "https://arxiv.org",
    icon: FileText,
  },
  {
    name: "MIT OpenCourseWare",
    bengali: "এমআইটি কোর্সওয়্যার",
    desc: "Full MIT course materials, lecture notes, and exams — free.",
    url: "https://ocw.mit.edu",
    icon: GraduationCap,
  },
  {
    name: "CORE",
    bengali: "ওপেন রিসার্চ",
    desc: "World's largest collection of open-access research papers.",
    url: "https://core.ac.uk",
    icon: Database,
  },
  {
    name: "Unpaywall",
    bengali: "পেওয়াল মুক্ত",
    desc: "Find legal free versions of paywalled research papers.",
    url: "https://unpaywall.org",
    icon: Globe,
  },
  {
    name: "DOAJ",
    bengali: "ওপেন জার্নাল",
    desc: "20,000+ peer-reviewed open-access academic journals.",
    url: "https://doaj.org",
    icon: BookMarked,
  },
  {
    name: "Google Scholar",
    bengali: "গুগল স্কলার",
    desc: "Search across academic literature — many results free.",
    url: "https://scholar.google.com",
    icon: Library,
  },
];

const ResearchHubSection = () => {
  return (
    <section id="research" className="py-24 md:py-32 section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 70% 30%, hsl(var(--pathshala-green) / 0.1) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3">
              Research Hub
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Knowledge that was{" "}
              <span className="text-gradient-green">never meant to be locked.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Direct access to the world's open research. No subscriptions, no $40 paper fees —
              every link below is legal, free, and curated for the curious.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((r, i) => (
            <ScrollReveal key={r.name} delay={i * 0.06}>
              <motion.a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="feature-card block group h-full"
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-pathshala-green/15 flex items-center justify-center">
                    <r.icon size={20} className="text-pathshala-green" />
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-pathshala-gold transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground">{r.name}</h3>
                <p className="bengali-text text-xs text-pathshala-gold/80 mt-0.5">{r.bengali}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{r.desc}</p>
              </motion.a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchHubSection;

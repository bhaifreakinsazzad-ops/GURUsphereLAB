import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import { Zap, Users2, Mic, Brain, Sparkles, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Daily Spark",
    bengali: "প্রতিদিনের আলো",
    description: "Every day, a 5-minute micro-lesson drops — a mind-bending fact, a thought experiment, a challenge. No two days are the same. Learning finds you.",
    color: "hsl(var(--pathshala-gold))",
  },
  {
    icon: Users2,
    title: "Peer Circle",
    bengali: "সহপাঠী বৃত্ত",
    description: "Get matched with 4 learners at your level from anywhere in the world. Study together, challenge each other, grow as a unit.",
    color: "hsl(var(--pathshala-green))",
  },
  {
    icon: Mic,
    title: "Voice Notes",
    bengali: "কণ্ঠ নোট",
    description: "Record voice notes while reading. Revisit your thoughts, listen to your own understanding grow. Your voice becomes your second notebook.",
    color: "hsl(var(--pathshala-emerald))",
  },
  {
    icon: Brain,
    title: "Thought Map",
    bengali: "চিন্তার মানচিত্র",
    description: "Visualize connections between everything you've learned. See how mathematics links to music, how history shapes science. Knowledge isn't linear — neither is GURU'sphere Lab.",
    color: "hsl(340 60% 55%)",
  },
];

const UniqueFeatures = () => {
  return (
    <section className="py-24 md:py-32 section-padding">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3">
              Never Done Before
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Features that make you{" "}
              <span className="text-gradient-gold">go silent.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <div className="feature-card h-full group">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${feature.color.replace(")", " / 0.12)")}` }}
                >
                  <feature.icon size={20} style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="bengali-text text-sm text-pathshala-gold mt-1">{feature.bengali}</p>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniqueFeatures;

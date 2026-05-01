import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import { Radio, Users, Globe, Sparkles } from "lucide-react";

const subjects = [
  { id: "math",       name: "Mathematics", bengali: "গণিত",     color: "hsl(42 85% 55%)",  icon: "∑" },
  { id: "science",    name: "Science",     bengali: "বিজ্ঞান",    color: "hsl(162 80% 35%)", icon: "⚛" },
  { id: "literature", name: "Literature",  bengali: "সাহিত্য",    color: "hsl(340 60% 55%)", icon: "✎" },
  { id: "technology", name: "Technology",  bengali: "প্রযুক্তি",   color: "hsl(200 70% 50%)", icon: "⌘" },
  { id: "arts",       name: "Arts",        bengali: "শিল্প",     color: "hsl(280 50% 55%)", icon: "◎" },
  { id: "history",    name: "History",     bengali: "ইতিহাস",    color: "hsl(25 70% 50%)",  icon: "⏳" },
];

const ClassroomSection = () => {
  return (
    <section id="classroom" className="py-24 md:py-32 section-padding">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3">
              Live Learning Universe
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Not a classroom.{" "}
              <span className="text-gradient-green">A universe.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
              Enter live sessions where subjects orbit around you like planets.
              Pick any world to join — real instructors, real-time interaction, real breakthroughs.
            </p>
          </div>
        </ScrollReveal>

        {/* Subject planets */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {subjects.map((subject, i) => (
              <ScrollReveal key={subject.name} delay={i * 0.08}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={`/classroom/${subject.id}`}
                    className="feature-card group cursor-pointer relative overflow-hidden block"
                  >
                    <div
                      className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                      style={{ background: subject.color }}
                    />
                    <div className="text-3xl mb-3">{subject.icon}</div>
                    <h3 className="font-semibold text-foreground text-lg">{subject.name}</h3>
                    <p className="bengali-text text-muted-foreground text-sm mt-1">{subject.bengali}</p>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: subject.color }} />
                        Live Now
                      </span>
                      <span className="font-semibold" style={{ color: subject.color }}>
                        Enter Room →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Features row */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Radio, label: "Live Streaming", desc: "Real-time classes" },
              { icon: Users, label: "Peer Learning", desc: "Study together" },
              { icon: Globe, label: "Any Language", desc: "বাংলা & English" },
              { icon: Sparkles, label: "Live Exams", desc: "Test in-session" },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                <f.icon size={18} className="text-pathshala-emerald mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ClassroomSection;

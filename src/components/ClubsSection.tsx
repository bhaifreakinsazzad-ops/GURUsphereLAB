import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const clubs = [
  { name: "Debate Club", bengali: "বিতর্ক ক্লাব", emoji: "🎤" },
  { name: "Science Lab", bengali: "বিজ্ঞান ল্যাব", emoji: "🔬" },
  { name: "Writers' Den", bengali: "লেখকদের আড্ডা", emoji: "✍️" },
  { name: "Code Dojo", bengali: "কোড ডোজো", emoji: "💻" },
  { name: "Art Studio", bengali: "শিল্প স্টুডিও", emoji: "🎨" },
  { name: "Music Room", bengali: "সংগীত কক্ষ", emoji: "🎵" },
];

const ClubsSection = () => {
  return (
    <section id="clubs" className="py-24 md:py-32 section-padding relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, hsl(var(--background)), hsl(var(--pathshala-warm)), hsl(var(--background)))",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3">
              Community · Coming Soon
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Learn alone. Grow{" "}
              <span className="text-gradient-green">together.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
              Discord, Telegram, study circles — find Bangladeshi students chasing
              the same wishes you are. Launching soon.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {clubs.map((club, i) => (
            <ScrollReveal key={club.name} delay={i * 0.08}>
              <motion.div
                className="feature-card text-center cursor-default opacity-70 hover:opacity-100 transition-opacity"
                whileHover={{ y: -2 }}
              >
                <div className="text-3xl mb-3">{club.emoji}</div>
                <h3 className="font-semibold text-foreground text-sm">{club.name}</h3>
                <p className="bengali-text text-xs text-muted-foreground mt-1">{club.bengali}</p>
                <span className="inline-block mt-3 text-[10px] font-semibold tracking-widest uppercase text-pathshala-gold/60">
                  Coming Soon
                </span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClubsSection;

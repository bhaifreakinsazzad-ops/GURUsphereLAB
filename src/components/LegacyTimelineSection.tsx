import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import hadiMemory from "@/assets/hadi-portrait-memory.png";
import ScrollReveal from "./ScrollReveal";

const milestones = [
  {
    en: "Inspiration",
    bn: "অনুপ্রেরণা",
    sub: "Early years",
    text: "A boy who asked questions the village had no answer for.",
  },
  {
    en: "Youth",
    bn: "যৌবন",
    sub: "Growth & learning",
    text: "Late nights, borrowed books, an internet that opened the world.",
  },
  {
    en: "Courage",
    bn: "সাহস",
    sub: "Facing it all",
    text: "He stood for what he believed — gently, then unbreakably.",
  },
  {
    en: "Connection",
    bn: "সংযোগ",
    sub: "A nation feels it",
    text: "His name became a word for honesty, for refusing to look away.",
  },
  {
    en: "Future",
    bn: "ভবিষ্যৎ",
    sub: "Carried by us",
    text: "Every free course opened, every dream rekindled — that is him, continuing.",
  },
];

const LegacyTimelineSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      id="legacy"
      className="relative py-28 md:py-36 section-padding overflow-hidden"
    >
      {/* Background ornament */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, hsl(35 80% 30% / 0.25), transparent 50%), radial-gradient(ellipse at 80% 70%, hsl(220 50% 12% / 0.4), transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="bengali-text text-base md:text-lg mb-3" style={{ color: "hsl(var(--candle-soft))" }}>
              যে গল্পটি আমরা ভুলতে পারি না
            </p>
            <h2
              className="text-4xl md:text-6xl tracking-tight italic font-medium mb-3"
              style={{ color: "hsl(var(--foreground))", fontFamily: "'Cormorant Garamond', serif" }}
            >
              Legacy <span className="handwritten not-italic text-gradient-candle">Timeline</span>
            </h2>
            <p className="text-base max-w-xl mx-auto font-light" style={{ color: "hsl(42 22% 72%)" }}>
              Five chapters from a life cut short — and the wishes that remain.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          {/* LEFT: Floating portrait */}
          <motion.div style={{ y: portraitY }} className="lg:sticky lg:top-32">
            <div className="relative max-w-sm mx-auto">
              <div
                className="absolute -inset-8 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, hsl(var(--candle) / 0.3) 0%, transparent 65%)",
                  filter: "blur(30px)",
                }}
              />
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid hsl(var(--candle) / 0.35)",
                  boxShadow: "0 25px 60px -20px hsl(0 0% 0% / 0.7), 0 0 60px -10px hsl(var(--candle) / 0.3)",
                }}
              >
                <img src={hadiMemory} alt="Hadi — five chapters of one life" className="w-full block" loading="lazy" />
              </div>
              <p
                className="text-center text-xs tracking-[0.3em] uppercase sans mt-5"
                style={{ color: "hsl(var(--candle-soft))" }}
              >
                In memory · legacy · dignity
              </p>
            </div>
          </motion.div>

          {/* RIGHT: Timeline */}
          <div className="relative pl-10">
            {/* Static rail */}
            <div
              className="absolute left-3 top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(180deg, hsl(var(--candle) / 0.15), hsl(var(--candle) / 0.05))" }}
            />
            {/* Animated fill rail */}
            <motion.div
              style={{ height: lineHeight }}
              className="absolute left-3 top-0 w-px"
              aria-hidden="true"
            >
              <div
                className="w-full h-full"
                style={{ background: "linear-gradient(180deg, hsl(var(--candle)), hsl(35 90% 50%))", boxShadow: "0 0 12px hsl(var(--candle) / 0.6)" }}
              />
            </motion.div>

            <div className="space-y-12">
              {milestones.map((m, i) => (
                <ScrollReveal key={m.en} delay={i * 0.05}>
                  <div className="relative">
                    {/* Glowing dot */}
                    <div
                      className="absolute -left-[34px] top-2 w-4 h-4 rounded-full"
                      style={{
                        background: "radial-gradient(circle, hsl(45 100% 80%), hsl(35 95% 55%))",
                        boxShadow: "0 0 16px hsl(var(--candle) / 0.8), 0 0 32px hsl(var(--candle) / 0.4)",
                      }}
                    />
                    <div className="glass-card rounded-2xl p-6 md:p-7 group hover:glow-gold transition-shadow duration-500">
                      <div className="flex items-baseline gap-3 mb-1.5">
                        <h3
                          className="text-2xl md:text-3xl italic font-medium"
                          style={{ color: "hsl(var(--candle-soft))", fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {m.en}
                        </h3>
                        <span className="bengali-text text-sm" style={{ color: "hsl(var(--candle) / 0.8)" }}>
                          {m.bn}
                        </span>
                      </div>
                      <p
                        className="text-xs tracking-[0.2em] uppercase sans mb-3"
                        style={{ color: "hsl(42 25% 55%)" }}
                      >
                        {m.sub}
                      </p>
                      <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: "hsl(42 22% 80%)" }}>
                        {m.text}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacyTimelineSection;

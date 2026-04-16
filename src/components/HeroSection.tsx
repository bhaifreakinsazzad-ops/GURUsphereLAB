import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroMemorial from "@/assets/hadi-memorial.jpg";
import Candle, { RisingParticles } from "./Candle";
import MemorialBadge from "./MemorialBadge";
import WishOfTheWeek from "./WishOfTheWeek";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, 200]);
  const imageOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);
  const textY = useTransform(scrollY, [0, 600], [0, -80]);

  // Typewriter effect for Bengali quote
  const fullQuote = "তোমার জন্য আমি যা চেয়েছিলাম —";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullQuote.length) {
        setTyped(fullQuote.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Layer 1: Deep dark gradient */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Layer 2: Memorial image, parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, opacity: imageOpacity }}
      >
        <img
          src={heroMemorial}
          alt="A candle's flame rises into stardust — a symbolic memorial to Shaheed Osman Hadi"
          className="w-full h-full object-cover opacity-50"
          style={{ objectPosition: "center 20%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, hsl(220 50% 4% / 0.5) 60%, hsl(220 50% 4%) 100%)",
          }}
        />
      </motion.div>

      {/* Layer 3: Rising particles */}
      <RisingParticles count={22} />

      {/* Layer 4: Floating candle (right side, faux-3D) */}
      <motion.div
        className="hidden md:block absolute"
        style={{
          right: "8%",
          top: "30%",
          y: useTransform(scrollY, [0, 500], [0, -50]),
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <Candle size={70} />
      </motion.div>

      {/* Layer 5: Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 text-center section-padding max-w-3xl mx-auto py-20"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex justify-center"
        >
          <MemorialBadge variant="light" />
        </motion.div>

        {/* Bengali typewriter quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="bengali-text text-xl md:text-3xl mb-6 min-h-[2.5rem]"
          style={{ color: "hsl(var(--candle-soft))" }}
        >
          {typed}
          <span className="inline-block w-[2px] h-6 ml-1 bg-current animate-pulse-soft align-middle" />
        </motion.p>

        {/* Main title — letter handwritten style */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6"
          style={{
            color: "hsl(var(--foreground))",
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 500,
          }}
        >
          The Wishes
          <br />
          <span
            className="text-gradient-candle handwritten not-italic"
            style={{ fontSize: "1.1em", display: "inline-block", marginTop: "0.2em" }}
          >
            he left behind.
          </span>
        </motion.h1>

        {/* Subtle handwritten signature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="handwritten text-lg md:text-xl mb-10"
          style={{ color: "hsl(var(--candle-soft) / 0.85)" }}
        >
          — a letter from Hadi, written through us.
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.8 }}
          className="text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light"
          style={{ color: "hsl(42 25% 78%)" }}
        >
          Free research. Free university courses. Free premium tools.
          Everything Bangladesh's curious students were told they couldn't afford —
          opened, in his memory.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#research"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 active:scale-[0.97] sans glow-gold"
            style={{
              background: "linear-gradient(135deg, hsl(var(--candle)), hsl(35 90% 50%))",
              color: "hsl(220 50% 6%)",
            }}
          >
            <span className="relative z-10">Light a candle →</span>
          </a>
          <a
            href="#memorial"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base border transition-all duration-300 active:scale-[0.97] sans hover:bg-white/5"
            style={{
              borderColor: "hsl(var(--candle) / 0.4)",
              color: "hsl(var(--candle-soft))",
            }}
          >
            Read his wall
          </a>
        </motion.div>

        {/* Wish of the Week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.5 }}
          className="mt-14"
        >
          <WishOfTheWeek />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 4 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span
            className="text-xs tracking-widest uppercase sans"
            style={{ color: "hsl(42 25% 55%)" }}
          >
            keep reading
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-10"
            style={{ background: "linear-gradient(180deg, hsl(var(--candle) / 0.6), transparent)" }}
          />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-20"
        style={{
          background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)",
        }}
      />
    </section>
  );
};

export default HeroSection;

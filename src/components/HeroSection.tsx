import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import hadiPortrait from "@/assets/hadi-portrait-hero.png";
import Candle, { RisingParticles } from "./Candle";
import MemorialBadge from "./MemorialBadge";
import WishOfTheWeek from "./WishOfTheWeek";
import { useAudio } from "@/contexts/AudioContext";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const portraitY = useTransform(scrollY, [0, 800], [0, 160]);
  const portraitScale = useTransform(scrollY, [0, 600], [1, 1.08]);
  const portraitOpacity = useTransform(scrollY, [0, 700], [1, 0.25]);
  const textY = useTransform(scrollY, [0, 600], [0, -80]);
  const candleY = useTransform(scrollY, [0, 500], [0, -50]);
  const ornamentY = useTransform(scrollY, [0, 800], [0, -100]);
  const { playSpark } = useAudio();

  // Mouse parallax for portrait card
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Bengali typewriter
  const fullQuote = "তোমার জন্য আমি যা চেয়েছিলাম —";
  const [typed, setTyped] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullQuote.length) { setTyped(fullQuote.slice(0, i)); i++; }
      else clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center pt-24 pb-12">
      {/* Layer 1: Deep night gradient */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Layer 2: ornamental light beams */}
      <motion.div
        style={{ y: ornamentY }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120%] h-[600px]"
          style={{
            background: "radial-gradient(ellipse at center, hsl(var(--candle) / 0.18) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      {/* Layer 3: Rising particles */}
      <RisingParticles count={28} />

      {/* Layer 4: Floating candle */}
      <motion.div
        className="hidden md:block absolute"
        style={{ left: "6%", top: "32%", y: candleY }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <Candle size={64} />
      </motion.div>

      {/* Content grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto section-padding grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        {/* LEFT: Text */}
        <motion.div style={{ y: textY }} className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex justify-center lg:justify-start"
          >
            <MemorialBadge variant="light" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bengali-text text-xl md:text-2xl mb-5 min-h-[2.5rem]"
            style={{ color: "hsl(var(--candle-soft))" }}
          >
            {typed}
            <span className="inline-block w-[2px] h-6 ml-1 bg-current animate-pulse-soft align-middle" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-5"
            style={{ color: "hsl(var(--foreground))", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500 }}
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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="handwritten text-lg md:text-xl mb-6"
            style={{ color: "hsl(var(--candle-soft) / 0.85)" }}
          >
            — a letter from Hadi, written through us.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed font-light"
            style={{ color: "hsl(42 25% 78%)" }}
          >
            Free research. Free university courses. Free premium tools.
            Everything Bangladesh's curious students were told they couldn't afford —
            opened, in his memory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a
              href="#research"
              onMouseEnter={playSpark}
              className="group inline-flex items-center justify-center px-7 py-4 rounded-xl font-semibold text-base transition-all duration-300 active:scale-[0.97] sans glow-gold"
              style={{ background: "linear-gradient(135deg, hsl(var(--candle)), hsl(35 90% 50%))", color: "hsl(220 50% 6%)" }}
            >
              Light a candle →
            </a>
            <a
              href="#donate"
              onMouseEnter={playSpark}
              className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-semibold text-base border transition-all duration-300 active:scale-[0.97] sans hover:bg-white/5"
              style={{ borderColor: "hsl(var(--candle) / 0.4)", color: "hsl(var(--candle-soft))" }}
            >
              Keep his light burning ♥
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT: Portrait card with parallax */}
        <motion.div
          style={{ y: portraitY, opacity: portraitOpacity, scale: portraitScale }}
          className="relative mx-auto"
          initial={{ opacity: 0, y: 50, rotateY: -15 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative max-w-md mx-auto"
            style={{
              transform: `perspective(1400px) rotateY(${mouse.x * 4}deg) rotateX(${-mouse.y * 4}deg)`,
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Aura halo */}
            <div
              className="absolute -inset-12 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, hsl(var(--candle) / 0.35) 0%, transparent 60%)",
                filter: "blur(40px)",
              }}
            />
            {/* Frame */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "2px solid hsl(var(--candle) / 0.45)",
                boxShadow:
                  "0 30px 80px -20px hsl(220 70% 0% / 0.7), 0 0 80px -10px hsl(var(--candle) / 0.4), inset 0 0 0 1px hsl(var(--candle) / 0.2)",
              }}
            >
              <img
                src={hadiPortrait}
                alt="Shaheed Osman Hadi — in memory, legacy & dignity"
                className="w-full h-auto block"
                loading="eager"
                decoding="async"
              />
              {/* Bottom plaque */}
              <div
                className="absolute bottom-0 left-0 right-0 px-6 py-4 backdrop-blur-md"
                style={{ background: "linear-gradient(180deg, transparent 0%, hsl(220 60% 4% / 0.85) 60%)" }}
              >
                <p className="text-xs tracking-[0.25em] uppercase sans" style={{ color: "hsl(var(--candle-soft))" }}>
                  Shaheed Osman Hadi
                </p>
                <p className="bengali-text text-sm mt-1" style={{ color: "hsl(42 30% 80%)" }}>
                  স্মরণে · উত্তরাধিকারে · মর্যাদায়
                </p>
              </div>
            </div>

            {/* Floating wax-seal stamp */}
            <motion.div
              animate={{ rotate: [0, 4, -2, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 rounded-full wax-seal flex items-center justify-center bengali-text text-sm font-bold"
              style={{ color: "hsl(0 60% 92%)" }}
              aria-hidden="true"
            >
              হাদী
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wish of the Week — full width below */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.2 }}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 w-full max-w-2xl section-padding z-10"
      >
        <WishOfTheWeek />
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs tracking-widest uppercase sans" style={{ color: "hsl(42 25% 55%)" }}>
          keep reading
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-10"
          style={{ background: "linear-gradient(180deg, hsl(var(--candle) / 0.6), transparent)" }}
        />
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[5]"
        style={{ background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)" }}
      />
    </section>
  );
};

export default HeroSection;

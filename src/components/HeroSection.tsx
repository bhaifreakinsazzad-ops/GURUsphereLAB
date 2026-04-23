import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import hadiPortrait from "@/assets/hadi-portrait-hero.png";
import heroBanner from "@/assets/hero-banner-premium.jpg";
import Candle, { RisingParticles } from "./Candle";
import WishOfTheWeek from "./WishOfTheWeek";
import { useAudio } from "@/contexts/AudioContext";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const portraitY = useTransform(scrollY, [0, 800], [0, 140]);
  const portraitScale = useTransform(scrollY, [0, 600], [1, 1.06]);
  const portraitOpacity = useTransform(scrollY, [0, 700], [1, 0.3]);
  const textY = useTransform(scrollY, [0, 600], [0, -60]);
  const candleY = useTransform(scrollY, [0, 500], [0, -50]);
  const { playSpark } = useAudio();

  // Mouse parallax — desktop only
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
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center pt-32 pb-20">
      {/* Backdrop — restrained 18% banner with strong vignette */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.18]"
          loading="eager"
          decoding="async"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, hsl(220 50% 4% / 0.4) 0%, hsl(220 50% 4% / 0.95) 75%, hsl(var(--background)) 100%)",
          }}
        />
      </div>

      <div className="absolute inset-0 hero-gradient opacity-60" />

      {/* Soft candle light from top */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120%] h-[600px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--candle) / 0.14) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      <RisingParticles count={22} />

      {/* Floating candle — left margin marker */}
      <motion.div
        className="hidden md:block absolute"
        style={{ left: "5%", top: "30%", y: candleY }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <Candle size={60} />
      </motion.div>

      {/* Editorial cover lockup */}
      <div className="relative z-10 w-full max-w-7xl mx-auto section-padding grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-20 items-center">
        {/* LEFT: Editorial column */}
        <motion.div style={{ y: textY }} className="lg:pr-4">
          {/* Eyebrow row */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8 flex-wrap"
          >
            <span className="eyebrow no-rule" style={{ color: "hsl(var(--candle))" }}>
              Est. 2024 · Memorial Edition
            </span>
            <span className="h-px w-10" style={{ background: "hsl(var(--candle) / 0.4)" }} />
            <span className="eyebrow no-rule" style={{ color: "hsl(var(--hadi-red-soft))" }}>
              Vol. I — A Letter From Hadi
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bengali-text text-lg md:text-xl mb-6 min-h-[2.25rem]"
            style={{ color: "hsl(var(--candle-soft))" }}
          >
            {typed}
            <span className="inline-block w-[2px] h-5 ml-1 bg-current animate-pulse-soft align-middle" />
          </motion.p>

          {/* THE display headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="display-xl mb-8"
            style={{ color: "hsl(var(--foreground))" }}
          >
            The wishes
            <br />
            <span className="text-gradient-candle">he left behind.</span>
          </motion.h1>

          {/* Lede with drop-cap */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="lede dropcap measure mb-10"
          >
            This is a quiet rebellion against a lie students were told for decades —
            that the world's best knowledge is sealed behind walls. Free research, free
            university courses, free premium tools, opened in his name.
          </motion.p>

          {/* CTAs — one primary, one ghost */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <a
              href="#research"
              onMouseEnter={playSpark}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-[15px] tracking-wide transition-all duration-300 active:scale-[0.97] sans glow-gold"
              style={{ background: "linear-gradient(135deg, hsl(var(--candle)), hsl(35 90% 50%))", color: "hsl(220 50% 6%)" }}
            >
              Light a candle
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#donate"
              onMouseEnter={playSpark}
              className="group inline-flex items-center gap-1.5 text-[14px] font-medium tracking-wide sans relative"
              style={{ color: "hsl(var(--hadi-red-soft))" }}
            >
              <span className="relative">
                Keep his light burning
                <span
                  className="absolute left-0 right-0 -bottom-1 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                  style={{ background: "hsl(var(--hadi-red-soft))" }}
                />
              </span>
              <span style={{ color: "hsl(var(--hadi-red))" }}>♥</span>
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT: Museum-framed portrait */}
        <motion.div
          style={{ y: portraitY, opacity: portraitOpacity, scale: portraitScale }}
          className="relative mx-auto w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative"
            style={{
              transform: `perspective(1400px) rotateY(${mouse.x * 3}deg) rotateX(${-mouse.y * 3}deg)`,
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Aura halo */}
            <div
              className="absolute -inset-16 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, hsl(var(--candle) / 0.32) 0%, transparent 60%)",
                filter: "blur(48px)",
              }}
            />

            {/* Outer brass frame */}
            <div
              className="relative p-3 rounded-[6px]"
              style={{
                background: "linear-gradient(135deg, hsl(42 60% 35%), hsl(35 70% 22%) 50%, hsl(42 55% 30%))",
                boxShadow:
                  "0 40px 90px -25px hsl(220 70% 0% / 0.8), 0 0 100px -10px hsl(var(--candle) / 0.35), inset 0 1px 0 hsl(45 90% 70% / 0.5), inset 0 -1px 0 hsl(20 50% 15% / 0.6)",
              }}
            >
              {/* Inner gold mat */}
              <div
                className="relative overflow-hidden rounded-[3px]"
                style={{
                  border: "1px solid hsl(var(--candle) / 0.35)",
                  boxShadow: "inset 0 0 0 4px hsl(220 60% 4%), inset 0 0 0 5px hsl(var(--candle) / 0.4)",
                }}
              >
                <img
                  src={hadiPortrait}
                  alt="Shaheed Osman Hadi — in memory, legacy & dignity"
                  className="w-full h-auto block"
                  loading="eager"
                  decoding="async"
                />
                {/* Subtle inner vignette for portrait depth */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at center, transparent 55%, hsl(220 60% 4% / 0.55) 100%)" }}
                />
              </div>
            </div>

            {/* Museum plaque */}
            <div
              className="mt-5 mx-auto max-w-[88%] py-3 px-5 text-center rounded-[3px]"
              style={{
                background: "linear-gradient(180deg, hsl(42 30% 18%), hsl(42 30% 12%))",
                border: "1px solid hsl(var(--candle) / 0.25)",
                boxShadow: "0 8px 24px -8px hsl(220 70% 0% / 0.6)",
              }}
            >
              <p className="eyebrow no-rule justify-center" style={{ color: "hsl(var(--candle))", fontSize: "0.625rem", letterSpacing: "0.32em" }}>
                Shaheed Osman Hadi
              </p>
              <p className="bengali-text text-[13px] mt-1.5" style={{ color: "hsl(42 30% 80%)" }}>
                স্মরণে · উত্তরাধিকারে · মর্যাদায়
              </p>
            </div>

            {/* Floating wax-seal stamp */}
            <motion.div
              animate={{ rotate: [0, 4, -2, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-5 -right-5 w-16 h-16 rounded-full wax-seal flex items-center justify-center bengali-text text-sm font-bold"
              style={{ color: "hsl(0 60% 92%)" }}
              aria-hidden="true"
            >
              হাদী
            </motion.div>
          </motion.div>

          {/* Mobile-only inline Wish */}
          <div className="lg:hidden mt-12">
            <WishOfTheWeek />
          </div>
        </motion.div>
      </div>

      {/* Wish of the Week — desktop floating overlay */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.6 }}
        className="hidden lg:block absolute bottom-32 left-1/2 -translate-x-1/2 w-full max-w-2xl section-padding z-10"
      >
        <WishOfTheWeek />
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="eyebrow no-rule" style={{ color: "hsl(42 22% 50%)", fontSize: "0.625rem" }}>
          keep reading
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-10"
          style={{ background: "linear-gradient(180deg, hsl(var(--candle) / 0.6), transparent)" }}
        />
      </motion.div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[5]"
        style={{ background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)" }}
      />
    </section>
  );
};

export default HeroSection;

import { motion } from "framer-motion";
import heroTree from "@/assets/hero-tree.jpg";
import MemorialBadge from "./MemorialBadge";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroTree}
          alt=""
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 hero-gradient opacity-60" />
      </div>

      {/* Floating particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0
              ? "hsl(42 85% 55% / 0.6)"
              : "hsl(162 100% 40% / 0.4)",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 text-center section-padding max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex justify-center"
        >
          <MemorialBadge variant="light" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bengali-text text-pathshala-gold-light text-lg md:text-xl mb-4 tracking-wide"
        >
          যা সে চেয়েছিল — তোমার জন্য খোলা
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-6"
          style={{ color: "hsl(var(--primary-foreground))" }}
        >
          The Wishes
          <br />
          <span className="text-gradient-gold">He Left Behind.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "hsl(162 30% 70%)" }}
        >
          Free research, free courses, free premium tools — everything Bangladesh's
          curious students were told they couldn't afford. Open. Forever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#research"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-200 active:scale-[0.97]"
            style={{
              background: "hsl(var(--pathshala-gold))",
              color: "hsl(var(--pathshala-deep))",
            }}
          >
            Claim His Wishes →
          </a>
          <a
            href="#library"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-base border-2 transition-all duration-200 active:scale-[0.97]"
            style={{
              borderColor: "hsl(162 60% 35% / 0.5)",
              color: "hsl(162 30% 70%)",
            }}
          >
            Browse Free Courses
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex flex-wrap justify-center gap-12"
        >
          {[
            { value: "100%", label: "Forever Free" },
            { value: "৳0", label: "Curated for Bangladesh" },
            { value: "∞", label: "Built on His Wish" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gradient-gold">{stat.value}</div>
              <div className="text-sm mt-1" style={{ color: "hsl(162 20% 55%)" }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to top, hsl(var(--background)), transparent)",
        }}
      />
    </section>
  );
};

export default HeroSection;

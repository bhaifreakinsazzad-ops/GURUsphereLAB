import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface LetterPageProps {
  bengaliQuote: string;
  englishTranslation?: string;
  signature?: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
  letterNumber?: string;
  topic?: string;
  readingTime?: string;
  align?: "center" | "left" | "right";
  tilt?: number;
}

/** A "page from Hadi's letter" with editorial pacing. */
const LetterPage = ({
  bengaliQuote,
  englishTranslation,
  signature,
  children,
  id,
  className = "",
  letterNumber = "01",
  topic,
  readingTime = "2 min letter",
  align = "center",
  tilt = 0,
}: LetterPageProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [tilt - 1, tilt, tilt + 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const alignClasses =
    align === "left"
      ? "mr-auto ml-0 md:ml-8 lg:ml-16 max-w-xl"
      : align === "right"
      ? "ml-auto mr-0 md:mr-8 lg:mr-16 max-w-xl"
      : "mx-auto max-w-2xl";

  return (
    <section
      ref={ref}
      id={id}
      className={`relative py-24 md:py-32 section-padding overflow-hidden ${className}`}
    >
      <motion.div
        style={{ rotate, y }}
        className={`mb-16 relative ${alignClasses}`}
      >
        {/* Letter meta */}
        <div className="flex items-center justify-between mb-3 px-2">
          <span
            className="eyebrow no-rule"
            style={{ color: "hsl(var(--candle))", fontSize: "0.625rem" }}
          >
            Letter №{letterNumber}{topic ? ` · ${topic}` : ""}
          </span>
          <span
            className="text-[10px] tracking-[0.2em] uppercase font-medium"
            style={{ color: "hsl(42 18% 55%)", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {readingTime}
          </span>
        </div>

        <div className="parchment-card p-8 md:p-10 relative">
          {/* Wax seal */}
          <div
            className="absolute -top-3 -right-3 w-10 h-10 rounded-full wax-seal flex items-center justify-center text-[8px] font-bold tracking-widest"
            style={{ color: "hsl(0 60% 90% / 0.9)" }}
          >
            হাদী
          </div>

          <p
            className="bengali-text text-lg md:text-2xl leading-[1.7] text-center"
            style={{ color: "hsl(var(--ink))" }}
          >
            {bengaliQuote}
          </p>
          {englishTranslation && (
            <p
              className="handwritten text-lg md:text-xl text-center mt-3 italic"
              style={{ color: "hsl(220 40% 25%)" }}
            >
              — {englishTranslation}
            </p>
          )}
          {signature && (
            <p
              className="handwritten text-base text-right mt-6"
              style={{ color: "hsl(220 50% 20%)" }}
            >
              {signature}
            </p>
          )}
        </div>
      </motion.div>

      {/* Section content */}
      <div className="relative">{children}</div>
    </section>
  );
};

export default LetterPage;

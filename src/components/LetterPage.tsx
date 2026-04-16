import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface LetterPageProps {
  bengaliQuote: string;
  englishTranslation?: string;
  signature?: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

/**
 * A "page from Hadi's letter" — parchment background with a handwritten Bengali quote at top,
 * then the section content. Parallax-rotated as you scroll for a faux-3D book feel.
 */
const LetterPage = ({
  bengaliQuote,
  englishTranslation,
  signature,
  children,
  id,
  className = "",
}: LetterPageProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-1.5, 0, 1.5]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative py-24 md:py-32 section-padding overflow-hidden ${className}`}
    >
      {/* Floating parchment quote at top */}
      <motion.div
        style={{ rotate, y }}
        className="max-w-2xl mx-auto mb-16 relative"
      >
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

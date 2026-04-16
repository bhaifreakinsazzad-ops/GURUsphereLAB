import { useEffect, useRef, useState } from "react";

interface CandleProps {
  size?: number;
  className?: string;
}

/**
 * Pure CSS candle with flickering flame & rising glow particles.
 * No images, no WebGL — feels alive on every device.
 */
const Candle = ({ size = 80, className = "" }: CandleProps) => {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size * 2.6 }}
      aria-hidden="true"
    >
      {/* Glow halo */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full animate-glow"
        style={{
          top: -size * 0.3,
          width: size * 2.5,
          height: size * 2.5,
          background:
            "radial-gradient(circle, hsl(var(--candle) / 0.55) 0%, hsl(var(--candle) / 0.18) 30%, transparent 65%)",
          filter: "blur(8px)",
        }}
      />

      {/* Flame */}
      <div
        className="absolute left-1/2 -translate-x-1/2 animate-flicker"
        style={{
          top: 0,
          width: size * 0.35,
          height: size * 0.7,
          background:
            "radial-gradient(ellipse at 50% 70%, hsl(45 100% 80%) 0%, hsl(35 100% 60%) 35%, hsl(15 95% 50% / 0.9) 65%, transparent 100%)",
          borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%",
          transformOrigin: "50% 100%",
          filter: "blur(0.5px)",
        }}
      />
      {/* Flame core */}
      <div
        className="absolute left-1/2 -translate-x-1/2 animate-flicker"
        style={{
          top: size * 0.15,
          width: size * 0.18,
          height: size * 0.4,
          background:
            "radial-gradient(ellipse at 50% 70%, hsl(50 100% 95%) 0%, hsl(40 100% 80%) 50%, transparent 100%)",
          borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%",
          transformOrigin: "50% 100%",
        }}
      />

      {/* Wick */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-zinc-900"
        style={{ top: size * 0.7, width: 1.5, height: size * 0.08 }}
      />

      {/* Candle body */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-t-md"
        style={{
          top: size * 0.78,
          width: size * 0.55,
          height: size * 1.7,
          background:
            "linear-gradient(180deg, hsl(40 30% 92%) 0%, hsl(38 40% 85%) 50%, hsl(35 35% 70%) 100%)",
          boxShadow:
            "inset -8px 0 12px hsl(30 30% 50% / 0.4), inset 4px 0 8px hsl(40 50% 95% / 0.6), 0 4px 12px hsl(0 0% 0% / 0.4)",
        }}
      />

      {/* Wax drip */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: size * 0.95,
          width: size * 0.08,
          height: size * 0.5,
          background: "linear-gradient(180deg, hsl(40 40% 88%), hsl(35 35% 75%))",
          borderRadius: "0 0 40% 40%",
          transform: "translateX(-30%)",
        }}
      />
    </div>
  );
};

interface ParticlesProps {
  count?: number;
}

/** Rising candle-light particles */
export const RisingParticles = ({ count = 18 }: ParticlesProps) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    bottom: Math.random() * 30,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
    size: 2 + Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-rise"
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: p.size,
            height: p.size,
            background: "hsl(var(--candle) / 0.85)",
            boxShadow: "0 0 6px hsl(var(--candle) / 0.8)",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

/** Parallax-tilted wrapper that responds to mouse + scroll */
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const TiltCard = ({ children, className = "", intensity = 6 }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1200px) rotateX(0deg) rotateY(0deg)");

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(1200px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) translateZ(0)`
    );
  };

  const handleLeave = () => {
    setTransform("perspective(1200px) rotateX(0deg) rotateY(0deg)");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform, transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)", transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </div>
  );
};

export default Candle;

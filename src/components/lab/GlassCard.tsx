import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlowTone = "cyan" | "violet" | "gold" | "rose" | "emerald" | "none";

const toneShadow: Record<GlowTone, string> = {
  cyan: "shadow-[0_0_40px_-12px_hsl(var(--lab-cyan)/0.55)]",
  violet: "shadow-[0_0_40px_-12px_hsl(var(--lab-violet)/0.55)]",
  gold: "shadow-[0_0_40px_-12px_hsl(var(--candle)/0.55)]",
  rose: "shadow-[0_0_40px_-12px_hsl(var(--hadi-red-soft)/0.5)]",
  emerald: "shadow-[0_0_40px_-12px_hsl(var(--pathshala-green)/0.5)]",
  none: "",
};

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: GlowTone;
  hoverLift?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = "none", hoverLift = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
        "transition-all duration-300",
        hoverLift && "hover:-translate-y-1 hover:bg-white/[0.06] hover:border-white/20",
        toneShadow[glow],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
GlassCard.displayName = "GlassCard";
export default GlassCard;

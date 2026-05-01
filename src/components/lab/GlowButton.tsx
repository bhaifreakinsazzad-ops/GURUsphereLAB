import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "cyan" | "violet" | "gold" | "ghost";

const toneClasses: Record<Tone, string> = {
  cyan:
    "border-[hsl(var(--lab-cyan)/0.5)] text-[hsl(var(--lab-cyan))] bg-[hsl(var(--lab-cyan)/0.08)] hover:bg-[hsl(var(--lab-cyan)/0.18)] hover:shadow-[0_0_30px_-4px_hsl(var(--lab-cyan)/0.6)]",
  violet:
    "border-[hsl(var(--lab-violet)/0.5)] text-[hsl(var(--lab-violet))] bg-[hsl(var(--lab-violet)/0.08)] hover:bg-[hsl(var(--lab-violet)/0.18)] hover:shadow-[0_0_30px_-4px_hsl(var(--lab-violet)/0.6)]",
  gold:
    "border-[hsl(var(--candle)/0.5)] text-[hsl(var(--candle))] bg-[hsl(var(--candle)/0.08)] hover:bg-[hsl(var(--candle)/0.18)] hover:shadow-[0_0_30px_-4px_hsl(var(--candle)/0.6)]",
  ghost:
    "border-white/15 text-foreground bg-white/[0.03] hover:bg-white/[0.07]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold tracking-wide backdrop-blur-md transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-[hsl(var(--lab-cyan))]";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
}
export const GlowButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, tone = "cyan", ...props }, ref) => (
    <button ref={ref} className={cn(base, toneClasses[tone], className)} {...props} />
  ),
);
GlowButton.displayName = "GlowButton";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  tone?: Tone;
}
export const GlowLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, tone = "cyan", ...props }, ref) => (
    <a ref={ref} className={cn(base, toneClasses[tone], className)} {...props} />
  ),
);
GlowLink.displayName = "GlowLink";

export default GlowButton;

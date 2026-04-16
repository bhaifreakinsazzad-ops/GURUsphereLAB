import { Flame } from "lucide-react";

interface MemorialBadgeProps {
  variant?: "light" | "dark";
  className?: string;
}

const MemorialBadge = ({ variant = "dark", className = "" }: MemorialBadgeProps) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide sans ${className}`}
      style={{
        background: "linear-gradient(135deg, hsl(var(--candle) / 0.18), hsl(var(--candle) / 0.08))",
        color: "hsl(var(--candle-soft))",
        border: "1px solid hsl(var(--candle) / 0.35)",
        boxShadow: "0 0 20px hsl(var(--candle) / 0.15)",
      }}
    >
      <Flame size={12} className="animate-flicker" style={{ color: "hsl(var(--candle))" }} />
      <span>In memory of Shaheed Osman Hadi</span>
    </div>
  );
};

export default MemorialBadge;

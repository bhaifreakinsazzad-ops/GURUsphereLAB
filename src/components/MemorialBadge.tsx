import { Heart } from "lucide-react";

interface MemorialBadgeProps {
  variant?: "light" | "dark";
  className?: string;
}

const MemorialBadge = ({ variant = "dark", className = "" }: MemorialBadgeProps) => {
  const isLight = variant === "light";
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${className}`}
      style={{
        background: isLight ? "hsl(var(--pathshala-gold) / 0.15)" : "hsl(var(--pathshala-gold) / 0.1)",
        color: isLight ? "hsl(var(--pathshala-gold-light))" : "hsl(var(--pathshala-gold))",
        border: "1px solid hsl(var(--pathshala-gold) / 0.25)",
      }}
    >
      <Heart size={11} className="fill-current" />
      <span>In memory of Shaheed Osman Hadi</span>
    </div>
  );
};

export default MemorialBadge;

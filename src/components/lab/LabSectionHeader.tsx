interface Props {
  eyebrow?: string;
  title: string;
  bengaliTitle?: string;
  subtitle?: string;
  align?: "left" | "center";
}

const LabSectionHeader = ({ eyebrow, title, bengaliTitle, subtitle, align = "center" }: Props) => (
  <div className={align === "center" ? "text-center max-w-2xl mx-auto mb-12" : "max-w-2xl mb-12"}>
    {eyebrow && (
      <p
        className="text-[11px] font-bold tracking-[0.28em] uppercase mb-3"
        style={{ color: "hsl(var(--lab-cyan))" }}
      >
        {eyebrow}
      </p>
    )}
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
      {title}
    </h2>
    {bengaliTitle && (
      <p
        className="bengali-text text-xl md:text-2xl mt-3"
        style={{ color: "hsl(var(--lab-violet))" }}
      >
        {bengaliTitle}
      </p>
    )}
    {subtitle && (
      <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
    )}
  </div>
);

export default LabSectionHeader;

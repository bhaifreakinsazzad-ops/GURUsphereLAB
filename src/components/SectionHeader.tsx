import ScrollReveal from "./ScrollReveal";

interface Props {
  eyebrow: string;
  heading: React.ReactNode;
  lede?: string;
  variant?: "centered" | "left-rule" | "split";
  className?: string;
}

/** Editorial section heads with 3 rhythm variants. */
const SectionHeader = ({ eyebrow, heading, lede, variant = "centered", className = "" }: Props) => {
  if (variant === "left-rule") {
    return (
      <ScrollReveal>
        <div className={`flex gap-6 mb-12 ${className}`}>
          <div className="gold-rule shrink-0" />
          <div>
            <p className="eyebrow no-rule mb-4">{eyebrow}</p>
            <h2 className="display-lg mb-4 text-foreground">{heading}</h2>
            {lede && <p className="lede measure">{lede}</p>}
          </div>
        </div>
      </ScrollReveal>
    );
  }

  if (variant === "split") {
    return (
      <ScrollReveal>
        <div className={`grid md:grid-cols-2 gap-8 md:gap-16 mb-14 items-end ${className}`}>
          <div>
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h2 className="display-lg text-foreground">{heading}</h2>
          </div>
          {lede && <p className="lede measure md:pb-2">{lede}</p>}
        </div>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal>
      <div className={`text-center mb-14 ${className}`}>
        <p className="eyebrow mb-4 justify-center">{eyebrow}</p>
        <h2 className="display-lg text-foreground mb-5 max-w-3xl mx-auto">{heading}</h2>
        {lede && <p className="lede measure mx-auto">{lede}</p>}
      </div>
    </ScrollReveal>
  );
};

export default SectionHeader;

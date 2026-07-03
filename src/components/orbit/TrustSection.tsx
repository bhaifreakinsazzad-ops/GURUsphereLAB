const STATS = [
  { value: "12,400+", label: "Learners onboarded" },
  { value: "180+", label: "Courses & pathways" },
  { value: "40+", label: "Educators & mentors" },
];

const TrustSection = () => (
  <section className="py-20 md:py-24 px-6 md:px-10" aria-labelledby="trust-title">
    <div className="max-w-[1200px] mx-auto">
      <h2 id="trust-title" className="sr-only">Trust & impact</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {STATS.map((s) => (
          <div key={s.label} className="orbit-card p-8 text-center">
            <div
              className="text-[clamp(2rem,4vw,2.75rem)] mb-2"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, letterSpacing: "-0.03em", color: "hsl(var(--foreground))" }}
            >
              {s.value}
            </div>
            <div className="text-[13px]" style={{ color: "hsl(var(--foreground-subtle))", letterSpacing: "0.05em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <figure
        className="orbit-card p-8 md:p-12 max-w-[820px] mx-auto"
        style={{ background: "hsl(var(--surface-raised))" }}
      >
        <blockquote
          className="text-[clamp(1.125rem,1.6vw,1.375rem)] leading-relaxed"
          style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "hsl(var(--foreground))" }}
        >
          "I stopped needing to hunt across ten websites. Everything I needed to actually learn was
          waiting — in one place, in a language I could think in."
        </blockquote>
        <figcaption className="mt-5 text-[13px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
          Sadia · beta learner, Dhaka
        </figcaption>
      </figure>
    </div>
  </section>
);

export default TrustSection;

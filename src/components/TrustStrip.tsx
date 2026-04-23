import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const stats: Stat[] = [
  { value: 12400, suffix: "+", label: "Free resources curated" },
  { value: 6, label: "World universities indexed" },
  { value: 240000, prefix: "৳", label: "Pledged in his name" },
  { value: 100, suffix: "%", label: "Open source · forever" },
];

const formatNumber = (n: number) => {
  if (n >= 100000) return (n / 1000).toFixed(0) + "k";
  if (n >= 1000) return n.toLocaleString();
  return String(n);
};

const useCountUp = (target: number, start: boolean, duration = 1400) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return val;
};

const StatItem = ({ stat, start }: { stat: Stat; start: boolean }) => {
  const v = useCountUp(stat.value, start);
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div
        className="text-2xl md:text-3xl font-medium tracking-tight"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "hsl(var(--candle))" }}
      >
        {stat.prefix}
        {formatNumber(v)}
        {stat.suffix}
      </div>
      <div className="eyebrow no-rule mt-1.5" style={{ color: "hsl(42 18% 60%)", fontSize: "0.625rem" }}>
        {stat.label}
      </div>
    </div>
  );
};

const TrustStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative section-padding py-10 border-y"
      style={{ borderColor: "hsl(var(--candle) / 0.12)", background: "hsl(220 45% 4% / 0.6)" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-x-12 items-start">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={i > 0 ? "md:border-l md:pl-12" : ""}
            style={i > 0 ? { borderColor: "hsl(var(--candle) / 0.12)" } : undefined}
          >
            <StatItem stat={s} start={visible} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustStrip;

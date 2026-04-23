import { useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import { toast } from "@/hooks/use-toast";
import Candle, { RisingParticles } from "./Candle";
import CandleLogomark from "./CandleLogomark";

const exploreLinks = [
  { label: "Research Archive", href: "/research-archive", route: true },
  { label: "Team Projects", href: "/team-projects", route: true },
  { label: "Mentorship", href: "/mentorship", route: true },
  { label: "Hadi Meter", href: "/hadi-meter", route: true },
  { label: "Exam Arena", href: "/exam-arena", route: true },
];

const memorialLinks = [
  { label: "Memorial Wall", href: "/#memorial" },
  { label: "His Legacy", href: "/#legacy" },
  { label: "Donate", href: "/#donate" },
];

const FooterSection = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast({ title: "You're in. 🤍", description: "We'll send you new free courses & tools as we curate them." });
      setEmail("");
      setSubmitting(false);
    }, 600);
  };

  return (
    <footer id="join" className="relative overflow-hidden pt-28 md:pt-36 pb-10 section-padding">
      <div className="absolute inset-0 hero-gradient" />
      <RisingParticles count={16} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Editorial CTA block */}
        <ScrollReveal>
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <Candle size={48} />
            </div>
            <p className="eyebrow no-rule justify-center mb-5" style={{ color: "hsl(var(--candle))" }}>
              The Letter Continues
            </p>
            <h2 className="display-lg mb-5 text-foreground">
              His wish.{" "}
              <span className="text-gradient-candle">Your turn.</span>
            </h2>
            <p className="lede measure mx-auto mb-9">
              Get every new free course, research portal, and premium tool we unlock —
              quietly, in his name. No spam. No fees.
            </p>

            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-5 py-3.5 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-shadow"
                style={{
                  background: "hsl(var(--background) / 0.6)",
                  border: "1px solid hsl(var(--candle) / 0.25)",
                  color: "hsl(var(--foreground))",
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.97] shrink-0 disabled:opacity-60 glow-gold"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--candle)), hsl(35 90% 50%))",
                  color: "hsl(220 50% 6%)",
                }}
              >
                {submitting ? "Joining..." : "Join the wishes"}
              </button>
            </form>
          </div>
        </ScrollReveal>

        <div className="hairline mb-16" />

        {/* 4-column editorial footer */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-4">
              <Link to="/" className="flex items-center gap-2.5 mb-5">
                <CandleLogomark size={26} />
                <span
                  className="text-2xl font-medium italic"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Hadi <span className="text-gradient-gold">Wishes</span>
                </span>
              </Link>
              <p className="bengali-text text-sm leading-relaxed mb-4 italic" style={{ color: "hsl(var(--candle-soft) / 0.85)" }}>
                শহীদ ওসমান হাদীর স্মরণে — তাঁর স্বপ্ন, আমাদের পথ।
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: "hsl(42 18% 60%)" }}>
                Born of grief. Built with love. Free, forever.
              </p>
            </div>

            {/* Explore */}
            <div className="md:col-span-3">
              <p className="eyebrow no-rule mb-5" style={{ color: "hsl(var(--candle))", fontSize: "0.625rem" }}>
                Explore
              </p>
              <ul className="space-y-2.5">
                {exploreLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      to={l.href}
                      className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Memorial */}
            <div className="md:col-span-2">
              <p className="eyebrow no-rule mb-5" style={{ color: "hsl(var(--candle))", fontSize: "0.625rem" }}>
                Memorial
              </p>
              <ul className="space-y-2.5">
                {memorialLinks.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stay close */}
            <div className="md:col-span-3">
              <p className="eyebrow no-rule mb-5" style={{ color: "hsl(var(--candle))", fontSize: "0.625rem" }}>
                Stay close
              </p>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/auth" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    Create an account
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    Your dashboard
                  </Link>
                </li>
                <li>
                  <a href="#donate" className="text-[13px] hover:underline transition-colors" style={{ color: "hsl(var(--hadi-red-soft))" }}>
                    Keep his light burning ♥
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </ScrollReveal>

        <div className="hairline mt-16 mb-8" />

        {/* Bottom strip — powered-by line preserved verbatim */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: "hsl(42 15% 50%)", fontFamily: "'Space Grotesk', sans-serif" }}>
            © {new Date().getFullYear()} Hadi Wishes · A free knowledge sanctuary
          </p>
          <p className="text-[12px]" style={{ color: "hsl(42 15% 60%)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Powered by{" "}
            <span className="font-semibold text-gradient-gold">Freakin Studio</span>
            {" "}&amp; the love of{" "}
            <a
              href="https://BhaiSazzaD.online"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gradient-red hover:underline"
            >
              BhaiSazzaD.online
            </a>
            {" "}&amp; 200 Million others{" "}
            <span style={{ color: "hsl(var(--hadi-red-soft))" }}>♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

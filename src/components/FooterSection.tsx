import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { toast } from "@/hooks/use-toast";
import MemorialBadge from "./MemorialBadge";
import Candle, { RisingParticles } from "./Candle";

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
    <footer id="join" className="py-32 md:py-40 section-padding relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient" />
      <RisingParticles count={20} />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <ScrollReveal>
          <div className="flex justify-center mb-8">
            <Candle size={56} />
          </div>

          <div className="mb-6 flex justify-center">
            <MemorialBadge />
          </div>

          <p className="bengali-text text-xl mb-4" style={{ color: "hsl(var(--candle-soft))" }}>
            শেখা শুরু করো — তাঁর স্বপ্ন বাঁচিয়ে রাখো
          </p>
          <h2
            className="text-4xl md:text-6xl tracking-tight leading-[1.05] mb-6 italic font-medium"
            style={{ color: "hsl(var(--foreground))", fontFamily: "'Cormorant Garamond', serif" }}
          >
            His wish.{" "}
            <span className="handwritten not-italic text-gradient-candle">Your turn.</span>
          </h2>
          <p className="text-lg mb-10 max-w-lg mx-auto leading-relaxed font-light" style={{ color: "hsl(42 22% 70%)" }}>
            Get every new free course, research portal, and premium tool we unlock —
            straight to your inbox. No spam. No fees. Just knowledge, freely given.
          </p>

          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto sans">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-5 py-4 rounded-xl text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 transition-shadow"
              style={{
                background: "hsl(var(--background) / 0.6)",
                border: "1px solid hsl(var(--candle) / 0.25)",
                color: "hsl(var(--foreground))",
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.97] shrink-0 disabled:opacity-60 glow-gold"
              style={{
                background: "linear-gradient(135deg, hsl(var(--candle)), hsl(35 90% 50%))",
                color: "hsl(220 50% 6%)",
              }}
            >
              {submitting ? "Joining..." : "Join Hadi Wishes"}
            </button>
          </form>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div
            className="mt-20 pt-10 flex flex-col items-center gap-4"
            style={{ borderTop: "1px solid hsl(var(--candle) / 0.15)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gradient-gold italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Hadi</span>
              <span className="text-2xl handwritten text-gradient-green">Wishes</span>
            </div>
            <p
              className="bengali-text text-base max-w-md italic"
              style={{ color: "hsl(var(--candle-soft) / 0.85)" }}
            >
              শহীদ ওসমান হাদীর স্মরণে — তাঁর স্বপ্ন, আমাদের পথ।
            </p>
            <p className="text-xs sans tracking-wide" style={{ color: "hsl(42 15% 50%)" }}>
              Born of grief. Built with love. Free, forever.
            </p>
            <p className="text-xs sans tracking-wide mt-2" style={{ color: "hsl(42 15% 55%)" }}>
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
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default FooterSection;

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { toast } from "@/hooks/use-toast";
import MemorialBadge from "./MemorialBadge";

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
    <footer id="join" className="py-24 md:py-32 section-padding relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient opacity-95" />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <ScrollReveal>
          <div className="mb-6 flex justify-center">
            <MemorialBadge variant="light" />
          </div>

          <p className="bengali-text text-lg mb-4" style={{ color: "hsl(var(--pathshala-gold-light))" }}>
            শেখা শুরু করো — তাঁর স্বপ্ন বাঁচিয়ে রাখো
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6"
            style={{ color: "hsl(var(--primary-foreground))" }}
          >
            His wish. Your turn.
          </h2>
          <p className="text-lg mb-10 max-w-lg mx-auto leading-relaxed" style={{ color: "hsl(162 30% 65%)" }}>
            Get every new free course, research portal, and premium tool we unlock —
            straight to your inbox. No spam. No fees. Just knowledge, freely given.
          </p>

          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pathshala-gold/50 transition-shadow"
              style={{ color: "hsl(var(--primary-foreground))" }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.97] shrink-0 disabled:opacity-60"
              style={{
                background: "hsl(var(--pathshala-gold))",
                color: "hsl(var(--pathshala-deep))",
              }}
            >
              {submitting ? "Joining..." : "Join Hadi Wishes"}
            </button>
          </form>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-20 pt-8 border-t border-white/10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gradient-gold">Hadi</span>
              <span className="text-xl font-bold text-gradient-green">Wishes</span>
            </div>
            <p
              className="bengali-text text-sm max-w-md"
              style={{ color: "hsl(var(--pathshala-gold-light))" }}
            >
              শহীদ ওসমান হাদীর স্মরণে — তাঁর স্বপ্ন, আমাদের পথ।
            </p>
            <p className="text-xs" style={{ color: "hsl(162 15% 40%)" }}>
              In loving memory of Shaheed Osman Hadi · Built for the curious of Bangladesh, free for the world.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default FooterSection;

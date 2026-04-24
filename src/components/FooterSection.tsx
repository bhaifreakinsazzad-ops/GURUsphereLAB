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
                <span className="flex flex-col leading-none">
                  <span className="bengali-text text-2xl font-semibold">
                    হাদির <span className="text-gradient-gold">ইচ্ছা</span>
                  </span>
                  <span className="text-[10px] tracking-[0.24em] uppercase mt-1" style={{ color: "hsl(var(--candle) / 0.7)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    Hadi Wishes
                  </span>
                </span>
              </Link>
              <p className="bengali-text text-sm leading-relaxed mb-3 italic" style={{ color: "hsl(var(--candle-soft) / 0.85)" }}>
                শহীদ ওসমান হাদীর স্মরণে — তাঁর স্বপ্ন, আমাদের পথ।
              </p>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: "hsl(42 18% 60%)" }}>
                Born of grief. Built with love. Free, forever — for Bangladesh.
              </p>

              {/* Share buttons — BD users share heavily on WhatsApp/FB/Telegram */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.2em] uppercase mr-1" style={{ color: "hsl(42 18% 55%)", fontFamily: "'Space Grotesk', sans-serif" }}>Share</span>
                <a
                  href="https://wa.me/?text=হাদির%20ইচ্ছা%20—%20শহীদ%20ওসমান%20হাদীর%20স্মরণে%20বাংলাদেশের%20জন্য%20ফ্রি%20জ্ঞানভাণ্ডার%20https%3A%2F%2Fgurusphere-lab.lovable.app"
                  target="_blank" rel="noopener noreferrer"
                  aria-label="Share on WhatsApp"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{ background: "hsl(142 70% 35% / 0.15)", border: "1px solid hsl(142 70% 45% / 0.4)", color: "hsl(142 70% 65%)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.057 0C5.495 0 .163 5.334.163 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.695 1.448h.005c6.554 0 11.892-5.335 11.892-11.892C23.953 5.334 18.616 0 12.057 0z"/></svg>
                </a>
                <a
                  href="https://t.me/share/url?url=https%3A%2F%2Fgurusphere-lab.lovable.app&text=হাদির%20ইচ্ছা%20—%20বাংলাদেশের%20জন্য%20ফ্রি%20জ্ঞানভাণ্ডার"
                  target="_blank" rel="noopener noreferrer"
                  aria-label="Share on Telegram"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{ background: "hsl(200 80% 45% / 0.15)", border: "1px solid hsl(200 80% 55% / 0.4)", color: "hsl(200 80% 70%)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </a>
                <a
                  href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgurusphere-lab.lovable.app"
                  target="_blank" rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{ background: "hsl(220 80% 50% / 0.15)", border: "1px solid hsl(220 80% 60% / 0.4)", color: "hsl(220 80% 75%)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
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

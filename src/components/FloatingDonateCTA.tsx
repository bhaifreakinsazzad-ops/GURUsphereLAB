import { Heart } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const FloatingDonateCTA = () => {
  const { pathname } = useLocation();
  // On Index page, anchor scroll to #donate; on other pages, route to "/#donate"
  const href = pathname === "/" ? "#donate" : "/#donate";
  const isAnchor = pathname === "/";

  const className =
    "fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-pathshala-gold-light shadow-[0_8px_24px_-8px_hsl(var(--candle)/0.6)] hover:scale-[1.04] active:scale-95 transition-transform animate-pulse-soft md:bottom-6 md:right-6";

  return isAnchor ? (
    <a href={href} className={className} aria-label="Support Hadi Wishes">
      <Heart size={16} fill="currentColor" /> <span className="hidden sm:inline">Support Hadi</span>
    </a>
  ) : (
    <Link to={href} className={className} aria-label="Support Hadi Wishes">
      <Heart size={16} fill="currentColor" /> <span className="hidden sm:inline">Support Hadi</span>
    </Link>
  );
};

export default FloatingDonateCTA;

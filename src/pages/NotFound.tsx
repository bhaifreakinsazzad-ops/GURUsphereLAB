import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center hero-gradient relative overflow-hidden">
      <div className="text-center relative z-10 section-padding">
        <p className="bengali-text text-lg mb-4" style={{ color: "hsl(var(--pathshala-gold-light))" }}>
          পথ হারিয়ে গেছে — কিন্তু স্বপ্ন বেঁচে আছে
        </p>
        <h1 className="text-7xl md:text-9xl font-bold text-gradient-gold mb-4">404</h1>
        <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: "hsl(162 30% 65%)" }}>
          This page isn't here — but Hadi's wishes are. Head back home and claim them.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-200 active:scale-[0.97]"
          style={{
            background: "hsl(var(--pathshala-gold))",
            color: "hsl(var(--pathshala-deep))",
          }}
        >
          ← Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

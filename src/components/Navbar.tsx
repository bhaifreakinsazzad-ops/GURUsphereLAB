import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Research", href: "#research" },
  { label: "Free Courses", href: "#library" },
  { label: "Premium Tools", href: "#tools" },
  { label: "Open Source", href: "#open-source" },
  { label: "Community", href: "#clubs" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl section-padding py-4">
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient-gold">Hadi</span>
            <span className="text-2xl font-bold text-gradient-green">Wishes</span>
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#join"
              className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] duration-150"
            >
              Join Free
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-2xl mt-2 p-4 md:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#join"
                onClick={() => setOpen(false)}
                className="block mt-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold text-center"
              >
                Join Free
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;

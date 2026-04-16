import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Legacy", href: "#legacy" },
  { label: "Research", href: "#research" },
  { label: "Free Courses", href: "#library" },
  { label: "Memorial", href: "#memorial" },
  { label: "Donate", href: "#donate" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl section-padding py-4">
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient-gold">Hadi</span>
            <span className="text-2xl font-bold text-gradient-green">Wishes</span>
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
                  <UserIcon size={14} /> {profile?.display_name ?? "you"}
                </span>
                <button
                  onClick={signOut}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] duration-150"
              >
                Sign in
              </Link>
            )}
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
              {user ? (
                <button
                  onClick={() => { setOpen(false); signOut(); }}
                  className="block w-full mt-2 px-5 py-3 rounded-xl text-sm font-semibold text-center bg-muted text-foreground"
                >
                  Sign out ({profile?.display_name})
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="block mt-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold text-center"
                >
                  Sign in
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;

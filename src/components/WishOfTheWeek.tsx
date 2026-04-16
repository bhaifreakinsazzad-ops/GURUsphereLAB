import { motion } from "framer-motion";
import { Sparkles, ExternalLink } from "lucide-react";

const featured = [
  {
    title: "CS50 by Harvard",
    tag: "Free Course · Worth $50,000/yr",
    desc: "The world's most famous intro to computer science — taught by David Malan, free on edX.",
    url: "https://cs50.harvard.edu/x/",
  },
  {
    title: "GitHub Student Pack",
    tag: "Premium Tools · Worth $200+/yr",
    desc: "Free domains, cloud credits, IDEs, and 100+ premium dev tools — just verify you're a student.",
    url: "https://education.github.com/pack",
  },
  {
    title: "MIT OpenCourseWare",
    tag: "University · Worth $60,000/yr",
    desc: "Full MIT course materials — CS, math, physics, engineering. Lecture videos, notes, exams.",
    url: "https://ocw.mit.edu",
  },
  {
    title: "fast.ai",
    tag: "AI / ML · Worth $5,000+",
    desc: "Practical deep learning for coders. Build real AI in weeks, not months. Top-down approach.",
    url: "https://www.fast.ai",
  },
  {
    title: "Khan Academy Bangla",
    tag: "Free Tutoring · Worth ৳5k+/mo",
    desc: "Math, science, computing — fully translated to Bengali. From class 1 to university prep.",
    url: "https://bn.khanacademy.org",
  },
  {
    title: "Figma Education",
    tag: "Premium Tool · Worth $15/mo",
    desc: "Full Figma Professional plan — design, prototype, collaborate. Free with student verification.",
    url: "https://www.figma.com/education/",
  },
  {
    title: "freeCodeCamp",
    tag: "Free Bootcamp · Worth $10,000+",
    desc: "3,000+ hours of curriculum + 12 free certifications. Web, data, ML, Python, JavaScript.",
    url: "https://www.freecodecamp.org",
  },
];

// ISO week number — deterministic rotation
const getWeekIndex = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = (now.getTime() - start.getTime()) / 86400000;
  const week = Math.floor((diff + start.getDay() + 1) / 7);
  return week;
};

const WishOfTheWeek = () => {
  const wish = featured[getWeekIndex() % featured.length];

  return (
    <motion.a
      href={wish.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      whileHover={{ y: -2 }}
      className="group relative block max-w-xl mx-auto rounded-2xl p-5 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--pathshala-gold) / 0.18), hsl(var(--pathshala-green) / 0.12))",
        border: "1px solid hsl(var(--pathshala-gold) / 0.35)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-start gap-4 text-left">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "hsl(var(--pathshala-gold) / 0.25)" }}
        >
          <Sparkles size={20} className="text-pathshala-gold-light" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "hsl(var(--pathshala-gold-light))" }}
            >
              Wish of the Week
            </span>
            <ExternalLink size={13} className="text-pathshala-gold-light/70 group-hover:text-pathshala-gold-light transition-colors" />
          </div>
          <h3 className="font-bold text-base" style={{ color: "hsl(var(--primary-foreground))" }}>
            {wish.title}
          </h3>
          <p className="text-xs font-medium mt-0.5" style={{ color: "hsl(var(--pathshala-gold-light))" }}>
            {wish.tag}
          </p>
          <p className="text-xs mt-2 leading-relaxed" style={{ color: "hsl(162 30% 70%)" }}>
            {wish.desc}
          </p>
        </div>
      </div>
    </motion.a>
  );
};

export default WishOfTheWeek;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { ExternalLink, Search, GraduationCap } from "lucide-react";

const courses = [
  {
    title: "MIT OpenCourseWare",
    bengali: "এমআইটি কোর্স",
    provider: "MIT",
    category: "University",
    normallyPaid: "$60,000/yr at MIT",
    desc: "Full MIT course materials — CS, math, physics, engineering. Lecture videos, notes, exams, all free.",
    url: "https://ocw.mit.edu",
  },
  {
    title: "Khan Academy Bangla",
    bengali: "খান একাডেমি",
    provider: "Khan Academy",
    category: "K–12",
    normallyPaid: "Tutoring: ৳5k+/mo",
    desc: "Math, science, and computing — fully translated to Bengali. From class 1 to university prep.",
    url: "https://bn.khanacademy.org",
  },
  {
    title: "freeCodeCamp",
    bengali: "ফ্রি কোডক্যাম্প",
    provider: "freeCodeCamp",
    category: "Coding",
    normallyPaid: "Bootcamps: $10k+",
    desc: "3,000+ hours of coding curriculum + 12 free certifications. Web, data, ML, Python, JavaScript.",
    url: "https://www.freecodecamp.org",
  },
  {
    title: "CS50 by Harvard",
    bengali: "হার্ভার্ড সিএস৫০",
    provider: "Harvard",
    category: "Computer Science",
    normallyPaid: "$50,000/yr at Harvard",
    desc: "The world's most famous intro to computer science — full Harvard course, free on edX.",
    url: "https://cs50.harvard.edu/x/",
  },
  {
    title: "Stanford Online",
    bengali: "স্ট্যানফোর্ড অনলাইন",
    provider: "Stanford",
    category: "University",
    normallyPaid: "$56,000/yr at Stanford",
    desc: "Free Stanford lectures: AI, ML, databases, algorithms — taught by the original professors.",
    url: "https://online.stanford.edu/free-courses",
  },
  {
    title: "fast.ai",
    bengali: "ফাস্ট এআই",
    provider: "fast.ai",
    category: "AI / ML",
    normallyPaid: "ML bootcamps: $5k+",
    desc: "Practical deep learning for coders. Build real AI in weeks, not months. Free, top-down approach.",
    url: "https://www.fast.ai",
  },
];

const LibrarySection = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="library" className="py-24 md:py-32 section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, hsl(var(--pathshala-gold) / 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-pathshala-gold mb-3">
              Free Courses Library
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              MIT. Harvard. Stanford.{" "}
              <span className="text-gradient-gold">All free.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              These are the same courses you'd pay tens of thousands of dollars for at top universities.
              Hadi believed every curious mind deserves them — so here they are.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Course list */}
          <ScrollReveal direction="left">
            <div className="space-y-3">
              {courses.map((c, i) => (
                <motion.button
                  key={c.title}
                  onClick={() => setActive(i)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    active === i ? "glass-card glow-green" : "hover:bg-muted/60"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        active === i
                          ? "bg-pathshala-green text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <GraduationCap size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground truncate">{c.title}</p>
                      <p className="bengali-text text-xs text-muted-foreground">{c.bengali}</p>
                    </div>
                    <span className="ml-auto text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground shrink-0">
                      {c.category}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Active course preview */}
          <ScrollReveal direction="right">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="feature-card min-h-[360px] flex flex-col sticky top-24"
              >
                <div className="flex-1">
                  <span className="text-xs font-semibold tracking-widest uppercase text-pathshala-gold">
                    {courses[active].provider}
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-2">
                    {courses[active].title}
                  </h3>
                  <p className="bengali-text text-sm text-muted-foreground mt-1">
                    {courses[active].bengali}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pathshala-gold/10 border border-pathshala-gold/20">
                    <span className="text-xs font-semibold text-pathshala-gold">
                      Normally: {courses[active].normallyPaid}
                    </span>
                  </div>

                  <p className="text-muted-foreground mt-5 leading-relaxed">
                    {courses[active].desc}
                  </p>
                </div>

                <div className="mt-6">
                  <a
                    href={courses[active].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-pathshala-green text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
                  >
                    Open free course <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </ScrollReveal>
        </div>

        {/* Search hint */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 feature-card flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-xl bg-pathshala-gold/20 flex items-center justify-center shrink-0">
              <Search size={20} className="text-pathshala-gold" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">More on the way</h4>
              <p className="text-sm text-muted-foreground">
                We're adding curated free courses every week — Coursera financial-aid guides,
                Bengali YouTube playlists, IELTS/SAT prep, and government-recognized certificates.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default LibrarySection;

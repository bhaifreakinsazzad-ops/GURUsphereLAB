import GoalPrompt from "./GoalPrompt";

const HeroSection = () => (
  <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-10" aria-labelledby="hero-title">
    <div className="max-w-[1120px] mx-auto text-center">
      <div className="orbit-eyebrow mb-6">AI-powered global learning ecosystem</div>

      <h1 id="hero-title" className="orbit-display mb-6">
        Learn anything. Teach anything. <br className="hidden md:block" />
        <span style={{ color: "hsl(var(--orbit-accent))" }}>Grow together.</span>
      </h1>

      <p
        className="mx-auto mb-3 max-w-[620px] text-[17px] md:text-[19px] leading-relaxed"
        style={{ color: "hsl(var(--foreground-muted))" }}
      >
        Set a goal. Follow a structured path. Learn from educators and mentors around the world —
        with tools built for real growth, not just watching videos.
      </p>
      <p
        className="bn mx-auto mb-12 max-w-[560px] text-[15px] md:text-[17px]"
        style={{ color: "hsl(var(--foreground-subtle))" }}
        lang="bn"
      >
        একটি লক্ষ্য ঠিক করুন। শিখুন, চর্চা করুন, এগিয়ে যান — বিশ্বের সেরা শিক্ষা, সবার জন্য।
      </p>

      <GoalPrompt />

      <div className="mt-16 flex items-center justify-center gap-2 text-[13px]" style={{ color: "hsl(var(--foreground-subtle))" }}>
        <span>Free during beta</span>
        <span aria-hidden>·</span>
        <span>English & বাংলা</span>
        <span aria-hidden>·</span>
        <span>Made for every learner</span>
      </div>
    </div>
  </section>
);

export default HeroSection;

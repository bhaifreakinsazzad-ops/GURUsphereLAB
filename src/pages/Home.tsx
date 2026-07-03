import { useEffect } from "react";
import OrbitNavbar from "@/components/orbit/OrbitNavbar";
import HeroSection from "@/components/orbit/HeroSection";
import PathwaysSection from "@/components/orbit/PathwaysSection";
import SubjectsSection from "@/components/orbit/SubjectsSection";
import HowItWorksSection from "@/components/orbit/HowItWorksSection";
import TeachSection from "@/components/orbit/TeachSection";
import MentorsPreview from "@/components/orbit/MentorsPreview";
import TrustSection from "@/components/orbit/TrustSection";
import LegacyStrip from "@/components/orbit/LegacyStrip";
import OrbitFooter from "@/components/orbit/OrbitFooter";

const Home = () => {
  useEffect(() => {
    document.title = "GURUsphere — Learn anything. Teach anything. Grow together.";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        "content",
        "GURUsphere is an AI-powered global learning ecosystem. Set a goal, follow a structured path, and grow with educators and mentors worldwide. Free during beta. English & বাংলা."
      );
    }
  }, []);

  return (
    <div className="orbit">
      <OrbitNavbar />
      <main id="main">
        <HeroSection />
        <PathwaysSection />
        <SubjectsSection />
        <HowItWorksSection />
        <TeachSection />
        <MentorsPreview />
        <TrustSection />
        <LegacyStrip />
      </main>
      <OrbitFooter />
    </div>
  );
};

export default Home;

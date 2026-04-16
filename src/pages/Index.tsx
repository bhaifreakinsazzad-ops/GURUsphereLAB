import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ClassroomSection from "@/components/ClassroomSection";
import ResearchHubSection from "@/components/ResearchHubSection";
import LibrarySection from "@/components/LibrarySection";
import PremiumFreeToolsSection from "@/components/PremiumFreeToolsSection";
import ExamSection from "@/components/ExamSection";
import KnowledgeTreeSection from "@/components/KnowledgeTreeSection";
import OpenSourceSection from "@/components/OpenSourceSection";
import SubmitResourceSection from "@/components/SubmitResourceSection";
import MemorialWallSection from "@/components/MemorialWallSection";
import UniqueFeatures from "@/components/UniqueFeatures";
import ClubsSection from "@/components/ClubsSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ClassroomSection />
      <ResearchHubSection />
      <LibrarySection />
      <PremiumFreeToolsSection />
      <ExamSection />
      <KnowledgeTreeSection />
      <OpenSourceSection />
      <SubmitResourceSection />
      <MemorialWallSection />
      <UniqueFeatures />
      <ClubsSection />
      <FooterSection />
    </div>
  );
};

export default Index;

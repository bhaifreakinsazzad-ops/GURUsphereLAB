import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LetterPage from "@/components/LetterPage";
import LegacyTimelineSection from "@/components/LegacyTimelineSection";
import DonationSection from "@/components/DonationSection";
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
      <LegacyTimelineSection />

      <LetterPage
        bengaliQuote="যা পাইনি, সেটাই তোমাকে দিতে চাই — পৃথিবীর সেরা জ্ঞান, বিনামূল্যে।"
        englishTranslation="What I never got — I want to give to you. The world's best knowledge, free."
        signature="— হাদী"
      >
        <ResearchHubSection />
      </LetterPage>

      <LetterPage
        bengaliQuote="হার্ভার্ড, এমআইটি, স্ট্যানফোর্ড — এদের দরজা তোমার জন্যও খোলা। কেউ বলেনি, তাই আমি বলছি।"
        englishTranslation="Harvard, MIT, Stanford — their doors are open for you too. Nobody told you, so I will."
      >
        <LibrarySection />
      </LetterPage>

      <LetterPage
        bengaliQuote="যে টুলগুলোর জন্য টাকা নেই বলে স্বপ্ন থেমে যায় — সেগুলো আসলে ফ্রি। শুধু কেউ দেখায়নি।"
        englishTranslation="The tools you stopped dreaming about because of money — they're actually free. Nobody just showed you."
      >
        <PremiumFreeToolsSection />
      </LetterPage>

      <ClassroomSection />
      <ExamSection />
      <KnowledgeTreeSection />

      <LetterPage
        bengaliQuote="তুমি একা কোড লেখো না — পৃথিবীর সাথে লেখো।"
        englishTranslation="Don't code alone — code with the world."
      >
        <OpenSourceSection />
      </LetterPage>

      <LetterPage
        bengaliQuote="তুমিও কিছু পেয়েছো যা ফ্রি, কিন্তু কেউ জানে না? শেয়ার করো — কারো স্বপ্নকে বাঁচাও।"
        englishTranslation="Found something free that nobody knows about? Share it — save someone's dream."
      >
        <SubmitResourceSection />
      </LetterPage>

      <MemorialWallSection />
      <UniqueFeatures />
      <ClubsSection />
      <DonationSection />
      <FooterSection />
    </div>
  );
};

export default Index;

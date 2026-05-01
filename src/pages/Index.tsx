import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import EditorialDivider from "@/components/EditorialDivider";
import FilmGrain from "@/components/FilmGrain";
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
import LearningPathSection from "@/components/lab/LearningPathSection";
import CommunityGrid from "@/components/lab/CommunityGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FilmGrain />
      <Navbar />
      <HeroSection />
      <TrustStrip />
      <LegacyTimelineSection />

      <EditorialDivider />

      <LetterPage
        letterNumber="01"
        topic="On Free Knowledge"
        align="center"
        bengaliQuote="যা পাইনি, সেটাই তোমাকে দিতে চাই — পৃথিবীর সেরা জ্ঞান, বিনামূল্যে।"
        englishTranslation="What I never got — I want to give to you. The world's best knowledge, free."
        signature="— হাদী"
      >
        <ResearchHubSection />
      </LetterPage>

      <EditorialDivider />

      <LetterPage
        letterNumber="02"
        topic="On Open Doors"
        align="left"
        readingTime="3 min letter"
        bengaliQuote="হার্ভার্ড, এমআইটি, স্ট্যানফোর্ড — এদের দরজা তোমার জন্যও খোলা। কেউ বলেনি, তাই আমি বলছি।"
        englishTranslation="Harvard, MIT, Stanford — their doors are open for you too. Nobody told you, so I will."
      >
        <LibrarySection />
      </LetterPage>

      <EditorialDivider />

      <LetterPage
        letterNumber="03"
        topic="On Stolen Tools"
        align="right"
        tilt={-1}
        bengaliQuote="যে টুলগুলোর জন্য টাকা নেই বলে স্বপ্ন থেমে যায় — সেগুলো আসলে ফ্রি। শুধু কেউ দেখায়নি।"
        englishTranslation="The tools you stopped dreaming about because of money — they're actually free. Nobody just showed you."
      >
        <PremiumFreeToolsSection />
      </LetterPage>

      <ClassroomSection />
      <ExamSection />
      <KnowledgeTreeSection />

      <LearningPathSection id="learning-path" />

      <EditorialDivider />

      <LetterPage
        letterNumber="04"
        topic="On Building Together"
        align="center"
        bengaliQuote="তুমি একা কোড লেখো না — পৃথিবীর সাথে লেখো।"
        englishTranslation="Don't code alone — code with the world."
      >
        <OpenSourceSection />
      </LetterPage>

      <LetterPage
        letterNumber="05"
        topic="On Paying It Forward"
        align="left"
        readingTime="1 min letter"
        bengaliQuote="তুমিও কিছু পেয়েছো যা ফ্রি, কিন্তু কেউ জানে না? শেয়ার করো — কারো স্বপ্নকে বাঁচাও।"
        englishTranslation="Found something free that nobody knows about? Share it — save someone's dream."
      >
        <SubmitResourceSection />
      </LetterPage>

      <EditorialDivider />

      <MemorialWallSection />
      <UniqueFeatures />
      <CommunityGrid />
      <ClubsSection />
      <DonationSection />
      <FooterSection />
    </div>
  );
};

export default Index;

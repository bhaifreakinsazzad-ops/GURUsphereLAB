import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";
import AudioToggle from "@/components/AudioToggle";
import FloatingDonateCTA from "@/components/FloatingDonateCTA";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";

const ExamArena = lazy(() => import("./pages/ExamArena.tsx"));
const HadiMeter = lazy(() => import("./pages/HadiMeter.tsx"));
const ResearchArchive = lazy(() => import("./pages/ResearchArchive.tsx"));
const TeamProjects = lazy(() => import("./pages/TeamProjects.tsx"));
const Mentorship = lazy(() => import("./pages/Mentorship.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center hero-gradient">
    <div className="text-center">
      <div className="text-3xl font-bold mb-2"><span className="text-gradient-gold">Hadi</span> <span className="text-gradient-green">Wishes</span></div>
      <p className="text-sm" style={{ color: "hsl(162 20% 55%)" }}>Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AudioProvider>
            <AudioToggle />
            <FloatingDonateCTA />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/exam-arena" element={<Suspense fallback={<LoadingFallback />}><ExamArena /></Suspense>} />
              <Route path="/hadi-meter" element={<Suspense fallback={<LoadingFallback />}><HadiMeter /></Suspense>} />
              <Route path="/research-archive" element={<Suspense fallback={<LoadingFallback />}><ResearchArchive /></Suspense>} />
              <Route path="/team-projects" element={<Suspense fallback={<LoadingFallback />}><TeamProjects /></Suspense>} />
              <Route path="/mentorship" element={<Suspense fallback={<LoadingFallback />}><Mentorship /></Suspense>} />
              <Route path="/dashboard" element={<Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AudioProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

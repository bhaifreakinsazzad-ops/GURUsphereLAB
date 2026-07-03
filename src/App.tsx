import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";
import AudioToggle from "@/components/AudioToggle";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";

const Legacy = lazy(() => import("./pages/Index.tsx"));
const Discover = lazy(() => import("./pages/Discover.tsx"));
const ExamArena = lazy(() => import("./pages/ExamArena.tsx"));
const HadiMeter = lazy(() => import("./pages/HadiMeter.tsx"));
const ResearchArchive = lazy(() => import("./pages/ResearchArchive.tsx"));
const TeamProjects = lazy(() => import("./pages/TeamProjects.tsx"));
const Mentorship = lazy(() => import("./pages/Mentorship.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const ClassroomRoom = lazy(() => import("./pages/ClassroomRoom.tsx"));
const Clubs = lazy(() => import("./pages/Clubs.tsx"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(224 30% 6%)" }}>
    <div className="text-center">
      <div className="text-2xl font-medium mb-2" style={{ fontFamily: "'Fraunces', serif", color: "hsl(40 20% 96%)" }}>
        GURU<span style={{ fontStyle: "italic", color: "hsl(168 72% 48%)" }}>sphere</span>
      </div>
      <p className="text-sm" style={{ color: "hsl(40 10% 68%)" }}>Loading…</p>
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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/legacy" element={<Suspense fallback={<LoadingFallback />}><Legacy /></Suspense>} />
              <Route path="/discover" element={<Suspense fallback={<LoadingFallback />}><Discover /></Suspense>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/exam-arena" element={<Suspense fallback={<LoadingFallback />}><ExamArena /></Suspense>} />
              <Route path="/hadi-meter" element={<Suspense fallback={<LoadingFallback />}><HadiMeter /></Suspense>} />
              <Route path="/research-archive" element={<Suspense fallback={<LoadingFallback />}><ResearchArchive /></Suspense>} />
              <Route path="/team-projects" element={<Suspense fallback={<LoadingFallback />}><TeamProjects /></Suspense>} />
              <Route path="/mentorship" element={<Suspense fallback={<LoadingFallback />}><Mentorship /></Suspense>} />
              <Route path="/dashboard" element={<Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>} />
              <Route path="/admin" element={<Suspense fallback={<LoadingFallback />}><Admin /></Suspense>} />
              <Route path="/classroom/:subjectId" element={<Suspense fallback={<LoadingFallback />}><ClassroomRoom /></Suspense>} />
              <Route path="/clubs" element={<Suspense fallback={<LoadingFallback />}><Clubs /></Suspense>} />
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

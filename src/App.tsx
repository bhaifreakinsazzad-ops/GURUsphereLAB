import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";
import AudioToggle from "@/components/AudioToggle";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ProtectedRoute from "./components/orbit/ProtectedRoute";
import { initLocale } from "@/lib/i18n";

const Legacy = lazy(() => import("./pages/Index.tsx"));
const Discover = lazy(() => import("./pages/Discover.tsx"));
const CourseDetail = lazy(() => import("./pages/CourseDetail.tsx"));
const LessonViewer = lazy(() => import("./pages/LessonViewer.tsx"));
const MyLearning = lazy(() => import("./pages/MyLearning.tsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
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

const App = () => {
  useEffect(() => { initLocale(); }, []);
  return (
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

              {/* Auth */}
              <Route path="/login" element={<AuthPage mode="signin" />} />
              <Route path="/signup" element={<AuthPage mode="signup" />} />
              <Route path="/auth" element={<Navigate to="/login" replace />} />
              <Route path="/forgot-password" element={<Suspense fallback={<LoadingFallback />}><ForgotPassword /></Suspense>} />
              <Route path="/reset-password" element={<Suspense fallback={<LoadingFallback />}><ResetPassword /></Suspense>} />

              {/* Onboarding — auth required, does not require completed onboarding */}
              <Route path="/onboarding" element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProtectedRoute requireOnboarding={false}><Onboarding /></ProtectedRoute>
                </Suspense>
              } />

              {/* Discovery + course details are public */}
              <Route path="/discover" element={<Suspense fallback={<LoadingFallback />}><Discover /></Suspense>} />
              <Route path="/courses/:slug" element={<Suspense fallback={<LoadingFallback />}><CourseDetail /></Suspense>} />

              {/* Learning experience — must be signed in and onboarded */}
              <Route path="/learn/:courseId/lessons/:lessonId" element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProtectedRoute><LessonViewer /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="/my-learning" element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProtectedRoute><MyLearning /></ProtectedRoute>
                </Suspense>
              } />

              {/* Legacy memorial routes (untouched) */}
              <Route path="/exam-arena" element={<Suspense fallback={<LoadingFallback />}><ExamArena /></Suspense>} />
              <Route path="/hadi-meter" element={<Suspense fallback={<LoadingFallback />}><HadiMeter /></Suspense>} />
              <Route path="/research-archive" element={<Suspense fallback={<LoadingFallback />}><ResearchArchive /></Suspense>} />
              <Route path="/team-projects" element={<Suspense fallback={<LoadingFallback />}><TeamProjects /></Suspense>} />
              <Route path="/mentorship" element={<Suspense fallback={<LoadingFallback />}><Mentorship /></Suspense>} />
              <Route path="/dashboard" element={<Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>} />
              <Route path="/admin" element={<Suspense fallback={<LoadingFallback />}><Admin /></Suspense>} />
              <Route path="/classroom/:subjectId" element={<Suspense fallback={<LoadingFallback />}><ClassroomRoom /></Suspense>} />
              <Route path="/clubs" element={<Suspense fallback={<LoadingFallback />}><Clubs /></Suspense>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AudioProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;

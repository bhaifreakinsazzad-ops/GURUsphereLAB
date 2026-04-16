import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const ExamArena = lazy(() => import("./pages/ExamArena.tsx"));
const HadiMeter = lazy(() => import("./pages/HadiMeter.tsx"));

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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/exam-arena" element={<Suspense fallback={<LoadingFallback />}><ExamArena /></Suspense>} />
          <Route path="/hadi-meter" element={<Suspense fallback={<LoadingFallback />}><HadiMeter /></Suspense>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

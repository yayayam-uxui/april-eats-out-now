import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Original app
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Pitch Night app
import { PitchNightProvider } from "./context/PitchNightContext";
import PitchLogin from "./pages/pitch-night/PitchLogin";
import PitchHome from "./pages/pitch-night/PitchHome";
import StartupProfile from "./pages/pitch-night/StartupProfile";
import JudgeOnboarding from "./pages/pitch-night/JudgeOnboarding";
import JudgeDashboard from "./pages/pitch-night/JudgeDashboard";
import ScoreStartup from "./pages/pitch-night/ScoreStartup";
import AdminDashboard from "./pages/pitch-night/AdminDashboard";
import AdminManageStartups from "./pages/pitch-night/AdminManageStartups";
import AdminManageJudges from "./pages/pitch-night/AdminManageJudges";
import AdminManageCriteria from "./pages/pitch-night/AdminManageCriteria";
import AdminManageRooms from "./pages/pitch-night/AdminManageRooms";
import AdminManageNotifications from "./pages/pitch-night/AdminManageNotifications";
import Leaderboard from "./pages/pitch-night/Leaderboard";
import PitchNetwork from "./pages/pitch-night/PitchNetwork";
import StartupTeamDashboard from "./pages/pitch-night/StartupTeamDashboard";
import PitchMessages from "./pages/pitch-night/PitchMessages";
import PitchNotifications from "./pages/pitch-night/PitchNotifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ── Original App ── */}
          <Route path="/" element={<Index />} />

          {/* ── Pitch Night App ── */}
          <Route
            path="/pitch/*"
            element={
              <PitchNightProvider>
                <Routes>
                  <Route path="/" element={<PitchHome />} />
                  <Route path="/login" element={<PitchLogin />} />

                  {/* Startup profiles */}
                  <Route path="/startup/:id" element={<StartupProfile />} />
                  <Route path="/startup/:id/dashboard" element={<StartupTeamDashboard />} />

                  {/* Judge flows */}
                  <Route path="/judge" element={<JudgeDashboard />} />
                  <Route path="/judge/onboarding" element={<JudgeOnboarding />} />
                  <Route path="/judge/score/:id" element={<ScoreStartup />} />

                  {/* Admin flows */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/startups" element={<AdminManageStartups />} />
                  <Route path="/admin/judges" element={<AdminManageJudges />} />
                  <Route path="/admin/criteria" element={<AdminManageCriteria />} />
                  <Route path="/admin/rooms" element={<AdminManageRooms />} />
                  <Route path="/admin/notifications" element={<AdminManageNotifications />} />

                  {/* Shared */}
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/network" element={<PitchNetwork />} />
                  <Route path="/messages" element={<PitchMessages />} />
                  <Route path="/notifications" element={<PitchNotifications />} />
                </Routes>
              </PitchNightProvider>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

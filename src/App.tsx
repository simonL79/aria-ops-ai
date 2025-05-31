
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AdminLogin from "./pages/admin/AdminLogin";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MonitoringPage from "./pages/dashboard/MonitoringPage";
import IntelligencePage from "./pages/dashboard/IntelligencePage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import MentionsPage from "./pages/dashboard/MentionsPage";
import OperatorConsole from "./components/operator/OperatorConsole";
import CommandCenterPage from "./pages/dashboard/CommandCenterPage";
import SigmaPage from "./pages/dashboard/SigmaPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/sigma" element={<SigmaPage />} />
              <Route path="/dashboard/monitoring" element={<MonitoringPage />} />
              <Route path="/dashboard/intelligence" element={<IntelligencePage />} />
              <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
              <Route path="/dashboard/mentions" element={<MentionsPage />} />
              <Route path="/dashboard/command-center" element={<CommandCenterPage />} />
              <Route path="/dashboard/operator-console" element={<OperatorConsole />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

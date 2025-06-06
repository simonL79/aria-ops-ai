
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { navItems } from "./nav-items";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import SecureClientIntakePage from "./pages/SecureClientIntakePage";
import SmartIntakePage from "./pages/SmartIntakePage";
import ContentGenerationPage from "./pages/ContentGenerationPage";
import KeywordToArticleSystemPage from "./pages/admin/KeywordToArticleSystemPage";
import ControlCenterPage from "./pages/admin/ControlCenterPage";
import ClientOnboardingPage from "./pages/ClientOnboardingPage";
import StrategyBrainStage3Page from "./pages/admin/StrategyBrainStage3Page";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ClientManagementPage from "./pages/admin/ClientManagementPage";
import SystemSettingsPage from "./pages/admin/SystemSettingsPage";
import StrategyBrainTestPage from "./pages/admin/StrategyBrainTestPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Protected Public Routes - DO NOT MODIFY */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            
            {/* Admin/Backend Routes - Safe to modify */}
            <Route path="/secure-intake" element={<SecureClientIntakePage />} />
            <Route path="/smart-intake" element={<SmartIntakePage />} />
            <Route path="/content-generation" element={<ContentGenerationPage />} />
            <Route path="/admin/keyword-to-article" element={<KeywordToArticleSystemPage />} />
            <Route path="/admin/control-center" element={<ControlCenterPage />} />
            <Route path="/control-center" element={<ControlCenterPage />} />
            <Route path="/admin/client-onboarding" element={<ClientOnboardingPage />} />
            <Route path="/admin/strategy-brain-stage3" element={<StrategyBrainStage3Page />} />
            
            {/* New Admin Routes */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/clients" element={<ClientManagementPage />} />
            <Route path="/admin/settings" element={<SystemSettingsPage />} />
            <Route path="/admin/strategy-brain-test" element={<StrategyBrainTestPage />} />
            
            {/* Dynamic Routes */}
            {navItems.map(({ to, page }) => (
              <Route key={to} path={to} element={page} />
            ))}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

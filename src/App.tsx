
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RbacProvider } from "@/hooks/useRbac";
import AppErrorBoundary from "@/components/common/AppErrorBoundary";
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
import SystemCompletionPage from '@/pages/admin/SystemCompletionPage';
import QASystemTestPage from '@/pages/QASystemTestPage';
import AIControlPage from './pages/admin/AIControlPage';
import AtlasSearch from './components/atlas/AtlasSearch';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error && 'status' in error && error.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RbacProvider>
            <TooltipProvider>
              <Router>
                <div className="min-h-screen bg-corporate-dark">
                  <Routes>
                    {/* Protected Public Routes - DO NOT MODIFY */}
                    <Route path="/" element={<Index />} />
                    <Route path="/home" element={<HomePage />} />
                    
                    {/* Atlas Intelligence Platform */}
                    <Route path="/atlas" element={<AtlasSearch />} />
                    
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
                    <Route path="/admin/ai-control" element={<AIControlPage />} />
                    
                    {/* Add the new system completion route */}
                    <Route 
                      path="/admin/system-completion" 
                      element={<SystemCompletionPage />} 
                    />
                    
                    {/* QA System Test Route */}
                    <Route 
                      path="/qa-system-test" 
                      element={<QASystemTestPage />} 
                    />
                    
                    {/* Dynamic Routes */}
                    {navItems.map(({ to, page }) => (
                      <Route key={to} path={to} element={page} />
                    ))}
                  </Routes>
                </div>
                <Toaster />
              </Router>
            </TooltipProvider>
          </RbacProvider>
        </AuthProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;

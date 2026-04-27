
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RbacProvider } from "@/hooks/useRbac";
import AppErrorBoundary from "@/components/common/AppErrorBoundary";
import { navItems } from "./nav-items";
import Index from "./pages/Index";
import UnsubscribePage from "./pages/UnsubscribePage";
import BlogPostPage from "./pages/BlogPostPage";
import HomePage from "./pages/HomePage";
import SecureClientIntakePage from "./pages/SecureClientIntakePage";
import SmartIntakePage from "./pages/SmartIntakePage";
import ContentGenerationPage from "./pages/ContentGenerationPage";
// KeywordToArticleSystemPage removed (legacy)
// ControlCenterPage removed (legacy)
import ClientOnboardingPage from "./pages/ClientOnboardingPage";
import StrategyBrainStage3Page from "./pages/admin/StrategyBrainStage3Page";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ClientManagementPage from "./pages/admin/ClientManagementPage";
import SystemSettingsPage from "./pages/admin/SystemSettingsPage";
import StrategyBrainTestPage from "./pages/admin/StrategyBrainTestPage";
import SystemCompletionPage from '@/pages/admin/SystemCompletionPage';
import QASystemTestPage from '@/pages/QASystemTestPage';
import AIControlPage from './pages/admin/AIControlPage';
import RequiemDashboardPage from './pages/admin/RequiemDashboardPage';
import BlackVertexPage from './pages/admin/BlackVertexPage';
import OblivionPage from './pages/admin/OblivionPage';
import EideticAlertPreferencesPage from './pages/admin/EideticAlertPreferencesPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import Authentication from './pages/Authentication';
import ClientPortalRoute from '@/components/auth/ClientPortalRoute';
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalReports from './pages/portal/PortalReports';
import PortalThreats from './pages/portal/PortalThreats';
import PortalFindings from './pages/portal/PortalFindings';
import PortalAccount from './pages/portal/PortalAccount';
import PortalNoAccess from './pages/portal/PortalNoAccess';

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
                    <Route path="/auth" element={<Authentication />} />

                    {/* Client Portal — read-only */}
                    <Route path="/portal/no-access" element={<PortalNoAccess />} />
                    <Route element={<ClientPortalRoute />}>
                      <Route path="/portal" element={<PortalDashboard />} />
                      <Route path="/portal/reports" element={<PortalReports />} />
                      <Route path="/portal/threats" element={<PortalThreats />} />
                      <Route path="/portal/findings" element={<PortalFindings />} />
                      <Route path="/portal/account" element={<PortalAccount />} />
                    </Route>
                    
                    {/* Admin/Backend Routes - Protected */}
                    <Route element={<ProtectedRoute requireAdmin redirectTo="/auth" />}>
                      <Route path="/secure-intake" element={<SecureClientIntakePage />} />
                      <Route path="/smart-intake" element={<SmartIntakePage />} />
                      <Route path="/content-generation" element={<ContentGenerationPage />} />
                      {/* /admin/keyword-to-article route removed (legacy) */}
                      {/* /admin/control-center route removed (legacy) */}
                      
                      <Route path="/admin/client-onboarding" element={<ClientOnboardingPage />} />
                      <Route path="/admin/strategy-brain-stage3" element={<StrategyBrainStage3Page />} />
                      <Route path="/admin" element={<AdminDashboardPage />} />
                      <Route path="/admin/clients" element={<ClientManagementPage />} />
                      <Route path="/admin/settings" element={<SystemSettingsPage />} />
                      <Route path="/admin/strategy-brain-test" element={<StrategyBrainTestPage />} />
                      <Route path="/admin/ai-control" element={<AIControlPage />} />
                      <Route path="/admin/requiem" element={<RequiemDashboardPage />} />
                      <Route path="/admin/black-vertex" element={<BlackVertexPage />} />
                      <Route path="/admin/oblivion" element={<OblivionPage />} />
                      <Route path="/admin/system-completion" element={<SystemCompletionPage />} />
                      <Route path="/admin/eidetic/preferences" element={<EideticAlertPreferencesPage />} />
                      <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
                      <Route path="/qa-system-test" element={<QASystemTestPage />} />
                    </Route>
                    
                    {/* Blog Routes */}
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    
                    {/* Unsubscribe */}
                    <Route path="/unsubscribe" element={<UnsubscribePage />} />
                    
                    {/* Public Dynamic Routes */}
                    {navItems
                      .filter(({ isPublic }) => isPublic)
                      .map(({ to, page }) => (
                        <Route key={to} path={to} element={page} />
                      ))}
                    
                    {/* Protected Dynamic Routes - Admin Only */}
                    <Route element={<ProtectedRoute requireAdmin redirectTo="/auth" />}>
                      {navItems
                        .filter(({ isPublic }) => !isPublic)
                        .map(({ to, page }) => (
                          <Route key={to} path={to} element={page} />
                        ))}
                    </Route>
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

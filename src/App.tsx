
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
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ClientManagementPage from "./pages/admin/ClientManagementPage";
import SystemSettingsPage from "./pages/admin/SystemSettingsPage";
// StrategyBrainTestPage, SystemCompletionPage, QASystemTestPage, AIControlPage, BlackVertexPage, OblivionPage, StrategyBrainStage3Page removed (legacy)
import GenesisSentinelPage from './pages/admin/GenesisSentinelPage';
import RequiemDashboardPage from './pages/admin/RequiemDashboardPage';
import EideticAlertPreferencesPage from './pages/admin/EideticAlertPreferencesPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import ShieldDashboard from './pages/admin/shield/ShieldDashboard';
import ShieldAlertsList from './pages/admin/shield/ShieldAlertsList';
import ShieldAlertDetail from './pages/admin/shield/ShieldAlertDetail';
import OpsHandbookPage from './pages/admin/OpsHandbookPage';
import MentionsWorkspace from './pages/dashboard/mentions';
import Authentication from './pages/Authentication';
import ClientPortalRoute from '@/components/auth/ClientPortalRoute';
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalReports from './pages/portal/PortalReports';
import PortalThreats from './pages/portal/PortalThreats';
import PortalFindings from './pages/portal/PortalFindings';
import PortalAccount from './pages/portal/PortalAccount';
import PortalNoAccess from './pages/portal/PortalNoAccess';
import PortalRemoval from './pages/portal/PortalRemoval';
import PortalUpgrade from './pages/portal/PortalUpgrade';
import CybersecurityFrameworkPage from './pages/CybersecurityFrameworkPage';

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
                    {/* /home registered via nav-items (isPublic) */}
                    <Route path="/auth" element={<Authentication />} />
                    <Route path="/cybersecurity-framework" element={<CybersecurityFrameworkPage />} />

                    {/* Client Portal — read-only */}
                    <Route path="/portal/no-access" element={<PortalNoAccess />} />
                    <Route element={<ClientPortalRoute />}>
                      <Route path="/portal" element={<PortalDashboard />} />
                      <Route path="/portal/reports" element={<PortalReports />} />
                      <Route path="/portal/threats" element={<PortalThreats />} />
                      <Route path="/portal/findings" element={<PortalFindings />} />
                      <Route path="/portal/account" element={<PortalAccount />} />
                      <Route path="/portal/removal" element={<PortalRemoval />} />
                      <Route path="/portal/upgrade" element={<PortalUpgrade />} />
                    </Route>
                    
                    {/* Admin/Backend Routes - Protected */}
                    <Route element={<ProtectedRoute requireAdmin redirectTo="/auth" />}>
                      <Route path="/secure-intake" element={<SecureClientIntakePage />} />
                      <Route path="/smart-intake" element={<SmartIntakePage />} />
                      <Route path="/content-generation" element={<ContentGenerationPage />} />
                      {/* /admin/keyword-to-article route removed (legacy) */}
                      {/* /admin/control-center route removed (legacy) */}
                      
                      <Route path="/admin/client-onboarding" element={<ClientOnboardingPage />} />
                      <Route path="/admin" element={<AdminDashboardPage />} />
                      <Route path="/admin/clients" element={<ClientManagementPage />} />
                      <Route path="/admin/settings" element={<SystemSettingsPage />} />
                      <Route path="/admin/genesis-sentinel" element={<GenesisSentinelPage />} />
                      <Route path="/admin/requiem" element={<RequiemDashboardPage />} />
                      {/* /admin/ai-control, /admin/black-vertex, /admin/oblivion, /admin/strategy-brain-stage3, /admin/system-completion removed (legacy) */}
                      <Route path="/admin/eidetic/preferences" element={<EideticAlertPreferencesPage />} />
                      <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
                      <Route path="/admin/shield" element={<ShieldDashboard />} />
                      <Route path="/admin/shield/alerts" element={<ShieldAlertsList />} />
                      <Route path="/admin/shield/alerts/:id" element={<ShieldAlertDetail />} />
                      <Route path="/admin/ops" element={<OpsHandbookPage />} />
                      <Route path="/dashboard/mentions" element={<MentionsWorkspace />} />
                      {/* /qa-system-test removed (legacy) */}
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

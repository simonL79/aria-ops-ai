import { lazy, Suspense } from "react";
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
import ClientPortalRoute from "@/components/auth/ClientPortalRoute";

// Lazy-loaded routes — every other page is split into its own chunk
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const SecureClientIntakePage = lazy(() => import("./pages/SecureClientIntakePage"));
const SmartIntakePage = lazy(() => import("./pages/SmartIntakePage"));
const ContentGenerationPage = lazy(() => import("./pages/ContentGenerationPage"));
const ClientOnboardingPage = lazy(() => import("./pages/ClientOnboardingPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const ClientManagementPage = lazy(() => import("./pages/admin/ClientManagementPage"));
const SystemSettingsPage = lazy(() => import("./pages/admin/SystemSettingsPage"));
const GenesisSentinelPage = lazy(() => import("./pages/admin/GenesisSentinelPage"));
const RequiemDashboardPage = lazy(() => import("./pages/admin/RequiemDashboardPage"));
const KeywordTargetsPage = lazy(() => import("./pages/admin/KeywordTargetsPage"));
const EideticAlertPreferencesPage = lazy(() => import("./pages/admin/EideticAlertPreferencesPage"));
const AdminNotificationsPage = lazy(() => import("./pages/admin/AdminNotificationsPage"));
const ShieldDashboard = lazy(() => import("./pages/admin/shield/ShieldDashboard"));
const ShieldAlertsList = lazy(() => import("./pages/admin/shield/ShieldAlertsList"));
const ShieldAlertDetail = lazy(() => import("./pages/admin/shield/ShieldAlertDetail"));
const OpsHandbookPage = lazy(() => import("./pages/admin/OpsHandbookPage"));
const SeoStatusPage = lazy(() => import("./pages/admin/SeoStatusPage"));
const MentionsWorkspace = lazy(() => import("./pages/dashboard/mentions"));
const Authentication = lazy(() => import("./pages/Authentication"));
const PortalDashboard = lazy(() => import("./pages/portal/PortalDashboard"));
const PortalReports = lazy(() => import("./pages/portal/PortalReports"));
const PortalThreats = lazy(() => import("./pages/portal/PortalThreats"));
const PortalFindings = lazy(() => import("./pages/portal/PortalFindings"));
const PortalAccount = lazy(() => import("./pages/portal/PortalAccount"));
const PortalNoAccess = lazy(() => import("./pages/portal/PortalNoAccess"));
const PortalRemoval = lazy(() => import("./pages/portal/PortalRemoval"));
const PortalUpgrade = lazy(() => import("./pages/portal/PortalUpgrade"));
const CybersecurityFrameworkPage = lazy(() => import("./pages/CybersecurityFrameworkPage"));
const RemoveGoogleReviewsPage = lazy(() => import("./pages/services/RemoveGoogleReviewsPage"));
const OnlineImpersonationUKPage = lazy(() => import("./pages/services/OnlineImpersonationUKPage"));
const BrandProtectionPage = lazy(() => import("./pages/services/BrandProtectionPage"));
const SimonLindsayAIPage = lazy(() => import("./pages/simon-lindsay/AIPage"));
const SimonLindsayEntrepreneurPage = lazy(() => import("./pages/simon-lindsay/EntrepreneurPage"));
const SimonLindsayAriaPage = lazy(() => import("./pages/simon-lindsay/AriaPage"));
const SimonLindsayCommercialStrategistPage = lazy(() => import("./pages/simon-lindsay/CommercialStrategistPage"));
const SimonLindsayBoxingPage = lazy(() => import("./pages/simon-lindsay/BoxingPage"));
const SimonLindsayReputationIntelligencePage = lazy(() => import("./pages/simon-lindsay/ReputationIntelligencePage"));
const SimonLindsayKSLPage = lazy(() => import("./pages/simon-lindsay/KSLPage"));
const SimonLindsayGlasgowPage = lazy(() => import("./pages/simon-lindsay/GlasgowPage"));
const SimonLindsayKSLHairPage = lazy(() => import("./pages/simon-lindsay/KSLHairPage"));
const SimonLindsayReviewsPage = lazy(() => import("./pages/simon-lindsay/ReviewsPage"));
const SimonLindsayBankruptcyPage = lazy(() => import("./pages/simon-lindsay/BankruptcyPage"));
const SimonLindsayKSLHairComplaintsPage = lazy(() => import("./pages/simon-lindsay/KSLHairComplaintsPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error && 'status' in error && (error as any).status === 401) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-screen bg-corporate-dark" />
);

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RbacProvider>
            <TooltipProvider>
              <Router>
                <div className="min-h-screen bg-corporate-dark">
                  <Suspense fallback={<RouteFallback />}>
                    <Routes>
                      {/* Protected Public Routes - DO NOT MODIFY */}
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Authentication />} />
                      <Route path="/cybersecurity-framework" element={<CybersecurityFrameworkPage />} />
                      <Route path="/services/remove-google-reviews" element={<RemoveGoogleReviewsPage />} />
                      <Route path="/services/online-impersonation-uk" element={<OnlineImpersonationUKPage />} />
                      <Route path="/services/brand-protection" element={<BrandProtectionPage />} />
                      <Route path="/simon-lindsay/ai" element={<SimonLindsayAIPage />} />
                      <Route path="/simon-lindsay/entrepreneur" element={<SimonLindsayEntrepreneurPage />} />
                      <Route path="/simon-lindsay/aria" element={<SimonLindsayAriaPage />} />
                      <Route path="/simon-lindsay/commercial-strategist" element={<SimonLindsayCommercialStrategistPage />} />
                      <Route path="/simon-lindsay/boxing" element={<SimonLindsayBoxingPage />} />
                      <Route path="/simon-lindsay/reputation-intelligence" element={<SimonLindsayReputationIntelligencePage />} />
                      <Route path="/simon-lindsay/ksl" element={<SimonLindsayKSLPage />} />
                      <Route path="/simon-lindsay/glasgow" element={<SimonLindsayGlasgowPage />} />
                      <Route path="/simon-lindsay/ksl-hair" element={<SimonLindsayKSLHairPage />} />
                      <Route path="/simon-lindsay/reviews" element={<SimonLindsayReviewsPage />} />
                      <Route path="/simon-lindsay/bankruptcy" element={<SimonLindsayBankruptcyPage />} />
                      <Route path="/simon-lindsay/ksl-hair-complaints" element={<SimonLindsayKSLHairComplaintsPage />} />

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
                        <Route path="/admin/client-onboarding" element={<ClientOnboardingPage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/admin/clients" element={<ClientManagementPage />} />
                        <Route path="/admin/settings" element={<SystemSettingsPage />} />
                        <Route path="/admin/genesis-sentinel" element={<GenesisSentinelPage />} />
                        <Route path="/admin/requiem" element={<RequiemDashboardPage />} />
                        <Route path="/admin/keyword-targets" element={<KeywordTargetsPage />} />
                        <Route path="/admin/eidetic/preferences" element={<EideticAlertPreferencesPage />} />
                        <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
                        <Route path="/admin/shield" element={<ShieldDashboard />} />
                        <Route path="/admin/shield/alerts" element={<ShieldAlertsList />} />
                        <Route path="/admin/shield/alerts/:id" element={<ShieldAlertDetail />} />
                        <Route path="/admin/ops" element={<OpsHandbookPage />} />
                        <Route path="/admin/seo-status" element={<SeoStatusPage />} />
                        <Route path="/dashboard/mentions" element={<MentionsWorkspace />} />
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
                  </Suspense>
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

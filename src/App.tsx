
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { initializeDatabase } from "@/utils/initializeMonitoring";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { HelmetProvider } from "react-helmet-async";

// Import your pages
import Dashboard from "@/pages/dashboard/DashboardPage";
import Monitor from "@/pages/Monitor";
import InfluencerRadar from "@/pages/InfluencerRadar";
import AiScrapingPage from "@/pages/AiScrapingPage";
import IntelligencePage from "@/pages/dashboard/IntelligencePage";
import NotFound from "@/pages/NotFound";
import RadarPage from "@/pages/dashboard/RadarPage";
import CommandCenterPage from "@/pages/dashboard/CommandCenterPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import EngagementHubPage from "@/pages/dashboard/EngagementHubPage";
import Settings from "@/pages/Settings";
import MentionsPage from "@/pages/dashboard/MentionsPage";
import NewCoPage from "@/pages/NewCoPage";
import Authentication from "@/pages/Authentication";
import SalesFunnelPage from "@/pages/SalesFunnelPage";
import ThankYouPage from "@/pages/ThankYouPage";
import ReputationScanForm from "@/pages/ReputationScanForm";
import AboutPage from "@/pages/AboutPage";
import BiographyPage from "@/pages/BiographyPage";
import PricingPage from "@/pages/PricingPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import DisclaimerPage from "@/pages/DisclaimerPage";
import GDPRCompliancePage from "@/pages/GDPRCompliancePage";
import RequestDataAccessPage from "@/pages/RequestDataAccessPage";
import ResourcesPage from "@/pages/ResourcesPage";
import CalendarPage from "@/pages/CalendarPage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import BlogAdminPage from "@/pages/BlogAdminPage";
import AdminLogin from "@/pages/AdminLogin";
import AuthGuard from "@/components/auth/AuthGuard";
import Clients from "@/pages/Clients"; 
import ReportsPage from "@/pages/ReportsPage";

function App() {
  useEffect(() => {
    // Initialize the database with required data
    initializeDatabase().catch(console.error);

    // Redirect to RSS feed edge function
    if (window.location.pathname === "/rss.xml") {
      window.location.href = "https://ssvskbejfacmjemphmry.supabase.co/functions/v1/generate-rss";
    }
  }, []);
  
  return (
    <HelmetProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SalesFunnelPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/scan" element={<ReputationScanForm />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/simon-lindsay" element={<BiographyPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/gdpr-compliance" element={<GDPRCompliancePage />} />
        <Route path="/request-data-access" element={<RequestDataAccessPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/rss.xml" element={<Navigate to="https://ssvskbejfacmjemphmry.supabase.co/functions/v1/generate-rss" />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* For backward compatibility - redirect from old route to new route */}
        <Route path="/biography" element={<Navigate to="/simon-lindsay" replace />} />
        <Route path="/admin-reset" element={<Navigate to="/admin-login" replace />} />
        
        {/* Authentication Route */}
        <Route path="/auth" element={<Authentication />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/influencer-radar" element={<InfluencerRadar />} />
          <Route path="/dashboard/ai-scraping" element={<AiScrapingPage />} />
          <Route path="/dashboard/intelligence" element={<IntelligencePage />} />
          <Route path="/dashboard/radar" element={<RadarPage />} />
          <Route path="/dashboard/command-center" element={<CommandCenterPage />} />
          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
          <Route path="/dashboard/engagement" element={<EngagementHubPage />} />
          <Route path="/dashboard/mentions" element={<MentionsPage />} />
          <Route path="/dashboard/new-companies" element={<NewCoPage />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Route>
        
        {/* Admin-only blog admin route */}
        <Route 
          path="/blog/admin" 
          element={
            <AuthGuard adminOnly={true} redirectTo="/admin-login">
              <BlogAdminPage />
            </AuthGuard>
          } 
        />
        
        {/* Catch all route - 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </HelmetProvider>
  );
}

export default App;

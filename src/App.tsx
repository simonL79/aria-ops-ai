
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BiographyPage from './pages/BiographyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DisclaimerPage from './pages/DisclaimerPage';
import NotFound from './pages/NotFound';
import Authentication from './pages/Authentication';
import Monitor from './pages/Monitor';
import Removal from './pages/Removal';
import Settings from './pages/Settings';
import ThankYouPage from './pages/ThankYouPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ReputationScanForm from './pages/ReputationScanForm';
import SalesFunnelPage from './pages/SalesFunnelPage';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SignedInRedirect from './components/auth/SignedInRedirect';
import Clients from './pages/Clients';
import CommandCenterPage from './pages/dashboard/CommandCenterPage';
import RadarPage from './pages/dashboard/RadarPage';
import ScanSubmissionsPage from './pages/dashboard/ScanSubmissionsPage';
import NewCoPage from './pages/NewCoPage';
import MentionsPage from './pages/dashboard/MentionsPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import Reports from './pages/Reports';
import GDPRCompliancePage from './pages/GDPRCompliancePage';
import RequestDataAccessPage from './pages/RequestDataAccessPage';
import DPARequestPage from './pages/DPARequestPage';
import IntelligencePage from './pages/dashboard/IntelligencePage';
import OutreachPipelinePage from './pages/OutreachPipelinePage';
import SeoCenterPage from './pages/SeoCenterPage';
import NewCoDetailsPage from './pages/NewCoDetailsPage';
import EngagementHubPage from './pages/dashboard/EngagementHubPage';

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/biography" element={<BiographyPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/funnel" element={<SalesFunnelPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/pay" element={<PaymentPage />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/reputation-scan" element={<ReputationScanForm />} />
        
        {/* GDPR Routes */}
        <Route path="/gdpr-compliance" element={<GDPRCompliancePage />} />
        <Route path="/request-data-access" element={<RequestDataAccessPage />} />
        <Route path="/dpa-request" element={<DPARequestPage />} />

        {/* Authentication Routes with Redirect for signed-in users */}
        <Route 
          path="/auth/*" 
          element={
            <SignedInRedirect redirectTo="/dashboard">
              <Authentication />
            </SignedInRedirect>
          } 
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/removal" element={<Removal />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/command-center" element={<CommandCenterPage />} />
          <Route path="/radar" element={<RadarPage />} />
          <Route path="/scan-submissions" element={<ScanSubmissionsPage />} />
          <Route path="/mentions" element={<MentionsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/intelligence" element={<IntelligencePage />} />
          <Route path="/newco" element={<NewCoPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/newco-details/:id" element={<NewCoDetailsPage />} />
          <Route path="/outreach-pipeline" element={<OutreachPipelinePage />} />
          <Route path="/seo-center" element={<SeoCenterPage />} />
          <Route path="/engagement" element={<EngagementHubPage />} />
        </Route>

        {/* Not Found and Redirects */}
        <Route path="/index" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./hooks/useAuth";
import { RbacProvider, Role } from "./hooks/useRbac";

import SalesFunnelPage from "./pages/SalesFunnelPage";
import AboutPage from "./pages/AboutPage";
import BiographyPage from "./pages/BiographyPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import ReputationScanForm from "./pages/ReputationScanForm";
import ThankYouPage from "./pages/ThankYouPage";
import Authentication from "./pages/Authentication";
import Clients from "./pages/Clients";
import Monitor from "./pages/Monitor";
import Removal from "./pages/Removal";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PricingPage from "./pages/PricingPage";
import PaymentPage from "./pages/PaymentPage"; // Added new page
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DashboardPage = React.lazy(() => import("./pages/dashboard/DashboardPage"));
const CommandCenterPage = React.lazy(() => import("./pages/dashboard/CommandCenterPage"));
const MentionsPage = React.lazy(() => import("./pages/dashboard/MentionsPage"));
const AnalyticsPage = React.lazy(() => import("./pages/dashboard/AnalyticsPage"));

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
};

function App() {
  const { isLoading, isAuthenticated } = useAuth();

  // Default to 'user' role, but add 'admin' role if authenticated
  const userRoles: Role[] = isAuthenticated ? ['user', 'admin', 'security'] : ['user'];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RbacProvider initialRoles={userRoles}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<SalesFunnelPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/biography" element={<BiographyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/scan" element={<ReputationScanForm />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/payment" element={<PaymentPage />} /> {/* Added new route */}
            
            {/* Redirect any /sales route to the home page */}
            <Route path="/sales" element={<Navigate to="/" replace />} />
            
            {/* Protected routes - require authentication */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/mentions"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <MentionsPage />
                  </React.Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/command-center"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <CommandCenterPage />
                  </React.Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/analytics"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <AnalyticsPage />
                  </React.Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitor"
              element={
                <ProtectedRoute>
                  <Monitor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/removal"
              element={
                <ProtectedRoute>
                  <Removal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </RbacProvider>
    </QueryClientProvider>
  );
}

export default App;

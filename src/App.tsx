
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./hooks/useAuth";
import { RbacProvider } from "./hooks/useRbac";

import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import Authentication from "./pages/Authentication";
import Clients from "./pages/Clients";
import Monitor from "./pages/Monitor";
import Removal from "./pages/Removal";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
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
  const userRoles = isAuthenticated ? ['user', 'admin', 'security'] : ['user'];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RbacProvider initialRoles={userRoles}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/auth" element={<Authentication />} />
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

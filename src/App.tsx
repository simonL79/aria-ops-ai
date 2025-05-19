
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./hooks/useAuth";

import Index from "./pages/Index";
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
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
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
    </QueryClientProvider>
  );
}

export default App;

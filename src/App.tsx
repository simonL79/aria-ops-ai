
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import SecureRouteGuard from "@/components/auth/SecureRouteGuard";
import AdminSessionManager from "@/components/auth/AdminSessionManager";
import Index from "./pages/Index";
import Discovery from "./pages/Discovery";
import AdminLogin from "./pages/AdminLogin";
import EmployeeBrandRiskPage from "./pages/EmployeeBrandRiskPage";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gray-50">
          {/* Show session manager only for authenticated admins */}
          {isAuthenticated && isAdmin && <AdminSessionManager />}
          
          {/* Show navbar only for authenticated routes */}
          {isAuthenticated && <Navbar />}
          
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              
              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route path="/discovery" element={
                <SecureRouteGuard requireAdmin={true}>
                  <Discovery />
                </SecureRouteGuard>
              } />
              
              <Route path="/employee-risk" element={
                <SecureRouteGuard requireAdmin={true}>
                  <EmployeeBrandRiskPage />
                </SecureRouteGuard>
              } />
              
              {/* Add more protected routes here */}
              <Route path="/dashboard" element={
                <SecureRouteGuard requireAdmin={true}>
                  <Discovery />
                </SecureRouteGuard>
              } />
            </Routes>
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

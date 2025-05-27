
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import SecureRouteGuard from "@/components/auth/SecureRouteGuard";
import AdminSessionManager from "@/components/auth/AdminSessionManager";
import SalesFunnelPage from "./pages/SalesFunnelPage";
import Discovery from "./pages/Discovery";
import AdminLogin from "./pages/AdminLogin";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import EideticPage from "./pages/EideticPage";
import EmployeeBrandRiskPage from "./pages/EmployeeBrandRiskPage";
import ComplianceDashboard from "./components/compliance/ComplianceDashboard";
import RSI from "./pages/RSI";
import GraveyardPage from "./pages/GraveyardPage";
import Clients from "./pages/Clients";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen bg-gray-50 flex w-full">
            {/* Show session manager only for authenticated admins */}
            {isAuthenticated && isAdmin && <AdminSessionManager />}
            
            {/* Show sidebar only for authenticated routes */}
            {isAuthenticated && <DashboardSidebar />}
            
            <main className="flex-1 overflow-auto">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<SalesFunnelPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blog" element={<BlogPage />} />
                
                {/* Admin Login */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Protected Admin Routes */}
                <Route path="/discovery" element={
                  <SecureRouteGuard requireAdmin={true}>
                    <Discovery />
                  </SecureRouteGuard>
                } />
                
                <Route path="/dashboard" element={
                  <SecureRouteGuard requireAdmin={true}>
                    <Discovery />
                  </SecureRouteGuard>
                } />
                
                <Route path="/clients" element={
                  <SecureRouteGuard requireAdmin={true}>
                    <Clients />
                  </SecureRouteGuard>
                } />
                
                <Route path="/employee-risk" element={
                  <SecureRouteGuard requireAdmin={true}>
                    <EmployeeBrandRiskPage />
                  </SecureRouteGuard>
                } />

                <Route path="/compliance" element={
                  <SecureRouteGuard requireAdmin={true}>
                    <ComplianceDashboard />
                  </SecureRouteGuard>
                } />

                <Route path="/eidetic" element={
                  <SecureRouteGuard requireAdmin={true}>
                    <EideticPage />
                  </SecureRouteGuard>
                } />

                <Route path="/rsi" element={
                  <SecureRouteGuard requireAdmin={true}>
                    <RSI />
                  </SecureRouteGuard>
                } />

                <Route path="/graveyard" element={
                  <SecureRouteGuard requireAdmin={true}>
                    <GraveyardPage />
                  </SecureRouteGuard>
                } />
              </Routes>
            </main>
          </div>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;

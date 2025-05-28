import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import SecureRouteGuard from "@/components/auth/SecureRouteGuard";
import AdminSessionManager from "@/components/auth/AdminSessionManager";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import Loading from "@/components/ui/loading";
import { useAuth } from "@/hooks/useAuth";
import EmergencyStrikePage from "./pages/EmergencyStrikePage";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Lazy load pages for better performance
const SalesFunnelPage = lazy(() => import("./pages/SalesFunnelPage"));
const Discovery = lazy(() => import("./pages/Discovery"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const EideticPage = lazy(() => import("./pages/EideticPage"));
const EmployeeBrandRiskPage = lazy(() => import("./pages/EmployeeBrandRiskPage"));
const ComplianceDashboard = lazy(() => import("./components/compliance/ComplianceDashboard"));
const RSI = lazy(() => import("./pages/RSI"));
const GraveyardPage = lazy(() => import("./pages/GraveyardPage"));
const Clients = lazy(() => import("./pages/Clients"));
const AnubisCockpitPage = lazy(() => import("./pages/AnubisCockpitPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <div className="min-h-screen bg-gray-50 flex w-full">
              {isAuthenticated && isAdmin && <AdminSessionManager />}
              {isAuthenticated && <DashboardSidebar />}
              
              <main className="flex-1 overflow-auto">
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<SalesFunnelPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
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

                    <Route path="/anubis-cockpit" element={
                      <SecureRouteGuard requireAdmin={true}>
                        <AnubisCockpitPage />
                      </SecureRouteGuard>
                    } />
                    
                    <Route 
                      path="/emergency-strike" 
                      element={
                        <DashboardLayout>
                          <EmergencyStrikePage />
                        </DashboardLayout>
                      } 
                    />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

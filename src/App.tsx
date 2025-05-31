
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AuthGuard from "@/components/auth/AuthGuard";
import AdminGuard from "@/components/auth/AdminGuard";
import Index from "./pages/Index";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AdminLogin from "./pages/AdminLogin";
import AriaCommand from "./pages/AriaCommand";
import ThreatsManagement from "./pages/ThreatsManagement";
import SalesFunnelPage from "./pages/SalesFunnelPage";
import PricingPage from "./pages/PricingPage";
import BlogPage from "./pages/BlogPage";
import SimonLindsayPage from "./pages/SimonLindsayPage";
import ContactPage from "./pages/ContactPage";
import SentinelPage from "./pages/admin/SentinelPage";
import SentinelOperatorPage from "./pages/admin/SentinelOperatorPage";
import WatchtowerPage from "./pages/admin/WatchtowerPage";
import PersonaSaturationPage from "./pages/admin/PersonaSaturationPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/simon-lindsay" element={<SimonLindsayPage />} />
              <Route path="/sales-funnel" element={<SalesFunnelPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/scan" element={<ContactPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <AdminGuard>
                    <DashboardPage />
                  </AdminGuard>
                } 
              />
              <Route 
                path="/admin/sentinel" 
                element={
                  <AdminGuard>
                    <SentinelPage />
                  </AdminGuard>
                } 
              />
              <Route 
                path="/admin/sentinel-command" 
                element={
                  <AdminGuard>
                    <SentinelOperatorPage />
                  </AdminGuard>
                } 
              />
              <Route 
                path="/admin/watchtower" 
                element={
                  <AdminGuard>
                    <WatchtowerPage />
                  </AdminGuard>
                } 
              />
              <Route 
                path="/admin/persona-saturation" 
                element={
                  <AdminGuard>
                    <PersonaSaturationPage />
                  </AdminGuard>
                } 
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <AdminGuard>
                    <DashboardPage />
                  </AdminGuard>
                } 
              />
              <Route 
                path="/aria-command" 
                element={
                  <AdminGuard>
                    <AriaCommand />
                  </AdminGuard>
                } 
              />
              <Route 
                path="/threats-management" 
                element={
                  <AdminGuard>
                    <ThreatsManagement />
                  </AdminGuard>
                } 
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;


import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AdminGuard from "@/components/auth/AdminGuard";
import Index from "./pages/Index";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AdminLogin from "./pages/AdminLogin";
import BlogPage from "./pages/BlogPage";
import SimonLindsayPage from "./pages/SimonLindsayPage";
import ContactPage from "./pages/ContactPage";
import GenesisSentinelPage from './pages/admin/GenesisSentinelPage';
import ClientsPage from './pages/admin/ClientsPage';
import SettingsPage from './pages/admin/SettingsPage';
import WatchtowerPage from './pages/admin/WatchtowerPage';
import IntelligenceCorePage from './pages/admin/IntelligenceCorePage';
import PersonaSaturationPage from './pages/admin/PersonaSaturationPage';
import LegalOpsPage from './pages/admin/LegalOpsPage';
import QATestingPage from './pages/admin/QATestingPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/simon-lindsay" element={<SimonLindsayPage />} />
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
                  path="/admin/genesis-sentinel" 
                  element={
                    <AdminGuard>
                      <GenesisSentinelPage />
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
                  path="/admin/intelligence-core" 
                  element={
                    <AdminGuard>
                      <IntelligenceCorePage />
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
                <Route 
                  path="/admin/legal-ops" 
                  element={
                    <AdminGuard>
                      <LegalOpsPage />
                    </AdminGuard>
                  } 
                />
                <Route 
                  path="/admin/clients" 
                  element={
                    <AdminGuard>
                      <ClientsPage />
                    </AdminGuard>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <AdminGuard>
                      <SettingsPage />
                    </AdminGuard>
                  } 
                />
                <Route 
                  path="/admin/qa-testing" 
                  element={
                    <AdminGuard>
                      <QATestingPage />
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
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

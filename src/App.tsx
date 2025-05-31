
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminGuard from "@/components/auth/AdminGuard";
import { AuthProvider } from "@/hooks/useAuth";

// Import all pages
import Index from "./pages/Index";
import Authentication from "./pages/Authentication";
import AdminLogin from "./pages/AdminLogin";
import BiographyPage from "./pages/BiographyPage";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MentionsPage from "./pages/dashboard/MentionsPage";
import MonitoringPage from "./pages/dashboard/MonitoringPage";
import SentinelPage from "./pages/dashboard/SentinelPage";
import Discovery from "./pages/Discovery";
import EideticPage from "./pages/EideticPage";
import ExecutiveReportsPage from "./pages/ExecutiveReportsPage";
import Features from "./pages/Features";
import CleanLaunch from "./pages/CleanLaunch";
import FreeScanResults from "./pages/FreeScanResults";
import EmergencyStrikePage from "./pages/EmergencyStrikePage";
import AnubisCockpitPage from "./pages/AnubisCockpitPage";
import CalendarPage from "./pages/CalendarPage";
import AriaCommand from "./pages/AriaCommand";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/simon-lindsay" element={<BiographyPage />} />
            
            {/* Dashboard routes with admin protection */}
            <Route path="/dashboard" element={
              <AdminGuard>
                <DashboardPage />
              </AdminGuard>
            } />
            <Route path="/mentions" element={
              <AdminGuard>
                <MentionsPage />
              </AdminGuard>
            } />
            <Route path="/monitoring" element={
              <AdminGuard>
                <MonitoringPage />
              </AdminGuard>
            } />
            <Route path="/sentinel" element={
              <AdminGuard>
                <SentinelPage />
              </AdminGuard>
            } />
            
            {/* Additional protected pages */}
            <Route path="/discovery" element={
              <AdminGuard>
                <Discovery />
              </AdminGuard>
            } />
            <Route path="/eidetic" element={
              <AdminGuard>
                <EideticPage />
              </AdminGuard>
            } />
            <Route path="/executive-reports" element={
              <AdminGuard>
                <ExecutiveReportsPage />
              </AdminGuard>
            } />
            <Route path="/emergency-strike" element={
              <AdminGuard>
                <EmergencyStrikePage />
              </AdminGuard>
            } />
            <Route path="/anubis-cockpit" element={
              <AdminGuard>
                <AnubisCockpitPage />
              </AdminGuard>
            } />
            <Route path="/calendar" element={
              <AdminGuard>
                <CalendarPage />
              </AdminGuard>
            } />
            <Route path="/aria-command" element={
              <AdminGuard>
                <AriaCommand />
              </AdminGuard>
            } />
            
            {/* Public pages */}
            <Route path="/features" element={<Features />} />
            <Route path="/clean-launch" element={<CleanLaunch />} />
            <Route path="/scan-results/:id" element={<FreeScanResults />} />
            
            {/* Dynamic routes from navItems */}
            {navItems.map(({ to, page, requiresAuth, requiresAdmin }) => (
              <Route
                key={to}
                path={to}
                element={
                  requiresAdmin ? (
                    <AdminGuard>
                      {page}
                    </AdminGuard>
                  ) : requiresAuth ? (
                    <ProtectedRoute>
                      {page}
                    </ProtectedRoute>
                  ) : (
                    page
                  )
                }
              />
            ))}
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

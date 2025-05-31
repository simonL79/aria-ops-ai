
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

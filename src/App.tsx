
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminGuard from "@/components/auth/AdminGuard";
import Index from "./pages/Index";
import Authentication from "./pages/Authentication";
import AdminLogin from "./pages/AdminLogin";
import BiographyPage from "./pages/BiographyPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/hooks/useAuth";

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

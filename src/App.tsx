
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { navItems } from "./nav-items";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import SecureClientIntakePage from "./pages/SecureClientIntakePage";
import KeywordToArticleSystemPage from "./pages/admin/KeywordToArticleSystemPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Protected Public Routes - DO NOT MODIFY */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            
            {/* Admin/Backend Routes - Safe to modify */}
            <Route path="/secure-intake" element={<SecureClientIntakePage />} />
            <Route path="/admin/keyword-to-article" element={<KeywordToArticleSystemPage />} />
            
            {/* Dynamic Routes */}
            {navItems.map(({ to, page }) => (
              <Route key={to} path={to} element={page} />
            ))}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

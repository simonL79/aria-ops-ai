
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/components/ui/theme-provider';
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ScanPage from "./pages/ScanPage";
import SimonLindsayPage from "./pages/SimonLindsayPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import Authentication from "./pages/Authentication";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClientsPage from "./pages/admin/ClientsPage";
import QATestPage from "./pages/QATestPage";
import SentinelOperatorPage from "./pages/admin/SentinelOperatorPage";
import SettingsPage from "./pages/admin/SettingsPage";
import SystemOptimizationPage from "./pages/admin/SystemOptimizationPage";
import WatchtowerPage from "./pages/admin/WatchtowerPage";
import IntelligenceCorePage from "./pages/admin/IntelligenceCorePage";
import PersonaSaturationPage from "./pages/admin/PersonaSaturationPage";
import Contact from "./pages/Contact";
import ContactFormPage from "./pages/ContactFormPage";
import PricingPage from "./pages/PricingPage";

const queryClient = new QueryClient();

const App = () => {
  console.log('🔄 App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="aria-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/scan" element={<ScanPage />} />
                <Route path="/simon-lindsay" element={<SimonLindsayPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/contact-sales" element={<ContactFormPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/auth" element={<Authentication />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/login" element={<Authentication />} />
                <Route path="/admin/genesis-sentinel" element={<SentinelOperatorPage />} />
                <Route path="/admin/persona-saturation" element={<PersonaSaturationPage />} />
                <Route path="/admin/watchtower" element={<WatchtowerPage />} />
                <Route path="/admin/intelligence-core" element={<IntelligenceCorePage />} />
                <Route path="/admin/legal-ops" element={<AdminDashboard />} />
                <Route path="/admin/clients" element={<ClientsPage />} />
                <Route path="/admin/qa-testing" element={<QATestPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
                <Route path="/admin/system-optimization" element={<SystemOptimizationPage />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

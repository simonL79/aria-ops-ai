
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
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

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/simon-lindsay" element={<SimonLindsayPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/genesis-sentinel" element={<SentinelOperatorPage />} />
            <Route path="/admin/persona-saturation" element={<AdminDashboard />} />
            <Route path="/admin/watchtower" element={<AdminDashboard />} />
            <Route path="/admin/intelligence-core" element={<AdminDashboard />} />
            <Route path="/admin/legal-ops" element={<AdminDashboard />} />
            <Route path="/admin/clients" element={<ClientsPage />} />
            <Route path="/admin/qa-testing" element={<QATestPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/system-optimization" element={<SystemOptimizationPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

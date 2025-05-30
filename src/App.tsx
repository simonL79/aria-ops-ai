import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AnubisGPTCockpit from "./pages/AnubisGPTCockpit";
import OperatorConsole from "./pages/OperatorConsole";
import Authentication from "./pages/Authentication";
import AdminLogin from "./pages/AdminLogin";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import QATestPage from "./pages/QATestPage";
import Settings from "./pages/Settings";
import NewCoPage from "./pages/NewCoPage";
import AiScrapingPage from "./pages/AiScrapingPage";
import ReputationScanPage from "./pages/ReputationScanPage";
import IntelligenceWorkbench from "./pages/IntelligenceWorkbench";
import EnhancedIntelligence from "./pages/EnhancedIntelligence";
import OffensiveOperations from "./pages/OffensiveOperations";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogAdminPage from "./pages/BlogAdminPage";
import SimonLindsayPage from "./pages/SimonLindsayPage";
import Contact from "./pages/Contact";
import ContactInquiries from "./pages/ContactInquiries";
import NotFound from "./pages/NotFound";
import SeoCenterPage from "./pages/SeoCenterPage";
import ReportsPage from "./pages/ReportsPage";
import Discovery from "./pages/Discovery";
import EideticPage from "./pages/EideticPage";
import ThreatsPage from "./pages/ThreatsPage";
import MonitoringPage from "./pages/MonitoringPage";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/qa-test" element={<QATestPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/clients" element={<NewCoPage />} />
          <Route path="/intelligence/workbench" element={<IntelligenceWorkbench />} />
          <Route path="/intelligence/enhanced" element={<EnhancedIntelligence />} />
          <Route path="/intelligence/offensive-operations" element={<OffensiveOperations />} />
          <Route path="/ai-scraping" element={<AiScrapingPage />} />
          <Route path="/clean-launch" element={<NewCoPage />} />
          <Route path="/reputation-scan" element={<ReputationScanPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blog/admin" element={<BlogAdminPage />} />
          <Route path="/simon-lindsay" element={<SimonLindsayPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-inquiries" element={<ContactInquiries />} />
          <Route path="/seo-center" element={<SeoCenterPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/eidetic" element={<EideticPage />} />
          <Route path="/threats" element={<ThreatsPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/anubis-gpt" element={<AnubisGPTCockpit />} />
          <Route path="/operator-console" element={<OperatorConsole />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

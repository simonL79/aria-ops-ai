
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ThreatsPage from "./pages/ThreatsPage";
import MonitoringPage from "./pages/MonitoringPage";
import IntelligencePage from "./pages/dashboard/IntelligencePage";
import EngagementHubPage from "./pages/EngagementHubPage";
import OperatorConsole from "./components/operator/OperatorConsole";
import SalesFunnelPage from "./pages/SalesFunnelPage";
import ScanPage from "./pages/ScanPage";
import PricingPage from "./pages/PricingPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import SimonLindsayPage from "./pages/SimonLindsayPage";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SalesFunnelPage />} />
          <Route path="/sales-funnel" element={<SalesFunnelPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/simon-lindsay" element={<SimonLindsayPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/threats" element={<ThreatsPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/intelligence" element={<IntelligencePage />} />
          <Route path="/engagement-hub" element={<EngagementHubPage />} />
          <Route path="/operator-console" element={<OperatorConsole />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

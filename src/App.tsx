
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import React from 'react';

// Import pages
import Index from "./pages/Index";
import ClientsPage from "./pages/ClientsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import IntelligenceWorkbench from "./pages/intelligence/IntelligenceWorkbench";
import EnhancedIntelligenceWorkbench from "./pages/intelligence/EnhancedIntelligenceWorkbench";
import OffensiveOperations from "./pages/intelligence/OffensiveOperations";
import AdminDashboard from "./pages/AdminDashboard";
import QATestPage from "./pages/QATestPage";
import AiScrapingPage from "./pages/AiScrapingPage";
import CleanLaunchPage from "./pages/CleanLaunchPage";
import BlogPage from "./pages/BlogPage";
import ReputationScanPage from "./pages/ReputationScanPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/intelligence/workbench" element={<IntelligenceWorkbench />} />
        <Route path="/intelligence/enhanced" element={<EnhancedIntelligenceWorkbench />} />
        <Route path="/intelligence/offensive-operations" element={<OffensiveOperations />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/qa-test" element={<QATestPage />} />
        <Route path="/ai-scraping" element={<AiScrapingPage />} />
        <Route path="/clean-launch" element={<CleanLaunchPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/reputation-scan" element={<ReputationScanPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

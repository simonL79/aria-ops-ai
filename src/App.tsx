
import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from 'sonner';
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import Index from "@/pages/HomePage"
import Dashboard from "@/pages/dashboard/DashboardPage"
import Features from "@/pages/Features"
import Pricing from "@/pages/PricingPage"
import Contact from "@/pages/Contact"
import Privacy from "@/pages/PrivacyPolicyPage"
import Terms from "@/pages/Terms"
import ReputationScan from "@/pages/ReputationScanForm"
import CleanLaunch from "@/pages/CleanLaunch"
import FreeScanResults from "@/pages/FreeScanResults"
import AdminDashboard from "@/pages/AdminDashboard";
import AiScrapingDashboard from "@/pages/AiScrapingPage";
import MentionsPage from "@/pages/dashboard/MentionsPage";
import EngagementHubPage from "@/pages/dashboard/EngagementHubPage";
import AriaIngestPage from "@/pages/dashboard/AriaIngestPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/mentions" element={<MentionsPage />} />
          <Route path="/dashboard/engagement" element={<EngagementHubPage />} />
          <Route path="/dashboard/aria-ingest" element={<AriaIngestPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/reputation-scan" element={<ReputationScan />} />
          <Route path="/clean-launch" element={<CleanLaunch />} />
          <Route path="/free-scan-results/:id" element={<FreeScanResults />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/ai-scraping" element={<AiScrapingDashboard />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

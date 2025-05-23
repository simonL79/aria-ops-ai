import React from 'react';
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from 'sonner';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import all pages
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
import AdminDashboard from "@/pages/AdminDashboard"
import AiScrapingDashboard from "@/pages/AiScrapingPage"
import MentionsPage from "@/pages/dashboard/MentionsPage"
import EngagementHubPage from "@/pages/dashboard/EngagementHubPage"
import AriaIngestPage from "@/pages/dashboard/AriaIngestPage"
import Authentication from "@/pages/Authentication"
import SalesFunnelPage from "@/pages/SalesFunnelPage"
import ScanPage from "@/pages/ScanPage"
import BlogPage from "@/pages/BlogPage"
import BlogPostPage from "@/pages/BlogPostPage"
import AboutPage from "@/pages/AboutPage"
import BiographyPage from "@/pages/BiographyPage"
import CalendarPage from "@/pages/CalendarPage"
import Settings from "@/pages/Settings"
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage"
import RadarPage from "@/pages/dashboard/RadarPage"
import Clients from "@/pages/Clients"
import Monitor from "@/pages/Monitor"
import NewCoPage from "@/pages/NewCoPage"

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/reputation-scan" element={<ReputationScan />} />
          <Route path="/clean-launch" element={<CleanLaunch />} />
          <Route path="/free-scan-results/:id" element={<FreeScanResults />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/simon-lindsay" element={<BiographyPage />} />
          <Route path="/scan" element={<ScanPage />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/mentions" element={<MentionsPage />} />
          <Route path="/dashboard/engagement" element={<EngagementHubPage />} />
          <Route path="/dashboard/aria-ingest" element={<AriaIngestPage />} />
          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
          <Route path="/dashboard/radar" element={<RadarPage />} />
          <Route path="/dashboard/ai-scraping" element={<AiScrapingDashboard />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Other protected routes */}
          <Route path="/clients" element={<Clients />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/new-companies" element={<NewCoPage />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Index />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

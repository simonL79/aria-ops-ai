
import React from 'react';
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from 'sonner';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RouteProtection from "@/components/auth/RouteProtection";

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
import BlogAdminPage from "@/pages/BlogAdminPage"
import IntelligenceWorkbench from "@/pages/intelligence/IntelligenceWorkbench"

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
          
          {/* Intelligence Workbench - Protected route */}
          <Route path="/intelligence" element={
            <RouteProtection requireAuth={true}>
              <IntelligenceWorkbench />
            </RouteProtection>
          } />
          
          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={
            <RouteProtection requireAuth={true}>
              <Dashboard />
            </RouteProtection>
          } />
          <Route path="/dashboard/mentions" element={
            <RouteProtection requireAuth={true}>
              <MentionsPage />
            </RouteProtection>
          } />
          <Route path="/dashboard/engagement" element={
            <RouteProtection requireAuth={true}>
              <EngagementHubPage />
            </RouteProtection>
          } />
          <Route path="/dashboard/aria-ingest" element={
            <RouteProtection requireAuth={true}>
              <AriaIngestPage />
            </RouteProtection>
          } />
          <Route path="/dashboard/analytics" element={
            <RouteProtection requireAuth={true}>
              <AnalyticsPage />
            </RouteProtection>
          } />
          <Route path="/dashboard/radar" element={
            <RouteProtection requireAuth={true}>
              <RadarPage />
            </RouteProtection>
          } />
          <Route path="/dashboard/ai-scraping" element={
            <RouteProtection requireAuth={true}>
              <AiScrapingDashboard />
            </RouteProtection>
          } />
          
          {/* Admin-only routes */}
          <Route path="/admin" element={
            <RouteProtection requireAuth={true} requireAdmin={true}>
              <AdminDashboard />
            </RouteProtection>
          } />
          <Route path="/blog/admin" element={
            <RouteProtection requireAuth={true} requireAdmin={true}>
              <BlogAdminPage />
            </RouteProtection>
          } />
          
          {/* Other protected routes */}
          <Route path="/clients" element={
            <RouteProtection requireAuth={true}>
              <Clients />
            </RouteProtection>
          } />
          <Route path="/calendar" element={
            <RouteProtection requireAuth={true}>
              <CalendarPage />
            </RouteProtection>
          } />
          <Route path="/settings" element={
            <RouteProtection requireAuth={true}>
              <Settings />
            </RouteProtection>
          } />
          <Route path="/monitor" element={
            <RouteProtection requireAuth={true}>
              <Monitor />
            </RouteProtection>
          } />
          <Route path="/new-companies" element={
            <RouteProtection requireAuth={true}>
              <NewCoPage />
            </RouteProtection>
          } />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Index />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

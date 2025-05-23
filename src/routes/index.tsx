
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SalesFunnelPage from "@/pages/SalesFunnelPage";
import ScanPage from "@/pages/ScanPage";
import Authentication from "@/pages/Authentication";
import AiScrapingPage from "@/pages/AiScrapingPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import AboutPage from "@/pages/AboutPage";
import BiographyPage from "@/pages/BiographyPage";
import PricingPage from "@/pages/PricingPage";
import CalendarPage from "@/pages/CalendarPage";
import Settings from "@/pages/Settings";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import MentionsPage from "@/pages/dashboard/mentions"; // Fixed import path
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import EngagementHubPage from "@/pages/dashboard/EngagementHubPage";
import RadarPage from "@/pages/dashboard/RadarPage";
import Clients from "@/pages/Clients";
import Monitor from "@/pages/Monitor";
import NewCoPage from "@/pages/NewCoPage";

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<SalesFunnelPage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/simon-lindsay" element={<BiographyPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/intelligence" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/mentions" element={
        <ProtectedRoute>
          <MentionsPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/engagement" element={
        <ProtectedRoute>
          <EngagementHubPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/analytics" element={
        <ProtectedRoute>
          <AnalyticsPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/radar" element={
        <ProtectedRoute>
          <RadarPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/ai-scraping" element={
        <ProtectedRoute>
          <AiScrapingPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/monitor" element={
        <ProtectedRoute>
          <Monitor />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/new-companies" element={
        <ProtectedRoute>
          <NewCoPage />
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute>
          <Clients />
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute>
          <CalendarPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

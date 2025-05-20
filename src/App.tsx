
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Import pages
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import AiScrapingPage from "./pages/AiScrapingPage";
import EngagementHubPage from "./pages/dashboard/EngagementHubPage";
import IntelligencePage from "./pages/dashboard/IntelligencePage";
import RadarPage from "./pages/dashboard/RadarPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import Authentication from "./pages/Authentication";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth" element={<Authentication />} />
        
        {/* Admin-only routes */}
        <Route element={<ProtectedRoute requiredRole={["admin"]} redirectTo="/auth" />}>
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
        
        {/* Admin or staff routes */}
        <Route element={<ProtectedRoute requiredRole={["admin", "staff"]} redirectTo="/auth" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/intelligence" element={<IntelligencePage />} />
          <Route path="/dashboard/radar" element={<RadarPage />} />
          <Route path="/dashboard/ai-scraping" element={<AiScrapingPage />} />
          <Route path="/dashboard/monitor" element={<Index />} />
          <Route path="/dashboard/new-companies" element={<Index />} />
          <Route path="/dashboard/new-companies/:id" element={<Index />} />
          <Route path="/dashboard/radar/entity/:id" element={<Index />} />
          <Route path="/dashboard/engagement" element={<EngagementHubPage />} />
        </Route>
        
        {/* Redirect legacy routes */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />
        
        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors />
    </>
  );
}

export default App;


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AiScrapingPage from "@/pages/AiScrapingPage";

// Import all your other pages/routes
// import DashboardPage from "@/pages/DashboardPage";
// import EngagementHubPage from "@/pages/dashboard/EngagementHubPage";
// import SettingsPage from "@/pages/SettingsPage";

// This component defines routes that can be used within the main Routes component
// It should NOT include its own Router/BrowserRouter
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard/ai-scraping" element={<AiScrapingPage />} />
      
      {/* Add all your other routes here */}
      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      {/* <Route path="/dashboard/engagement" element={<EngagementHubPage />} /> */}
      {/* <Route path="/settings" element={<SettingsPage />} /> */}
      
      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/dashboard/ai-scraping" replace />} />
    </Routes>
  );
};

export default AppRoutes;


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AiScrapingPage from "@/pages/AiScrapingPage";
import SalesFunnelPage from "@/pages/SalesFunnelPage";
import Authentication from "@/pages/Authentication";

// This component defines routes that can be used within the main Routes component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<SalesFunnelPage />} />
      <Route path="/auth" element={<Authentication />} />
      
      {/* Protected routes */}
      <Route path="/dashboard/ai-scraping" element={<AiScrapingPage />} />
      
      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

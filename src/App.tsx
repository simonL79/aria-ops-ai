import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage";
import RadarPage from "./pages/RadarPage";
import RadarDetailPage from "./pages/RadarDetailPage";
import NewCompaniesPage from "./pages/NewCompaniesPage";
import NewCoDetailsPage from "./pages/NewCoDetailsPage";
import Monitor from "./pages/Monitor";
import IntelligencePage from "./pages/IntelligencePage";
import AiScrapingPage from "./pages/AiScrapingPage";

// Update the Routes component to include our new AI Scraping page
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/intelligence" element={<IntelligencePage />} />
        <Route path="/dashboard/radar" element={<RadarPage />} />
        <Route path="/dashboard/ai-scraping" element={<AiScrapingPage />} />
        <Route path="/dashboard/monitor" element={<Monitor />} />
        <Route path="/dashboard/new-companies" element={<NewCompaniesPage />} />
        <Route path="/dashboard/new-companies/:id" element={<NewCoDetailsPage />} />
        <Route path="/dashboard/radar/entity/:id" element={<RadarDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  );
}

export default App;

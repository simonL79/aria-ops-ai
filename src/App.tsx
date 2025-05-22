
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { initializeDatabase } from "@/utils/initializeMonitoring";

// Import your pages
import Dashboard from "@/pages/dashboard/DashboardPage";
import Monitor from "@/pages/Monitor";
import InfluencerRadar from "@/pages/InfluencerRadar";
import AiScrapingPage from "@/pages/AiScrapingPage";
import IntelligencePage from "@/pages/dashboard/IntelligencePage";
import NotFound from "@/pages/NotFound";
import RadarPage from "@/pages/dashboard/RadarPage";
import CommandCenterPage from "@/pages/dashboard/CommandCenterPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import EngagementHubPage from "@/pages/dashboard/EngagementHubPage";
import Settings from "@/pages/Settings";
import MentionsPage from "@/pages/dashboard/MentionsPage";
import NewCoPage from "@/pages/NewCoPage";

function App() {
  useEffect(() => {
    // Initialize the database with required data
    initializeDatabase().catch(console.error);
  }, []);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/influencer-radar" element={<InfluencerRadar />} />
        <Route path="/dashboard/ai-scraping" element={<AiScrapingPage />} />
        <Route path="/dashboard/intelligence" element={<IntelligencePage />} />
        <Route path="/dashboard/radar" element={<RadarPage />} />
        <Route path="/dashboard/command-center" element={<CommandCenterPage />} />
        <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
        <Route path="/dashboard/engagement" element={<EngagementHubPage />} />
        <Route path="/dashboard/mentions" element={<MentionsPage />} />
        <Route path="/dashboard/new-companies" element={<NewCoPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

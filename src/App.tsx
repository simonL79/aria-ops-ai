
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
      </Routes>
      <Toaster />
    </>
  );
}

export default App;


import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { initializeDatabase } from "@/utils/initializeMonitoring";

// Import your pages
import Dashboard from "@/pages/dashboard/DashboardPage";
import Monitor from "@/pages/Monitor";
import InfluencerRadar from "@/pages/InfluencerRadar";

function App() {
  useEffect(() => {
    // Initialize the database with required data
    initializeDatabase().catch(console.error);
  }, []);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/influencer-radar" element={<InfluencerRadar />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;


import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { initializeDatabase } from "@/utils/initializeMonitoring";

// Import your pages
import Dashboard from "@/pages/dashboard/DashboardPage";
import Monitor from "@/pages/Monitor";

function App() {
  useEffect(() => {
    // Initialize the database with required data
    initializeDatabase().catch(console.error);
  }, []);
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitor" element={<Monitor />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;

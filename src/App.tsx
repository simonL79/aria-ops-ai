
import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { initializeMonitoringSystem } from "./utils/initializeMonitoring";

function App() {
  // Initialize monitoring system on app start
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeMonitoringSystem();
        console.log("Monitoring system initialized successfully");
      } catch (error) {
        console.error("Failed to initialize monitoring system:", error);
      }
    };
    
    initialize();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;

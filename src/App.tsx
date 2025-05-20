
import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { initializeMonitoringSystem } from "./utils/initializeMonitoring";
// Import your actual routes file
import Routes from "./routes/index";

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
        <Routes />
      </Router>
    </>
  );
}

export default App;

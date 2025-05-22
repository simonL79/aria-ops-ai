
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { initializeDatabase } from "@/utils/initializeMonitoring";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

// Import your root routes component
import AppRoutes from "./routes/index";

function App() {
  useEffect(() => {
    // Initialize the database with required data
    initializeDatabase().catch(console.error);

    // Redirect to RSS feed edge function
    if (window.location.pathname === "/rss.xml") {
      window.location.href = "https://ssvskbejfacmjemphmry.supabase.co/functions/v1/generate-rss";
    }
  }, []);
  
  return (
    <HelmetProvider>
      {/* We're removing the BrowserRouter from here since it's already in main.tsx */}
      <AppRoutes />
      <Toaster />
    </HelmetProvider>
  );
}

export default App;

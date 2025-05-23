
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AiScrapingDashboard } from "@/components/aiScraping";
import { useEffect } from "react";
import { initializeMonitoringStatus } from "@/utils/initializeMonitoring";
import { toast } from "sonner";

const AiScrapingPage = () => {
  useEffect(() => {
    // Initialize monitoring when component mounts
    const setupMonitoring = async () => {
      try {
        console.log("Initializing monitoring status...");
        await initializeMonitoringStatus();
        console.log("Monitoring status initialized successfully");
      } catch (error) {
        console.error('Failed to initialize monitoring:', error);
        toast.error("Failed to initialize monitoring system");
      }
    };
    
    setupMonitoring();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <AiScrapingDashboard />
      </div>
    </DashboardLayout>
  );
};

export default AiScrapingPage;

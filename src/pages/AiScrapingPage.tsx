
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AiScrapingDashboard } from "@/components/aiScraping";
import { useEffect } from "react";
import { initializeMonitoringStatus } from "@/utils/initializeMonitoring";

const AiScrapingPage = () => {
  useEffect(() => {
    // Initialize monitoring when component mounts
    initializeMonitoringStatus().catch(error => {
      console.error('Failed to initialize monitoring:', error);
    });
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


import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AriaIngestPanel from "@/components/dashboard/AriaIngestPanel";
import RedditScannerPanel from "@/components/dashboard/RedditScannerPanel";
import MonitoringSourcesManager from "@/components/dashboard/MonitoringSourcesManager";
import ThreatAnalysisHub from "@/components/dashboard/ThreatAnalysisHub";

const AriaIngestPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <DashboardHeader 
          title="ARIA Intelligence Suite" 
          description="Comprehensive threat intelligence, content processing, and real-time monitoring"
        />
        
        <div className="space-y-8 max-w-full">
          <AriaIngestPanel />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RedditScannerPanel />
            <MonitoringSourcesManager />
          </div>
          
          <ThreatAnalysisHub />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AriaIngestPage;

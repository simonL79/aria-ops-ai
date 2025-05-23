
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AriaIngestPanel from "@/components/dashboard/AriaIngestPanel";
import RedditScannerPanel from "@/components/dashboard/RedditScannerPanel";
import MonitoringSourcesManager from "@/components/dashboard/MonitoringSourcesManager";

const AriaIngestPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <DashboardHeader 
          title="ARIA Content Ingest" 
          description="Submit content for AI-powered entity extraction and threat analysis"
        />
        
        <div className="space-y-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AriaIngestPanel />
            <RedditScannerPanel />
          </div>
          
          <MonitoringSourcesManager />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AriaIngestPage;

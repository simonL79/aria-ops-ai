
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AriaIngestPanel from "@/components/dashboard/AriaIngestPanel";
import RedditScannerPanel from "@/components/dashboard/RedditScannerPanel";

const AriaIngestPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <DashboardHeader 
          title="ARIA Content Ingest" 
          description="Submit content for AI-powered entity extraction and threat analysis"
        />
        
        <div className="space-y-8 max-w-4xl">
          <AriaIngestPanel />
          <RedditScannerPanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AriaIngestPage;

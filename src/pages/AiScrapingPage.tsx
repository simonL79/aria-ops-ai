
import DashboardLayout from "@/components/layout/DashboardLayout";
import AiScrapingDashboard from "@/components/aiScraping/AiScrapingDashboard";

const AiScrapingPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Scraping & Data Collection</h1>
        <p className="text-muted-foreground">
          Use AI to collect, analyze, and monitor reputation data from across the web without relying on direct APIs
        </p>
      </div>
      
      <AiScrapingDashboard />
    </DashboardLayout>
  );
};

export default AiScrapingPage;

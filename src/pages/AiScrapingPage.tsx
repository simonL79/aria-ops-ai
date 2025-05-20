
import DashboardLayout from "@/components/layout/DashboardLayout";
import AiScrapingDashboard from "@/components/aiScraping/AiScrapingDashboard";
import { AlertTriangle } from "lucide-react";

const AiScrapingPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tight">AI-Powered Reputation Intelligence</h1>
          <span className="ml-3 px-2 py-1 bg-amber-200 text-amber-800 text-xs font-medium rounded-full">BETA</span>
        </div>
        <p className="text-muted-foreground">
          A.R.I.A™ uses advanced AI to collect, analyze, and monitor reputation data from across the web without relying on direct APIs
        </p>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
        <div>
          <h3 className="font-medium text-yellow-800">How this system works</h3>
          <p className="text-sm text-yellow-700 mt-1">
            This system uses AI to analyze content from various sources. It can extract sentiment, identify risks, 
            classify threats, and generate appropriate responses - all without needing direct API access to platforms.
            You can use the prompt templates to customize how the AI analyzes different types of content.
          </p>
        </div>
      </div>
      
      <AiScrapingDashboard />
    </DashboardLayout>
  );
};

export default AiScrapingPage;

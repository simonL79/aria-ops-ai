
import DashboardLayout from "@/components/layout/DashboardLayout";
import AiScrapingDashboard from "@/components/aiScraping/AiScrapingDashboard";
import { AlertTriangle, Zap, Shield, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      
      {/* Strategy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 text-amber-500 mr-2" />
              Autonomous Scanning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use crawlers, RSS feeds, and proxy methods instead of paid APIs. Monitor sources like Google, news sites, 
              and social media with your own infrastructure.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Shield className="h-5 w-5 text-blue-500 mr-2" />
              Hybrid Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Combine lightweight open-source models for initial screening with strategic use of GPT for deeper analysis.
              Get the best of both worlds: speed and cost efficiency.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Coins className="h-5 w-5 text-green-500 mr-2" />
              Cost-Effective Scale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Minimize recurring costs with self-hosted tools and open-source models. Maintain full control of your data and 
              infrastructure while scaling globally.
            </p>
          </CardContent>
        </Card>
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

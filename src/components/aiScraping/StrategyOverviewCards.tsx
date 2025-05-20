
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, Shield, Coins } from "lucide-react";

const StrategyOverviewCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Zap className="h-5 w-5 text-amber-500 mr-2" />
            Live Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Real-time data gathering using crawlers and advanced scraping techniques to monitor web mentions across platforms.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Shield className="h-5 w-5 text-blue-500 mr-2" />
            Threat Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            AI-powered analysis identifies and prioritizes reputation threats in real-time, allowing for immediate response.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Coins className="h-5 w-5 text-green-500 mr-2" />
            Engagement Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Direct response capabilities for customer inquiries and reputation threats with AI-assisted response recommendations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyOverviewCards;

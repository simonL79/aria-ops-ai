
import DashboardLayout from "@/components/layout/DashboardLayout";
import RadarFeed from "@/components/radar/RadarFeed";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, AlertCircle } from "lucide-react";
import { useState } from "react";

const RadarPage = () => {
  const [lastScan, setLastScan] = useState<string>("2025-05-20T08:00:00Z");

  const refreshData = async () => {
    // In a real implementation, this would trigger the edge function to scan for new mentions
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastScan(new Date().toISOString());
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reputation Radar</h1>
        <p className="text-muted-foreground">
          Monitor online mentions to identify potential clients in need of reputation management
        </p>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            Last scan: {new Date(lastScan).toLocaleString()}
          </span>
          <AlertCircle className="h-3 w-3 ml-3 mr-1" />
          <span>
            Daily scan runs automatically at 8:00 AM
          </span>
          <Button variant="ghost" size="sm" className="ml-auto h-7">
            <Settings className="h-3 w-3 mr-1" />
            <span className="text-xs">Configure Radar</span>
          </Button>
        </div>
      </div>
      
      <RadarFeed onRefresh={refreshData} />
    </DashboardLayout>
  );
};

export default RadarPage;

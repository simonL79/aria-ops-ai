
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ContentAlert } from "@/types/dashboard";
import { ScanParameters } from "@/types/aiScraping";
import AiScrapingDashboard from "@/components/aiScraping/AiScrapingDashboard";
import StrategyOverviewCards from "@/components/aiScraping/StrategyOverviewCards";
import SystemStatusAlert from "@/components/aiScraping/SystemStatusAlert";
import ScanParametersForm from "@/components/aiScraping/ScanParametersForm";

interface AiScrapingTabsProps {
  isScanning: boolean;
  setIsScanning: (isScanning: boolean) => void;
  activeAlerts: ContentAlert[];
  setActiveAlerts: (alerts: ContentAlert[]) => void;
  selectedAlert: ContentAlert | null;
  setSelectedAlert: (alert: ContentAlert | null) => void;
  onScan: () => void;
  handleParameterizedScan: (params: ScanParameters) => Promise<void>;
  handleViewOnEngagementHub: (alertId: string) => void;
}

const AiScrapingTabs = ({
  isScanning,
  setIsScanning,
  activeAlerts,
  setActiveAlerts,
  selectedAlert,
  setSelectedAlert,
  onScan,
  handleParameterizedScan,
  handleViewOnEngagementHub
}: AiScrapingTabsProps) => {
  return (
    <Tabs defaultValue="dashboard">
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="scanner">Scanner</TabsTrigger>
        <TabsTrigger value="analysis">Analysis</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard" className="pt-4">
        <StrategyOverviewCards />
        <SystemStatusAlert />
        <AiScrapingDashboard />
      </TabsContent>
      <TabsContent value="scanner" className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-muted rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Quick Scan</h3>
            <p className="text-muted-foreground mb-4">Start a quick scan to detect online mentions and potential threats</p>
            <Button 
              size="lg" 
              className="animate-pulse"
              onClick={onScan}
              disabled={isScanning}
              variant="scan"
            >
              {isScanning ? "Scanning..." : "Start Live Scan"}
            </Button>
          </div>
          
          <ScanParametersForm 
            onStartScan={handleParameterizedScan}
            isScanning={isScanning}
          />
        </div>
      </TabsContent>
      <TabsContent value="analysis" className="pt-4">
        <div className="bg-muted rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Advanced Analysis</h3>
          <p className="text-muted-foreground">Select an alert to analyze threats and generate response recommendations</p>
          {selectedAlert ? (
            <div className="mt-4 text-left p-4 border rounded-md bg-card">
              <h4 className="font-medium">{selectedAlert.platform}</h4>
              <p className="mt-2">{selectedAlert.content}</p>
              <div className="mt-4">
                <Button variant="outline" className="mr-2" onClick={() => setSelectedAlert(null)}>
                  Close
                </Button>
                <Button onClick={() => handleViewOnEngagementHub(selectedAlert.id)}>
                  View in Engagement Hub
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-4">No alert selected</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AiScrapingTabs;

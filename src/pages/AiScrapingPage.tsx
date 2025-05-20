
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AiScrapingDashboard from "@/components/aiScraping/AiScrapingDashboard";
import RealTimeAlerts from "@/components/dashboard/real-time-alerts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Zap, Shield, Coins, Play, Pause } from "lucide-react";
import { useAlertSimulation } from "@/components/dashboard/real-time-alerts/useAlertSimulation";
import { ContentAlert } from "@/types/dashboard";

const AiScrapingPage = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const { activeAlerts, setActiveAlerts } = useAlertSimulation([]);
  const [selectedAlert, setSelectedAlert] = useState<ContentAlert | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate a scan that takes 3 seconds
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleViewDetail = (alert: ContentAlert) => {
    setSelectedAlert(alert);
  };

  const handleMarkAsRead = (alertId: string) => {
    setActiveAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'read' } : alert
    ));
  };

  const handleDismiss = (alertId: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold tracking-tight">AI-Powered Reputation Intelligence</h1>
            <span className="ml-3 px-2 py-1 bg-amber-200 text-amber-800 text-xs font-medium rounded-full">LIVE</span>
          </div>
          <Button 
            onClick={handleScan} 
            disabled={isScanning}
            className="gap-2"
          >
            {isScanning ? (
              <>
                <Pause className="h-4 w-4" />
                Scanning...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Scan
              </>
            )}
          </Button>
        </div>
        <p className="text-muted-foreground">
          A.R.I.A™ uses advanced AI to collect, analyze, and monitor reputation data from across the web without relying on direct APIs
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="dashboard">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="scanner">Scanner</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="pt-4">
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
              
              <Alert className="bg-yellow-50 border-yellow-200 mb-8">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <AlertTitle>System Active</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  ARIA is actively monitoring content sources and will generate alerts in real-time. 
                  Adjust notification settings from the alerts panel.
                </AlertDescription>
              </Alert>
              
              <AiScrapingDashboard />
            </TabsContent>
            <TabsContent value="scanner" className="pt-4">
              <div className="bg-muted rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Real-time Web Scanner</h3>
                <p className="text-muted-foreground mb-4">Start a scan to detect online mentions and potential threats</p>
                <Button 
                  size="lg" 
                  className="animate-pulse"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  {isScanning ? "Scanning..." : "Start Real-Time Scan"}
                </Button>
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
                      <Button>Analyze Threat</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-4">No alert selected</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <RealTimeAlerts 
            onViewDetail={handleViewDetail}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismiss}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AiScrapingPage;

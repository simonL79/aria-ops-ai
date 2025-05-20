
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Play, Pause, LineChart } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";
import { startContinuousScan, performLiveScan } from '@/services/aiScraping/mockScanner';
import { toast } from "sonner";

const AiScrapingDashboard = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isInitialScan, setIsInitialScan] = useState<boolean>(true);
  const [scanResults, setScanResults] = useState<ContentAlert[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [metrics, setMetrics] = useState({
    scansToday: 0,
    alertsDetected: 0,
    highPriorityAlerts: 0
  });
  
  useEffect(() => {
    // Start with a one-time scan when component mounts
    if (isInitialScan) {
      setIsScanning(true);
      performLiveScan().then(alerts => {
        setScanResults(prev => [...alerts, ...prev]);
        
        // Update metrics
        setMetrics(prev => ({
          scansToday: prev.scansToday + 1,
          alertsDetected: prev.alertsDetected + alerts.length,
          highPriorityAlerts: prev.highPriorityAlerts + alerts.filter(a => a.severity === 'high').length
        }));
        
        setIsScanning(false);
        setIsInitialScan(false);
      }).catch(() => {
        setIsScanning(false);
        setIsInitialScan(false);
      });
    }
    
    let stopScanning: (() => void) | null = null;
    
    if (isActive) {
      toast.info("Real-time monitoring activated", {
        description: "ARIA is now actively monitoring for new mentions and alerts"
      });
      
      // Set up continuous scanning
      stopScanning = startContinuousScan((newAlert) => {
        setScanResults(prev => [newAlert, ...prev].slice(0, 30)); // Keep top 30
        
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          alertsDetected: prev.alertsDetected + 1,
          highPriorityAlerts: prev.highPriorityAlerts + (newAlert.severity === 'high' ? 1 : 0)
        }));
      });
    }
    
    // Clean up the scanning when component unmounts or when isActive changes
    return () => {
      if (stopScanning) {
        stopScanning();
      }
    };
  }, [isActive, isInitialScan]);
  
  const handleToggleScan = () => {
    setIsActive(prev => !prev);
  };
  
  const handleManualScan = async () => {
    setIsScanning(true);
    try {
      const newAlerts = await performLiveScan();
      setScanResults(prev => [...newAlerts, ...prev]);
      
      // Update metrics
      setMetrics(prev => ({
        scansToday: prev.scansToday + 1,
        alertsDetected: prev.alertsDetected + newAlerts.length,
        highPriorityAlerts: prev.highPriorityAlerts + newAlerts.filter(a => a.severity === 'high').length
      }));
    } catch (error) {
      console.error("Manual scan error:", error);
    } finally {
      setIsScanning(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reputation Intelligence</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={isActive ? "destructive" : "default"}
            onClick={handleToggleScan}
            className="gap-2"
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4" />
                Stop Real-Time Monitoring
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Activate Real-Time
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleManualScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Scanning...
              </>
            ) : (
              "Run Manual Scan"
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scans Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <LineChart className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-2xl font-bold">{metrics.scansToday}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alerts Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <LineChart className="h-4 w-4 mr-2 text-amber-500" />
              <span className="text-2xl font-bold">{metrics.alertsDetected}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <LineChart className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-2xl font-bold">{metrics.highPriorityAlerts}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Live Monitoring Results</CardTitle>
        </CardHeader>
        <CardContent>
          {scanResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No monitoring results yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                {isActive 
                  ? "Real-time monitoring is active. Results will appear here as they are detected." 
                  : "Activate real-time monitoring to track mentions and threats."}
              </p>
              {!isActive && !isScanning && (
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setIsActive(true)}
                >
                  Activate Monitoring
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {isActive 
                  ? "Real-time monitoring is active. New results will appear automatically." 
                  : "Real-time monitoring is inactive. Run a manual scan or activate real-time monitoring."}
              </p>
              <div className="divide-y">
                {scanResults.map(result => (
                  <div key={result.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 ${
                          result.severity === 'high' 
                            ? 'bg-red-500' 
                            : result.severity === 'medium' 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`} />
                        <span className="font-medium">{result.platform}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{result.date}</span>
                    </div>
                    <p className="mt-1 text-sm">{result.content}</p>
                    <div className="mt-2">
                      {result.category === 'customer_enquiry' && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Customer Enquiry
                        </span>
                      )}
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        result.severity === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : result.severity === 'medium' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {result.severity === 'high' 
                          ? 'High Priority' 
                          : result.severity === 'medium' 
                          ? 'Medium Priority' 
                          : 'Low Priority'
                        }
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => {
                          window.location.href = `/dashboard/engagement?alert=${result.id}`;
                        }}
                      >
                        View & Respond
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AiScrapingDashboard;

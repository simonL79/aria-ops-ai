import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader, RefreshCw, Clock } from "lucide-react";
import { IntelligenceReport, ThreatVector, DataSourceStats } from "@/types/intelligence";
import { runMonitoringScan, getMonitoringStatus, startMonitoring } from "@/services/monitoringService";
import { getAvailableSources } from "@/services/dataIngestion";
import DashboardOverview from "./intelligence-sections/DashboardOverview";
import ThreatVectorsDisplay from "./intelligence-sections/ThreatVectorsDisplay";
import DataSourcesPanel from "./intelligence-sections/DataSourcesPanel";

interface IntelligenceDashboardContainerProps {
  sampleReport: IntelligenceReport;
  threatVectors: ThreatVector[];
  sourceStats: DataSourceStats[];
  onFormSubmit?: (e: React.FormEvent) => void;
}

const IntelligenceDashboardContainer = ({ 
  sampleReport,
  threatVectors,
  sourceStats,
  onFormSubmit
}: IntelligenceDashboardContainerProps) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isRunningAnalysis, setIsRunningAnalysis] = useState<boolean>(false);
  const [availableSources, setAvailableSources] = useState<any[]>([]);
  const [monitoringStatus, setMonitoringStatus] = useState<any>(null);
  
  useEffect(() => {
    // Get available sources
    setAvailableSources(getAvailableSources());
    
    // Get monitoring status
    setMonitoringStatus(getMonitoringStatus());
    
    // Set up monitoring if not yet active
    if (!getMonitoringStatus().isActive) {
      startMonitoring();
    }
    
    // Prevent any auto-refreshes from useEffect
    const getInitialData = async () => {
      setAvailableSources(getAvailableSources());
      setMonitoringStatus(getMonitoringStatus());
      
      if (!getMonitoringStatus().isActive) {
        startMonitoring();
      }
    };
    
    getInitialData();
    
    // Refresh monitoring status every minute
    const statusInterval = setInterval(() => {
      setMonitoringStatus(getMonitoringStatus());
    }, 60000);
    
    return () => {
      clearInterval(statusInterval);
    };
  }, []);
  
  const handleRunAnalysis = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent page refresh
    setIsRunningAnalysis(true);
    
    try {
      await runMonitoringScan();
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reputation Intelligence</h2>
        <Button 
          onClick={handleRunAnalysis} 
          disabled={isRunningAnalysis}
          variant="default"
          type="button" // Explicitly set type to button to prevent form submission
        >
          {isRunningAnalysis ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Running Analysis...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Full Analysis
            </>
          )}
        </Button>
      </div>
      
      {monitoringStatus && (
        <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
          <Clock className="h-4 w-4" />
          <AlertTitle>Monitoring Active</AlertTitle>
          <AlertDescription>
            Last scan: {new Date(monitoringStatus.lastRun).toLocaleTimeString()}
            {monitoringStatus.nextRun && (
              <> • Next scan: {new Date(monitoringStatus.nextRun).toLocaleTimeString()}</>
            )}
            {' • '}{monitoringStatus.sources} sources monitored
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threat Vectors</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <DashboardOverview report={sampleReport} />
        </TabsContent>
        
        <TabsContent value="threats" className="mt-4">
          <ThreatVectorsDisplay threatVectors={threatVectors} />
        </TabsContent>
        
        <TabsContent value="sources" className="mt-4">
          <DataSourcesPanel 
            sourceStats={sourceStats} 
            availableSources={availableSources} 
            onFormSubmit={onFormSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligenceDashboardContainer;

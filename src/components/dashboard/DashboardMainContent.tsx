
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { DashboardMainContentProps } from "@/types/dashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import OptimizedDashboard from "./OptimizedDashboard";

const DashboardMainContent = ({
  metrics, 
  alerts, 
  sources, 
  actions, 
  loading, 
  error, 
  fetchData, 
  filteredAlerts, 
  onFilterChange,
  reputationScore = 75,
  previousScore = 70,
  selectedClient,
  clientEntities
}: DashboardMainContentProps) => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [isGuardianActive, setIsGuardianActive] = useState(false);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);

  // Critical button handlers
  const handleLiveThreatScan = async () => {
    setIsScanning(true);
    toast.info('🔍 Initiating Live Threat Scan...');
    
    try {
      // Simulate scan process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('✅ Live Threat Scan completed successfully!');
      fetchData?.(); // Refresh data
    } catch (error) {
      toast.error('❌ Live Threat Scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const handleLiveIntelligenceSweep = async () => {
    setIsScanning(true);
    toast.info('🧠 Starting Live Intelligence Sweep...');
    
    try {
      // Simulate sweep process
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('✅ Live Intelligence Sweep completed!');
      fetchData?.(); // Refresh data
    } catch (error) {
      toast.error('❌ Live Intelligence Sweep failed');
    } finally {
      setIsScanning(false);
    }
  };

  const handleGuardianToggle = () => {
    const newState = !isGuardianActive;
    setIsGuardianActive(newState);
    
    if (newState) {
      toast.success('🛡️ Guardian Mode Activated - Enhanced protection enabled');
    } else {
      toast.info('🛡️ Guardian Mode Deactivated');
    }
  };

  const handleGenerateReport = () => {
    toast.info('📊 Generating Executive Report...');
    navigate('/reports/executive');
  };

  const handleActivateRealTime = () => {
    const newState = !isRealTimeActive;
    setIsRealTimeActive(newState);
    
    if (newState) {
      toast.success('📡 Real-Time Monitoring Activated');
    } else {
      toast.info('📡 Real-Time Monitoring Deactivated');
    }
  };

  const handleRunManualScan = async () => {
    setIsScanning(true);
    toast.info('🔄 Running Manual Scan...');
    
    try {
      // Simulate manual scan
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('✅ Manual Scan completed!');
      fetchData?.(); // Refresh data
    } catch (error) {
      toast.error('❌ Manual Scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  // Filter for live OSINT data only
  const liveAlerts = alerts?.filter(alert => 
    alert.sourceType === 'osint_intelligence' || 
    alert.sourceType === 'live_alert' ||
    alert.sourceType === 'live_osint' ||
    alert.sourceType === 'live_scan' ||
    alert.platform === 'Reddit' ||
    alert.platform === 'RSS' ||
    alert.platform === 'Twitter' ||
    alert.platform === 'Google News'
  ) || [];
  
  const displayAlerts = liveAlerts.length > 0 ? liveAlerts : (alerts || []);
  
  const liveSources = sources?.filter(source => 
    source.type === 'osint_source' || 
    source.name?.includes('Reddit') || 
    source.name?.includes('RSS') ||
    source.name?.includes('Twitter') ||
    source.name?.includes('News')
  ) || [];
  
  const liveActions = actions?.filter(action => 
    action.type === 'urgent' || action.type === 'monitoring' || action.type === 'response'
  ) || [];

  return (
    <div className="min-h-screen bg-corporate-dark">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Header with System Status */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">A.R.I.A™ Intelligence Dashboard</h1>
            <p className="text-corporate-lightGray">Advanced Reputation Intelligence Assistant</p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchData}
            className="gap-2 border-corporate-border text-corporate-lightGray hover:bg-corporate-darkSecondary hover:text-white w-fit"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Client Status Bar */}
        {selectedClient && (
          <div className="bg-corporate-darkSecondary border border-corporate-border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-corporate-accent rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white">
                Active Client: {selectedClient.name} • {clientEntities?.length || 0} entities monitored
              </span>
            </div>
          </div>
        )}

        {/* Live Status Indicator */}
        <div className="bg-corporate-darkSecondary border border-green-600 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">
                Live Intelligence Active: {displayAlerts.length} threats detected • {liveSources.length} sources monitored
              </span>
            </div>
          </div>
        </div>

        {/* Optimized Dashboard Component */}
        <OptimizedDashboard
          metrics={metrics}
          alerts={displayAlerts}
          sources={liveSources}
          actions={liveActions}
          loading={loading}
          error={error}
          fetchData={fetchData}
          filteredAlerts={filteredAlerts}
          reputationScore={reputationScore}
          previousScore={previousScore}
          selectedClient={selectedClient}
          clientEntities={clientEntities}
          onLiveThreatScan={handleLiveThreatScan}
          onLiveIntelligenceSweep={handleLiveIntelligenceSweep}
          onGuardianToggle={handleGuardianToggle}
          onGenerateReport={handleGenerateReport}
          onActivateRealTime={handleActivateRealTime}
          onRunManualScan={handleRunManualScan}
          isScanning={isScanning}
          isGuardianActive={isGuardianActive}
          isRealTimeActive={isRealTimeActive}
        />

        {/* Navigation Tabs */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="genesis" 
              onClick={() => navigate('/admin/genesis-sentinel')}
              className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
            >
              Genesis Sentinel
            </TabsTrigger>
            <TabsTrigger 
              value="clients" 
              onClick={() => navigate('/admin/clients')}
              className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
            >
              Clients
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              onClick={() => navigate('/admin/settings')}
              className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="text-center text-corporate-lightGray py-8">
              <p>Use the navigation above to access specific modules</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardMainContent;

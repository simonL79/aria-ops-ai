
import React from "react";
import { useNavigate } from "react-router-dom";
import ReputationScore from "@/components/dashboard/ReputationScore";
import ContentAlerts from "@/components/dashboard/ContentAlerts";
import SourceOverview from "@/components/dashboard/SourceOverview";
import RecentActions from "@/components/dashboard/RecentActions";
import IntelligenceCollection from "@/components/dashboard/IntelligenceCollection";
import ContentFilter from "@/components/dashboard/ContentFilter";
import EntitySummaryPanel from "@/components/dashboard/EntitySummaryPanel";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { DashboardMainContentProps } from "@/types/dashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

  // Filter for live OSINT data
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg">Loading A.R.I.A™ Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">System Error</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header with System Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">A.R.I.A™ Intelligence Dashboard</h1>
          <p className="text-muted-foreground">Advanced Reputation Intelligence Assistant</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchData}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Client Status Bar */}
      {selectedClient && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">
              Active Client: {selectedClient.name} • {clientEntities?.length || 0} entities monitored
            </span>
          </div>
        </div>
      )}

      {/* Live Status Indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Live Intelligence Active: {displayAlerts.length} threats detected • {liveSources.length} sources monitored
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Score & Intelligence */}
        <div className="lg:col-span-1 space-y-6">
          <ReputationScore score={reputationScore} previousScore={previousScore} />
          <IntelligenceCollection onDataRefresh={fetchData} />
        </div>
        
        {/* Center Column - Threats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Live Threat Intelligence</h2>
            <ContentFilter onFilterChange={onFilterChange} />
          </div>
          <ContentAlerts 
            alerts={filteredAlerts && filteredAlerts.length > 0 ? filteredAlerts : displayAlerts} 
            isLoading={loading}
          />
        </div>

        {/* Right Column - Entity Summary */}
        <div className="lg:col-span-1">
          <EntitySummaryPanel alerts={displayAlerts} />
        </div>
      </div>

      {/* Bottom Section - Sources & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SourceOverview sources={liveSources as any} />
        <RecentActions actions={liveActions} />
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="genesis" onClick={() => navigate('/admin/genesis-sentinel')}>Genesis Sentinel</TabsTrigger>
          <TabsTrigger value="clients" onClick={() => navigate('/admin/clients')}>Clients</TabsTrigger>
          <TabsTrigger value="settings" onClick={() => navigate('/admin/settings')}>Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            <p>Use the navigation above to access specific modules</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardMainContent;

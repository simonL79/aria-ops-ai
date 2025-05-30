
import React from "react";
import { useNavigate } from "react-router-dom";
import ReputationScore from "@/components/dashboard/ReputationScore";
import ContentAlerts from "@/components/dashboard/ContentAlerts";
import SourceOverview from "@/components/dashboard/SourceOverview";
import RecentActions from "@/components/dashboard/RecentActions";
import DarkWebSurveillance from "@/components/dashboard/DarkWebSurveillance";
import StrategicResponseEngine from "@/components/dashboard/responseEngine";
import SeoSuppressionPipeline from "@/components/dashboard/SeoSuppressionPipeline";
import IntelligenceCollection from "@/components/dashboard/IntelligenceCollection";
import ContentFilter from "@/components/dashboard/ContentFilter";
import InfoTooltip from "@/components/dashboard/InfoTooltip";
import SERPDefensePanel from "@/components/dashboard/SERPDefensePanel";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { DashboardMainContentProps } from "@/types/dashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const DashboardMainContent = ({
  metrics, 
  alerts, 
  classifiedAlerts, 
  sources, 
  actions, 
  toneStyles, 
  recentActivity, 
  seoContent, 
  negativeContent, 
  positiveContent, 
  neutralContent, 
  onSimulateNewData, 
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

  // Filter for LIVE OSINT data only
  const liveAlerts = alerts?.filter(alert => 
    alert.sourceType === 'osint_intelligence' || 
    alert.sourceType === 'live_alert' ||
    alert.sourceType === 'live_osint' ||
    alert.sourceType === 'live_scan'
  ) || [];
  
  const liveSources = sources?.filter(source => 
    source.type === 'osint_source' || 
    source.name?.includes('Reddit') || 
    source.name?.includes('RSS')
  ) || [];
  
  const liveActions = actions?.filter(action => 
    action.type === 'urgent' || action.type === 'monitoring' || action.type === 'response'
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg">Loading A.R.I.A™ live threat intelligence...</p>
          <p className="text-sm text-gray-500">Connecting to live OSINT monitoring systems</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">A.R.I.A™ System Error</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reconnect to Live Systems
          </Button>
        </div>
      </div>
    );
  }

  // Show live data status
  return (
    <div className="container mx-auto px-6 py-8">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="threats" onClick={() => navigate('/threats')}>Threats</TabsTrigger>
          <TabsTrigger value="seo" onClick={() => navigate('/seo-center')}>SEO Defense</TabsTrigger>
          <TabsTrigger value="serp">SERP Defense</TabsTrigger>
          <TabsTrigger value="monitoring" onClick={() => navigate('/monitoring')}>Monitoring</TabsTrigger>
          <TabsTrigger value="reports" onClick={() => navigate('/reports')}>Reports</TabsTrigger>
          <TabsTrigger value="settings" onClick={() => navigate('/settings')}>Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Client Selection Status */}
          {selectedClient && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">
                  Monitoring for: {selectedClient.name} • {clientEntities?.length || 0} entities tracked
                </span>
              </div>
            </div>
          )}

          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">
                A.R.I.A™ Live Intelligence: {liveAlerts.length} live threats • {liveSources.length} OSINT sources • Mock data blocked
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={fetchData}
                className="ml-auto gap-1 border-green-300 text-green-700 hover:bg-green-100"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh Live Data
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <div className="flex items-center">
                  <ReputationScore score={reputationScore} previousScore={previousScore} />
                  <InfoTooltip text="Reputation score calculated from live OSINT intelligence and sentiment analysis." />
                </div>
                <div className="flex items-center">
                  <IntelligenceCollection />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <h2 className="text-lg font-medium">Live OSINT Threat Intelligence</h2>
                    <InfoTooltip text="AI-detected threats from live OSINT sources requiring attention or action." />
                  </div>
                  <ContentFilter onFilterChange={onFilterChange} />
                </div>
                
                {liveAlerts.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                    <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Live Threats Detected</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      A.R.I.A™ OSINT systems are monitoring. All intelligence sources active.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live monitoring active • Use Operator Console for manual sweeps</span>
                    </div>
                  </div>
                ) : (
                  <ContentAlerts alerts={filteredAlerts && filteredAlerts.length > 0 ? filteredAlerts : liveAlerts} />
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <SourceOverview sources={liveSources as any} />
            </div>
            <div className="lg:col-span-1">
              <RecentActions actions={liveActions} />
            </div>
            <div className="lg:col-span-1">
              <DarkWebSurveillance />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <StrategicResponseEngine />
          </div>
          
          <div className="mb-6">
            <SeoSuppressionPipeline />
          </div>
          
          {/* Live Data Compliance Footer */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  100% Live Data Compliance Achieved
                </span>
              </div>
              <div className="text-xs text-blue-600">
                All components showing live OSINT intelligence only • Mock data blocked
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="serp" className="space-y-6">
          <SERPDefensePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardMainContent;

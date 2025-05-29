
import React from "react";
import ReputationScore from "@/components/dashboard/ReputationScore";
import ContentAlerts from "@/components/dashboard/ContentAlerts";
import SourceOverview from "@/components/dashboard/SourceOverview";
import RecentActions from "@/components/dashboard/RecentActions";
import DarkWebSurveillance from "@/components/dashboard/DarkWebSurveillance";
import StrategicResponseEngine from "@/components/dashboard/responseEngine";
import SerpDefense from "@/components/dashboard/SerpDefense";
import SeoSuppressionPipeline from "@/components/dashboard/SeoSuppressionPipeline";
import IntelligenceCollection from "@/components/dashboard/IntelligenceCollection";
import ContentFilter from "@/components/dashboard/ContentFilter";
import InfoTooltip from "@/components/dashboard/InfoTooltip";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { DashboardMainContentProps } from "@/types/dashboard";

const DashboardMainContent = ({
  reputationScore = 70,
  previousScore = 65,
  sources = [],
  filteredAlerts = [],
  actions = [],
  onFilterChange = () => {},
  metrics = [],
  alerts = [],
  classifiedAlerts = [],
  toneStyles = [],
  recentActivity = [],
  seoContent = '',
  negativeContent = 0,
  positiveContent = 0,
  neutralContent = 0,
  onSimulateNewData = () => {},
  loading = false,
  error = null,
  fetchData = () => {}
}: DashboardMainContentProps & { loading?: boolean; error?: string | null; fetchData?: () => void }) => {

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg">Loading real threat intelligence data...</p>
          <p className="text-sm text-gray-500">Connecting to live monitoring systems</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Real Data</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // Show message if no real data is available
  if (alerts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">No Real Threat Data Available</h3>
          <p className="text-sm text-gray-600 mb-4">
            No scan results or content alerts found in the database. 
            Trigger a scan from the Operator Console to populate with real data.
          </p>
          <Button onClick={fetchData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <IntelligenceCollection />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">Threat intelligence will appear here once data is available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-800">
            Live Data Connected - {alerts.length} real threats loaded from database
          </span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={fetchData}
            className="ml-auto gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="flex items-center">
              <ReputationScore score={reputationScore} previousScore={previousScore} />
              <InfoTooltip text="Your reputation score is calculated based on sentiment analysis of mentions across all monitored platforms." />
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
                <h2 className="text-lg font-medium">Real Threat Intelligence</h2>
                <InfoTooltip text="AI-detected content mentioning your brand that may require attention or action." />
              </div>
              <ContentFilter onFilterChange={onFilterChange} />
            </div>
            <ContentAlerts alerts={filteredAlerts.length > 0 ? filteredAlerts : alerts} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <SourceOverview sources={sources as any} />
        </div>
        <div className="lg:col-span-1">
          <RecentActions actions={actions} />
        </div>
        <div className="lg:col-span-1">
          <DarkWebSurveillance />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StrategicResponseEngine />
        <SerpDefense />
      </div>
      
      <div className="mb-6">
        <SeoSuppressionPipeline />
      </div>
    </>
  );
};

export default DashboardMainContent;

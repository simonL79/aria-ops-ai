
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
import { ContentAlert, ContentSource, ContentAction } from "@/types/dashboard";

interface DashboardMainContentProps {
  reputationScore: number;
  previousScore: number;
  sources: ContentSource[];
  filteredAlerts: ContentAlert[];
  actions: ContentAction[];
  onFilterChange: (filters: { platforms: string[]; severities: string[]; statuses: string[] }) => void;
}

const DashboardMainContent = ({
  reputationScore,
  previousScore,
  sources,
  filteredAlerts,
  actions,
  onFilterChange
}: DashboardMainContentProps) => {
  return (
    <>
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
                <h2 className="text-lg font-medium">Threat Intelligence</h2>
                <InfoTooltip text="AI-detected content mentioning your brand that may require attention or action." />
              </div>
              <ContentFilter onFilterChange={onFilterChange} />
            </div>
            <ContentAlerts alerts={filteredAlerts} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <SourceOverview sources={sources} />
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

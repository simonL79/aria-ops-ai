
import { useState } from 'react';
import { ThreatClassificationResult } from "@/services/openaiService";
import { IntelligenceReport, ThreatVector, DataSourceStats } from "@/types/intelligence";
import ThreatAnalysisHub from "@/components/dashboard/ThreatAnalysisHub";
import DarkWebSurveillance from "@/components/dashboard/DarkWebSurveillance";
import IntelligenceDashboardContainer from "@/components/dashboard/IntelligenceDashboardContainer";
import ActiveMonitoring from "@/components/dashboard/intelligence-sections/ActiveMonitoring";
import TrendAnalysis from "@/components/dashboard/intelligence-sections/TrendAnalysis";

// Sample data for MVP
const sampleReport: IntelligenceReport = {
  id: "rep-1",
  title: "Weekly Reputation Analysis",
  date: "May 18, 2025",
  summary: "Overall positive sentiment with isolated negative mentions. One coordinated attack identified from competitor sources.",
  threatLevel: 4.2,
  topics: ["Customer Service", "Product Quality", "Pricing", "Delivery Times"],
  sources: 7,
  mentions: 156,
  sentiment: {
    positive: 62,
    neutral: 21,
    negative: 17
  }
};

const threatVectors: ThreatVector[] = [
  {
    type: "coordinatedAttack",
    count: 1,
    severity: 8,
    trend: "increasing",
    examples: ["Multiple identical negative posts appeared across platforms within 30 minutes"]
  },
  {
    type: "falseReviews",
    count: 12,
    severity: 6,
    trend: "stable",
    examples: ["Reviews mentioning products we don't sell", "Reviews from users who purchased elsewhere"]
  },
  {
    type: "misinformation",
    count: 5,
    severity: 7,
    trend: "decreasing",
    examples: ["False claims about manufacturing locations", "Incorrect statements about ingredients"]
  }
];

const sourceStats: DataSourceStats[] = [
  { source: "Twitter", mentions: 78, sentiment: -2, coverage: 85 },
  { source: "Reddit", mentions: 34, sentiment: 4, coverage: 70 },
  { source: "Google News", mentions: 12, sentiment: 1, coverage: 90 },
  { source: "Review Sites", mentions: 32, sentiment: -5, coverage: 60 }
];

interface IntelligenceDashboardProps {
  onAlertDetected?: (alert: ThreatClassificationResult) => void;
}

const IntelligenceDashboard = ({ onAlertDetected }: IntelligenceDashboardProps) => {
  // Prevent default on form submissions to avoid page refreshes
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process form data here
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="col-span-1 md:col-span-2 space-y-6">
        <IntelligenceDashboardContainer 
          sampleReport={sampleReport}
          threatVectors={threatVectors}
          sourceStats={sourceStats}
          onFormSubmit={handleFormSubmit}
        />
        
        <ThreatAnalysisHub />
      </div>
      
      {/* Right Column */}
      <div className="space-y-6">
        <ActiveMonitoring />
        
        <DarkWebSurveillance />
        
        <TrendAnalysis />
      </div>
    </div>
  );
};

export default IntelligenceDashboard;

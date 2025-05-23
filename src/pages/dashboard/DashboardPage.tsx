
import React from 'react';
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMainContent from "@/components/dashboard/DashboardMainContent";
import { MetricValue, ContentAlert, ContentSource, ContentAction } from "@/types/dashboard";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  onRefresh?: () => Promise<void>;
  totalAlerts?: number;
  highSeverityAlerts?: number;
}

interface DashboardMainContentProps {
  metrics?: MetricValue[];
  alerts?: ContentAlert[];
  classifiedAlerts?: ContentAlert[];
  sources?: ContentSource[];
  actions?: ContentAction[];
  toneStyles?: any;
  recentActivity?: any;
  seoContent?: any;
  negativeContent?: number;
  positiveContent?: number;
  neutralContent?: number;
  onSimulateNewData?: (scanResults: any[]) => void;
}

const DashboardPage = () => {
  const {
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
    loading,
    error,
    fetchData,
    simulateNewData,
  } = useDashboardData();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Dashboard"
        description="Overview of your reputation monitoring"
        totalAlerts={alerts.length}
        highSeverityAlerts={alerts.filter(alert => alert.severity === 'high').length}
      />
      <DashboardMainContent
        metrics={metrics}
        alerts={alerts}
        classifiedAlerts={classifiedAlerts}
        sources={sources}
        actions={actions}
        toneStyles={toneStyles}
        recentActivity={recentActivity}
        seoContent={seoContent}
        negativeContent={negativeContent}
        positiveContent={positiveContent}
        neutralContent={neutralContent}
        onSimulateNewData={simulateNewData}
      />
    </div>
  );
};

export default DashboardPage;

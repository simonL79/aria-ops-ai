import React from 'react';
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMainContent from "@/components/dashboard/DashboardMainContent";

// Update or add the necessary interface definitions for DashboardHeaderProps
interface DashboardHeaderProps {
  onRefresh?: () => Promise<void>;
  totalAlerts: number;
  highSeverityAlerts: number;
  // Add any other required props
}

// Update or add the necessary interface definitions for DashboardMainContentProps
interface DashboardMainContentProps {
  metrics: MetricValue[];
  alerts: ContentAlert[];
  classifiedAlerts: ContentAlert[];
  sources: ContentSource[];
  actions: ContentAction[];
  // Add any other required props
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
        onRefresh={fetchData}
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


import React from 'react';
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMainContent from "@/components/dashboard/DashboardMainContent";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="A.R.I.A™ Threat Intelligence Dashboard"
        description="Real-time reputation monitoring and threat detection"
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
        loading={loading}
        error={error}
        fetchData={fetchData}
        filteredAlerts={alerts} // Show all alerts by default
        onFilterChange={() => {}} // Add filter functionality if needed
      />
    </div>
  );
};

export default DashboardPage;

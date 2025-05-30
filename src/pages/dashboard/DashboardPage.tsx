
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardMainContent from "@/components/dashboard/DashboardMainContent";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import LiveDataGuard from "@/components/dashboard/LiveDataGuard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useClientSelection } from "@/hooks/useClientSelection";
import { useState } from "react";

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
    simulateNewData
  } = useDashboardData();

  const { selectedClient, clientEntities } = useClientSelection();
  const [filteredAlerts, setFilteredAlerts] = useState(alerts);

  const handleFilterChange = (filtered: any[]) => {
    setFilteredAlerts(filtered);
  };

  return (
    <DashboardLayout>
      <LiveDataGuard enforceStrict={true}>
        <div className="space-y-6">
          <MetricsOverview metrics={metrics} loading={loading} />
          
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
            filteredAlerts={filteredAlerts}
            onFilterChange={handleFilterChange}
            selectedClient={selectedClient}
            clientEntities={clientEntities}
          />
        </div>
      </LiveDataGuard>
    </DashboardLayout>
  );
};

export default DashboardPage;

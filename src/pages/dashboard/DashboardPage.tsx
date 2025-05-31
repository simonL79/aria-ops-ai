
import React, { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardMainContent from "@/components/dashboard/DashboardMainContent";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import LiveDataGuard from "@/components/dashboard/LiveDataGuard";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useClientSelection } from "@/hooks/useClientSelection";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

const DashboardPage = () => {
  // Performance monitoring
  const { measureRenderTime } = usePerformanceMonitor('DashboardPage');

  const {
    metrics,
    alerts,
    sources,
    actions,
    loading,
    error,
    fetchData
  } = useDashboardData();

  const { selectedClient, clientEntities } = useClientSelection();
  const [filteredAlerts, setFilteredAlerts] = useState(alerts);

  const handleFilterChange = (filters: { platforms: string[]; severities: string[]; statuses: string[]; }) => {
    const endMeasure = measureRenderTime('filterChange');
    
    let filtered = alerts;
    
    if (filters.platforms.length > 0) {
      filtered = filtered.filter(alert => filters.platforms.includes(alert.platform));
    }
    
    if (filters.severities.length > 0) {
      filtered = filtered.filter(alert => filters.severities.includes(alert.severity));
    }
    
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(alert => filters.statuses.includes(alert.status));
    }
    
    setFilteredAlerts(filtered);
    endMeasure();
  };

  return (
    <DashboardLayout>
      <LiveDataGuard enforceStrict={true}>
        <ResponsiveLayout>
          <div className="space-y-4 sm:space-y-6">
            <MetricsOverview metrics={metrics} loading={loading} />
            
            <DashboardMainContent
              metrics={metrics}
              alerts={alerts}
              sources={sources}
              actions={actions}
              loading={loading}
              error={error}
              fetchData={fetchData}
              filteredAlerts={filteredAlerts}
              onFilterChange={handleFilterChange}
              selectedClient={selectedClient}
              clientEntities={clientEntities}
            />
          </div>
        </ResponsiveLayout>
      </LiveDataGuard>
    </DashboardLayout>
  );
};

export default DashboardPage;

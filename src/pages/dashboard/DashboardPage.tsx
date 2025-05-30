
import React, { useState } from 'react';
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMainContent from "@/components/dashboard/DashboardMainContent";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClientSelector from "@/components/admin/ClientSelector";
import type { Client } from '@/types/clients';

const DashboardPage = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientEntities, setClientEntities] = useState<any[]>([]);
  
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

  // Only show live data metrics
  const liveAlerts = alerts.filter(alert => 
    alert.sourceType === 'osint_intelligence' || 
    alert.sourceType === 'live_alert' ||
    alert.sourceType === 'live_osint'
  );

  const highSeverityLiveAlerts = liveAlerts.filter(alert => alert.severity === 'high').length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader 
          title="A.R.I.A™ Live Threat Intelligence Dashboard"
          description="Real-time reputation monitoring and threat detection from live OSINT sources"
          onRefresh={fetchData}
          totalAlerts={liveAlerts.length}
          highSeverityAlerts={highSeverityLiveAlerts}
        />
        
        {/* Client Selection Section */}
        <div className="container mx-auto px-6 py-4">
          <ClientSelector
            selectedClient={selectedClient}
            onClientSelect={setSelectedClient}
            onEntitiesLoad={setClientEntities}
          />
        </div>

        <DashboardMainContent
          metrics={metrics}
          alerts={liveAlerts}
          classifiedAlerts={liveAlerts}
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
          filteredAlerts={liveAlerts}
          onFilterChange={() => {}}
          reputationScore={75}
          previousScore={70}
          selectedClient={selectedClient}
          clientEntities={clientEntities}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

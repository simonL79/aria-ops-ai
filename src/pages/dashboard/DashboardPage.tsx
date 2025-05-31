
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardMainContent from '@/components/dashboard/DashboardMainContent';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardScan } from '@/hooks/useDashboardScan';
import { ContentAlert } from '@/types/dashboard';
import { performComprehensiveScan } from '@/services/monitoring/monitoringScanService';
import { toast } from 'sonner';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientEntities, setClientEntities] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState<ContentAlert[]>([]);
  
  const {
    alerts,
    sources,
    actions,
    metrics,
    loading,
    error,
    fetchData,
    setAlerts
  } = useDashboardData();

  const { isScanning, performScan } = useDashboardScan(alerts, setAlerts);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [user, navigate, fetchData]);

  const handleSimulateNewData = async () => {
    try {
      toast.info("Starting live intelligence scan...");
      const results = await performComprehensiveScan();
      if (results.length > 0) {
        fetchData(); // Refresh dashboard data
        toast.success(`Scan complete: ${results.length} intelligence items found`);
      } else {
        toast.info("No new intelligence detected");
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error("Intelligence scan failed");
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = alerts;
    
    if (filters.severity && filters.severity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }
    
    if (filters.platform && filters.platform !== 'all') {
      filtered = filtered.filter(alert => alert.platform === filters.platform);
    }
    
    setFilteredAlerts(filtered);
  };

  // Convert metrics to match dashboard types
  const convertedMetrics = metrics.map(metric => ({
    ...metric,
    value: typeof metric.value === 'string' ? 0 : metric.value
  }));

  // Calculate content arrays from alerts
  const negativeContent = alerts.filter(alert => alert.sentiment === 'negative');
  const positiveContent = alerts.filter(alert => alert.sentiment === 'positive');  
  const neutralContent = alerts.filter(alert => alert.sentiment === 'neutral');

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardMainContent
        metrics={convertedMetrics}
        alerts={alerts}
        classifiedAlerts={alerts}
        sources={sources}
        actions={actions}
        toneStyles={[]}
        recentActivity={[]}
        seoContent={[]}
        negativeContent={negativeContent.length}
        positiveContent={positiveContent.length}
        neutralContent={neutralContent.length}
        onSimulateNewData={handleSimulateNewData}
        loading={loading}
        error={error}
        fetchData={fetchData}
        filteredAlerts={filteredAlerts}
        onFilterChange={handleFilterChange}
        reputationScore={75}
        previousScore={70}
        selectedClient={selectedClient}
        clientEntities={clientEntities}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;

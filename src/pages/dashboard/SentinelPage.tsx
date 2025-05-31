
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SentinelProtocolDashboard from '@/components/sentinel/SentinelProtocolDashboard';

const SentinelPage = () => {
  return (
    <DashboardLayout>
      <SentinelProtocolDashboard />
    </DashboardLayout>
  );
};

export default SentinelPage;

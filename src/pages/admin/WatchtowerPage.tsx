
import React from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WatchtowerDashboard from '@/components/watchtower/WatchtowerDashboard';

const WatchtowerPage = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>A.R.I.A™ Watchtower - Threat Discovery & Intelligence</title>
        <meta name="description" content="Advanced threat discovery and intelligence gathering system" />
      </Helmet>
      
      <WatchtowerDashboard />
    </DashboardLayout>
  );
};

export default WatchtowerPage;

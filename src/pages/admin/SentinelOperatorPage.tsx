
import React from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OperatorConsole from '@/components/operator/OperatorConsole';

const SentinelOperatorPage = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>A.R.I.A™ Genesis Sentinel - Advanced Threat Detection</title>
        <meta name="description" content="Genesis Sentinel operator console for advanced threat detection and response" />
      </Helmet>
      
      <OperatorConsole />
    </DashboardLayout>
  );
};

export default SentinelOperatorPage;

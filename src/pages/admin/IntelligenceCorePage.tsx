
import React from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ThreatAnalysisHub from '@/components/dashboard/ThreatAnalysisHub';
import AdvancedIntelligencePanel from '@/components/dashboard/AdvancedIntelligencePanel';

const IntelligenceCorePage = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>A.R.I.A™ Intelligence Core - Advanced AI Analysis</title>
        <meta name="description" content="Advanced AI-powered threat analysis and intelligence processing" />
      </Helmet>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ThreatAnalysisHub />
        <AdvancedIntelligencePanel />
      </div>
    </DashboardLayout>
  );
};

export default IntelligenceCorePage;

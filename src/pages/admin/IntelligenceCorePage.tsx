
import React from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ThreatAnalysisHub from '@/components/dashboard/ThreatAnalysisHub';
import AdvancedIntelligencePanel from '@/components/dashboard/AdvancedIntelligencePanel';
import ThreatAnalysisPanel from '@/components/intelligence/ThreatAnalysisPanel';
import ThreatCorrelationPanel from '@/components/intelligence/ThreatCorrelationPanel';
import LiveIntelligenceDashboard from '@/components/intelligence/LiveIntelligenceDashboard';

const IntelligenceCorePage = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>A.R.I.A™ Intelligence Core - Advanced AI Analysis</title>
        <meta name="description" content="Advanced AI-powered threat analysis and intelligence processing" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Live Intelligence Dashboard */}
        <LiveIntelligenceDashboard />
        
        {/* Threat Analysis Hub and Advanced Intelligence Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ThreatAnalysisHub />
          <AdvancedIntelligencePanel />
        </div>
        
        {/* Live Threat Analysis Panel */}
        <ThreatAnalysisPanel />
        
        {/* Threat Correlation Panel */}
        <ThreatCorrelationPanel 
          selectedThreats={[]} 
          onCaseCreated={(caseThread) => {
            console.log('Case thread created:', caseThread);
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default IntelligenceCorePage;

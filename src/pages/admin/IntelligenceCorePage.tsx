
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ThreatAnalysisHub from '@/components/dashboard/ThreatAnalysisHub';
import AdvancedIntelligencePanel from '@/components/dashboard/AdvancedIntelligencePanel';

const IntelligenceCorePage = () => {
  return (
    <>
      <Helmet>
        <title>A.R.I.A™ Intelligence Core - Advanced AI Analysis</title>
        <meta name="description" content="Advanced AI-powered threat analysis and intelligence processing" />
      </Helmet>
      
      <div className="min-h-screen bg-corporate-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold corporate-heading">A.R.I.A™ Intelligence Core</h1>
            <p className="corporate-subtext mt-2">
              Advanced AI-Powered Threat Analysis & Intelligence Processing
            </p>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ThreatAnalysisHub />
            <AdvancedIntelligencePanel />
          </div>
        </div>
      </div>
    </>
  );
};

export default IntelligenceCorePage;

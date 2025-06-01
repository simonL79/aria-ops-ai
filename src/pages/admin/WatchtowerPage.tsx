
import React from 'react';
import { Helmet } from 'react-helmet-async';
import WatchtowerDashboard from '@/components/watchtower/WatchtowerDashboard';

const WatchtowerPage = () => {
  return (
    <>
      <Helmet>
        <title>A.R.I.A™ Watchtower - Threat Discovery & Intelligence</title>
        <meta name="description" content="Advanced threat discovery and intelligence gathering system" />
      </Helmet>
      
      <div className="min-h-screen bg-corporate-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold corporate-heading">A.R.I.A™ Watchtower</h1>
            <p className="corporate-subtext mt-2">
              Advanced Threat Discovery & Intelligence Gathering System
            </p>
          </div>
          
          <WatchtowerDashboard />
        </div>
      </div>
    </>
  );
};

export default WatchtowerPage;

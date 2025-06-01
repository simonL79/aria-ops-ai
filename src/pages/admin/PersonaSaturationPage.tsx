
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PersonaSaturationPanel from '@/components/admin/PersonaSaturationPanel';

const PersonaSaturationPage = () => {
  return (
    <>
      <Helmet>
        <title>A.R.I.A™ Persona Saturation - Content Deployment Engine</title>
        <meta name="description" content="Advanced persona saturation and content deployment system" />
      </Helmet>
      
      <div className="min-h-screen bg-corporate-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold corporate-heading">A.R.I.A™ Persona Saturation</h1>
            <p className="corporate-subtext mt-2">
              Advanced Content Deployment & Reputation Management Engine
            </p>
          </div>
          
          <PersonaSaturationPanel />
        </div>
      </div>
    </>
  );
};

export default PersonaSaturationPage;

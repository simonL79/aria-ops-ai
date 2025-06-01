
import React from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PersonaSaturationPanel from '@/components/admin/PersonaSaturationPanel';

const PersonaSaturationPage = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>A.R.I.A™ Persona Saturation - Content Deployment Engine</title>
        <meta name="description" content="Advanced persona saturation and content deployment system" />
      </Helmet>
      
      <PersonaSaturationPanel />
    </DashboardLayout>
  );
};

export default PersonaSaturationPage;

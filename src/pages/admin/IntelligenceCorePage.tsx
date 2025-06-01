
import React from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/DashboardLayout';
import IntelligenceHub from '@/components/aria/IntelligenceHub';

const IntelligenceCorePage = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>A.R.I.A™ Intelligence Core - Advanced Intelligence Hub</title>
        <meta name="description" content="Advanced intelligence gathering and analysis system" />
      </Helmet>
      
      <IntelligenceHub />
    </DashboardLayout>
  );
};

export default IntelligenceCorePage;

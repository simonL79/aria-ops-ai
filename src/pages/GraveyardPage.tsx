
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import GraveyardDashboard from "@/components/graveyard/GraveyardDashboard";

const GraveyardPage = () => {
  return (
    <DashboardLayout>
      <GraveyardDashboard />
    </DashboardLayout>
  );
};

export default GraveyardPage;

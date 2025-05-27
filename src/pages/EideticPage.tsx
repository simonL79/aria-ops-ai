
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import EideticDashboard from "@/components/graveyard/GraveyardDashboard";

const EideticPage = () => {
  return (
    <DashboardLayout>
      <EideticDashboard />
    </DashboardLayout>
  );
};

export default EideticPage;

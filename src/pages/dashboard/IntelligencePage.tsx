
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import IntelligenceDashboard from "@/components/dashboard/IntelligenceDashboard";
import { Button } from "@/components/ui/button";

const IntelligencePage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Threat Intelligence</h1>
        <p className="text-muted-foreground">
          Monitor and analyze potential threats to client reputation across all digital channels
        </p>
      </div>
      
      <IntelligenceDashboard />
    </DashboardLayout>
  );
};

export default IntelligencePage;

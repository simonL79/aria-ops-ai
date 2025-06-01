
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import SystemOptimizationDashboard from '@/components/admin/SystemOptimizationDashboard';

const SystemOptimizationPage = () => {
  return (
    <DashboardLayout>
      <ResponsiveLayout className="bg-corporate-dark min-h-screen">
        <div className="container mx-auto py-6">
          <SystemOptimizationDashboard />
        </div>
      </ResponsiveLayout>
    </DashboardLayout>
  );
};

export default SystemOptimizationPage;


import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import SystemOptimizationDashboard from '@/components/admin/SystemOptimizationDashboard';

const SystemOptimizationPage = () => {
  return (
    <DashboardLayout>
      <ResponsiveLayout className="bg-black min-h-screen">
        <div className="container mx-auto py-6 bg-black text-white">
          <SystemOptimizationDashboard />
        </div>
      </ResponsiveLayout>
    </DashboardLayout>
  );
};

export default SystemOptimizationPage;

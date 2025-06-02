
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QATestDashboard from '@/components/admin/QATestDashboard';

const QATestPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 bg-black text-white min-h-screen">
        <QATestDashboard />
      </div>
    </DashboardLayout>
  );
};

export default QATestPage;

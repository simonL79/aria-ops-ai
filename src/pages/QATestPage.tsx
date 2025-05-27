
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QATestDashboard from '@/components/admin/QATestDashboard';

const QATestPage = () => {
  return (
    <DashboardLayout>
      <QATestDashboard />
    </DashboardLayout>
  );
};

export default QATestPage;

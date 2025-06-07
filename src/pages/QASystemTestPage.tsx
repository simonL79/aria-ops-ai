
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { QATestRunner } from '@/components/admin/qa/QATestRunner';

const QASystemTestPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <QATestRunner />
      </div>
    </DashboardLayout>
  );
};

export default QASystemTestPage;

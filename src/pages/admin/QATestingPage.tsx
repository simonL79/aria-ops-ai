
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QATestingDashboard from '@/components/qa/QATestingDashboard';

const QATestingPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-corporate-dark min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 corporate-heading">
              A.R.I.A™ QA Master Plan
            </h1>
            <p className="corporate-subtext mt-1">
              Comprehensive Quality Assurance & System Validation
            </p>
          </div>
        </div>

        <QATestingDashboard />
      </div>
    </DashboardLayout>
  );
};

export default QATestingPage;

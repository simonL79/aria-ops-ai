
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ComprehensiveSystemCheck from '@/components/system/ComprehensiveSystemCheck';

const SystemCheckPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <ComprehensiveSystemCheck />
      </div>
    </DashboardLayout>
  );
};

export default SystemCheckPage;

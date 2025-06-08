
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { AIServiceControl } from '@/components/admin/AIServiceControl';

const AIControlPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Service Control
          </h1>
          <p className="text-corporate-lightGray">
            Manage hybrid AI services with local fallback capabilities
          </p>
        </div>
        
        <AIServiceControl />
      </div>
    </DashboardLayout>
  );
};

export default AIControlPage;

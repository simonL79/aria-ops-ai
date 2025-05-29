
import React from 'react';
import SystemConfigurationPanel from '../aria/SystemConfigurationPanel';

const SystemConfigurationTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Configuration</h2>
          <p className="text-[#D8DEE9]/60">
            Configure A.R.I.A™ for live operations and manage system settings
          </p>
        </div>
      </div>
      
      <SystemConfigurationPanel />
    </div>
  );
};

export default SystemConfigurationTab;

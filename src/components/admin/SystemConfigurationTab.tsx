
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SystemConfigurationPanel from '../aria/SystemConfigurationPanel';
import AnubisAuditLogViewer from './AnubisAuditLogViewer';

const SystemConfigurationTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Configuration</h2>
          <p className="text-[#D8DEE9]/60">
            Configure A.R.I.A™ for live operations and review compliance audit logs
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="configuration" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#1C1C1E]/50 border border-[#247CFF]/20">
          <TabsTrigger 
            value="configuration"
            className="data-[state=active]:bg-[#247CFF] data-[state=active]:text-white text-[#D8DEE9]/60"
          >
            System Configuration
          </TabsTrigger>
          <TabsTrigger 
            value="audit"
            className="data-[state=active]:bg-[#247CFF] data-[state=active]:text-white text-[#D8DEE9]/60"
          >
            Anubis Audit Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="mt-6">
          <SystemConfigurationPanel />
        </TabsContent>
        
        <TabsContent value="audit" className="mt-6">
          <AnubisAuditLogViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfigurationTab;

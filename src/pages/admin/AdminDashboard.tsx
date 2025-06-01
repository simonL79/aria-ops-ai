
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PersonaSaturationPanel from '@/components/admin/PersonaSaturationPanel';
import { Shield, Globe, Users, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold corporate-heading">Admin Dashboard</h1>
          <p className="corporate-subtext mt-1">
            Administrative controls and system management
          </p>
        </div>

        <Tabs defaultValue="persona-saturation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="persona-saturation" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Globe className="h-4 w-4 mr-2" />
              Persona Saturation
            </TabsTrigger>
            <TabsTrigger value="threat-management" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Shield className="h-4 w-4 mr-2" />
              Threat Management
            </TabsTrigger>
            <TabsTrigger value="user-management" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="persona-saturation">
            <PersonaSaturationPanel />
          </TabsContent>

          <TabsContent value="threat-management">
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
              <h3 className="text-lg font-medium text-white mb-2">Threat Management</h3>
              <p className="text-corporate-lightGray">Coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="user-management">
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
              <h3 className="text-lg font-medium text-white mb-2">User Management</h3>
              <p className="text-corporate-lightGray">Coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
              <h3 className="text-lg font-medium text-white mb-2">Analytics</h3>
              <p className="text-corporate-lightGray">Coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;


import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-black text-white min-h-screen p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">System Settings</h1>
            <p className="text-gray-300">
              Configure system preferences and administrative settings
            </p>
          </div>
        </div>

        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5" />
              Administrative Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              System configuration interface coming soon. This will include user management, 
              security settings, and system preferences.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

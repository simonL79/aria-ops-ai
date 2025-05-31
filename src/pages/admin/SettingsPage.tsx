
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground">
              Configure system preferences and administrative settings
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Administrative Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
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

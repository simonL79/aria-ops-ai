
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Shield, Database, Bell } from 'lucide-react';

const SystemSettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-corporate-lightGray">Configure A.R.I.A™ system preferences and security</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-corporate-accent" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-corporate-lightGray">
              <p>Configure authentication, access controls, and security policies.</p>
            </CardContent>
          </Card>

          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-corporate-accent" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="text-corporate-lightGray">
              <p>Manage data retention, backup schedules, and compliance settings.</p>
            </CardContent>
          </Card>

          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-corporate-accent" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="text-corporate-lightGray">
              <p>Configure alert thresholds, notification channels, and escalation rules.</p>
            </CardContent>
          </Card>

          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-corporate-accent" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="text-corporate-lightGray">
              <p>General system configuration and operational parameters.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white">Configuration Options</CardTitle>
          </CardHeader>
          <CardContent className="text-corporate-lightGray">
            <p>Advanced system configuration panel for A.R.I.A™ administrators.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SystemSettingsPage;

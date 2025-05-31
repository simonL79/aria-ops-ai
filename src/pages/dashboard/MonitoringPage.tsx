
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

const MonitoringPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-600" />
              Live Monitoring
            </h1>
            <p className="text-gray-600 mt-2">Real-time threat monitoring and analysis</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monitoring Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Live monitoring capabilities coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MonitoringPage;

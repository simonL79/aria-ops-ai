
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const ClientsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
            <p className="text-muted-foreground">
              Manage client accounts and configurations
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Client management interface coming soon. This will include client onboarding, 
              account management, and monitoring configuration.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage;

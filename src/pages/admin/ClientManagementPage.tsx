
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building, Settings } from 'lucide-react';

const ClientManagementPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
          <p className="text-corporate-lightGray">Manage client entities and campaigns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-corporate-accent" />
                Active Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-corporate-accent">12</div>
              <p className="text-corporate-lightGray text-sm">Currently monitored</p>
            </CardContent>
          </Card>

          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building className="h-5 w-5 text-corporate-accent" />
                Entities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-corporate-accent">47</div>
              <p className="text-corporate-lightGray text-sm">Total entities</p>
            </CardContent>
          </Card>

          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-corporate-accent" />
                Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-corporate-accent">23</div>
              <p className="text-corporate-lightGray text-sm">Active campaigns</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white">Client Management Features</CardTitle>
          </CardHeader>
          <CardContent className="text-corporate-lightGray">
            <p>This page will contain comprehensive client management functionality including:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Client entity management</li>
              <li>Campaign oversight</li>
              <li>Performance metrics</li>
              <li>Client communication tools</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClientManagementPage;

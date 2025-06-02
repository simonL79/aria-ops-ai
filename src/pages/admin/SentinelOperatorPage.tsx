
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import SentinelOperatorConsole from '@/components/admin/sentinel/SentinelOperatorConsole';

const SentinelOperatorPage = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-black text-white min-h-screen">
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-500 mb-2">Access Denied</h3>
              <p className="text-red-400">Sentinel Command requires administrative clearance</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-black text-white min-h-screen">
        <SentinelOperatorConsole />
      </div>
    </DashboardLayout>
  );
};

export default SentinelOperatorPage;

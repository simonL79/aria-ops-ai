
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

const DeploymentHistory = () => {
  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <History className="h-5 w-5 text-corporate-accent" />
          Deployment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <History className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
          <h3 className="text-lg font-medium text-white mb-2">No Deployment History</h3>
          <p className="text-corporate-lightGray">
            Deployment history will appear here after your first scheduled deployment runs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentHistory;

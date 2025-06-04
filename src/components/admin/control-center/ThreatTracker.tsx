
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Activity } from 'lucide-react';

interface ThreatTrackerProps {
  selectedEntity: string;
  serviceStatus: any;
}

const ThreatTracker: React.FC<ThreatTrackerProps> = ({
  selectedEntity,
  serviceStatus
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-corporate-accent" />
              Real-time Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Live threat monitoring for {selectedEntity || 'No entity selected'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-corporate-accent" />
              Priority Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Intelligent threat prioritization system
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-corporate-accent" />
              Response Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Response effectiveness monitoring
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThreatTracker;

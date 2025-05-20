
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ban, Bell } from 'lucide-react';
import { MonitoringStatus as StatusType } from '@/services/monitoring/types';

interface MonitoringStatusProps {
  status: StatusType;
  onStart: () => void;
  onStop: () => void;
}

const MonitoringStatus = ({ status, onStart, onStop }: MonitoringStatusProps) => {
  // Parse the string dates to show formatted time
  const nextRunTime = new Date(status.nextRun).toLocaleTimeString();
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">Monitoring Status</p>
        <p className="text-sm text-muted-foreground">
          {status.isActive 
            ? `Next automated scan at ${nextRunTime}`
            : 'Monitoring is currently disabled'}
        </p>
      </div>
      <div>
        {status.isActive ? (
          <Button variant="outline" size="sm" onClick={onStop}>
            <Ban className="mr-2 h-4 w-4" />
            Pause
          </Button>
        ) : (
          <Button size="sm" onClick={onStart}>
            <Bell className="mr-2 h-4 w-4" />
            Start
          </Button>
        )}
      </div>
    </div>
  );
};

export default MonitoringStatus;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Trash2 } from 'lucide-react';
import { ScheduledDeployment } from '@/services/deploymentScheduler';

interface ScheduleItemProps {
  schedule: ScheduledDeployment;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

const ScheduleItem = ({ schedule, onToggleStatus, onDelete }: ScheduleItemProps) => {
  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
    ) : (
      <Badge className="bg-gray-500/20 text-gray-400">Paused</Badge>
    );
  };

  const handleToggleStatus = () => {
    console.log('Toggle status clicked for schedule:', schedule.id, 'Current status:', schedule.status);
    onToggleStatus(schedule.id, schedule.status);
  };

  return (
    <div className="p-4 bg-corporate-darkSecondary rounded-lg border border-corporate-border">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-white">{schedule.name}</h3>
          <p className="text-sm text-corporate-lightGray">
            {schedule.entityName} • {schedule.frequency} at {schedule.time}
          </p>
        </div>
        {getStatusBadge(schedule.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
        <div>
          <span className="text-corporate-lightGray">Articles:</span>
          <span className="ml-2 text-white">{schedule.articleCount}</span>
        </div>
        <div>
          <span className="text-corporate-lightGray">Platforms:</span>
          <span className="ml-2 text-white">{schedule.platforms.length}</span>
        </div>
        <div>
          <span className="text-corporate-lightGray">Next Run:</span>
          <span className="ml-2 text-white">
            {schedule.nextRun !== 'Never' ? new Date(schedule.nextRun).toLocaleString() : 'Never'}
          </span>
        </div>
        <div>
          <span className="text-corporate-lightGray">Last Run:</span>
          <span className="ml-2 text-white">{schedule.lastRun}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {schedule.platforms.map((platform) => (
            <Badge key={platform} variant="outline" className="border-corporate-border text-corporate-lightGray">
              {platform}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleToggleStatus}
            className="border-corporate-border text-corporate-lightGray hover:bg-corporate-accent hover:text-black"
            title={schedule.status === 'active' ? 'Pause Schedule' : 'Activate Schedule'}
          >
            {schedule.status === 'active' ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(schedule.id)}
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            title="Delete Schedule"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleItem;

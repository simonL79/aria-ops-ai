
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Trash2, Clock } from 'lucide-react';
import { ScheduledDeployment } from '@/services/deploymentScheduler';

interface ScheduleListProps {
  schedules: ScheduledDeployment[]; // Use ScheduledDeployment instead of Schedule
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

const ScheduleList = ({ schedules, onToggleStatus, onDelete }: ScheduleListProps) => {
  const formatDate = (dateString: string) => {
    if (dateString === 'Never') return 'Never';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  if (schedules.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
        <h3 className="text-lg font-medium text-white mb-2">No Scheduled Deployments</h3>
        <p className="text-corporate-lightGray">Create your first scheduled deployment above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <Card key={schedule.id} className="corporate-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="corporate-heading text-lg">{schedule.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={schedule.status === 'active' ? 'default' : 'secondary'}
                  className={schedule.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}
                >
                  {schedule.status.toUpperCase()}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleStatus(schedule.id, schedule.status)}
                  className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
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
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-corporate-lightGray">Entity: <span className="text-white">{schedule.entityName}</span></p>
                <p className="text-corporate-lightGray">Frequency: <span className="text-white">{schedule.frequency}</span></p>
                <p className="text-corporate-lightGray">Time: <span className="text-white">{schedule.time}</span></p>
              </div>
              <div>
                <p className="text-corporate-lightGray">Article Count: <span className="text-white">{schedule.articleCount}</span></p>
                <p className="text-corporate-lightGray">Platforms: <span className="text-white">{schedule.platforms.length}</span></p>
                <p className="text-corporate-lightGray">Keywords: <span className="text-white">{schedule.keywords.length}</span></p>
              </div>
              <div>
                <p className="text-corporate-lightGray">Next Run: <span className="text-white">{formatDate(schedule.nextRun)}</span></p>
                <p className="text-corporate-lightGray">Last Run: <span className="text-white">{formatDate(schedule.lastRun)}</span></p>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1">
              {schedule.platforms.map((platform) => (
                <Badge key={platform} variant="outline" className="text-xs">
                  {platform}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScheduleList;

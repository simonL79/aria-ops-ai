
import React from 'react';
import { Calendar } from 'lucide-react';
import { ScheduledDeployment } from '@/services/deploymentScheduler';
import ScheduleItem from './ScheduleItem';

interface ScheduleListProps {
  schedules: ScheduledDeployment[];
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

const ScheduleList = ({ schedules, onToggleStatus, onDelete }: ScheduleListProps) => {
  if (schedules.length === 0) {
    return (
      <div className="text-center py-8 text-corporate-lightGray">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-corporate-accent opacity-50" />
        <p>No scheduled deployments found</p>
        <p className="text-sm">Create your first schedule to automate deployments</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <ScheduleItem
          key={schedule.id}
          schedule={schedule}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ScheduleList;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Plus,
  RefreshCw
} from 'lucide-react';
import { DeploymentSchedulerService, ScheduledDeployment } from '@/services/deploymentScheduler';
import { toast } from 'sonner';
import DeploymentHistory from './DeploymentHistory';
import ScheduleForm from './ScheduleForm';
import ScheduleList from './ScheduleList';

const DeploymentScheduler = () => {
  const [schedules, setSchedules] = useState<ScheduledDeployment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily',
    time: '09:00',
    platforms: [] as string[],
    articleCount: 10,
    entityName: '',
    keywords: ''
  });

  const loadSchedules = async () => {
    setIsLoading(true);
    try {
      const loadedSchedules = await DeploymentSchedulerService.loadScheduledDeployments();
      console.log('Loaded schedules:', loadedSchedules);
      setSchedules(loadedSchedules);
    } catch (error) {
      console.error('Failed to load schedules:', error);
      toast.error('Failed to load scheduled deployments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleCreateSchedule = async () => {
    if (!formData.name || !formData.entityName || formData.platforms.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const keywords = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
    const nextRun = DeploymentSchedulerService.calculateNextRun(formData.frequency, formData.time);

    const scheduleData = {
      name: formData.name,
      frequency: formData.frequency,
      time: formData.time,
      platforms: formData.platforms,
      articleCount: formData.articleCount,
      status: 'active' as const,
      nextRun,
      lastRun: 'Never',
      entityName: formData.entityName,
      keywords
    };

    try {
      const scheduleId = await DeploymentSchedulerService.saveScheduledDeployment(scheduleData);
      if (scheduleId) {
        toast.success('Scheduled deployment created successfully');
        setShowCreateForm(false);
        setFormData({
          name: '',
          frequency: 'daily',
          time: '09:00',
          platforms: [],
          articleCount: 10,
          entityName: '',
          keywords: ''
        });
        await loadSchedules();
      } else {
        toast.error('Failed to create scheduled deployment');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast.error('Failed to create scheduled deployment');
    }
  };

  const toggleScheduleStatus = async (scheduleId: string, currentStatus: string) => {
    console.log('Toggle initiated for schedule:', scheduleId, 'current status:', currentStatus);
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const success = await DeploymentSchedulerService.updateScheduledDeployment(scheduleId, { 
        status: newStatus 
      });
      
      if (success) {
        console.log('Update successful, new status:', newStatus);
        toast.success(`Schedule ${newStatus === 'active' ? 'activated' : 'paused'}`);
        
        // Force reload to get fresh data
        await loadSchedules();
      } else {
        console.error('Update failed in service');
        toast.error('Failed to update schedule status');
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Failed to update schedule status');
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      const success = await DeploymentSchedulerService.deleteScheduledDeployment(scheduleId);
      if (success) {
        toast.success('Schedule deleted successfully');
        await loadSchedules();
      } else {
        toast.error('Failed to delete schedule');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Failed to delete schedule');
    }
  };

  return (
    <div className="space-y-6">
      {/* Scheduled Deployments */}
      <Card className="corporate-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 corporate-heading">
              <Calendar className="h-5 w-5 text-corporate-accent" />
              Scheduled Deployments
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={loadSchedules}
                disabled={isLoading}
                className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Schedule
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <ScheduleForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateSchedule}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          <ScheduleList
            schedules={schedules}
            onToggleStatus={toggleScheduleStatus}
            onDelete={deleteSchedule}
          />
        </CardContent>
      </Card>

      <Separator className="bg-corporate-border" />

      {/* Deployment History */}
      <DeploymentHistory />
    </div>
  );
};

export default DeploymentScheduler;

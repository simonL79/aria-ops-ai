
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Trash2, 
  Plus,
  Settings,
  RefreshCw
} from 'lucide-react';
import { DeploymentSchedulerService, ScheduledDeployment } from '@/services/deploymentScheduler';
import { toast } from 'sonner';
import DeploymentHistory from './DeploymentHistory';

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

  const availablePlatforms = [
    'github-pages',
    'netlify', 
    'vercel',
    'cloudflare',
    'firebase',
    'surge'
  ];

  const loadSchedules = async () => {
    setIsLoading(true);
    try {
      const loadedSchedules = await DeploymentSchedulerService.loadScheduledDeployments();
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
        loadSchedules();
      } else {
        toast.error('Failed to create scheduled deployment');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast.error('Failed to create scheduled deployment');
    }
  };

  const toggleScheduleStatus = async (scheduleId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      const success = await DeploymentSchedulerService.updateScheduledDeployment(scheduleId, { 
        status: newStatus 
      });
      if (success) {
        toast.success(`Schedule ${newStatus === 'active' ? 'activated' : 'paused'}`);
        loadSchedules();
      } else {
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
        loadSchedules();
      } else {
        toast.error('Failed to delete schedule');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Failed to delete schedule');
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
    ) : (
      <Badge className="bg-gray-500/20 text-gray-400">Paused</Badge>
    );
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
            <div className="mb-6 p-4 bg-corporate-darkSecondary rounded-lg border border-corporate-border">
              <h3 className="font-medium text-white mb-4">Create New Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schedule-name" className="text-corporate-lightGray">Schedule Name</Label>
                  <Input
                    id="schedule-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Daily Simon Lindsay Campaign"
                    className="bg-corporate-darkSecondary border-corporate-border text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="entity-name" className="text-corporate-lightGray">Entity Name</Label>
                  <Input
                    id="entity-name"
                    value={formData.entityName}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                    placeholder="e.g., Simon Lindsay"
                    className="bg-corporate-darkSecondary border-corporate-border text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="frequency" className="text-corporate-lightGray">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                    <SelectTrigger className="bg-corporate-darkSecondary border-corporate-border text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="time" className="text-corporate-lightGray">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="bg-corporate-darkSecondary border-corporate-border text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="article-count" className="text-corporate-lightGray">Articles per Run</Label>
                  <Input
                    id="article-count"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.articleCount}
                    onChange={(e) => setFormData({ ...formData, articleCount: parseInt(e.target.value) })}
                    className="bg-corporate-darkSecondary border-corporate-border text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="keywords" className="text-corporate-lightGray">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="e.g., reputation management, digital strategy"
                    className="bg-corporate-darkSecondary border-corporate-border text-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-corporate-lightGray">Deployment Platforms</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availablePlatforms.map((platform) => (
                    <Button
                      key={platform}
                      size="sm"
                      variant={formData.platforms.includes(platform) ? "default" : "outline"}
                      onClick={() => {
                        const newPlatforms = formData.platforms.includes(platform)
                          ? formData.platforms.filter(p => p !== platform)
                          : [...formData.platforms, platform];
                        setFormData({ ...formData, platforms: newPlatforms });
                      }}
                      className={formData.platforms.includes(platform) 
                        ? "bg-corporate-accent text-black" 
                        : "border-corporate-border text-corporate-lightGray hover:bg-corporate-accent hover:text-black"
                      }
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-corporate-border text-corporate-lightGray"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSchedule}
                  className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
                >
                  Create Schedule
                </Button>
              </div>
            </div>
          )}

          {schedules.length === 0 ? (
            <div className="text-center py-8 text-corporate-lightGray">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-corporate-accent opacity-50" />
              <p>No scheduled deployments found</p>
              <p className="text-sm">Create your first schedule to automate deployments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="p-4 bg-corporate-darkSecondary rounded-lg border border-corporate-border">
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
                        onClick={() => toggleScheduleStatus(schedule.id, schedule.status)}
                        className="border-corporate-border text-corporate-lightGray hover:bg-corporate-accent hover:text-black"
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
                        onClick={() => deleteSchedule(schedule.id)}
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className="bg-corporate-border" />

      {/* Deployment History */}
      <DeploymentHistory />
    </div>
  );
};

export default DeploymentScheduler;

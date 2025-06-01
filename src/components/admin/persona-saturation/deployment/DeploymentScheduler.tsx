import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Trash2, 
  Plus,
  RefreshCw,
  CheckCircle,
  Timer,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DeploymentSchedulerService, type ScheduledDeployment } from '@/services/deploymentScheduler';

interface ScheduledDeployment {
  id: string;
  name: string;
  frequency: string;
  time: string;
  platforms: string[];
  articleCount: number;
  status: 'active' | 'paused';
  nextRun: string;
  lastRun: string;
  entityName: string;
  keywords: string[];
}

const DeploymentScheduler = () => {
  const [schedules, setSchedules] = useState<ScheduledDeployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'daily',
    time: '09:00',
    platforms: [] as string[],
    articleCount: 10,
    entityName: '',
    keywords: ''
  });

  const [isExecuting, setIsExecuting] = useState<string | null>(null);

  const frequencies = [
    { value: 'hourly', label: 'Every Hour' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const platforms = [
    { id: 'github-pages', name: 'GitHub Pages' },
    { id: 'netlify', name: 'Netlify' },
    { id: 'vercel', name: 'Vercel' },
    { id: 'cloudflare', name: 'Cloudflare Pages' },
    { id: 'firebase', name: 'Firebase Hosting' },
    { id: 'surge', name: 'Surge.sh' }
  ];

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading scheduled deployments from database...');
      const loadedSchedules = await DeploymentSchedulerService.loadScheduledDeployments();
      console.log(`✅ Loaded ${loadedSchedules.length} scheduled deployments`);
      setSchedules(loadedSchedules);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast.error('Failed to load scheduled deployments');
    } finally {
      setIsLoading(false);
    }
  };

  const executeScheduledDeployment = async (schedule: ScheduledDeployment) => {
    setIsExecuting(schedule.id);
    console.log(`🚀 Executing scheduled deployment: ${schedule.name}`);

    try {
      // Validate deployment data before execution
      const validation = DeploymentSchedulerService.validateDeploymentData(schedule);
      if (!validation.isValid) {
        console.error('❌ Deployment validation failed:', validation.errors);
        toast.error(`Deployment blocked: ${validation.errors.join(', ')}`);
        return;
      }

      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          entityName: schedule.entityName,
          targetKeywords: schedule.keywords,
          contentCount: schedule.articleCount,
          deploymentTargets: schedule.platforms,
          saturationMode: 'defensive'
        }
      });

      if (error) {
        console.error('❌ Scheduled deployment error:', error);
        throw error;
      }

      console.log('✅ Scheduled deployment successful:', data);

      // Update the schedule's last run time and next run
      const updatedSchedule = {
        ...schedule,
        lastRun: new Date().toISOString(),
        nextRun: DeploymentSchedulerService.calculateNextRun(schedule.frequency, schedule.time)
      };

      // Update in database
      const updateSuccess = await DeploymentSchedulerService.updateScheduledDeployment(
        schedule.id, 
        { 
          lastRun: updatedSchedule.lastRun, 
          nextRun: updatedSchedule.nextRun 
        }
      );

      if (updateSuccess) {
        // Update local state
        setSchedules(prev => prev.map(s => 
          s.id === schedule.id ? updatedSchedule : s
        ));
      }

      toast.success(`✅ Scheduled deployment "${schedule.name}" completed successfully! ${data?.campaign?.deploymentsSuccessful || 0} articles deployed.`);

    } catch (error: any) {
      console.error('❌ Scheduled deployment failed:', error);
      toast.error(`❌ Scheduled deployment "${schedule.name}" failed: ${error.message}`);
    } finally {
      setIsExecuting(null);
    }
  };

  const toggleScheduleStatus = async (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    if (!schedule) return;

    const newStatus: 'active' | 'paused' = schedule.status === 'active' ? 'paused' : 'active';
    
    const updateSuccess = await DeploymentSchedulerService.updateScheduledDeployment(id, { status: newStatus });
    
    if (updateSuccess) {
      setSchedules(prev => prev.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      ));
      toast.success(`Schedule ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } else {
      toast.error('Failed to update schedule status');
    }
  };

  const deleteSchedule = async (id: string) => {
    const deleteSuccess = await DeploymentSchedulerService.deleteScheduledDeployment(id);
    
    if (deleteSuccess) {
      setSchedules(prev => prev.filter(s => s.id !== id));
      toast.success('Schedule deleted successfully');
    } else {
      toast.error('Failed to delete schedule');
    }
  };

  const addSchedule = async () => {
    if (!newSchedule.name || !newSchedule.entityName || !newSchedule.keywords) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (newSchedule.platforms.length === 0) {
      toast.error('Please select at least one deployment platform');
      return;
    }

    const deploymentData = {
      ...newSchedule,
      keywords: newSchedule.keywords.split(',').map(k => k.trim()),
      status: 'active' as const,
      nextRun: DeploymentSchedulerService.calculateNextRun(newSchedule.frequency, newSchedule.time),
      lastRun: 'Never'
    };

    // Validate before saving
    const validation = DeploymentSchedulerService.validateDeploymentData(deploymentData);
    if (!validation.isValid) {
      toast.error(`Invalid deployment data: ${validation.errors.join(', ')}`);
      return;
    }

    const savedId = await DeploymentSchedulerService.saveScheduledDeployment(deploymentData);
    
    if (savedId) {
      // Reload schedules from database to get the latest data
      await loadSchedules();
      
      setNewSchedule({
        name: '',
        frequency: 'daily',
        time: '09:00',
        platforms: [],
        articleCount: 10,
        entityName: '',
        keywords: ''
      });
      
      toast.success('Schedule created and saved successfully');
    } else {
      toast.error('Failed to save schedule');
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      : <Badge className="bg-gray-500/20 text-gray-400"><Pause className="h-3 w-3 mr-1" />Paused</Badge>;
  };

  const togglePlatformSelection = (platformId: string) => {
    setNewSchedule(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-corporate-accent" />
        <span className="ml-2 text-white">Loading scheduled deployments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create New Schedule */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Plus className="h-5 w-5 text-corporate-accent" />
            Create New Scheduled Deployment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduleName" className="text-white">Schedule Name</Label>
              <Input
                id="scheduleName"
                value={newSchedule.name}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Daily Review Posts"
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="entityName" className="text-white">Entity Name</Label>
              <Input
                id="entityName"
                value={newSchedule.entityName}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, entityName: e.target.value }))}
                placeholder="e.g. Company Name"
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="keywords" className="text-white">Target Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              value={newSchedule.keywords}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder="e.g. excellence, leadership, innovation"
              className="bg-corporate-darkSecondary border-corporate-border text-white"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-white">Frequency</Label>
              <Select value={newSchedule.frequency} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger className="bg-corporate-darkSecondary border-corporate-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map(freq => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="scheduleTime" className="text-white">Time</Label>
              <Input
                id="scheduleTime"
                type="time"
                value={newSchedule.time}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="articleCount" className="text-white">Article Count</Label>
              <Input
                id="articleCount"
                type="number"
                value={newSchedule.articleCount}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, articleCount: parseInt(e.target.value) || 10 }))}
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-white">Deployment Platforms</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {platforms.map(platform => (
                <Button
                  key={platform.id}
                  variant={newSchedule.platforms.includes(platform.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePlatformSelection(platform.id)}
                  className={newSchedule.platforms.includes(platform.id) 
                    ? "bg-corporate-accent text-black" 
                    : "border-corporate-border text-white hover:bg-corporate-darkSecondary"
                  }
                >
                  {platform.name}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={addSchedule}
            className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule
          </Button>
        </CardContent>
      </Card>

      {/* Existing Schedules */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between corporate-heading">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-corporate-accent" />
              Scheduled Deployments ({schedules.length})
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={loadSchedules}
              className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map(schedule => (
              <div key={schedule.id} className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Timer className="h-5 w-5 text-corporate-accent" />
                    <div>
                      <h3 className="font-medium text-white">{schedule.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(schedule.status)}
                        <span className="text-xs text-corporate-lightGray">
                          {schedule.frequency} at {schedule.time}
                        </span>
                      </div>
                      <div className="text-xs text-corporate-lightGray mt-1">
                        Entity: {schedule.entityName} | Keywords: {schedule.keywords.join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => executeScheduledDeployment(schedule)}
                      disabled={isExecuting === schedule.id || schedule.status === 'paused'}
                      className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
                    >
                      {isExecuting === schedule.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleScheduleStatus(schedule.id)}
                      className="border-corporate-border text-white hover:bg-corporate-darkSecondary"
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
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-corporate-lightGray">Articles</div>
                    <div className="text-white font-medium">{schedule.articleCount}</div>
                  </div>
                  <div>
                    <div className="text-corporate-lightGray">Platforms</div>
                    <div className="text-white font-medium">{schedule.platforms.length}</div>
                  </div>
                  <div>
                    <div className="text-corporate-lightGray">Next Run</div>
                    <div className="text-white font-medium text-xs">
                      {schedule.nextRun === 'Manual trigger' ? schedule.nextRun : new Date(schedule.nextRun).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-corporate-lightGray">Last Run</div>
                    <div className="text-white font-medium text-xs">
                      {schedule.lastRun === 'Never' ? schedule.lastRun : new Date(schedule.lastRun).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {schedules.length === 0 && (
              <div className="text-center py-8 text-corporate-lightGray">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No scheduled deployments found</p>
                <p className="text-sm">Create your first schedule above to automate persona saturation</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentScheduler;

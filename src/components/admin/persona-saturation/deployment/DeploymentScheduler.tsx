
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Trash2, 
  Plus,
  Settings,
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DeploymentSchedulerService, type ScheduledDeployment } from '@/services/deploymentScheduler';

const DeploymentScheduler = () => {
  const [schedules, setSchedules] = useState<ScheduledDeployment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    entityName: '',
    frequency: 'daily',
    time: '09:00',
    platforms: ['github-pages'],
    articleCount: 10,
    keywords: [''],
    status: 'active' as const
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setIsLoading(true);
    try {
      const loadedSchedules = await DeploymentSchedulerService.loadScheduledDeployments();
      setSchedules(loadedSchedules);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast.error('Failed to load scheduled deployments');
    } finally {
      setIsLoading(false);
    }
  };

  const executeScheduledDeployment = async (schedule: ScheduledDeployment) => {
    try {
      console.log(`🚀 Executing scheduled deployment: ${schedule.entityName}`);
      
      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          entityName: schedule.entityName,
          targetKeywords: schedule.keywords,
          contentCount: schedule.articleCount,
          deploymentTargets: schedule.platforms,
          saturationMode: 'comprehensive'
        }
      });

      if (error) {
        console.error('❌ Scheduled deployment error:', error);
        throw error;
      }

      console.log('✅ Scheduled deployment successful:', data);
      
      // Update last run time and calculate next run
      const now = new Date().toISOString();
      const nextRun = DeploymentSchedulerService.calculateNextRun(schedule.frequency, schedule.time);
      
      await DeploymentSchedulerService.updateScheduledDeployment(schedule.id, {
        lastRun: now,
        nextRun: nextRun
      });

      toast.success(`Deployment successful for ${schedule.entityName}`);
      await loadSchedules(); // Refresh the list
      
    } catch (error) {
      console.error('❌ Scheduled deployment failed:', error);
      toast.error(`Deployment failed for ${schedule.entityName}`);
    }
  };

  const addSchedule = async () => {
    if (!newSchedule.name || !newSchedule.entityName) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate for mock data
    const validation = DeploymentSchedulerService.validateDeploymentData({
      name: newSchedule.name,
      entityName: newSchedule.entityName,
      keywords: newSchedule.keywords.filter(k => k.trim() !== '')
    });

    if (!validation.isValid) {
      toast.error(`Cannot schedule deployment: ${validation.errors.join(', ')}`);
      return;
    }

    try {
      const nextRun = DeploymentSchedulerService.calculateNextRun(newSchedule.frequency, newSchedule.time);
      
      const scheduleData: Omit<ScheduledDeployment, 'id' | 'createdAt' | 'updatedAt'> = {
        name: newSchedule.name,
        entityName: newSchedule.entityName,
        frequency: newSchedule.frequency,
        time: newSchedule.time,
        platforms: newSchedule.platforms,
        articleCount: newSchedule.articleCount,
        keywords: newSchedule.keywords.filter(k => k.trim() !== ''),
        status: newSchedule.status,
        nextRun: nextRun,
        lastRun: 'Never'
      };

      const savedId = await DeploymentSchedulerService.saveScheduledDeployment(scheduleData);
      
      if (savedId) {
        toast.success('Scheduled deployment created successfully');
        setShowAddForm(false);
        resetForm();
        await loadSchedules();
      } else {
        toast.error('Failed to create scheduled deployment');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast.error('Failed to create scheduled deployment');
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      const success = await DeploymentSchedulerService.deleteScheduledDeployment(id);
      if (success) {
        toast.success('Scheduled deployment deleted');
        await loadSchedules();
      } else {
        toast.error('Failed to delete scheduled deployment');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Failed to delete scheduled deployment');
    }
  };

  const toggleScheduleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      const success = await DeploymentSchedulerService.updateScheduledDeployment(id, {
        status: newStatus as 'active' | 'paused'
      });
      
      if (success) {
        toast.success(`Schedule ${newStatus === 'active' ? 'activated' : 'paused'}`);
        await loadSchedules();
      } else {
        toast.error('Failed to update schedule status');
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Failed to update schedule status');
    }
  };

  const resetForm = () => {
    setNewSchedule({
      name: '',
      entityName: '',
      frequency: 'daily',
      time: '09:00',
      platforms: ['github-pages'],
      articleCount: 10,
      keywords: [''],
      status: 'active'
    });
  };

  const addKeywordField = () => {
    setNewSchedule(prev => ({
      ...prev,
      keywords: [...prev.keywords, '']
    }));
  };

  const updateKeyword = (index: number, value: string) => {
    setNewSchedule(prev => ({
      ...prev,
      keywords: prev.keywords.map((k, i) => i === index ? value : k)
    }));
  };

  const removeKeyword = (index: number) => {
    setNewSchedule(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const platformOptions = [
    { id: 'github-pages', name: 'GitHub Pages' },
    { id: 'netlify', name: 'Netlify' },
    { id: 'vercel', name: 'Vercel' },
    { id: 'cloudflare', name: 'Cloudflare Pages' },
    { id: 'firebase', name: 'Firebase Hosting' },
    { id: 'surge', name: 'Surge.sh' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Deployment Scheduler</h3>
          <p className="text-corporate-lightGray">Automate content deployment across platforms</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-corporate-accent hover:bg-corporate-accent/80 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Deployment
        </Button>
      </div>

      {/* Add Schedule Form */}
      {showAddForm && (
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="corporate-heading">New Scheduled Deployment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule-name">Schedule Name</Label>
                <Input
                  id="schedule-name"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Daily Brand Defense"
                  className="corporate-input"
                />
              </div>
              
              <div>
                <Label htmlFor="entity-name">Entity Name</Label>
                <Input
                  id="entity-name"
                  value={newSchedule.entityName}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, entityName: e.target.value }))}
                  placeholder="e.g., John Smith"
                  className="corporate-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={newSchedule.frequency} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger className="corporate-input">
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
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                  className="corporate-input"
                />
              </div>

              <div>
                <Label htmlFor="article-count">Article Count</Label>
                <Input
                  id="article-count"
                  type="number"
                  min="1"
                  max="50"
                  value={newSchedule.articleCount}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, articleCount: parseInt(e.target.value) || 10 }))}
                  className="corporate-input"
                />
              </div>
            </div>

            <div>
              <Label>Target Platforms</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {platformOptions.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={newSchedule.platforms.includes(platform.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewSchedule(prev => ({
                            ...prev,
                            platforms: [...prev.platforms, platform.id]
                          }));
                        } else {
                          setNewSchedule(prev => ({
                            ...prev,
                            platforms: prev.platforms.filter(p => p !== platform.id)
                          }));
                        }
                      }}
                      className="border-corporate-border"
                    />
                    <Label htmlFor={platform.id} className="text-sm text-corporate-lightGray">
                      {platform.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Keywords</Label>
              <div className="space-y-2 mt-2">
                {newSchedule.keywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={keyword}
                      onChange={(e) => updateKeyword(index, e.target.value)}
                      placeholder="Enter keyword"
                      className="corporate-input"
                    />
                    {newSchedule.keywords.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeKeyword(index)}
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addKeywordField}
                  className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Keyword
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={addSchedule}
                className="bg-corporate-accent hover:bg-corporate-accent/80 text-black"
              >
                Create Schedule
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="border-corporate-border text-corporate-lightGray hover:bg-corporate-darkSecondary"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Deployments List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="corporate-card">
            <CardContent className="p-6">
              <p className="text-center text-corporate-lightGray">Loading scheduled deployments...</p>
            </CardContent>
          </Card>
        ) : schedules.length === 0 ? (
          <Card className="corporate-card">
            <CardContent className="p-6">
              <p className="text-center text-corporate-lightGray">No scheduled deployments configured</p>
            </CardContent>
          </Card>
        ) : (
          schedules.map((schedule) => (
            <Card key={schedule.id} className="corporate-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-white">{schedule.name}</h4>
                      <Badge variant={schedule.status === 'active' ? 'default' : 'secondary'}>
                        {schedule.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-corporate-lightGray">Entity</p>
                        <p className="text-white">{schedule.entityName}</p>
                      </div>
                      <div>
                        <p className="text-corporate-lightGray">Schedule</p>
                        <p className="text-white">{schedule.frequency} at {schedule.time}</p>
                      </div>
                      <div>
                        <p className="text-corporate-lightGray">Next Run</p>
                        <p className="text-white">{new Date(schedule.nextRun).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-corporate-lightGray">Last Run</p>
                        <p className="text-white">{schedule.lastRun === 'Never' ? 'Never' : new Date(schedule.lastRun).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {schedule.platforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => executeScheduledDeployment(schedule)}
                      className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleScheduleStatus(schedule.id, schedule.status)}
                      className={schedule.status === 'active' 
                        ? "border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                        : "border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                      }
                    >
                      {schedule.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSchedule(schedule.id)}
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DeploymentScheduler;

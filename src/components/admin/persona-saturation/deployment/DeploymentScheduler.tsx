
import React, { useState } from 'react';
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
  const [schedules, setSchedules] = useState<ScheduledDeployment[]>([
    {
      id: '1',
      name: 'Daily Review Posts',
      frequency: 'daily',
      time: '09:00',
      platforms: ['github-pages', 'netlify'],
      articleCount: 10,
      status: 'active',
      nextRun: '2024-01-15 09:00:00',
      lastRun: '2024-01-14 09:00:00',
      entityName: 'Professional Entity',
      keywords: ['excellence', 'leadership', 'innovation']
    }
  ]);

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

  const executeScheduledDeployment = async (schedule: ScheduledDeployment) => {
    setIsExecuting(schedule.id);
    console.log(`🚀 Executing scheduled deployment: ${schedule.name}`);

    try {
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

      // Update the schedule's last run time
      setSchedules(prev => prev.map(s => 
        s.id === schedule.id 
          ? { 
              ...s, 
              lastRun: new Date().toISOString(),
              nextRun: calculateNextRun(s.frequency, s.time)
            }
          : s
      ));

      toast.success(`✅ Scheduled deployment "${schedule.name}" completed successfully! ${data?.campaign?.deploymentsSuccessful || 0} articles deployed.`);

    } catch (error: any) {
      console.error('❌ Scheduled deployment failed:', error);
      toast.error(`❌ Scheduled deployment "${schedule.name}" failed: ${error.message}`);
    } finally {
      setIsExecuting(null);
    }
  };

  const toggleScheduleStatus = (id: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id 
        ? { ...schedule, status: schedule.status === 'active' ? 'paused' : 'active' }
        : schedule
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    toast.success('Schedule deleted successfully');
  };

  const addSchedule = () => {
    if (!newSchedule.name || !newSchedule.entityName || !newSchedule.keywords) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (newSchedule.platforms.length === 0) {
      toast.error('Please select at least one deployment platform');
      return;
    }
    
    const schedule: ScheduledDeployment = {
      id: Date.now().toString(),
      ...newSchedule,
      keywords: newSchedule.keywords.split(',').map(k => k.trim()),
      status: 'active',
      nextRun: calculateNextRun(newSchedule.frequency, newSchedule.time),
      lastRun: 'Never'
    };
    
    setSchedules(prev => [...prev, schedule]);
    setNewSchedule({
      name: '',
      frequency: 'daily',
      time: '09:00',
      platforms: [],
      articleCount: 10,
      entityName: '',
      keywords: ''
    });
    
    toast.success('Schedule created successfully');
  };

  const calculateNextRun = (frequency: string, time: string) => {
    const now = new Date();
    switch (frequency) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return `${tomorrow.toISOString().split('T')[0]} ${time}:00`;
      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return `${nextWeek.toISOString().split('T')[0]} ${time}:00`;
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return `${nextMonth.toISOString().split('T')[0]} ${time}:00`;
      default:
        return 'Manual trigger';
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-500/20 text-green-400">Active</Badge>
      : <Badge className="bg-gray-500/20 text-gray-400">Paused</Badge>;
  };

  const togglePlatformSelection = (platformId: string) => {
    setNewSchedule(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

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
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Calendar className="h-5 w-5 text-corporate-accent" />
            Scheduled Deployments
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
                      disabled={isExecuting === schedule.id}
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
                <p>No scheduled deployments configured</p>
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

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
  Timer
} from 'lucide-react';

const DeploymentScheduler = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: 'Daily Review Posts',
      frequency: 'daily',
      time: '09:00',
      platforms: ['github-pages', 'netlify'],
      articleCount: 10,
      status: 'active',
      nextRun: '2024-01-15 09:00:00',
      lastRun: '2024-01-14 09:00:00'
    },
    {
      id: 2,
      name: 'Weekly Bulk Deployment',
      frequency: 'weekly',
      time: '02:00',
      platforms: ['vercel', 'cloudflare'],
      articleCount: 50,
      status: 'active',
      nextRun: '2024-01-21 02:00:00',
      lastRun: '2024-01-14 02:00:00'
    },
    {
      id: 3,
      name: 'Crisis Response',
      frequency: 'on-demand',
      time: 'immediate',
      platforms: ['all'],
      articleCount: 25,
      status: 'paused',
      nextRun: 'Manual trigger',
      lastRun: '2024-01-12 15:30:00'
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'daily',
    time: '09:00',
    platforms: [],
    articleCount: 10
  });

  const frequencies = [
    { value: 'hourly', label: 'Every Hour' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'on-demand', label: 'On Demand' }
  ];

  const platforms = [
    { id: 'github-pages', name: 'GitHub Pages' },
    { id: 'netlify', name: 'Netlify' },
    { id: 'vercel', name: 'Vercel' },
    { id: 'cloudflare', name: 'Cloudflare Pages' },
    { id: 'all', name: 'All Platforms' }
  ];

  const toggleScheduleStatus = (id: number) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id 
        ? { ...schedule, status: schedule.status === 'active' ? 'paused' : 'active' }
        : schedule
    ));
  };

  const deleteSchedule = (id: number) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  const addSchedule = () => {
    if (!newSchedule.name) return;
    
    const schedule = {
      id: Date.now(),
      ...newSchedule,
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
      articleCount: 10
    });
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
      default:
        return 'Manual trigger';
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-500/20 text-green-400">Active</Badge>
      : <Badge className="bg-gray-500/20 text-gray-400">Paused</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Create New Schedule */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Plus className="h-5 w-5 text-corporate-accent" />
            Create New Schedule
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onChange={(e) => setNewSchedule(prev => ({ ...prev, articleCount: parseInt(e.target.value) }))}
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
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
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
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
                    <div className="text-white font-medium">
                      {schedule.nextRun === 'Manual trigger' ? schedule.nextRun : new Date(schedule.nextRun).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-corporate-lightGray">Last Run</div>
                    <div className="text-white font-medium">
                      {schedule.lastRun === 'Never' ? schedule.lastRun : new Date(schedule.lastRun).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentScheduler;

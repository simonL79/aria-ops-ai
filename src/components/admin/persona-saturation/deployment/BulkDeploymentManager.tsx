
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Play, 
  Pause, 
  Square, 
  FileText, 
  Globe, 
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

const BulkDeploymentManager = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [batchSize, setBatchSize] = useState(50);
  const [deploymentSpeed, setDeploymentSpeed] = useState('standard');
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);

  const platforms = [
    { id: 'github-pages', name: 'GitHub Pages', status: 'active', articles: 245 },
    { id: 'netlify', name: 'Netlify', status: 'active', articles: 189 },
    { id: 'vercel', name: 'Vercel', status: 'active', articles: 156 },
    { id: 'cloudflare', name: 'Cloudflare Pages', status: 'warning', articles: 78 },
    { id: 'firebase', name: 'Firebase Hosting', status: 'active', articles: 134 },
    { id: 'surge', name: 'Surge.sh', status: 'active', articles: 98 },
  ];

  const currentJobs = [
    { id: 1, name: 'Entity Batch #847', platform: 'GitHub Pages', status: 'running', progress: 65, articles: 25 },
    { id: 2, name: 'Review Posts Batch', platform: 'Netlify', status: 'queued', progress: 0, articles: 40 },
    { id: 3, name: 'Crisis Response Articles', platform: 'Vercel', status: 'completed', progress: 100, articles: 15 },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const startBulkDeployment = () => {
    setIsDeploying(true);
    // Simulate deployment progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDeploying(false);
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <RefreshCw className="h-3 w-3 animate-spin text-blue-400" />;
      case 'completed': return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'queued': return <Clock className="h-3 w-3 text-yellow-400" />;
      default: return <AlertTriangle className="h-3 w-3 text-red-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Globe className="h-5 w-5 text-corporate-accent" />
            Bulk Deployment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="batchSize" className="text-white">Batch Size</Label>
              <Input
                id="batchSize"
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
              <p className="text-xs text-corporate-lightGray mt-1">Articles per batch</p>
            </div>
            
            <div>
              <Label className="text-white">Deployment Speed</Label>
              <div className="space-y-2 mt-2">
                {['conservative', 'standard', 'aggressive'].map(speed => (
                  <div key={speed} className="flex items-center space-x-2">
                    <Checkbox
                      checked={deploymentSpeed === speed}
                      onCheckedChange={() => setDeploymentSpeed(speed)}
                    />
                    <label className="text-sm text-white capitalize">{speed}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-white">Target Platforms</Label>
              <div className="text-sm text-corporate-lightGray mt-1">
                {selectedPlatforms.length} of {platforms.length} selected
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <Label className="text-white">Select Platforms</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {platforms.map(platform => (
                <div key={platform.id} className="flex items-center space-x-2 p-2 bg-corporate-darkSecondary rounded">
                  <Checkbox
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => handlePlatformToggle(platform.id)}
                  />
                  <div className="flex-1">
                    <div className="text-sm text-white">{platform.name}</div>
                    <div className="text-xs text-corporate-lightGray">{platform.articles} articles</div>
                  </div>
                  <Badge variant={platform.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                    {platform.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={startBulkDeployment}
              disabled={isDeploying || selectedPlatforms.length === 0}
              className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Bulk Deployment
            </Button>
            <Button variant="outline" disabled={!isDeploying}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button variant="outline" disabled={!isDeploying}>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>

          {isDeploying && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-corporate-lightGray">Deployment Progress</span>
                <span className="text-white">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Jobs */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <FileText className="h-5 w-5 text-corporate-accent" />
            Active Deployment Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentJobs.map(job => (
              <div key={job.id} className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job.status)}
                    <span className="font-medium text-white">{job.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {job.platform}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-corporate-lightGray">
                    {job.articles} articles • {job.status}
                  </div>
                  <div className="text-sm text-white">{job.progress}%</div>
                </div>
                
                <Progress value={job.progress} className="h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkDeploymentManager;

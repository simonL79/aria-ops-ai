
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Globe, 
  Key, 
  Clock, 
  Zap, 
  Shield,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save
} from 'lucide-react';

const PlatformConfiguration = () => {
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  
  const [platforms, setPlatforms] = useState([
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      status: 'connected',
      enabled: true,
      apiKey: '***********',
      rateLimit: 100,
      delayMs: 2000,
      maxConcurrent: 3,
      successRate: 99.2,
      lastDeployment: '2 hours ago'
    },
    {
      id: 'netlify',
      name: 'Netlify',
      status: 'connected',
      enabled: true,
      apiKey: '***********',
      rateLimit: 150,
      delayMs: 1500,
      maxConcurrent: 5,
      successRate: 98.8,
      lastDeployment: '45 minutes ago'
    },
    {
      id: 'vercel',
      name: 'Vercel',
      status: 'warning',
      enabled: true,
      apiKey: 'Not configured',
      rateLimit: 200,
      delayMs: 1000,
      maxConcurrent: 4,
      successRate: 97.5,
      lastDeployment: '6 hours ago'
    },
    {
      id: 'cloudflare',
      name: 'Cloudflare Pages',
      status: 'error',
      enabled: false,
      apiKey: 'Invalid',
      rateLimit: 300,
      delayMs: 500,
      maxConcurrent: 10,
      successRate: 85.2,
      lastDeployment: '2 days ago'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleEdit = (platformId: string) => {
    setEditingPlatform(platformId);
  };

  const handleSave = (platformId: string) => {
    setEditingPlatform(null);
    // Save configuration logic here
  };

  const updatePlatform = (platformId: string, field: string, value: any) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { ...platform, [field]: value }
        : platform
    ));
  };

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Settings className="h-5 w-5 text-corporate-accent" />
            Global Deployment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-white">Default Rate Limit</Label>
              <Input 
                type="number" 
                defaultValue="100" 
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
              <p className="text-xs text-corporate-lightGray mt-1">Requests per hour</p>
            </div>
            
            <div>
              <Label className="text-white">Retry Attempts</Label>
              <Input 
                type="number" 
                defaultValue="3" 
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
              <p className="text-xs text-corporate-lightGray mt-1">Failed deployment retries</p>
            </div>
            
            <div>
              <Label className="text-white">Timeout (seconds)</Label>
              <Input 
                type="number" 
                defaultValue="30" 
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
              <p className="text-xs text-corporate-lightGray mt-1">Per deployment timeout</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Configurations */}
      <div className="space-y-4">
        {platforms.map(platform => (
          <Card key={platform.id} className="corporate-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-corporate-accent" />
                  <div>
                    <CardTitle className="corporate-heading">{platform.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(platform.status)}
                      <Badge className={getStatusColor(platform.status)}>
                        {platform.status}
                      </Badge>
                      <span className="text-xs text-corporate-lightGray">
                        Last: {platform.lastDeployment}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={platform.enabled}
                    onCheckedChange={(checked) => updatePlatform(platform.id, 'enabled', checked)}
                  />
                  {editingPlatform === platform.id ? (
                    <Button
                      size="sm"
                      onClick={() => handleSave(platform.id)}
                      className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(platform.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-corporate-darkSecondary rounded">
                  <div className="text-lg font-bold text-white">{platform.successRate}%</div>
                  <div className="text-xs text-corporate-lightGray">Success Rate</div>
                </div>
                <div className="text-center p-3 bg-corporate-darkSecondary rounded">
                  <div className="text-lg font-bold text-white">{platform.rateLimit}</div>
                  <div className="text-xs text-corporate-lightGray">Rate Limit</div>
                </div>
                <div className="text-center p-3 bg-corporate-darkSecondary rounded">
                  <div className="text-lg font-bold text-white">{platform.maxConcurrent}</div>
                  <div className="text-xs text-corporate-lightGray">Max Concurrent</div>
                </div>
              </div>

              {editingPlatform === platform.id && (
                <div className="space-y-4 p-4 bg-corporate-darkSecondary rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        API Key
                      </Label>
                      <Input 
                        type="password"
                        value={platform.apiKey}
                        onChange={(e) => updatePlatform(platform.id, 'apiKey', e.target.value)}
                        className="bg-corporate-darkPrimary border-corporate-border text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Delay (ms)
                      </Label>
                      <Input 
                        type="number"
                        value={platform.delayMs}
                        onChange={(e) => updatePlatform(platform.id, 'delayMs', parseInt(e.target.value))}
                        className="bg-corporate-darkPrimary border-corporate-border text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4" />
                      Rate Limit: {platform.rateLimit}/hour
                    </Label>
                    <Slider
                      value={[platform.rateLimit]}
                      onValueChange={(value) => updatePlatform(platform.id, 'rateLimit', value[0])}
                      max={500}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4" />
                      Max Concurrent: {platform.maxConcurrent}
                    </Label>
                    <Slider
                      value={[platform.maxConcurrent]}
                      onValueChange={(value) => updatePlatform(platform.id, 'maxConcurrent', value[0])}
                      max={20}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlatformConfiguration;

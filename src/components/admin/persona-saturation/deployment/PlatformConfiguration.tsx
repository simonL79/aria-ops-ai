
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Globe,
  Key,
  TestTube
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PlatformConfig {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  enabled: boolean;
  apiKey?: string;
  webhookUrl?: string;
  deploymentCount: number;
  lastDeployment?: string;
  errorMessage?: string;
}

const PlatformConfiguration = () => {
  const [platforms, setPlatforms] = useState<PlatformConfig[]>([
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      status: 'active',
      enabled: true,
      deploymentCount: 0,
      lastDeployment: undefined
    },
    {
      id: 'netlify',
      name: 'Netlify',
      status: 'active',
      enabled: true,
      deploymentCount: 0,
      lastDeployment: undefined
    },
    {
      id: 'vercel',
      name: 'Vercel',
      status: 'active',
      enabled: true,
      deploymentCount: 0,
      lastDeployment: undefined
    },
    {
      id: 'cloudflare',
      name: 'Cloudflare Pages',
      status: 'active',
      enabled: true,
      deploymentCount: 0,
      lastDeployment: undefined
    },
    {
      id: 'firebase',
      name: 'Firebase Hosting',
      status: 'active',
      enabled: true,
      deploymentCount: 0,
      lastDeployment: undefined
    },
    {
      id: 'surge',
      name: 'Surge.sh',
      status: 'active',
      enabled: true,
      deploymentCount: 0,
      lastDeployment: undefined
    }
  ]);

  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);

  useEffect(() => {
    loadPlatformStats();
  }, []);

  const loadPlatformStats = async () => {
    try {
      // In a real implementation, this would load from a database
      // For now, we'll simulate loading platform statistics
      console.log('Loading platform statistics...');
      
      // Update platforms with simulated data
      setPlatforms(prev => prev.map(platform => ({
        ...platform,
        deploymentCount: Math.floor(Math.random() * 100),
        lastDeployment: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined
      })));
    } catch (error) {
      console.error('Error loading platform stats:', error);
    }
  };

  const togglePlatform = (platformId: string) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { ...platform, enabled: !platform.enabled }
        : platform
    ));
    
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      toast.success(`${platform.name} ${platform.enabled ? 'disabled' : 'enabled'}`);
    }
  };

  const testPlatformConnection = async (platformId: string) => {
    setTestingPlatform(platformId);
    
    try {
      console.log(`🧪 Testing platform connection: ${platformId}`);
      
      // Test deployment with minimal content
      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          entityName: 'Test Entity',
          targetKeywords: ['test'],
          contentCount: 1,
          deploymentTargets: [platformId],
          saturationMode: 'defensive'
        }
      });

      if (error) {
        throw error;
      }

      // Update platform status
      setPlatforms(prev => prev.map(platform => 
        platform.id === platformId 
          ? { 
              ...platform, 
              status: 'active' as const,
              errorMessage: undefined,
              deploymentCount: platform.deploymentCount + 1,
              lastDeployment: new Date().toISOString()
            }
          : platform
      ));

      toast.success(`✅ ${platforms.find(p => p.id === platformId)?.name} connection test successful!`);
      
    } catch (error: any) {
      console.error(`❌ Platform test failed for ${platformId}:`, error);
      
      // Update platform with error status
      setPlatforms(prev => prev.map(platform => 
        platform.id === platformId 
          ? { 
              ...platform, 
              status: 'error' as const,
              errorMessage: error.message || 'Connection test failed'
            }
          : platform
      ));
      
      toast.error(`❌ ${platforms.find(p => p.id === platformId)?.name} connection test failed`);
    } finally {
      setTestingPlatform(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400"><AlertTriangle className="h-3 w-3 mr-1" />Error</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/20 text-gray-400">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
              <Globe className="h-4 w-4 text-corporate-accent" />
              Active Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {platforms.filter(p => p.enabled && p.status === 'active').length}
            </div>
            <p className="text-xs corporate-subtext">Ready for deployment</p>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Total Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {platforms.reduce((sum, p) => sum + p.deploymentCount, 0)}
            </div>
            <p className="text-xs corporate-subtext">Across all platforms</p>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {platforms.filter(p => p.status === 'error').length}
            </div>
            <p className="text-xs corporate-subtext">Platforms with errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Configuration */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Settings className="h-5 w-5 text-corporate-accent" />
            Platform Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platforms.map(platform => (
              <div key={platform.id} className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-corporate-accent" />
                    <div>
                      <h3 className="font-medium text-white">{platform.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(platform.status)}
                        <span className="text-xs text-corporate-lightGray">
                          {platform.deploymentCount} deployments
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={platform.enabled}
                      onCheckedChange={() => togglePlatform(platform.id)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testPlatformConnection(platform.id)}
                      disabled={testingPlatform === platform.id || !platform.enabled}
                      className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
                    >
                      {testingPlatform === platform.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {platform.errorMessage && (
                  <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded mt-2">
                    Error: {platform.errorMessage}
                  </div>
                )}
                
                {platform.lastDeployment && (
                  <div className="text-xs text-corporate-lightGray mt-2">
                    Last deployment: {new Date(platform.lastDeployment).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformConfiguration;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Github,
  Globe,
  Users,
  MessageSquare,
  FileText,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Platform {
  id: string;
  name: string;
  apiEndpoint: string;
  requiresAuth: boolean;
  status: 'ready' | 'deploying' | 'deployed' | 'failed';
  deploymentUrl?: string;
  icon: React.ReactNode;
}

interface LiveDeploymentManagerProps {
  contentConfig: any;
  onDeploymentComplete: (results: any) => void;
}

export const LiveDeploymentManager = ({ 
  contentConfig, 
  onDeploymentComplete 
}: LiveDeploymentManagerProps) => {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      apiEndpoint: 'github_deploy',
      requiresAuth: true,
      status: 'ready',
      icon: <Github className="h-4 w-4" />
    },
    {
      id: 'medium',
      name: 'Medium',
      apiEndpoint: 'medium_publish',
      requiresAuth: true,
      status: 'ready',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'reddit',
      name: 'Reddit',
      apiEndpoint: 'reddit_post',
      requiresAuth: true,
      status: 'ready',
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      apiEndpoint: 'linkedin_publish',
      requiresAuth: true,
      status: 'ready',
      icon: <Users className="h-4 w-4" />
    }
  ]);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  const deployToRealPlatforms = async () => {
    setIsDeploying(true);
    setDeploymentProgress(0);

    try {
      console.log('🚀 Starting LIVE deployment to real platforms...');
      
      const enabledPlatforms = platforms.filter(p => p.status === 'ready');
      const results = [];

      for (let i = 0; i < enabledPlatforms.length; i++) {
        const platform = enabledPlatforms[i];
        
        setPlatforms(prev => prev.map(p => 
          p.id === platform.id ? { ...p, status: 'deploying' } : p
        ));

        try {
          console.log(`📡 Deploying to ${platform.name}...`);
          
          // Call the persona-saturation edge function with live deployment config
          const { data, error } = await supabase.functions.invoke('persona-saturation', {
            body: {
              ...contentConfig,
              deploymentTargets: [platform.id],
              liveDeployment: true,
              platformEndpoint: platform.apiEndpoint
            }
          });

          if (error) throw error;

          // Handle the new response format with real deployment results
          const deploymentResult = data.deploymentResults?.[0];
          
          if (deploymentResult?.success) {
            setPlatforms(prev => prev.map(p => 
              p.id === platform.id 
                ? { ...p, status: 'deployed', deploymentUrl: deploymentResult.url } 
                : p
            ));

            results.push({
              platform: platform.name,
              success: true,
              url: deploymentResult.url,
              timestamp: new Date().toISOString()
            });

            toast.success(`✅ Live deployment to ${platform.name} successful`);
          } else {
            throw new Error(deploymentResult?.error || 'Deployment failed');
          }

        } catch (error) {
          console.error(`❌ Live deployment to ${platform.name} failed:`, error);
          
          setPlatforms(prev => prev.map(p => 
            p.id === platform.id ? { ...p, status: 'failed' } : p
          ));

          results.push({
            platform: platform.name,
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
          });

          toast.error(`❌ Live deployment to ${platform.name} failed: ${error.message}`);
        }

        setDeploymentProgress(((i + 1) / enabledPlatforms.length) * 100);
      }

      onDeploymentComplete(results);
      
      const successCount = results.filter(r => r.success).length;
      toast.success(`Live deployment complete: ${successCount}/${enabledPlatforms.length} platforms successful`);

    } catch (error) {
      console.error('❌ Live deployment failed:', error);
      toast.error('Live deployment failed - check console for details');
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'deploying': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Globe className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="border-corporate-border bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Rocket className="h-5 w-5 text-corporate-accent" />
          Live Platform Deployment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deployment Progress */}
        {isDeploying && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-corporate-lightGray">Live Deployment Progress</span>
              <span className="text-white">{Math.round(deploymentProgress)}%</span>
            </div>
            <Progress value={deploymentProgress} className="h-2" />
          </div>
        )}

        {/* Platform Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Platform Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {platforms.map((platform) => (
              <div 
                key={platform.id}
                className="flex items-center justify-between p-3 border border-corporate-border rounded"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(platform.status)}
                  {platform.icon}
                  <span className="text-white font-medium">{platform.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {platform.deploymentUrl && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(platform.deploymentUrl, '_blank')}
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                  <Badge 
                    variant={platform.status === 'deployed' ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {platform.status === 'deployed' ? 'LIVE' : platform.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deploy Button */}
        <Button
          onClick={deployToRealPlatforms}
          disabled={isDeploying || !contentConfig}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {isDeploying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying to Live Platforms...
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-4 w-4" />
              Deploy to LIVE Platforms
            </>
          )}
        </Button>

        {/* Warning */}
        <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-orange-400 font-medium">Live Deployment Notice</p>
              <p className="text-orange-300">
                Articles will be published to real platforms with legitimate URLs. Ensure content review is complete.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

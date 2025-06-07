
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
  Loader2,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { deployToGitHubPages, validateGitHubToken } from '@/services/deployment/automatedGitDeployment';

interface Platform {
  id: string;
  name: string;
  apiEndpoint: string;
  requiresAuth: boolean;
  status: 'ready' | 'deploying' | 'deployed' | 'failed' | 'disabled';
  deploymentUrl?: string;
  icon: React.ReactNode;
  hasCredentials?: boolean;
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
      icon: <Github className="h-4 w-4" />,
      hasCredentials: false
    },
    {
      id: 'medium',
      name: 'Medium',
      apiEndpoint: 'medium_publish',
      requiresAuth: true,
      status: 'disabled',
      icon: <FileText className="h-4 w-4" />,
      hasCredentials: false
    },
    {
      id: 'reddit',
      name: 'Reddit',
      apiEndpoint: 'reddit_post',
      requiresAuth: true,
      status: 'disabled',
      icon: <MessageSquare className="h-4 w-4" />,
      hasCredentials: false
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      apiEndpoint: 'linkedin_publish',
      requiresAuth: true,
      status: 'disabled',
      icon: <Users className="h-4 w-4" />,
      hasCredentials: false
    }
  ]);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [credentialsChecked, setCredentialsChecked] = useState(false);

  // Check which platforms have credentials available
  const checkPlatformCredentials = async () => {
    if (credentialsChecked) return;

    console.log('🔍 Checking platform credentials...');
    
    try {
      // Check GitHub credentials
      const hasGitHubToken = await validateGitHubToken();
      
      setPlatforms(prev => prev.map(platform => {
        if (platform.id === 'github-pages') {
          return {
            ...platform,
            hasCredentials: hasGitHubToken,
            status: hasGitHubToken ? 'ready' : 'disabled'
          };
        }
        return platform;
      }));

      setCredentialsChecked(true);
      
      if (hasGitHubToken) {
        toast.success('✅ GitHub credentials validated');
      } else {
        toast.warning('⚠️ GitHub credentials not found - deployment will be limited');
      }

    } catch (error) {
      console.error('Failed to check credentials:', error);
      toast.error('Failed to validate platform credentials');
    }
  };

  // Deploy only to platforms with valid credentials
  const deployToAvailablePlatforms = async () => {
    await checkPlatformCredentials();
    
    const availablePlatforms = platforms.filter(p => p.status === 'ready' && p.hasCredentials);
    
    if (availablePlatforms.length === 0) {
      toast.error('❌ No platforms available for deployment. Please configure credentials.');
      return;
    }

    setIsDeploying(true);
    setDeploymentProgress(0);

    try {
      console.log(`🚀 Starting deployment to ${availablePlatforms.length} available platforms...`);
      
      const results = [];

      for (let i = 0; i < availablePlatforms.length; i++) {
        const platform = availablePlatforms[i];
        
        setPlatforms(prev => prev.map(p => 
          p.id === platform.id ? { ...p, status: 'deploying' } : p
        ));

        try {
          console.log(`📡 Deploying to ${platform.name}...`);
          
          if (platform.id === 'github-pages') {
            // Use automated GitHub Pages deployment
            const deploymentResult = await deployToGitHubPages({
              title: contentConfig.title || 'Professional Content',
              content: contentConfig.content || 'Professional insights and analysis.',
              entity: contentConfig.entity || 'Professional',
              keywords: contentConfig.keywords,
              contentType: contentConfig.contentType
            });

            if (deploymentResult.success) {
              setPlatforms(prev => prev.map(p => 
                p.id === platform.id 
                  ? { ...p, status: 'deployed', deploymentUrl: deploymentResult.url } 
                  : p
              ));

              results.push({
                platform: platform.name,
                success: true,
                url: deploymentResult.url,
                repositoryName: deploymentResult.repositoryName,
                timestamp: new Date().toISOString()
              });

              toast.success(`✅ Successfully deployed to ${platform.name}`);
            } else {
              throw new Error(deploymentResult.error || 'GitHub deployment failed');
            }
          }

        } catch (error) {
          console.error(`❌ Deployment to ${platform.name} failed:`, error);
          
          setPlatforms(prev => prev.map(p => 
            p.id === platform.id ? { ...p, status: 'failed' } : p
          ));

          results.push({
            platform: platform.name,
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
          });

          toast.error(`❌ ${platform.name} deployment failed: ${error.message}`);
        }

        setDeploymentProgress(((i + 1) / availablePlatforms.length) * 100);
      }

      onDeploymentComplete(results);
      
      const successCount = results.filter(r => r.success).length;
      toast.success(`✅ Deployment complete: ${successCount}/${availablePlatforms.length} platforms successful`);

    } catch (error) {
      console.error('❌ Deployment batch failed:', error);
      toast.error('Deployment failed - check console for details');
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'deploying': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'disabled': return <Settings className="h-4 w-4 text-gray-400" />;
      default: return <Globe className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (platform: Platform) => {
    if (platform.status === 'deployed') return <Badge variant="default" className="text-xs">LIVE</Badge>;
    if (platform.status === 'disabled') return <Badge variant="outline" className="text-xs text-gray-500">NO CREDENTIALS</Badge>;
    if (platform.hasCredentials === false) return <Badge variant="outline" className="text-xs text-orange-500">SETUP REQUIRED</Badge>;
    return <Badge variant="outline" className="text-xs">{platform.status.toUpperCase()}</Badge>;
  };

  React.useEffect(() => {
    if (!credentialsChecked) {
      checkPlatformCredentials();
    }
  }, [credentialsChecked]);

  const readyPlatforms = platforms.filter(p => p.status === 'ready' && p.hasCredentials);

  return (
    <Card className="border-corporate-border bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Rocket className="h-5 w-5 text-corporate-accent" />
          Live Platform Deployment
          {readyPlatforms.length > 0 && (
            <Badge variant="outline" className="text-corporate-accent border-corporate-accent">
              {readyPlatforms.length} PLATFORM{readyPlatforms.length !== 1 ? 'S' : ''} READY
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deployment Progress */}
        {isDeploying && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-corporate-lightGray">Deployment Progress</span>
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
                className={`flex items-center justify-between p-3 border rounded ${
                  platform.hasCredentials ? 'border-corporate-border' : 'border-gray-600'
                }`}
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
                  {getStatusBadge(platform)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deploy Button */}
        <Button
          onClick={deployToAvailablePlatforms}
          disabled={isDeploying || !contentConfig || readyPlatforms.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {isDeploying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying to Available Platforms...
            </>
          ) : readyPlatforms.length === 0 ? (
            <>
              <Settings className="mr-2 h-4 w-4" />
              No Platforms Ready - Configure Credentials
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-4 w-4" />
              Deploy to {readyPlatforms.length} Ready Platform{readyPlatforms.length !== 1 ? 's' : ''}
            </>
          )}
        </Button>

        {/* Status Info */}
        {readyPlatforms.length === 0 && (
          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded">
            <div className="flex items-start gap-2">
              <Settings className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-orange-400 font-medium">Platform Setup Required</p>
                <p className="text-orange-300">
                  Configure API credentials for platforms you want to deploy to. GitHub is recommended for anonymous hosting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Notice */}
        {readyPlatforms.length > 0 && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-green-400 font-medium">Ready for Live Deployment</p>
                <p className="text-green-300">
                  {readyPlatforms.length} platform{readyPlatforms.length !== 1 ? 's are' : ' is'} configured and ready. 
                  Content will be published to real URLs.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

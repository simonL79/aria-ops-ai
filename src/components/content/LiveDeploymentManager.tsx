
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
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { deployToGitHubPages, validateGitHubToken } from '@/services/deployment/automatedGitDeployment';

interface Platform {
  id: string;
  name: string;
  status: 'ready' | 'deploying' | 'deployed' | 'failed' | 'disabled';
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
      status: 'ready',
      icon: <Github className="h-4 w-4" />
    }
  ]);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  const deployToGitHub = async () => {
    setIsDeploying(true);
    setDeploymentProgress(0);

    try {
      console.log('🚀 Starting GitHub Pages deployment...');
      
      // Validate GitHub token first
      const isTokenValid = await validateGitHubToken();
      if (!isTokenValid) {
        throw new Error('GitHub API token is invalid or missing');
      }

      setPlatforms(prev => prev.map(p => 
        p.id === 'github-pages' ? { ...p, status: 'deploying' } : p
      ));

      setDeploymentProgress(25);

      // Deploy to GitHub
      const result = await deployToGitHubPages({
        title: contentConfig.title || 'Professional Content',
        content: contentConfig.content || 'Professional analysis content',
        entity: contentConfig.targetEntity || 'Professional',
        keywords: contentConfig.keywords || [],
        contentType: contentConfig.contentType || 'positive_profile'
      });

      setDeploymentProgress(75);

      if (result.success && result.url) {
        setPlatforms(prev => prev.map(p => 
          p.id === 'github-pages' 
            ? { ...p, status: 'deployed', deploymentUrl: result.url } 
            : p
        ));

        const deploymentResult = {
          platform: 'GitHub Pages',
          success: true,
          url: result.url,
          repositoryName: result.repositoryName,
          timestamp: new Date().toISOString()
        };

        onDeploymentComplete([deploymentResult]);
        toast.success(`✅ Live deployment to GitHub Pages successful!`);
        
      } else {
        throw new Error(result.error || 'GitHub deployment failed');
      }

      setDeploymentProgress(100);

    } catch (error) {
      console.error('❌ GitHub deployment failed:', error);
      
      setPlatforms(prev => prev.map(p => 
        p.id === 'github-pages' ? { ...p, status: 'failed' } : p
      ));

      const failedResult = {
        platform: 'GitHub Pages',
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };

      onDeploymentComplete([failedResult]);
      toast.error(`❌ GitHub deployment failed: ${error.message}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'deploying': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'disabled': return <AlertTriangle className="h-4 w-4 text-gray-400" />;
      default: return <Github className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="border-corporate-border bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Rocket className="h-5 w-5 text-corporate-accent" />
          Live GitHub Pages Deployment
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
          <div className="space-y-2">
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
          onClick={deployToGitHub}
          disabled={isDeploying || !contentConfig}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {isDeploying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying to GitHub Pages...
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-4 w-4" />
              Deploy to GitHub Pages
            </>
          )}
        </Button>

        {/* Info */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
          <div className="flex items-start gap-2">
            <Github className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-400 font-medium">Anonymous Deployment</p>
              <p className="text-blue-300">
                Creates anonymous repositories with sanitized content, removing ARIA and personal identifiers.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

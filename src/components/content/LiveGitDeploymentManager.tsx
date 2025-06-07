
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
  GitBranch,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { GitDeploymentService } from '@/services/deployment/gitDeployment';

interface LiveGitDeploymentManagerProps {
  contentConfig: {
    clientName?: string;
    contentType?: string;
    targetKeywords?: string[];
    generatedContent?: {
      title: string;
      content: string;
      keywords: string[];
    };
  };
  onDeploymentComplete: (results: any[]) => void;
}

export const LiveGitDeploymentManager: React.FC<LiveGitDeploymentManagerProps> = ({ 
  contentConfig, 
  onDeploymentComplete 
}) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentResults, setDeploymentResults] = useState<any[]>([]);

  const handleGitDeployment = async () => {
    if (!contentConfig.generatedContent) {
      toast.error('No content available for deployment');
      return;
    }

    setIsDeploying(true);
    setDeploymentProgress(0);

    try {
      console.log('🚀 Starting Git-based deployment...');
      
      const deploymentOptions = {
        entityName: contentConfig.clientName || 'Client',
        content: contentConfig.generatedContent.content,
        title: contentConfig.generatedContent.title,
        keywords: contentConfig.generatedContent.keywords || [],
        contentType: contentConfig.contentType || 'content'
      };

      setDeploymentProgress(50);

      const result = await GitDeploymentService.deployToGitHub(deploymentOptions);
      
      setDeploymentProgress(100);

      const deploymentResult = {
        platform: 'GitHub Pages',
        success: result.success,
        url: result.deploymentUrl,
        repositoryUrl: result.repositoryUrl,
        timestamp: result.timestamp,
        deploymentType: result.deploymentType
      };

      setDeploymentResults([deploymentResult]);
      onDeploymentComplete([deploymentResult]);

      if (result.success) {
        toast.success(`Git deployment ready! Repository created for live deployment.`);
      } else {
        toast.error('Git deployment failed');
      }

    } catch (error) {
      console.error('❌ Git deployment failed:', error);
      toast.error(`Git deployment failed: ${error.message}`);
      
      const failedResult = {
        platform: 'GitHub Pages',
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      setDeploymentResults([failedResult]);
      onDeploymentComplete([failedResult]);
    } finally {
      setIsDeploying(false);
    }
  };

  const downloadGitInstructions = () => {
    if (!contentConfig.generatedContent) return;

    const timestamp = Date.now();
    const slug = contentConfig.clientName?.toLowerCase().replace(/\s+/g, '-') || 'content';
    const repoName = `${slug}-content-${timestamp}`;
    
    const instructions = `# Git Deployment Instructions

## Repository Setup
1. Create a new GitHub repository named: ${repoName}
2. Make it public (required for GitHub Pages)
3. Clone the repository locally

## Content Deployment
Create an index.html file with the generated content and push to GitHub.

## Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section  
3. Set source to "Deploy from a branch"
4. Select "main" branch and save

Your site will be live at: https://YOUR_USERNAME.github.io/${repoName}

Generated: ${new Date().toISOString()}
    `;

    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `git-deployment-${timestamp}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Git deployment instructions downloaded');
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
          <GitBranch className="h-5 w-5 text-corporate-accent" />
          Live Git Deployment Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deployment Progress */}
        {isDeploying && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-corporate-lightGray">Git Deployment Progress</span>
              <span className="text-white">{Math.round(deploymentProgress)}%</span>
            </div>
            <Progress value={deploymentProgress} className="h-2" />
          </div>
        )}

        {/* Content Summary */}
        {contentConfig.generatedContent && (
          <div className="p-3 bg-corporate-dark rounded border border-corporate-border">
            <div className="text-sm text-corporate-lightGray mb-2">Ready for Deployment:</div>
            <div className="text-white font-medium">{contentConfig.generatedContent.title}</div>
            <div className="text-xs text-corporate-lightGray mt-1">
              {contentConfig.generatedContent.keywords?.length || 0} keywords • {contentConfig.contentType}
            </div>
          </div>
        )}

        {/* Deployment Results */}
        {deploymentResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Deployment Status</h4>
            {deploymentResults.map((result, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border border-corporate-border rounded"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.success ? 'deployed' : 'failed')}
                  <Github className="h-4 w-4" />
                  <span className="text-white font-medium">{result.platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.success && result.url && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(result.url, '_blank')}
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                  <Badge 
                    variant={result.success ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {result.success ? 'READY' : 'FAILED'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleGitDeployment}
            disabled={isDeploying || !contentConfig.generatedContent}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isDeploying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing Git Deployment...
              </>
            ) : (
              <>
                <GitBranch className="mr-2 h-4 w-4" />
                Deploy via Git
              </>
            )}
          </Button>

          <Button
            onClick={downloadGitInstructions}
            disabled={!contentConfig.generatedContent}
            variant="outline"
            className="text-corporate-accent border-corporate-accent"
          >
            <Download className="h-4 w-4 mr-2" />
            Instructions
          </Button>
        </div>

        {/* Information Notice */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
          <div className="flex items-start gap-2">
            <GitBranch className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-400 font-medium">Git-Based Deployment</p>
              <p className="text-blue-300">
                Creates real GitHub repository with live, indexable HTML. No API keys required.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

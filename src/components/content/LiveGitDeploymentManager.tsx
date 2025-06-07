import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
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
  Download,
  Copy,
  Code,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { GitDeploymentService } from '@/services/deployment/gitDeployment';
import { AutomatedGitDeploymentService } from '@/services/deployment/automatedGitDeployment';

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
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);
  const [setupInstructions, setSetupInstructions] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [deploymentMode, setDeploymentMode] = useState<'automated' | 'manual'>('automated');

  const handleAutomatedGitDeployment = async () => {
    if (!contentConfig.generatedContent) {
      toast.error('No content available for deployment');
      return;
    }

    setIsDeploying(true);
    setDeploymentProgress(0);

    try {
      console.log('🚀 Starting automated GitHub Pages deployment...');
      
      const deploymentOptions = {
        entityName: contentConfig.clientName || 'Client',
        content: contentConfig.generatedContent.content,
        title: contentConfig.generatedContent.title,
        keywords: contentConfig.generatedContent.keywords || [],
        contentType: contentConfig.contentType || 'content'
      };

      setDeploymentProgress(25);
      toast.info('Creating GitHub repository...');

      const result = await AutomatedGitDeploymentService.deployToGitHubPages(deploymentOptions);
      
      setDeploymentProgress(100);

      const deploymentResult = {
        platform: 'GitHub Pages',
        success: result.success,
        url: result.deploymentUrl,
        repositoryUrl: result.repositoryUrl,
        timestamp: result.timestamp,
        deploymentType: result.deploymentType,
        repositoryName: result.repositoryName
      };

      setDeploymentResults([deploymentResult]);
      onDeploymentComplete([deploymentResult]);

      toast.success(`🎉 Content deployed successfully! Live at: ${result.deploymentUrl}`);

    } catch (error) {
      console.error('❌ Automated deployment failed:', error);
      
      // Fall back to manual deployment preparation
      toast.error(`Automated deployment failed: ${error.message}. Preparing manual deployment...`);
      await handleManualGitDeployment();
    } finally {
      setIsDeploying(false);
    }
  };

  const handleManualGitDeployment = async () => {
    if (!contentConfig.generatedContent) {
      toast.error('No content available for deployment');
      return;
    }

    setIsDeploying(true);
    setDeploymentProgress(0);

    try {
      console.log('🚀 Starting manual Git deployment preparation...');
      
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
        deploymentType: result.deploymentType,
        repositoryName: result.repositoryName
      };

      setDeploymentResults([deploymentResult]);
      setSetupInstructions(result.setupInstructions);
      setHtmlContent(result.htmlContent);
      onDeploymentComplete([deploymentResult]);

      if (result.success) {
        toast.success('Manual deployment package ready! Follow setup instructions to go live.');
        setShowSetupInstructions(true);
      } else {
        toast.error('Deployment preparation failed');
      }

    } catch (error) {
      console.error('❌ Manual deployment preparation failed:', error);
      toast.error(`Manual deployment preparation failed: ${error.message}`);
      
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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded!`);
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
        {/* Deployment Mode Selection */}
        <div className="flex gap-2 p-1 bg-corporate-dark rounded border border-corporate-border">
          <Button
            onClick={() => setDeploymentMode('automated')}
            variant={deploymentMode === 'automated' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
          >
            <Zap className="h-4 w-4 mr-2" />
            Automated
          </Button>
          <Button
            onClick={() => setDeploymentMode('manual')}
            variant={deploymentMode === 'manual' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
          >
            <Code className="h-4 w-4 mr-2" />
            Manual Setup
          </Button>
        </div>

        {/* Deployment Progress */}
        {isDeploying && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-corporate-lightGray">
                {deploymentMode === 'automated' ? 'Automated Deployment' : 'Preparing Manual Deployment'}
              </span>
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
                  {result.repositoryName && (
                    <Badge variant="outline" className="text-xs">
                      {result.repositoryName}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {result.url && result.success && (
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
                    {result.success ? (deploymentMode === 'automated' ? 'LIVE' : 'READY') : 'FAILED'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Setup Instructions - Only show for manual mode */}
        {showSetupInstructions && setupInstructions && deploymentMode === 'manual' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">Setup Instructions</h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(setupInstructions, 'Setup instructions')}
                  className="h-6 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadFile(setupInstructions, 'setup-instructions.md', 'text/markdown')}
                  className="h-6 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <Textarea
              value={setupInstructions}
              readOnly
              className="bg-corporate-dark border-corporate-border text-white font-mono text-xs min-h-[200px]"
            />
          </div>
        )}

        {/* HTML Content Download - Only show for manual mode */}
        {htmlContent && deploymentMode === 'manual' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">Generated HTML Content</h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(htmlContent, 'HTML content')}
                  className="h-6 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy HTML
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadFile(htmlContent, 'index.html', 'text/html')}
                  className="h-6 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download HTML
                </Button>
              </div>
            </div>
            <div className="p-3 bg-corporate-dark rounded border border-corporate-border">
              <div className="text-xs text-corporate-lightGray">
                Complete HTML file ready for GitHub Pages deployment
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={deploymentMode === 'automated' ? handleAutomatedGitDeployment : handleManualGitDeployment}
            disabled={isDeploying || !contentConfig.generatedContent}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isDeploying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {deploymentMode === 'automated' ? 'Deploying...' : 'Preparing...'}
              </>
            ) : (
              <>
                {deploymentMode === 'automated' ? (
                  <Zap className="mr-2 h-4 w-4" />
                ) : (
                  <GitBranch className="mr-2 h-4 w-4" />
                )}
                {deploymentMode === 'automated' ? 'Deploy to GitHub Pages' : 'Prepare Manual Deployment'}
              </>
            )}
          </Button>
        </div>

        {/* Information Notice */}
        <div className={`p-3 rounded border ${
          deploymentMode === 'automated' 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-blue-500/10 border-blue-500/30'
        }`}>
          <div className="flex items-start gap-2">
            {deploymentMode === 'automated' ? (
              <Zap className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <GitBranch className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <p className={`font-medium ${
                deploymentMode === 'automated' ? 'text-green-400' : 'text-blue-400'
              }`}>
                {deploymentMode === 'automated' ? 'Automated GitHub Deployment' : 'Manual GitHub Setup Required'}
              </p>
              <p className={deploymentMode === 'automated' ? 'text-green-300' : 'text-blue-300'}>
                {deploymentMode === 'automated' 
                  ? 'Automatically creates repository, uploads content, and enables GitHub Pages using your API token.'
                  : 'Creates deployment package with HTML content and step-by-step instructions for GitHub Pages setup.'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

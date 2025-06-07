
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Github, 
  Download, 
  FileText, 
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { OllamaContentGenerator } from '@/services/localContent/ollamaGenerator';
import { GitDeploymentService } from '@/services/deployment/gitDeployment';

interface LiveGitDeploymentManagerProps {
  entityName: string;
  contentType: 'positive_profile' | 'counter_narrative' | 'news_article';
  keywords: string[];
  onDeploymentComplete?: (result: any) => void;
}

export const LiveGitDeploymentManager = ({
  entityName,
  contentType,
  keywords,
  onDeploymentComplete
}: LiveGitDeploymentManagerProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [step, setStep] = useState<'generate' | 'review' | 'deploy' | 'complete'>('generate');

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    
    try {
      console.log('🧠 Generating content locally for:', entityName);
      
      const content = await OllamaContentGenerator.generateContent({
        entityName,
        contentType,
        keywords,
        wordCount: 800
      });
      
      setGeneratedContent(content);
      setStep('review');
      
      toast.success('Content generated locally - no API calls required');
      
    } catch (error) {
      console.error('Content generation failed:', error);
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrepareDeployment = async () => {
    if (!generatedContent) return;
    
    try {
      const result = await GitDeploymentService.deployToGitHub({
        entityName,
        content: generatedContent.content,
        title: generatedContent.title,
        keywords: generatedContent.keywords,
        contentType
      });
      
      setDeploymentResult(result);
      setStep('deploy');
      
      toast.success('Deployment package prepared');
      
    } catch (error) {
      console.error('Deployment preparation failed:', error);
      toast.error('Failed to prepare deployment');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleDownloadHTML = () => {
    if (!generatedContent) return;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entityName.toLowerCase().replace(/\s+/g, '-')}-content.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('HTML file downloaded');
  };

  return (
    <Card className="border-corporate-border bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Github className="h-5 w-5 text-green-400" />
          A.R.I.A.™ Live Git Deployment (No API Keys)
        </CardTitle>
        <div className="flex gap-2">
          <Badge className="bg-green-500/20 text-green-400">LOCAL GENERATION</Badge>
          <Badge className="bg-blue-500/20 text-blue-400">GIT DEPLOYMENT</Badge>
          <Badge className="bg-purple-500/20 text-purple-400">LIVE URLS</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step 1: Generate Content */}
        {step === 'generate' && (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
              <h3 className="text-white font-medium mb-2">Step 1: Local Content Generation</h3>
              <p className="text-green-300 text-sm mb-4">
                Generate SEO-optimized content locally without external API calls
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-green-400 text-sm">Entity:</span>
                  <p className="text-white">{entityName}</p>
                </div>
                <div>
                  <span className="text-green-400 text-sm">Content Type:</span>
                  <p className="text-white">{contentType.replace(/_/g, ' ').toUpperCase()}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-green-400 text-sm">Keywords:</span>
                  <p className="text-white">{keywords.join(', ')}</p>
                </div>
              </div>
              
              <Button 
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isGenerating ? 'Generating Content...' : 'Generate Content Locally'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Review Content */}
        {step === 'review' && generatedContent && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
              <h3 className="text-white font-medium mb-2">Step 2: Review Generated Content</h3>
              
              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-blue-400 text-sm">Title:</span>
                  <p className="text-white font-medium">{generatedContent.title}</p>
                </div>
                <div>
                  <span className="text-blue-400 text-sm">Word Count:</span>
                  <p className="text-white">{generatedContent.metadata.word_count} words</p>
                </div>
                <div>
                  <span className="text-blue-400 text-sm">Content Preview:</span>
                  <div className="bg-black/30 p-3 rounded text-white text-sm max-h-32 overflow-y-auto">
                    {generatedContent.content.substring(0, 300)}...
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handlePrepareDeployment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Prepare Git Deployment
                </Button>
                <Button 
                  onClick={() => setStep('generate')}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Regenerate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Deploy */}
        {step === 'deploy' && deploymentResult && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Deployment package ready! Follow the instructions below to deploy to GitHub Pages.
              </AlertDescription>
            </Alert>
            
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded">
              <h3 className="text-white font-medium mb-2">Step 3: Git Deployment Instructions</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 text-sm">Target URL:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-black/30 px-2 py-1 rounded text-green-400 text-sm">
                      {deploymentResult.deploymentUrl}
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(deploymentResult.deploymentUrl)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 text-sm">Repository:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-black/30 px-2 py-1 rounded text-green-400 text-sm">
                      {deploymentResult.repositoryUrl}
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(deploymentResult.repositoryUrl)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleDownloadHTML}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Complete HTML File
                </Button>
                
                <Button 
                  onClick={() => setStep('complete')}
                  variant="outline"
                  className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                >
                  Mark as Deployed
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 'complete' && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
            <h3 className="text-white text-xl font-bold">Deployment Complete!</h3>
            <p className="text-green-300">
              Your content has been prepared for live deployment to GitHub Pages
            </p>
            
            {deploymentResult && (
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => window.open(deploymentResult.deploymentUrl, '_blank')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Live Site
                </Button>
                <Button 
                  onClick={() => window.open(deploymentResult.repositoryUrl, '_blank')}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Github className="h-4 w-4 mr-2" />
                  View Repository
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Technical Details */}
        <div className="text-xs text-corporate-lightGray space-y-1 pt-4 border-t border-corporate-border">
          <p>✅ Local content generation - No external API calls</p>
          <p>✅ Git-based deployment - No platform API keys required</p>
          <p>✅ Real GitHub Pages URLs - Fully indexable by search engines</p>
          <p>✅ Complete HTML with Schema.org markup for SEO</p>
          <p>✅ Zero recurring costs - Free GitHub hosting</p>
        </div>
      </CardContent>
    </Card>
  );
};

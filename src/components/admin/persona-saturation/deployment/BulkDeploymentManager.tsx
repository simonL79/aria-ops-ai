
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { deployToGitHubPages } from '@/services/deployment/automatedGitDeployment';

interface DeploymentJob {
  id: string;
  name: string;
  platform: string;
  status: 'running' | 'queued' | 'completed' | 'failed';
  progress: number;
  articles: number;
  entityName: string;
  keywords: string[];
  startedAt: string;
  url?: string;
}

const BulkDeploymentManager = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['github-pages']);
  const [batchSize, setBatchSize] = useState(50);
  const [entityName, setEntityName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentJobs, setCurrentJobs] = useState<DeploymentJob[]>([]);

  const platforms = [
    { id: 'github-pages', name: 'GitHub Pages', status: 'active' },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const startBulkDeployment = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (!entityName.trim() || !keywords.trim()) {
      toast.error('Please provide entity name and keywords');
      return;
    }

    setIsDeploying(true);
    setProgress(0);
    
    try {
      console.log('🚀 Starting LIVE bulk deployment to GitHub Pages...');
      
      const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
      const successfulDeployments: string[] = [];
      const failedDeployments: string[] = [];
      
      // Deploy multiple articles to GitHub Pages
      for (let i = 0; i < batchSize; i++) {
        try {
          setProgress((i / batchSize) * 100);
          
          const articleTitle = `${entityName} - Professional Excellence Article ${i + 1}`;
          const articleContent = `This is a professional article about ${entityName} focusing on ${keywordArray.join(', ')}. Article ${i + 1} of ${batchSize} in the bulk deployment series.`;
          
          const result = await deployToGitHubPages({
            title: articleTitle,
            content: articleContent,
            entity: entityName,
            keywords: keywordArray,
            contentType: 'positive_profile'
          });

          if (result.success && result.url) {
            successfulDeployments.push(result.url);
            console.log(`✅ Article ${i + 1} deployed: ${result.url}`);
          } else {
            failedDeployments.push(`Article ${i + 1}: ${result.error}`);
            console.error(`❌ Article ${i + 1} failed: ${result.error}`);
          }
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          failedDeployments.push(`Article ${i + 1}: ${error.message}`);
          console.error(`❌ Article ${i + 1} error:`, error);
        }
      }

      // Create job entries from the deployment results
      const newJob: DeploymentJob = {
        id: `bulk-${Date.now()}`,
        name: `Live Bulk Deployment - ${entityName}`,
        platform: 'github-pages',
        status: 'completed' as const,
        progress: 100,
        articles: batchSize,
        entityName,
        keywords: keywordArray,
        startedAt: new Date().toISOString(),
        url: successfulDeployments[0] || undefined
      };

      setCurrentJobs(prev => [newJob, ...prev].slice(0, 10));
      setProgress(100);
      
      toast.success(`✅ LIVE bulk deployment completed! ${successfulDeployments.length}/${batchSize} articles deployed successfully.`);
      
      if (failedDeployments.length > 0) {
        console.error('Failed deployments:', failedDeployments);
        toast.error(`${failedDeployments.length} deployments failed. Check console for details.`);
      }
      
    } catch (error: any) {
      console.error('❌ Bulk deployment failed:', error);
      toast.error(`❌ Bulk deployment failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const stopDeployment = () => {
    setIsDeploying(false);
    setProgress(0);
    toast.info('Bulk deployment stopped');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-500/20 text-blue-400"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Running</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400"><AlertTriangle className="h-3 w-3 mr-1" />Failed</Badge>;
      case 'queued':
        return <Badge className="bg-yellow-500/20 text-yellow-400"><Clock className="h-3 w-3 mr-1" />Queued</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Deployment Notice */}
      <Card className="corporate-card border-green-500/30 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-green-400">LIVE GitHub Deployment Active</h3>
              <p className="text-sm text-green-300">
                ✅ Real repositories will be created with live GitHub Pages deployment - NO SIMULATION
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Deployment Configuration */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Globe className="h-5 w-5 text-corporate-accent" />
            Live Bulk Deployment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entityName" className="text-white">Entity Name</Label>
              <Input
                id="entityName"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="e.g. Professional Services LLC"
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="keywords" className="text-white">Target Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. excellence, leadership, innovation"
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="batchSize" className="text-white">Batch Size (Articles per Platform)</Label>
            <Input
              id="batchSize"
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value) || 50)}
              className="bg-corporate-darkSecondary border-corporate-border text-white max-w-32"
            />
          </div>

          <div>
            <Label className="text-white">Target Platforms</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {platforms.map(platform => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => handlePlatformToggle(platform.id)}
                  />
                  <label htmlFor={platform.id} className="text-sm text-white cursor-pointer">
                    {platform.name} (LIVE)
                  </label>
                </div>
              ))}
            </div>
          </div>

          {isDeploying && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white">Deployment Progress</span>
                <span className="text-sm text-corporate-accent">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={startBulkDeployment}
              disabled={isDeploying || selectedPlatforms.length === 0}
              className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  LIVE Deploying...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start LIVE Bulk Deployment
                </>
              )}
            </Button>
            
            {isDeploying && (
              <Button
                onClick={stopDeployment}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Jobs */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <FileText className="h-5 w-5 text-corporate-accent" />
            Recent LIVE Deployment Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentJobs.length > 0 ? currentJobs.map(job => (
              <div key={job.id} className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-white">{job.name}</div>
                    <div className="text-sm text-corporate-lightGray">
                      Platform: {job.platform} | Articles: {job.articles}
                    </div>
                    <div className="text-xs text-corporate-lightGray">
                      Entity: {job.entityName} | Keywords: {job.keywords.join(', ')}
                    </div>
                  </div>
                  {getStatusBadge(job.status)}
                </div>
                {job.progress < 100 && job.status === 'running' && (
                  <Progress value={job.progress} className="h-1 mt-2" />
                )}
                {job.url && (
                  <div className="text-xs text-corporate-accent mt-1">
                    Deployed: {job.url}
                  </div>
                )}
              </div>
            )) : (
              <div className="text-center py-8 text-corporate-lightGray">
                <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No deployment jobs yet</p>
                <p className="text-sm">Start your first bulk deployment above</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkDeploymentManager;

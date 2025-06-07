import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Check, 
  Clock, 
  AlertTriangle, 
  Github,
  Cloud,
  Zap,
  FileText,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ZeroCostPlatform {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  cost: 'free';
  setup: 'auto' | 'manual';
  indexable: boolean;
}

interface DeploymentResult {
  platform: string;
  success: boolean;
  url?: string;
  error?: string;
  timestamp: string;
}

interface ZeroCostDeploymentManagerProps {
  contentConfig: any;
  onDeploymentComplete: (results: DeploymentResult[]) => void;
}

export const ZeroCostDeploymentManager = ({
  contentConfig,
  onDeploymentComplete
}: ZeroCostDeploymentManagerProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['github-pages']);

  const zeroCostPlatforms: ZeroCostPlatform[] = [
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      description: 'Free static hosting with custom domains',
      icon: <Github className="h-4 w-4" />,
      cost: 'free',
      setup: 'auto',
      indexable: true
    },
    {
      id: 'cloudflare-pages',
      name: 'Cloudflare Pages',
      description: 'Edge-optimized hosting with global CDN',
      icon: <Cloud className="h-4 w-4" />,
      cost: 'free',
      setup: 'auto',
      indexable: true
    },
    {
      id: 'netlify',
      name: 'Netlify',
      description: 'JAMstack deployment with instant SSL',
      icon: <Zap className="h-4 w-4" />,
      cost: 'free',
      setup: 'auto',
      indexable: true
    },
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Frontend cloud with edge functions',
      icon: <FileText className="h-4 w-4" />,
      cost: 'free',
      setup: 'auto',
      indexable: true
    }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleZeroCostDeployment = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one deployment platform');
      return;
    }

    setIsDeploying(true);
    setDeploymentProgress(0);
    setDeploymentStatus('Initializing zero-cost deployment...');

    try {
      const results: DeploymentResult[] = [];
      const totalSteps = selectedPlatforms.length;

      for (let i = 0; i < selectedPlatforms.length; i++) {
        const platform = selectedPlatforms[i];
        setDeploymentStatus(`Deploying to ${platform}...`);
        setDeploymentProgress((i / totalSteps) * 100);

        try {
          const { data, error } = await supabase.functions.invoke('zero-cost-deploy', {
            body: {
              platform,
              content: contentConfig.generatedContent,
              title: contentConfig.generatedContent.title,
              entity: contentConfig.clientName,
              contentType: contentConfig.contentType,
              keywords: contentConfig.targetKeywords || [],
              enableSEO: true,
              generateSitemap: true,
              jsonLD: true
            }
          });

          if (error) throw error;

          results.push({
            platform,
            success: true,
            url: data.deploymentUrl,
            timestamp: new Date().toISOString()
          });

          toast.success(`✅ Deployed to ${platform}: ${data.deploymentUrl}`);

        } catch (error) {
          console.error(`Deployment to ${platform} failed:`, error);
          results.push({
            platform,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          });

          toast.error(`❌ ${platform} deployment failed`);
        }
      }

      setDeploymentProgress(100);
      setDeploymentStatus('Zero-cost deployment complete!');
      
      // Log successful zero-cost deployment with proper JSON serialization
      const operationData = {
        platforms_deployed: selectedPlatforms.length,
        successful_deployments: results.filter(r => r.success).length,
        total_cost: 0,
        deployment_results: results.map(r => ({
          platform: r.platform,
          success: r.success,
          url: r.url || null,
          error: r.error || null,
          timestamp: r.timestamp
        }))
      };

      await supabase.from('aria_ops_log').insert({
        operation_type: 'zero_cost_deployment',
        entity_name: contentConfig.clientName,
        module_source: 'zero_cost_deployment_manager',
        success: true,
        operation_data: operationData as any
      });

      onDeploymentComplete(results);
      
      toast.success(`🎯 Zero-cost saturation complete: ${results.filter(r => r.success).length}/${results.length} platforms live`);

    } catch (error) {
      console.error('Zero-cost deployment failed:', error);
      toast.error('Zero-cost deployment failed');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="border-corporate-border bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Globe className="h-5 w-5 text-green-400" />
          A.R.I.A™ Zero-Cost Saturation Deployment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zero-Cost Benefits */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">$0</div>
            <p className="text-xs text-green-300">Total Cost</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">100%</div>
            <p className="text-xs text-green-300">SEO Indexable</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">∞</div>
            <p className="text-xs text-green-300">Scale Potential</p>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">Select Zero-Cost Platforms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {zeroCostPlatforms.map(platform => (
              <div 
                key={platform.id}
                className={`p-3 border rounded cursor-pointer transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-green-400 bg-green-400/10'
                    : 'border-corporate-border hover:border-green-400/50'
                }`}
                onClick={() => handlePlatformToggle(platform.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {platform.icon}
                    <span className="text-white font-medium">{platform.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Badge className="bg-green-500/20 text-green-400 text-xs">FREE</Badge>
                    {platform.indexable && (
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">SEO</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-corporate-lightGray">{platform.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Progress */}
        {isDeploying && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-corporate-accent animate-spin" />
              <span className="text-white">{deploymentStatus}</span>
            </div>
            <Progress value={deploymentProgress} className="w-full" />
          </div>
        )}

        {/* Deployment Button */}
        <Button
          onClick={handleZeroCostDeployment}
          disabled={isDeploying || selectedPlatforms.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
        >
          {isDeploying ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Deploying to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Deploy Zero-Cost Saturation ({selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''})
            </>
          )}
        </Button>

        {/* Technical Details */}
        <div className="text-xs text-corporate-lightGray space-y-1">
          <p>✅ No API keys required - Direct Git deployment</p>
          <p>✅ Automatic JSON-LD schema injection for Google News</p>
          <p>✅ Auto-generated sitemaps for search engine discovery</p>
          <p>✅ Edge-optimized global CDN distribution</p>
          <p>✅ Custom domain support (configure post-deployment)</p>
        </div>
      </CardContent>
    </Card>
  );
};

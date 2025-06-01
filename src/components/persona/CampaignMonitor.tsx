
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Globe, CheckCircle, Clock, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SaturationCampaign {
  id: string;
  entityName: string;
  status: 'planning' | 'generating' | 'deploying' | 'indexing' | 'monitoring' | 'completed';
  progress: number;
  contentGenerated: number;
  deploymentsSuccessful: number;
  serpPenetration: number;
  estimatedImpact: string;
  deploymentUrls?: string[];
  platformResults?: Record<string, { success: number; total: number; urls: string[] }>;
}

interface CampaignMonitorProps {
  currentCampaign: SaturationCampaign | null;
}

const CampaignMonitor: React.FC<CampaignMonitorProps> = ({ currentCampaign }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'deploying': return 'bg-blue-500';
      case 'generating': return 'bg-yellow-500';
      case 'planning': return 'bg-gray-500';
      default: return 'bg-corporate-accent';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'deploying': return <Globe className="h-4 w-4" />;
      case 'generating': return <Activity className="h-4 w-4 animate-spin" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copied to clipboard');
  };

  const copyAllUrls = () => {
    const allUrls = getAllDeployedUrls();
    if (allUrls.length > 0) {
      navigator.clipboard.writeText(allUrls.join('\n'));
      toast.success(`${allUrls.length} URLs copied to clipboard`);
    }
  };

  const getAllDeployedUrls = (): string[] => {
    if (!currentCampaign) return [];
    
    const urls: string[] = [];
    
    // Get URLs from deploymentUrls if available
    if (currentCampaign.deploymentUrls) {
      urls.push(...currentCampaign.deploymentUrls);
    }
    
    // Get URLs from platformResults if available
    if (currentCampaign.platformResults) {
      Object.values(currentCampaign.platformResults).forEach(platform => {
        if (platform.urls) {
          urls.push(...platform.urls);
        }
      });
    }
    
    return [...new Set(urls)]; // Remove duplicates
  };

  if (!currentCampaign) {
    return (
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Activity className="h-5 w-5 text-corporate-accent" />
            Campaign Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
            <p className="text-corporate-lightGray">No active campaign</p>
            <p className="text-sm text-corporate-lightGray mt-2">Deploy a campaign to monitor progress</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const deployedUrls = getAllDeployedUrls();

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Activity className="h-5 w-5 text-corporate-accent" />
          Campaign Monitor
        </CardTitle>
        <Badge className={`${getStatusColor(currentCampaign.status)} text-white ml-auto`}>
          {getStatusIcon(currentCampaign.status)}
          <span className="ml-1 capitalize">{currentCampaign.status}</span>
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-white mb-2">{currentCampaign.entityName}</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-corporate-lightGray">Overall Progress</span>
              <span className="text-white">{currentCampaign.progress}%</span>
            </div>
            <Progress value={currentCampaign.progress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-corporate-lightGray">Content Generated</p>
            <p className="text-lg font-semibold text-white">{currentCampaign.contentGenerated}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-corporate-lightGray">Deployments</p>
            <p className="text-lg font-semibold text-white">{currentCampaign.deploymentsSuccessful}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-corporate-lightGray">SERP Penetration</p>
            <p className="text-lg font-semibold text-green-400">{currentCampaign.serpPenetration}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-corporate-lightGray">Live URLs</p>
            <p className="text-lg font-semibold text-corporate-accent">{deployedUrls.length}</p>
          </div>
        </div>

        {currentCampaign.status === 'completed' && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Campaign Completed Successfully</span>
            </div>
          </div>
        )}

        {/* Deployed URLs Section */}
        {deployedUrls.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-corporate-accent" />
                Deployed URLs ({deployedUrls.length})
              </h5>
              <Button
                size="sm"
                variant="outline"
                onClick={copyAllUrls}
                className="text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy All
              </Button>
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2 bg-corporate-darkSecondary/50 rounded-lg p-3">
              {deployedUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-corporate-background/50 rounded p-2">
                  <span className="text-corporate-lightGray truncate flex-1 mr-2">{url}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(url)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => window.open(url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platform Results Breakdown */}
        {currentCampaign.platformResults && Object.keys(currentCampaign.platformResults).length > 0 && (
          <div className="mt-4 space-y-3">
            <h5 className="font-medium text-white">Platform Breakdown</h5>
            <div className="space-y-2">
              {Object.entries(currentCampaign.platformResults).map(([platform, results]) => (
                <div key={platform} className="flex items-center justify-between text-sm bg-corporate-darkSecondary/30 rounded p-2">
                  <span className="text-white capitalize">{platform.replace('-', ' ')}</span>
                  <div className="flex items-center gap-2 text-corporate-lightGray">
                    <span>{results.success}/{results.total}</span>
                    <Badge variant="outline" className="text-xs">
                      {results.urls.length} URLs
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignMonitor;

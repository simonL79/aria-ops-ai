
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Rocket, ExternalLink, Copy, Globe } from 'lucide-react';
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
  createdAt?: string;
  deploymentUrls?: string[];
  platformResults?: Record<string, { success: number; total: number; urls: string[] }>;
}

interface CampaignMonitorProps {
  currentCampaign: SaturationCampaign | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'monitoring': return 'bg-blue-100 text-blue-800';
    case 'deploying': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const CampaignMonitor = ({ currentCampaign }: CampaignMonitorProps) => {
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
      <div className="text-center py-8 text-gray-500">
        <Rocket className="h-12 w-12 mx-auto mb-2 text-gray-300" />
        <p>No active campaign. Deploy a persona saturation campaign to monitor progress.</p>
      </div>
    );
  }

  const deployedUrls = getAllDeployedUrls();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Campaign: {currentCampaign.entityName}</h3>
        <Badge className={getStatusColor(currentCampaign.status)}>
          {currentCampaign.status.toUpperCase()}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{currentCampaign.progress}%</span>
        </div>
        <Progress value={currentCampaign.progress} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{currentCampaign.contentGenerated}</div>
          <div className="text-xs text-muted-foreground">Content Generated</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{currentCampaign.deploymentsSuccessful}</div>
          <div className="text-xs text-muted-foreground">Live Sites</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{currentCampaign.serpPenetration.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">SERP Penetration</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{deployedUrls.length}</div>
          <div className="text-xs text-muted-foreground">Live URLs</div>
        </div>
      </div>

      {currentCampaign.status === 'completed' && (
        <div className={`p-4 border rounded-lg ${
          currentCampaign.progress === 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
        }`}>
          <h4 className={`font-medium mb-2 ${
            currentCampaign.progress === 0 ? 'text-red-800' : 'text-green-800'
          }`}>
            {currentCampaign.progress === 0 ? 'Campaign Failed' : 'Campaign Completed Successfully'}
          </h4>
          <p className={`text-sm ${
            currentCampaign.progress === 0 ? 'text-red-700' : 'text-green-700'
          }`}>
            {currentCampaign.estimatedImpact}
          </p>
        </div>
      )}

      {/* Deployed URLs Section */}
      {deployedUrls.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              Deployed URLs ({deployedUrls.length})
            </h4>
            <Button
              size="sm"
              variant="outline"
              onClick={copyAllUrls}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy All URLs
            </Button>
          </div>
          
          <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50">
            {deployedUrls.map((url, index) => (
              <div key={index} className="flex items-center justify-between text-sm bg-white rounded p-2 border">
                <span className="text-gray-700 truncate flex-1 mr-2">{url}</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={() => copyToClipboard(url)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
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
        <div className="space-y-3">
          <h4 className="font-medium">Platform Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(currentCampaign.platformResults).map(([platform, results]) => (
              <div key={platform} className="flex items-center justify-between text-sm bg-gray-50 rounded p-3">
                <span className="font-medium capitalize">{platform.replace('-', ' ')}</span>
                <div className="flex items-center gap-3 text-gray-600">
                  <span>Success: {results.success}/{results.total}</span>
                  <Badge variant="outline">
                    {results.urls.length} URLs
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignMonitor;

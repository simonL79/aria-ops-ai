
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, Globe, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';

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
  platformResults?: Record<string, any>;
}

interface CampaignMonitorProps {
  currentCampaign: SaturationCampaign | null;
  allCampaigns?: SaturationCampaign[];
  loadingCampaigns?: boolean;
}

const CampaignMonitor = ({ currentCampaign, allCampaigns = [], loadingCampaigns = false }: CampaignMonitorProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'planning': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'generating': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'deploying': return <Globe className="h-4 w-4 text-orange-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'generating': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'deploying': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loadingCampaigns) {
    return (
      <Card className="corporate-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-corporate-accent"></div>
            <span className="ml-2 text-corporate-lightGray">Loading campaigns...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentCampaign && allCampaigns.length === 0) {
    return (
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="corporate-heading">Campaign Monitor</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Globe className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
          <h3 className="text-lg font-medium text-white mb-2">No Active Campaigns</h3>
          <p className="text-corporate-lightGray">
            Deploy your first persona saturation campaign to see real-time progress and results here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayCampaign = currentCampaign || allCampaigns[0];

  return (
    <div className="space-y-6">
      {/* Current Campaign Progress */}
      {displayCampaign && (
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 corporate-heading">
              {getStatusIcon(displayCampaign.status)}
              Live Campaign Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{displayCampaign.entityName}</h3>
                <Badge className={getStatusColor(displayCampaign.status)}>
                  {displayCampaign.status.charAt(0).toUpperCase() + displayCampaign.status.slice(1)}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-corporate-accent">{displayCampaign.progress}%</div>
                <div className="text-sm text-corporate-lightGray">Complete</div>
              </div>
            </div>

            <Progress value={displayCampaign.progress} className="w-full" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-corporate-darkTertiary rounded-lg">
                <div className="text-xl font-bold text-white">{displayCampaign.contentGenerated}</div>
                <div className="text-sm text-corporate-lightGray">Articles Generated</div>
              </div>
              <div className="text-center p-3 bg-corporate-darkTertiary rounded-lg">
                <div className="text-xl font-bold text-green-400">{displayCampaign.deploymentsSuccessful}</div>
                <div className="text-sm text-corporate-lightGray">Live Deployments</div>
              </div>
              <div className="text-center p-3 bg-corporate-darkTertiary rounded-lg">
                <div className="text-xl font-bold text-corporate-accent">{displayCampaign.serpPenetration}%</div>
                <div className="text-sm text-corporate-lightGray">SERP Impact</div>
              </div>
            </div>

            <div className="p-3 bg-corporate-darkSecondary rounded-lg">
              <div className="text-sm font-medium text-corporate-lightGray mb-1">Impact Assessment</div>
              <div className="text-white">{displayCampaign.estimatedImpact}</div>
            </div>

            {/* Live URLs */}
            {displayCampaign.deploymentUrls && displayCampaign.deploymentUrls.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-corporate-lightGray">Live Deployment URLs ({displayCampaign.deploymentUrls.length})</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {displayCampaign.deploymentUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-corporate-darkTertiary rounded text-xs">
                      <ExternalLink className="h-3 w-3 text-corporate-accent flex-shrink-0" />
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-corporate-lightGray hover:text-white truncate flex-1"
                      >
                        {url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Platform Results */}
            {displayCampaign.platformResults && Object.keys(displayCampaign.platformResults).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-corporate-lightGray">Platform Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(displayCampaign.platformResults).map(([platform, result]: [string, any]) => (
                    <div key={platform} className="p-2 bg-corporate-darkTertiary rounded text-xs">
                      <div className="font-medium text-white capitalize">{platform.replace('-', ' ')}</div>
                      <div className="text-corporate-lightGray">
                        {result.success || 0}/{result.total || 0} deployed
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Campaign History */}
      {allCampaigns.length > 1 && (
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="corporate-heading">Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allCampaigns.slice(1, 6).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-corporate-darkTertiary rounded-lg">
                  <div>
                    <div className="font-medium text-white">{campaign.entityName}</div>
                    <div className="text-sm text-corporate-lightGray">
                      {campaign.deploymentsSuccessful} articles deployed
                    </div>
                    {campaign.createdAt && (
                      <div className="text-xs text-corporate-gray">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignMonitor;

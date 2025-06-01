
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  FileText,
  TrendingUp,
  Shield,
  Target,
  Zap,
  GitBranch,
  Cloud,
  Database,
  Server
} from 'lucide-react';

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

const getPlatformIcon = (platformId: string) => {
  const icons = {
    'github-pages': GitBranch,
    'cloudflare-pages': Cloud,
    'netlify': Globe,
    'ipfs-pinata': Database,
    's3-static': Server,
    'arweave': Database,
    'local-static': Server
  };
  return icons[platformId as keyof typeof icons] || Globe;
};

const getPlatformColor = (platformId: string) => {
  const colors = {
    'github-pages': 'text-gray-400',
    'cloudflare-pages': 'text-orange-400',
    'netlify': 'text-cyan-400',
    'ipfs-pinata': 'text-purple-400',
    's3-static': 'text-yellow-400',
    'arweave': 'text-green-400',
    'local-static': 'text-blue-400'
  };
  return colors[platformId as keyof typeof colors] || 'text-gray-400';
};

const StatusIndicator = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'planning':
        return { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Planning' };
      case 'generating':
        return { icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Generating' };
      case 'deploying':
        return { icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Deploying' };
      case 'indexing':
        return { icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Indexing' };
      case 'monitoring':
        return { icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-500/20', label: 'Monitoring' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Completed' };
      default:
        return { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Unknown' };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
      <Icon className={`h-4 w-4 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
};

const CampaignMonitor = ({ currentCampaign, allCampaigns = [], loadingCampaigns = false }: CampaignMonitorProps) => {
  if (loadingCampaigns) {
    return (
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Globe className="h-5 w-5 text-corporate-accent animate-spin" />
            Loading Campaigns...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-corporate-accent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentCampaign && allCampaigns.length === 0) {
    return (
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Target className="h-5 w-5 text-corporate-accent" />
            Campaign Monitor
          </CardTitle>
          <div className="text-sm text-corporate-lightGray">
            Real-time deployment tracking
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Globe className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
          <h3 className="text-lg font-medium text-white mb-2">No Active Campaigns</h3>
          <p className="text-corporate-lightGray">
            Configure and deploy your first persona saturation campaign to see live monitoring data here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayCampaign = currentCampaign || allCampaigns[0];

  return (
    <div className="space-y-6">
      {/* Current Campaign Status */}
      {currentCampaign && (
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 corporate-heading">
              <Target className="h-5 w-5 text-corporate-accent" />
              Live Campaign Monitor
            </CardTitle>
            <div className="flex items-center justify-between">
              <div className="text-sm text-corporate-lightGray">
                Entity: {currentCampaign.entityName}
              </div>
              <StatusIndicator status={currentCampaign.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-corporate-lightGray">Deployment Progress</span>
                <span className="text-white">{currentCampaign.progress}%</span>
              </div>
              <Progress value={currentCampaign.progress} className="h-2" />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="text-sm text-corporate-lightGray">Content Generated</div>
                <div className="text-2xl font-bold text-white">{currentCampaign.contentGenerated}</div>
              </div>
              <div className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="text-sm text-corporate-lightGray">Successful Deployments</div>
                <div className="text-2xl font-bold text-green-400">{currentCampaign.deploymentsSuccessful}</div>
              </div>
            </div>

            {/* Platform Results */}
            {currentCampaign.platformResults && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-white">Platform Results</div>
                <div className="space-y-2">
                  {Object.entries(currentCampaign.platformResults).map(([platform, result]: [string, any]) => {
                    const Icon = getPlatformIcon(platform);
                    const iconColor = getPlatformColor(platform);
                    
                    return (
                      <div key={platform} className="flex items-center justify-between p-3 bg-corporate-darkSecondary rounded-lg">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${iconColor}`} />
                          <span className="text-white text-sm">{result.platform || platform}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {result.articlesDeployed || 0}/{result.totalAttempted || 0}
                          </Badge>
                          {result.articlesDeployed > 0 && (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live URLs */}
            {currentCampaign.deploymentUrls && currentCampaign.deploymentUrls.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-white">Live Deployment URLs</div>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {currentCampaign.deploymentUrls.slice(0, 5).map((url, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-corporate-darkSecondary rounded text-xs">
                      <span className="text-corporate-lightGray truncate flex-1">{url}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-corporate-accent hover:text-white"
                        onClick={() => window.open(url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {currentCampaign.deploymentUrls.length > 5 && (
                    <div className="text-xs text-corporate-lightGray text-center">
                      +{currentCampaign.deploymentUrls.length - 5} more URLs deployed
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Message */}
            <div className="p-3 bg-corporate-darkSecondary rounded-lg">
              <div className="text-sm text-corporate-lightGray">Current Status</div>
              <div className="text-sm text-white">{currentCampaign.estimatedImpact}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign History */}
      {allCampaigns.length > 0 && (
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 corporate-heading">
              <FileText className="h-5 w-5 text-corporate-accent" />
              Campaign History
            </CardTitle>
            <div className="text-sm text-corporate-lightGray">
              Previous deployments and results
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {allCampaigns.slice(0, 3).map((campaign) => (
              <div key={campaign.id} className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">{campaign.entityName}</div>
                  <StatusIndicator status={campaign.status} />
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-corporate-lightGray">Articles</div>
                    <div className="text-white">{campaign.contentGenerated}</div>
                  </div>
                  <div>
                    <div className="text-corporate-lightGray">Deployed</div>
                    <div className="text-green-400">{campaign.deploymentsSuccessful}</div>
                  </div>
                  <div>
                    <div className="text-corporate-lightGray">URLs</div>
                    <div className="text-white">{campaign.deploymentUrls?.length || 0}</div>
                  </div>
                </div>
                {campaign.createdAt && (
                  <div className="text-xs text-corporate-lightGray mt-2">
                    {new Date(campaign.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
            
            {allCampaigns.length > 3 && (
              <div className="text-center">
                <Button variant="outline" size="sm" className="text-corporate-lightGray border-corporate-border">
                  View All {allCampaigns.length} Campaigns
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignMonitor;

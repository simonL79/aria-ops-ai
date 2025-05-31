
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Globe, CheckCircle, Clock } from 'lucide-react';

interface SaturationCampaign {
  id: string;
  entityName: string;
  status: 'planning' | 'generating' | 'deploying' | 'indexing' | 'monitoring' | 'completed';
  progress: number;
  contentGenerated: number;
  deploymentsSuccessful: number;
  serpPenetration: number;
  estimatedImpact: string;
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
            <p className="text-sm text-corporate-lightGray">Impact</p>
            <p className="text-sm text-white">{currentCampaign.estimatedImpact}</p>
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
      </CardContent>
    </Card>
  );
};

export default CampaignMonitor;

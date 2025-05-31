
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Rocket } from 'lucide-react';

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
  if (!currentCampaign) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Rocket className="h-12 w-12 mx-auto mb-2 text-gray-300" />
        <p>No active campaign. Deploy a persona saturation campaign to monitor progress.</p>
      </div>
    );
  }

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
          <div className="text-2xl font-bold text-orange-600">72h</div>
          <div className="text-xs text-muted-foreground">Est. Full Impact</div>
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
    </div>
  );
};

export default CampaignMonitor;


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

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

interface CampaignHistoryProps {
  campaigns: SaturationCampaign[];
  loadingCampaigns: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'monitoring': return 'bg-blue-100 text-blue-800';
    case 'deploying': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const CampaignHistory = ({ campaigns, loadingCampaigns }: CampaignHistoryProps) => {
  if (loadingCampaigns) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading campaigns...</p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Globe className="h-12 w-12 mx-auto mb-2 text-gray-300" />
        <p>No campaigns yet. Deploy your first persona saturation campaign.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {campaigns.map(campaign => (
        <div key={campaign.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-medium">{campaign.entityName}</div>
              <div className="text-sm text-gray-500">
                {campaign.contentGenerated} articles, {campaign.deploymentsSuccessful} live deployments
              </div>
              {campaign.createdAt && (
                <div className="text-xs text-gray-400">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
            <Badge className={getStatusColor(campaign.status)}>
              {campaign.status}
            </Badge>
          </div>
          <div className="text-xs text-gray-500">
            SERP Impact: {campaign.estimatedImpact}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignHistory;

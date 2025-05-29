
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LegacyPostsList from './LegacyPostsList';
import AddLegacyPostDialog from './AddLegacyPostDialog';
import SuppressionAssets from './SuppressionAssets';
import GSCRankTracker from './GSCRankTracker';
import LiveSystemStatus from './LiveSystemStatus';

interface GraveyardMainContentProps {
  onStatsChange: () => void;
}

const GraveyardMainContent = ({ onStatsChange }: GraveyardMainContentProps) => {
  return (
    <div className="space-y-6">
      {/* Live System Status - Full Width */}
      <LiveSystemStatus />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Legacy Posts Management
                <AddLegacyPostDialog onPostAdded={onStatsChange} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LegacyPostsList onStatsChange={onStatsChange} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suppression Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <SuppressionAssets onStatsChange={onStatsChange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GSC Rank Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <GSCRankTracker />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GraveyardMainContent;

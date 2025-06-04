
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, TrendingUp } from 'lucide-react';

interface OpportunityRadarProps {
  selectedEntity: string;
}

const OpportunityRadar: React.FC<OpportunityRadarProps> = ({
  selectedEntity
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-corporate-accent" />
              Lead Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Prospect identification for {selectedEntity || 'No entity selected'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-corporate-accent" />
              Alert Builder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Proactive outreach alert system
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-corporate-accent" />
              Opportunity Scoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Lead scoring and prioritization
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpportunityRadar;

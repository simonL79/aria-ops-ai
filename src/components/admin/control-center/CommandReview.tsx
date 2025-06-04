
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, Target } from 'lucide-react';

interface CommandReviewProps {
  selectedEntity: string;
}

const CommandReview: React.FC<CommandReviewProps> = ({
  selectedEntity
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart className="h-5 w-5 text-corporate-accent" />
              Executive Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Performance metrics for {selectedEntity || 'No entity selected'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-corporate-accent" />
              Impact Graphs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Visual impact analysis and trends
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-corporate-accent" />
              Effectiveness Audit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Strategy effectiveness assessment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommandReview;

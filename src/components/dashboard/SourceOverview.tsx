
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SourceData {
  name: string;
  status: 'good' | 'warning' | 'critical';
  positiveRatio: number;
  total: number;
}

interface SourceOverviewProps {
  sources: SourceData[];
}

const SourceOverview = ({ sources }: SourceOverviewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-alert-positive text-white';
      case 'warning': return 'bg-alert-warning text-white';
      case 'critical': return 'bg-alert-negative text-white';
      default: return 'bg-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Platform Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sources.map((source) => (
            <div key={source.name}>
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium">{source.name}</div>
                <Badge className={getStatusColor(source.status)}>
                  {source.status === 'good' ? 'Good' : 
                   source.status === 'warning' ? 'Attention Needed' : 'Critical'}
                </Badge>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Positive Content Ratio</span>
                <span>{source.positiveRatio}%</span>
              </div>
              <Progress value={source.positiveRatio} max={100} className="h-1.5" />
              <div className="text-xs text-muted-foreground mt-1">
                Based on {source.total} monitored posts/comments
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SourceOverview;

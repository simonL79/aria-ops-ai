
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ban, Loader, Eye, Shield, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ContentAlert {
  id: string;
  platform: string;
  content: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'reviewing' | 'actioned';
  threatType?: 'falseReviews' | 'coordinatedAttack' | 'competitorSmear' | 'botActivity';
  confidenceScore?: number;
}

interface ContentAlertsProps {
  alerts: ContentAlert[];
  isLoading?: boolean;
}

const ContentAlerts = ({ alerts, isLoading = false }: ContentAlertsProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-alert-negative text-white';
      case 'medium': return 'bg-alert-warning text-white';
      case 'low': return 'bg-brand-light text-white';
      default: return 'bg-gray-200';
    }
  };

  const getThreatTypeIcon = (threatType?: string) => {
    if (!threatType) return null;
    
    switch (threatType) {
      case 'falseReviews': 
        return <Flag className="h-4 w-4 text-yellow-600" />;
      case 'coordinatedAttack': 
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'competitorSmear': 
        return <Ban className="h-4 w-4 text-purple-600" />;
      case 'botActivity': 
        return <Eye className="h-4 w-4 text-blue-600" />;
      default: 
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex justify-between items-center">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-5 w-16" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {[1, 2, 3].map((item) => (
              <div key={item}>
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-3 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-11/12 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-36" />
                  </div>
                </div>
                {item < 3 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recent Content Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-2">No alerts match your current filters</p>
            <Button variant="outline" size="sm">Reset Filters</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Recent Content Alerts</span>
          <Badge variant="outline" className="font-normal">{alerts.length} new</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {alerts.map((alert, idx) => (
            <div key={alert.id}>
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <div className="font-medium flex items-center">
                    {alert.platform}
                    {alert.threatType && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-2">
                              {getThreatTypeIcon(alert.threatType)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {alert.threatType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              {alert.confidenceScore && ` (${alert.confidenceScore}% confidence)`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity === 'high' ? 'High Impact' : 
                     alert.severity === 'medium' ? 'Medium Impact' : 'Low Impact'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">{alert.date}</div>
                <p className="text-sm mb-3">{alert.content}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Review</Button>
                  <Button variant="destructive" size="sm" className="gap-1">
                    <Ban className="h-4 w-4" />
                    <span>Request Removal</span>
                  </Button>
                  <Button variant="outline" size="sm" className="ml-auto gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Analyze</span>
                  </Button>
                </div>
              </div>
              {idx < alerts.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentAlerts;

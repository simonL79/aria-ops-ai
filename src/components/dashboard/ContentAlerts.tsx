
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentAlert } from "@/types/dashboard";
import AlertItem from "./alerts/AlertItem";
import AlertSkeleton from "./alerts/AlertSkeleton";

interface ContentAlertsProps {
  alerts: ContentAlert[];
  isLoading?: boolean;
}

const ContentAlerts = ({ alerts, isLoading = false }: ContentAlertsProps) => {
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
            <AlertSkeleton count={3} />
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
          <span>Reputation Threat Intelligence</span>
          <Badge variant="outline" className="font-normal">{alerts.length} active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {alerts.map((alert, idx) => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              isLast={idx === alerts.length - 1} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentAlerts;

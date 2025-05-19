
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentAlert } from "@/types/dashboard";
import ClassifiedAlertItem from "./alerts/ClassifiedAlertItem";
import AlertSkeleton from "./alerts/AlertSkeleton";
import { ShieldAlert } from "lucide-react";

interface ClassifiedContentAlertsProps {
  alerts: ContentAlert[];
  isLoading?: boolean;
  onViewDetails?: (alert: ContentAlert) => void;
  onMarkAsRead?: (id: string) => void;
}

const ClassifiedContentAlerts = ({ 
  alerts, 
  isLoading = false,
  onViewDetails,
  onMarkAsRead
}: ClassifiedContentAlertsProps) => {
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
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <span>Classified Content Alerts</span>
          </CardTitle>
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
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <span>AI-Classified Alerts</span>
          </div>
          <Badge variant="outline" className="font-normal">{alerts.length} active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <ClassifiedAlertItem 
              key={alert.id} 
              alert={alert} 
              onViewDetails={onViewDetails}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassifiedContentAlerts;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ContentAlert {
  id: string;
  platform: string;
  content: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'reviewing' | 'actioned';
}

interface ContentAlertsProps {
  alerts: ContentAlert[];
}

const ContentAlerts = ({ alerts }: ContentAlertsProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-alert-negative text-white';
      case 'medium': return 'bg-alert-warning text-white';
      case 'low': return 'bg-brand-light text-white';
      default: return 'bg-gray-200';
    }
  };

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
                  <div className="font-medium">{alert.platform}</div>
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

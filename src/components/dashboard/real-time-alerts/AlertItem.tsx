
import { ContentAlert } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, X, CheckCircle2 } from "lucide-react";

interface AlertItemProps {
  alert: ContentAlert;
  handleDismiss: (alertId: string) => void;
  handleMarkAsRead: (alertId: string) => void;
  onViewDetail?: (alert: ContentAlert) => void;
}

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-500 text-white';
    case 'medium': return 'bg-yellow-500 text-white';
    case 'low': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const AlertItem = ({
  alert,
  handleDismiss,
  handleMarkAsRead,
  onViewDetail
}: AlertItemProps) => {
  return (
    <div className={`p-4 ${alert.status === 'new' ? 'bg-blue-50' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <Badge className={getSeverityColor(alert.severity)}>
              {alert.severity.toUpperCase()}
            </Badge>
            <span className="font-medium">{alert.platform}</span>
            {alert.status === 'new' && (
              <Badge variant="outline" className="bg-blue-100 border-blue-200 text-blue-800">
                New
              </Badge>
            )}
          </div>
          <p className="mt-2">{alert.content}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <Clock className="h-3 w-3" />
            <span>{alert.date}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => handleDismiss(alert.id)}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => handleMarkAsRead(alert.id)}
            className="h-7 w-7 p-0"
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-7"
          onClick={() => onViewDetail && onViewDetail(alert)}
        >
          Analyze & Respond
        </Button>
      </div>
    </div>
  );
};

export default AlertItem;

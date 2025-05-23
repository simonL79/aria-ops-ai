
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";

interface AlertItemProps {
  alert: ContentAlert;
  onViewDetail: (alert: ContentAlert) => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const AlertItem = ({ alert, onViewDetail, onMarkAsRead, onDismiss }: AlertItemProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${alert.status === 'new' ? 'border-l-4 border-l-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Badge className={getSeverityColor(alert.severity)}>
              {alert.severity.toUpperCase()}
            </Badge>
            <span className="text-sm font-medium">{alert.platform}</span>
          </div>
          <span className="text-xs text-muted-foreground">{alert.date}</span>
        </div>
        
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{alert.content}</p>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onViewDetail(alert)}
            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View
          </Button>
          
          {alert.status === 'new' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onMarkAsRead(alert.id)}
              className="flex items-center gap-1"
            >
              <Check className="h-3 w-3" />
              Mark Read
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onDismiss(alert.id)}
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
          >
            <X className="h-3 w-3" />
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertItem;

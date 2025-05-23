
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, Clock, AlertTriangle } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";

interface EngagementHubAlertProps {
  alerts: ContentAlert[];
  onViewDetail: (alert: ContentAlert) => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const EngagementHubAlertList: React.FC<EngagementHubAlertProps> = ({
  alerts,
  onViewDetail,
  onMarkAsRead,
  onDismiss
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 text-white border-red-600';
      case 'medium': return 'bg-yellow-500 text-white border-yellow-600';
      case 'low': return 'bg-green-500 text-white border-green-600';
      default: return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'high') return <AlertTriangle className="h-3 w-3" />;
    return <Clock className="h-3 w-3" />;
  };

  const getStatusIndicator = (status: string) => {
    if (status === 'new') {
      return <div className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />;
    }
    return null;
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    // Sort by: new status first, then by severity (high->medium->low), then by date
    if (a.status === 'new' && b.status !== 'new') return -1;
    if (b.status === 'new' && a.status !== 'new') return 1;
    
    const severityOrder = { high: 3, medium: 2, low: 1 };
    const aSeverity = severityOrder[a.severity as keyof typeof severityOrder] || 0;
    const bSeverity = severityOrder[b.severity as keyof typeof severityOrder] || 0;
    
    if (aSeverity !== bSeverity) return bSeverity - aSeverity;
    
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-3">
      {sortedAlerts.map((alert) => (
        <Card 
          key={alert.id} 
          className={`relative transition-all hover:shadow-md cursor-pointer group ${
            alert.status === 'new' ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
          }`}
          onClick={() => onViewDetail(alert)}
        >
          {getStatusIndicator(alert.status)}
          
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={getSeverityColor(alert.severity)}>
                  {getSeverityIcon(alert.severity)}
                  <span className="ml-1">{alert.severity.toUpperCase()}</span>
                </Badge>
                <span className="text-sm font-medium text-gray-700">{alert.platform}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {alert.status === 'new' && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(alert.id);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(alert.id);
                  }}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {alert.date}
              </span>
              {alert.threatType && (
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                  {alert.threatType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-sm text-gray-700 line-clamp-2 mb-3">
              {alert.content}
            </p>
            
            {alert.detectedEntities && alert.detectedEntities.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {alert.detectedEntities.slice(0, 3).map((entity, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {entity}
                  </Badge>
                ))}
                {alert.detectedEntities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{alert.detectedEntities.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {alert.confidenceScore && (
                  <span>Confidence: {alert.confidenceScore}%</span>
                )}
                {alert.potentialReach && (
                  <span>Reach: {alert.potentialReach.toLocaleString()}</span>
                )}
              </div>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(alert);
                }}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {sortedAlerts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No alerts to display</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EngagementHubAlertList;

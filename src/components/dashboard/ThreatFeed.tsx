
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Shield, ArrowRight, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentAlert } from "@/types/dashboard";

interface ThreatFeedProps {
  alerts: ContentAlert[];
  isLoading?: boolean;
  onViewDetails?: (alert: ContentAlert) => void;
}

const ThreatFeed = ({ alerts, isLoading = false, onViewDetails }: ThreatFeedProps) => {
  const [displayCount, setDisplayCount] = useState<number>(5);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-alert-negative text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  const getSourceIcon = (sourceType?: string) => {
    switch (sourceType) {
      case 'social':
        return <span className="text-blue-500 text-xs font-medium">Social</span>;
      case 'review':
        return <span className="text-amber-500 text-xs font-medium">Review</span>;
      case 'news':
        return <span className="text-purple-500 text-xs font-medium">News</span>;
      case 'forum':
        return <span className="text-green-500 text-xs font-medium">Forum</span>;
      case 'darkweb':
        return <span className="text-red-500 text-xs font-medium">Dark Web</span>;
      default:
        return <span className="text-gray-500 text-xs font-medium">Unknown</span>;
    }
  };
  
  const getStatusIndicator = (status: string, category?: string) => {
    if (category === 'customer_enquiry') {
      return <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>;
    }
    
    switch (status) {
      case 'new':
        return <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>;
      case 'reviewing':
        return <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1"></span>;
      case 'actioned':
        return <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>;
      case 'read':
        return <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-1"></span>;
      default:
        return null;
    }
  };
  
  const handleViewMore = () => {
    setDisplayCount(prev => prev + 5);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Threat Feed</span>
            </div>
            <Skeleton className="h-5 w-16" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((_, idx) => (
              <div key={idx} className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between mt-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
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
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Threat Feed</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Shield className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-center">No threats detected</p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            The system will notify you when new threats are detected
          </p>
        </CardContent>
      </Card>
    );
  }

  const customerEnquiries = alerts.filter(a => a.category === 'customer_enquiry' && a.status === 'new').length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Threat Feed</span>
          </div>
          <div className="flex gap-2">
            {customerEnquiries > 0 && (
              <Badge variant="outline" className="font-normal bg-blue-50 text-blue-800">
                <MessageSquare className="h-3 w-3 mr-1" /> {customerEnquiries} enquiries
              </Badge>
            )}
            <Badge variant="outline" className="font-normal">
              {alerts.filter(a => a.status === 'new').length} new
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {alerts.slice(0, displayCount).map((alert, idx) => (
            <div key={alert.id} className="group">
              <div className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    {getStatusIndicator(alert.status, alert.category)}
                    {alert.category === 'customer_enquiry' ? (
                      <Badge className="bg-blue-500 text-white">
                        CUSTOMER
                      </Badge>
                    ) : (
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    )}
                    {alert.threatType && !alert.category && (
                      <Badge variant="outline" className="ml-2">
                        {alert.threatType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {alert.date}
                  </div>
                </div>
                
                <p className="text-sm line-clamp-2 mb-2">{alert.content}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getSourceIcon(alert.sourceType)}
                    <span className="text-xs text-muted-foreground">{alert.platform}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onViewDetails && onViewDetails(alert)}
                  >
                    <span className="text-xs">{alert.category === 'customer_enquiry' ? 'Respond' : 'View'}</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
              {idx < Math.min(displayCount, alerts.length) - 1 && <Separator />}
            </div>
          ))}
        </div>
        
        {displayCount < alerts.length && (
          <div className="p-2 flex justify-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleViewMore}
              className="text-xs w-full"
            >
              View More ({alerts.length - displayCount} remaining)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThreatFeed;

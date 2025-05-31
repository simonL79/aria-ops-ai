
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, ExternalLink, Eye } from 'lucide-react';
import { ContentAlert } from '@/types/dashboard';

interface ContentAlertsProps {
  alerts: ContentAlert[];
  isLoading: boolean;
}

const ContentAlerts = ({ alerts, isLoading }: ContentAlertsProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-600 text-white border-red-600';
      case 'medium':
        return 'bg-yellow-600 text-white border-yellow-600';
      case 'low':
        return 'bg-green-600 text-white border-green-600';
      default:
        return 'bg-corporate-accent text-black border-corporate-accent';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-600 text-white';
      case 'read':
        return 'bg-corporate-gray text-white';
      case 'resolved':
        return 'bg-green-600 text-white';
      default:
        return 'bg-corporate-accent text-black';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-corporate-darkTertiary border-corporate-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="h-5 w-5 text-corporate-accent" />
            Live Threat Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-corporate-border rounded-lg animate-pulse">
                <div className="h-4 bg-corporate-gray rounded mb-2"></div>
                <div className="h-16 bg-corporate-gray rounded mb-2"></div>
                <div className="h-4 bg-corporate-gray rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter out any mock data
  const realAlerts = alerts.filter(alert => 
    !alert.content?.toLowerCase().includes('mock') &&
    !alert.content?.toLowerCase().includes('test') &&
    !alert.content?.toLowerCase().includes('demo')
  );

  return (
    <Card className="bg-corporate-darkTertiary border-corporate-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <AlertTriangle className="h-5 w-5 text-corporate-accent" />
          Live Threat Intelligence
          <Badge className="bg-corporate-accent text-black ml-2">
            {realAlerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {realAlerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-corporate-lightGray mb-2">
              <Eye className="h-8 w-8 mx-auto mb-2" />
              No live threats detected
            </div>
            <p className="text-sm text-corporate-gray">
              All monitored channels are clear
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {realAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border border-corporate-border rounded-lg hover:border-corporate-accent transition-colors bg-corporate-darkSecondary"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity?.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                      <Badge variant="outline" className="border-corporate-border text-corporate-lightGray">
                        {alert.platform}
                      </Badge>
                    </div>
                    
                    <p className="text-corporate-lightGray leading-relaxed text-sm">
                      {alert.content}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-corporate-gray">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.date}
                      </div>
                      {alert.confidenceScore && (
                        <span>Confidence: {alert.confidenceScore}%</span>
                      )}
                      {alert.potentialReach && alert.potentialReach > 0 && (
                        <span>Reach: {alert.potentialReach.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-fit">
                    {alert.url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-corporate-border text-corporate-lightGray hover:bg-corporate-accent hover:text-black text-xs"
                        onClick={() => window.open(alert.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Source
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentAlerts;

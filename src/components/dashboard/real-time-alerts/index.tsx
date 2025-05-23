
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { ContentAlert } from '@/types/dashboard';

interface RealTimeAlertsProps {
  alerts: ContentAlert[];
  onViewDetail: (alert: ContentAlert) => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ alerts, onViewDetail, onMarkAsRead, onDismiss }) => {
  const filteredAlerts = alerts.filter(alert => alert.status !== 'dismissed').slice(0, 5);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Real-Time Alerts
        </CardTitle>
        <CardDescription>
          Latest mentions and potential threats
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p>No new alerts at this time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 border rounded-md transition-colors hover:bg-gray-50 cursor-pointer relative group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <Badge className={`${
                      alert.severity === 'high' ? 'bg-red-500' : 
                      alert.severity === 'medium' ? 'bg-yellow-500' : 
                      'bg-green-500'
                    } text-white`}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">
                        {alert.platform}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                        <Clock className="h-3 w-3 mr-1" /> {alert.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(alert.id);
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismiss(alert.id);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm line-clamp-2">
                  {alert.content}
                </p>
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2"
                    onClick={() => onViewDetail(alert)}
                  >
                    View Details
                  </Button>
                </div>
                {alert.status === 'new' && (
                  <div className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full" />
                )}
              </div>
            ))}
            
            {alerts.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="link" size="sm">
                  View all {alerts.length} alerts
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;

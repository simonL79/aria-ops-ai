
import React from 'react';
import { ContentAlert } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, Shield } from 'lucide-react';

interface ClassifiedAlertItemProps {
  alert: ContentAlert;
  onViewDetails?: (alert: ContentAlert) => void;
  onMarkAsRead?: (id: string) => void;
}

const ClassifiedAlertItem = ({ alert, onViewDetails, onMarkAsRead }: ClassifiedAlertItemProps) => {
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewDetails) onViewDetails(alert);
  };
  
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMarkAsRead) onMarkAsRead(alert.id);
  };
  
  const getSeverityBadge = () => {
    if (alert.severity === 'high') {
      return <Badge variant="destructive">High Risk</Badge>;
    }
    if (alert.severity === 'medium') {
      return <Badge variant="default">Medium Risk</Badge>;
    }
    return <Badge variant="outline">Low Risk</Badge>;
  };
  
  const getCategoryBadge = () => {
    if (!alert.category) return null;
    
    const color = alert.category === 'Neutral' 
      ? 'bg-gray-100 text-gray-800' 
      : alert.category === 'Positive' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-amber-100 text-amber-800';
    
    return <Badge className={color}>{alert.category}</Badge>;
  };

  return (
    <div 
      className="border-b last:border-b-0 p-3 hover:bg-muted/50 cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-start gap-2">
          <Badge variant="outline">{alert.platform}</Badge>
          {getCategoryBadge()}
        </div>
        {getSeverityBadge()}
      </div>
      
      <p className="text-sm mb-2">{alert.content}</p>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{alert.date}</span>
        </div>
        
        <div className="flex gap-2">
          {alert.status === 'new' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs"
              onClick={handleMarkAsRead}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Mark Read
            </Button>
          )}
          
          {alert.recommendation && (
            <div className="flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              <span className="truncate max-w-24">{alert.recommendation}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassifiedAlertItem;

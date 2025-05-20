
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, X, CheckCircle2, MessageSquare, Eye } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";

interface AlertItemProps {
  alert: ContentAlert;
  isLast: boolean;
  onDismiss: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onViewDetail?: (alert: ContentAlert) => void;
  onRespond?: (alertId: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ 
  alert, 
  isLast, 
  onDismiss, 
  onMarkAsRead,
  onViewDetail,
  onRespond
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };
  
  const isHighSeverity = alert.severity === 'high';
  const isCustomerEnquiry = alert.category === 'customer_enquiry';
  
  const handleViewDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewDetail) {
      onViewDetail(alert);
    }
  };

  const handleRespond = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRespond) {
      onRespond(alert.id);
    }
  };

  return (
    <div 
      className={`p-4 
        ${alert.status === 'new' ? isCustomerEnquiry ? 'bg-blue-50' : 'bg-blue-50' : ''} 
        ${isHighSeverity && alert.status === 'new' ? 'border-l-4 border-red-500' : ''}
        ${isCustomerEnquiry && alert.status === 'new' ? 'border-l-4 border-blue-500' : ''}
        ${!isLast ? 'border-b' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            {isCustomerEnquiry ? (
              <Badge className="bg-blue-500 text-white">
                CUSTOMER
              </Badge>
            ) : (
              <Badge className={getSeverityColor(alert.severity)}>
                {alert.severity.toUpperCase()}
                {isHighSeverity && alert.status === 'new' && " ⚠️"}
              </Badge>
            )}
            <span className="font-medium">{alert.platform}</span>
            {alert.status === 'new' && (
              <Badge variant="outline" className={
                isCustomerEnquiry ? 
                "bg-blue-100 border-blue-200 text-blue-800 animate-pulse" : 
                isHighSeverity ? 
                "bg-red-100 border-red-200 text-red-800 animate-pulse" : 
                "bg-blue-100 border-blue-200 text-blue-800"
              }>
                New
              </Badge>
            )}
          </div>
          <p className={`mt-2 ${(isHighSeverity || isCustomerEnquiry) && alert.status === 'new' ? 'font-medium' : ''}`}>
            {alert.content}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <Clock className="h-3 w-3" />
            <span>{alert.date}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onDismiss(alert.id)}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onMarkAsRead(alert.id)}
            className="h-7 w-7 p-0"
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <Button 
          size="sm" 
          variant={
            isCustomerEnquiry && alert.status === 'new' ? "default" : 
            isHighSeverity && alert.status === 'new' ? "destructive" : 
            "outline"
          }
          className={`text-xs h-7 ${(isHighSeverity || isCustomerEnquiry) && alert.status === 'new' ? 'animate-pulse' : ''}`}
          onClick={isCustomerEnquiry ? handleRespond : handleViewDetail}
        >
          {isCustomerEnquiry && alert.status === 'new' ? (
            <>
              <MessageSquare className="h-3 w-3 mr-1" /> Respond Now
            </>
          ) : isHighSeverity && alert.status === 'new' ? (
            <>
              <Eye className="h-3 w-3 mr-1" /> View Now
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" /> Analyze & Respond
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AlertItem;

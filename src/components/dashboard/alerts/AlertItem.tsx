
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Ban, Shield } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ContentAlert } from "@/types/dashboard";
import { getSeverityColor, getThreatTypeIcon, getSourceTypeLabel, formatThousands } from "@/utils/alertUtils";
import { requestContentRemoval } from "@/services/contentActionService";
import AlertDetails from "./AlertDetails";

interface AlertItemProps {
  alert: ContentAlert;
  isLast: boolean;
}

const AlertItem = ({ alert, isLast }: AlertItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRequestRemoval = async () => {
    // Track the request removal action in the database
    const success = await requestContentRemoval(alert);
    
    if (success) {
      // No need to update UI here as the alert status will be fetched again
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={toggleExpansion}>
      <div>
        <div className="p-4">
          <div className="flex justify-between mb-2">
            <div className="font-medium flex items-center">
              {alert.platform}
              {alert.threatType && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-2">
                        {getThreatTypeIcon(alert.threatType)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {alert.threatType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        {alert.confidenceScore && ` (${alert.confidenceScore}% confidence)`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {alert.sourceType && (
                <span className="ml-2">
                  {getSourceTypeLabel(alert.sourceType)}
                </span>
              )}
            </div>
            <Badge className={getSeverityColor(alert.severity)}>
              {alert.severity === 'high' ? 'Critical Threat' : 
               alert.severity === 'medium' ? 'Medium Impact' : 'Low Impact'}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mb-2 flex justify-between">
            <span>{alert.date}</span>
            {alert.potentialReach && (
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                Reach: {formatThousands(alert.potentialReach)}
              </span>
            )}
          </div>
          <p className="text-sm mb-3">{alert.content}</p>
          <div className="flex gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                {isExpanded ? 'Less Details' : 'Analysis'}
              </Button>
            </CollapsibleTrigger>
            <Button 
              variant="destructive" 
              size="sm" 
              className="gap-1"
              onClick={handleRequestRemoval}
            >
              <Ban className="h-4 w-4" />
              <span>Request Removal</span>
            </Button>
            <Button variant="outline" size="sm" className="ml-auto gap-1">
              <Shield className="h-4 w-4" />
              <span>Respond</span>
            </Button>
          </div>
        </div>
        
        <CollapsibleContent>
          <AlertDetails alert={alert} />
        </CollapsibleContent>
      </div>
      {!isLast && <Separator />}
    </Collapsible>
  );
};

export default AlertItem;

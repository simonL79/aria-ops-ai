import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";
import { getRecommendedActions } from "@/utils/alertUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResponseGenerationProps } from "@/services/openaiService";
import StrategicResponseEngine from "@/components/dashboard/responseEngine";

interface AlertDetailsProps {
  alert: ContentAlert;
}

const AlertDetails = ({ alert }: AlertDetailsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Pass alert data to the Strategic Response Engine
  const handleOpenResponseEngine = () => {
    setIsDialogOpen(true);
  };
  
  return (
    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-1">Threat Assessment</h4>
          <div className="text-sm">
            {alert.threatType && (
              <div className="flex items-center mb-1">
                <span className="font-medium mr-2">Type:</span>
                <span>{alert.threatType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              </div>
            )}
            {alert.confidenceScore && (
              <div className="flex items-center mb-1">
                <span className="font-medium mr-2">AI Confidence:</span>
                <span>{alert.confidenceScore}%</span>
              </div>
            )}
            {alert.sentiment && (
              <div className="flex items-center mb-1">
                <span className="font-medium mr-2">Sentiment:</span>
                <span className="capitalize">{alert.sentiment}</span>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-1">Recommended Actions</h4>
          <ul className="text-sm list-disc pl-5">
            {getRecommendedActions(alert.severity).map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {alert.detectedEntities && alert.detectedEntities.length > 0 && (
        <div className="mt-2">
          <h4 className="text-xs font-medium text-muted-foreground mb-1">Named Entities</h4>
          <div className="flex flex-wrap gap-1">
            {alert.detectedEntities.map((entity, idx) => (
              <Badge key={idx} variant="outline" className="bg-gray-100">
                {entity}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-3">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary" className="gap-1" onClick={handleOpenResponseEngine}>
              <Shield className="h-4 w-4" />
              <span>AI Response Suggestions</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Strategic Response Engine</DialogTitle>
            </DialogHeader>
            <div className="p-1">
              <StrategicResponseEngine 
                initialContent={alert.content}
                threatType={alert.threatType}
                severity={alert.severity}
                platform={alert.platform}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AlertDetails;

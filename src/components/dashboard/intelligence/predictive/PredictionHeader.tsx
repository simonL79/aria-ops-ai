
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface PredictionHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
}

const PredictionHeader = ({ refreshing: externalRefreshing, onRefresh }: PredictionHeaderProps) => {
  const [internalRefreshing, setInternalRefreshing] = useState(false);
  
  // Combined refreshing state (either from props or internal state)
  const refreshing = externalRefreshing || internalRefreshing;
  
  const handleRefresh = () => {
    if (refreshing) return;
    
    // Start internal refreshing state
    setInternalRefreshing(true);
    
    // Show toast notification
    toast.loading("Refreshing predictions", {
      description: "Analyzing latest data to forecast potential threats"
    });
    
    // Call the parent's onRefresh handler
    onRefresh();
    
    // Simulate API call completion
    setTimeout(() => {
      toast.success("Predictions Updated", {
        description: "Threat intelligence predictions have been updated with latest data"
      });
      
      // End internal refreshing state
      setInternalRefreshing(false);
    }, 2000);
  };
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-medium text-lg">Predictive Reputation Intelligence</h3>
        <p className="text-sm text-muted-foreground">
          Forecasting potential threats before they materialize
        </p>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleRefresh}
        disabled={refreshing}
      >
        {refreshing ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Refreshing
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Predictions
          </>
        )}
      </Button>
    </div>
  );
};

export default PredictionHeader;

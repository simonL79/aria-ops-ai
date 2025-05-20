
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader } from "lucide-react";
import { useIntelligenceSimulation } from "@/hooks/useIntelligenceSimulation";

interface PredictionHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
}

const PredictionHeader = ({ refreshing: externalRefreshing, onRefresh }: PredictionHeaderProps) => {
  const { isSimulating, runSimulation } = useIntelligenceSimulation({
    successMessage: "Predictions Updated",
    description: "Analyzing latest data to forecast potential threats",
    onComplete: onRefresh
  });
  
  // Combined refreshing state (either from props or internal state)
  const refreshing = externalRefreshing || isSimulating;
  
  const handleRefresh = () => {
    if (refreshing) return;
    runSimulation();
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

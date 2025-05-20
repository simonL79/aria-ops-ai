
import React from 'react';
import { Button } from "@/components/ui/button";

interface EmptyResultsProps {
  isActive: boolean;
  isScanning: boolean;
  onActivate: () => void;
}

const EmptyResults: React.FC<EmptyResultsProps> = ({ isActive, isScanning, onActivate }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">No monitoring results yet.</p>
      <p className="text-sm text-muted-foreground mt-1">
        {isActive 
          ? "Real-time monitoring is active. Results will appear here as they are detected." 
          : "Activate real-time monitoring to track mentions and threats."}
      </p>
      {!isActive && !isScanning && (
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={onActivate}
        >
          Activate Monitoring
        </Button>
      )}
    </div>
  );
};

export default EmptyResults;

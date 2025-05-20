
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Loader } from "lucide-react";

interface MonitoringControlsProps {
  isActive: boolean;
  isScanning: boolean;
  onToggleScan: () => void;
  onManualScan: () => void;
}

const MonitoringControls: React.FC<MonitoringControlsProps> = ({ 
  isActive, 
  isScanning, 
  onToggleScan, 
  onManualScan 
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Reputation Intelligence</h2>
      <div className="flex items-center gap-2">
        <Button
          variant={isActive ? "destructive" : "default"}
          onClick={onToggleScan}
          className="gap-2"
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4" />
              Stop Real-Time Monitoring
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Activate Real-Time
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={onManualScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Scanning...
            </>
          ) : (
            "Run Manual Scan"
          )}
        </Button>
      </div>
    </div>
  );
};

export default MonitoringControls;

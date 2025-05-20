
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ContentAlert } from "@/types/dashboard";
import ResultList from "./ResultList";
import EmptyResults from "./EmptyResults";

interface MonitoringResultsProps {
  scanResults: ContentAlert[];
  isActive: boolean;
  isScanning: boolean;
  onActivate: () => void;
}

const MonitoringResults: React.FC<MonitoringResultsProps> = ({ 
  scanResults, 
  isActive, 
  isScanning, 
  onActivate 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Monitoring Results</CardTitle>
      </CardHeader>
      <CardContent>
        {scanResults.length === 0 ? (
          <EmptyResults 
            isActive={isActive}
            isScanning={isScanning}
            onActivate={onActivate}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {isActive 
                ? "Real-time monitoring is active. New results will appear automatically." 
                : "Real-time monitoring is inactive. Run a manual scan or activate real-time monitoring."}
            </p>
            <ResultList results={scanResults} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonitoringResults;

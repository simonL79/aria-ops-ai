
import React from "react";
import MetricsOverview from "@/components/dashboard/MetricsOverview";

interface DashboardMetricsProps {
  monitoredSources: number;
  negativeContent: number;
  removedContent: number;
}

const DashboardMetrics = ({
  monitoredSources,
  negativeContent,
  removedContent
}: DashboardMetricsProps) => {
  return (
    <div className="mb-6">
      <MetricsOverview 
        monitoredSources={monitoredSources}
        negativeContent={negativeContent} 
        removedContent={removedContent}
      />
    </div>
  );
};

export default DashboardMetrics;

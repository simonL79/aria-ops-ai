
import React from "react";

export interface DashboardMetricsProps {
  reputationScore: number;
  previousScore: number;
  sources: number;
  alerts: number;
  removed: number;
}

const DashboardMetrics = ({ 
  reputationScore, 
  previousScore, 
  sources, 
  alerts, 
  removed 
}: DashboardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Reputation Score</h3>
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-bold">{reputationScore}</span>
          <span className={`ml-2 text-xs ${previousScore < reputationScore ? 'text-green-500' : 'text-red-500'}`}>
            {previousScore < reputationScore ? '+' : ''}{(reputationScore - previousScore).toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Sources Monitored</h3>
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-bold">{sources}</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Negative Mentions</h3>
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-bold">{alerts}</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Content Removed</h3>
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-bold">{removed}</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Risk Score</h3>
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-bold">42%</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;

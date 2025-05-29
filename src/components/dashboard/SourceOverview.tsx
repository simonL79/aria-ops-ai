
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Wifi } from "lucide-react";

interface SourceOverviewProps {
  sources: Array<{
    id: string;
    name: string;
    type: string;
    status: "critical" | "good" | "warning";
    lastUpdate: string;
    metrics: {
      total: number;
      positive: number;
      negative: number;
      neutral: number;
    };
  }>;
}

const SourceOverview = ({ sources }: SourceOverviewProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "critical": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-green-50 text-green-700 border-green-200";
      case "warning": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "critical": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Only show sources with real data
  if (!sources || sources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">OSINT Intelligence Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Wifi className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">No live intelligence sources active</p>
            <p className="text-sm text-gray-500">Run an OSINT sweep to activate live monitoring</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          OSINT Intelligence Sources
          <Badge variant="outline" className="text-xs">
            {sources.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sources.map((source) => (
          <div key={source.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
            <div className="flex items-center space-x-3">
              {getStatusIcon(source.status)}
              <div>
                <h4 className="font-medium text-sm">{source.name}</h4>
                <p className="text-xs text-gray-500">Last update: {source.lastUpdate}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`text-xs ${getStatusColor(source.status)}`}>
                {source.metrics.total} items
              </Badge>
              <div className="text-xs text-gray-500 mt-1">
                {source.metrics.negative > 0 && (
                  <span className="text-red-600">{source.metrics.negative} negative</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 text-sm">
            <CheckCircle className="h-4 w-4" />
            Live OSINT monitoring active - Real-time intelligence collection
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SourceOverview;

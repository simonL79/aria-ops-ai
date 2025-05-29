
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Eye, Clock } from "lucide-react";

interface RecentActionsProps {
  actions: Array<{
    id: string;
    type: "urgent" | "monitoring" | "response";
    description: string;
    status: "pending" | "completed" | "failed";
    platform: string;
    timestamp: string;
  }>;
}

const RecentActions = ({ actions }: RecentActionsProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "monitoring": return <Eye className="h-4 w-4 text-blue-500" />;
      case "response": return <Activity className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-50 text-green-700 border-green-200";
      case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "failed": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Only show actions based on real intelligence
  if (!actions || actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Intelligence Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">No intelligence actions taken</p>
            <p className="text-sm text-gray-500">Actions will appear when threats are detected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          Intelligence Actions
          <Badge variant="outline" className="text-xs">
            {actions.length} Recent
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-80 overflow-y-auto space-y-3">
          {actions.map((action) => (
            <div key={action.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-gray-50">
              <div className="mt-0.5">
                {getTypeIcon(action.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {action.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs ${getStatusColor(action.status)}`}>
                    {action.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {action.platform}
                  </span>
                  <span className="text-xs text-gray-400">
                    {action.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 text-sm">
            <Activity className="h-4 w-4" />
            Actions based on live OSINT intelligence only
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActions;

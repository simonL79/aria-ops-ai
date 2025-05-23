
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  onRefresh?: () => Promise<void>;
  totalAlerts?: number;
  highSeverityAlerts?: number;
}

const DashboardHeader = ({ title, description, onRefresh, totalAlerts, highSeverityAlerts }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
        {totalAlerts !== undefined && (
          <p className="text-sm text-muted-foreground mt-1">
            {totalAlerts} total alerts {highSeverityAlerts !== undefined && `(${highSeverityAlerts} high severity)`}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}
        <Link to="/clients">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Client Management
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;


import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

const DashboardHeader = ({ title, description }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="flex gap-2">
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

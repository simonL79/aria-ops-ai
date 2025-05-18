
import React from "react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  subtitle?: string;
}

const DashboardHeader = ({ title, description, subtitle }: DashboardHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">
        {description || subtitle}
      </p>
    </div>
  );
};

export default DashboardHeader;

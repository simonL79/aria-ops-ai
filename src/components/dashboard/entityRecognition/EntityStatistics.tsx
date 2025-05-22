
import React from 'react';
import { Users, Building, AtSign } from "lucide-react";

interface EntityStatisticsProps {
  personEntities: number;
  orgEntities: number;
  handleEntities: number;
}

const EntityStatistics: React.FC<EntityStatisticsProps> = ({
  personEntities,
  orgEntities,
  handleEntities
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-muted/50 p-4 rounded-lg text-center">
        <Users className="h-5 w-5 mx-auto mb-2" />
        <div className="text-2xl font-bold">{personEntities}</div>
        <div className="text-xs text-muted-foreground">People</div>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg text-center">
        <Building className="h-5 w-5 mx-auto mb-2" />
        <div className="text-2xl font-bold">{orgEntities}</div>
        <div className="text-xs text-muted-foreground">Organizations</div>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg text-center">
        <AtSign className="h-5 w-5 mx-auto mb-2" />
        <div className="text-2xl font-bold">{handleEntities}</div>
        <div className="text-xs text-muted-foreground">Social Handles</div>
      </div>
    </div>
  );
};

export default EntityStatistics;

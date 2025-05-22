
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Users, Building, AtSign } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

export interface EntityItemProps {
  entity: {
    name: string;
    type: 'person' | 'organization' | 'handle' | 'unknown';
    confidence: number;
    mentions: number;
  };
  onViewEntity: (entity: any) => void;
}

const EntityItem: React.FC<EntityItemProps> = ({ entity, onViewEntity }) => {
  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'person': return <Users className="h-4 w-4" />;
      case 'organization': return <Building className="h-4 w-4" />;
      case 'handle': return <AtSign className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
      <div className="flex items-center gap-2">
        {getEntityIcon(entity.type)}
        <span className="font-medium">{entity.name}</span>
        <Badge variant="outline" className="text-xs">
          {entity.mentions} {entity.mentions === 1 ? 'mention' : 'mentions'}
        </Badge>
      </div>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onViewEntity(entity)}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:inline-flex">View</span>
          </Button>
        </SheetTrigger>
      </Sheet>
    </div>
  );
};

export default EntityItem;


import React from 'react';
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EntityItem, { EntityItemProps } from './EntityItem';

interface EntityListProps {
  loading: boolean;
  entities: EntityItemProps['entity'][];
  onViewEntity: (entity: any) => void;
}

const EntityList: React.FC<EntityListProps> = ({ loading, entities, onViewEntity }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (entities.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>No entities found in this category</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {entities.slice(0, 10).map((entity, index) => (
        <EntityItem 
          key={index} 
          entity={entity} 
          onViewEntity={onViewEntity} 
        />
      ))}
      
      {entities.length > 10 && (
        <Button variant="outline" className="w-full mt-2">
          View All {entities.length} Entities
        </Button>
      )}
    </div>
  );
};

export default EntityList;

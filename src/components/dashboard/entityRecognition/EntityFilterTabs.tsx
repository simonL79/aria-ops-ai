
import React from 'react';
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EntityList from './EntityList';

interface EntityFilterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  loading: boolean;
  entities: any[];
  filteredEntities: any[];
  onViewEntity: (entity: any) => void;
}

const EntityFilterTabs: React.FC<EntityFilterTabsProps> = ({
  activeTab,
  onTabChange,
  loading,
  filteredEntities,
  onViewEntity
}) => {
  return (
    <>
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="all" onClick={() => onTabChange("all")}>All</TabsTrigger>
        <TabsTrigger value="person" onClick={() => onTabChange("person")}>People</TabsTrigger>
        <TabsTrigger value="organization" onClick={() => onTabChange("organization")}>Organizations</TabsTrigger>
        <TabsTrigger value="handle" onClick={() => onTabChange("handle")}>Handles</TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab} className="space-y-4">
        <EntityList 
          loading={loading} 
          entities={filteredEntities} 
          onViewEntity={onViewEntity} 
        />
      </TabsContent>
    </>
  );
};

export default EntityFilterTabs;

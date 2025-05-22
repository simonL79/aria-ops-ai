
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Sheet } from "@/components/ui/sheet";
import ProcessEntitiesButton from './ProcessEntitiesButton';
import EntityStatistics from './EntityStatistics';
import EntityFilterTabs from './EntityFilterTabs';
import EntityDetailsSheet from './EntityDetailsSheet';
import { useEntityRecognition } from './useEntityRecognition';

const EntityRecognitionPanel = () => {
  const {
    entities,
    selectedEntity,
    entityResults,
    loading,
    processing,
    stats,
    activeTab,
    filteredEntities,
    setActiveTab,
    handleProcessEntities,
    handleViewEntity
  } = useEntityRecognition();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Entity Recognition</CardTitle>
            <CardDescription>Extracted people, organizations, and social handles</CardDescription>
          </div>
          <ProcessEntitiesButton 
            processing={processing} 
            onProcess={handleProcessEntities} 
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <EntityStatistics 
          personEntities={stats.personEntities}
          orgEntities={stats.orgEntities}
          handleEntities={stats.handleEntities}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <EntityFilterTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            loading={loading}
            entities={entities}
            filteredEntities={filteredEntities}
            onViewEntity={handleViewEntity}
          />
        </Tabs>
        
        <Sheet>
          <EntityDetailsSheet 
            selectedEntity={selectedEntity}
            entityResults={entityResults}
          />
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default EntityRecognitionPanel;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, User, Brain, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EntityContextPanelProps {
  selectedEntity: string;
  entityMemory: any[];
  onEntitySelect: (entity: string) => void;
  serviceStatus: any;
}

const EntityContextPanel: React.FC<EntityContextPanelProps> = ({
  selectedEntity,
  entityMemory,
  onEntitySelect,
  serviceStatus
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [entities, setEntities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    try {
      // Get entities from multiple sources
      const { data: clients } = await supabase
        .from('clients')
        .select('name');

      const { data: scanResults } = await supabase
        .from('scan_results')
        .select('DISTINCT content')
        .limit(20);

      const entityList = [
        ...(clients?.map(c => c.name) || []),
        'Simon Lindsay', // Default test entity
        'ARIA Technologies',
        'Example Corp'
      ];

      setEntities([...new Set(entityList)]);
    } catch (error) {
      console.error('Failed to load entities:', error);
    }
  };

  const filteredEntities = entities.filter(entity =>
    entity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCollapsed) {
    return (
      <div className="w-12 bg-corporate-darkSecondary border-r border-corporate-border flex flex-col items-center py-4">
        <Button
          onClick={() => setIsCollapsed(false)}
          variant="ghost"
          size="sm"
          className="text-corporate-lightGray hover:text-white mb-4"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex flex-col gap-2">
          <User className="h-5 w-5 text-corporate-accent" />
          <Activity className="h-5 w-5 text-corporate-lightGray" />
          <Brain className="h-5 w-5 text-corporate-lightGray" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-corporate-darkSecondary border-r border-corporate-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-corporate-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Entity Context</h3>
          <Button
            onClick={() => setIsCollapsed(true)}
            variant="ghost"
            size="sm"
            className="text-corporate-lightGray hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <Input
          placeholder="Search entities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-corporate-dark border-corporate-border text-white"
        />
      </div>

      {/* Entity List */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        <h4 className="text-corporate-lightGray text-sm font-medium mb-3">
          Available Entities
        </h4>
        {filteredEntities.map((entity) => (
          <Button
            key={entity}
            onClick={() => onEntitySelect(entity)}
            variant={selectedEntity === entity ? "default" : "ghost"}
            className={`w-full justify-start text-left ${
              selectedEntity === entity
                ? 'bg-corporate-accent text-black'
                : 'text-corporate-lightGray hover:text-white hover:bg-corporate-dark'
            }`}
          >
            <User className="h-4 w-4 mr-2" />
            {entity}
          </Button>
        ))}
      </div>

      {/* Selected Entity Memory */}
      {selectedEntity && (
        <div className="border-t border-corporate-border p-4">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-corporate-accent" />
            Memory Snapshot
          </h4>
          <div className="space-y-2 max-h-40 overflow-auto">
            {entityMemory.slice(0, 3).map((memory, index) => (
              <div key={index} className="p-2 bg-corporate-dark rounded text-xs">
                <Badge className="bg-blue-500/20 text-blue-300 text-xs mb-1">
                  {memory.memory_type}
                </Badge>
                <p className="text-corporate-lightGray line-clamp-2">
                  {memory.memory_summary}
                </p>
              </div>
            ))}
            {entityMemory.length === 0 && (
              <p className="text-corporate-lightGray text-xs">
                No memory data available
              </p>
            )}
          </div>
        </div>
      )}

      {/* Service Status */}
      <div className="border-t border-corporate-border p-4">
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-corporate-accent" />
          System Status
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(serviceStatus).slice(0, 4).map(([service, status]) => (
            <Badge
              key={service}
              className={`text-xs justify-center ${
                status === 'active'
                  ? 'bg-green-500/20 text-green-400 border-green-500/50'
                  : 'bg-red-500/20 text-red-400 border-red-500/50'
              }`}
            >
              {service.replace(/([A-Z])/g, ' $1').toLowerCase().slice(0, 8)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EntityContextPanel;

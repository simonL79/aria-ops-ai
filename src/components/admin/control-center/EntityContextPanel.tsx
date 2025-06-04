
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Target, Search, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EntityContextPanelProps {
  selectedEntity: string;
  entityMemory: any[];
  onEntitySelect: (entityName: string) => void;
  serviceStatus: any;
}

const EntityContextPanel: React.FC<EntityContextPanelProps> = ({
  selectedEntity,
  entityMemory,
  onEntitySelect,
  serviceStatus
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [entities, setEntities] = useState<string[]>([]);
  const [recentEntities, setRecentEntities] = useState<string[]>([]);

  useEffect(() => {
    loadAvailableEntities();
    loadRecentEntities();
  }, []);

  const loadAvailableEntities = async () => {
    try {
      // Get unique entities from various sources
      const { data: scanEntities } = await supabase
        .from('scan_results')
        .select('detected_entities')
        .not('detected_entities', 'is', null)
        .limit(100);

      const { data: clientEntities } = await supabase
        .from('client_entities')
        .select('entity_name')
        .limit(50);

      const allEntities = new Set<string>();
      
      // Process scan results
      scanEntities?.forEach(item => {
        if (item.detected_entities) {
          const entityList = Array.isArray(item.detected_entities) 
            ? item.detected_entities 
            : [item.detected_entities];
          entityList.forEach(entity => {
            if (typeof entity === 'string' && entity.length > 2) {
              allEntities.add(entity.trim());
            }
          });
        }
      });

      // Process client entities
      clientEntities?.forEach(item => {
        if (item.entity_name && item.entity_name.length > 2) {
          allEntities.add(item.entity_name.trim());
        }
      });

      setEntities(Array.from(allEntities).sort());
      
    } catch (error) {
      console.error('Failed to load entities:', error);
    }
  };

  const loadRecentEntities = async () => {
    try {
      const { data: recentOps } = await supabase
        .from('aria_ops_log')
        .select('entity_name')
        .not('entity_name', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentOps) {
        const recent = recentOps
          .map(op => op.entity_name)
          .filter((name, index, arr) => arr.indexOf(name) === index)
          .slice(0, 5);
        setRecentEntities(recent);
      }
      
    } catch (error) {
      console.error('Failed to load recent entities:', error);
    }
  };

  const handleEntitySelect = (entityName: string) => {
    onEntitySelect(entityName);
    toast.success(`🎯 Entity context switched to: ${entityName}`, {
      description: "All modules now targeting this entity"
    });
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
        <div className="writing-vertical text-xs text-corporate-lightGray">
          Entity Context
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-corporate-darkSecondary border-r border-corporate-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-corporate-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-corporate-accent" />
            Entity Context
          </h3>
          <Button
            onClick={() => setIsCollapsed(true)}
            variant="ghost"
            size="sm"
            className="text-corporate-lightGray hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Selected Entity */}
        {selectedEntity ? (
          <Badge className="bg-corporate-accent text-black">
            Active: {selectedEntity}
          </Badge>
        ) : (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">
            No Entity Selected
          </Badge>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b border-corporate-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-corporate-lightGray" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entities..."
            className="pl-10 bg-corporate-dark border-corporate-border text-white"
          />
        </div>
      </div>

      {/* Recent Entities */}
      {recentEntities.length > 0 && (
        <div className="p-4 border-b border-corporate-border">
          <h4 className="text-white text-sm font-medium mb-2">Recent</h4>
          <div className="space-y-1">
            {recentEntities.map((entity, index) => (
              <Button
                key={index}
                onClick={() => handleEntitySelect(entity)}
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-left ${
                  selectedEntity === entity
                    ? 'bg-corporate-accent text-black'
                    : 'text-corporate-lightGray hover:text-white'
                }`}
              >
                {entity}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Available Entities */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Available Entities ({filteredEntities.length})
          </h4>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {filteredEntities.length > 0 ? (
              filteredEntities.map((entity, index) => (
                <Button
                  key={index}
                  onClick={() => handleEntitySelect(entity)}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${
                    selectedEntity === entity
                      ? 'bg-corporate-accent text-black'
                      : 'text-corporate-lightGray hover:text-white'
                  }`}
                >
                  {entity}
                </Button>
              ))
            ) : (
              <p className="text-corporate-lightGray text-sm">
                {searchQuery ? 'No matching entities' : 'No entities found'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Entity Memory Summary */}
      {selectedEntity && (
        <div className="p-4 border-t border-corporate-border">
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-xs">Entity Memory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Memory Entries:</span>
                  <span className="text-white">{entityMemory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Last Update:</span>
                  <span className="text-white">
                    {entityMemory.length > 0 
                      ? new Date(entityMemory[0].created_at).toLocaleDateString()
                      : 'None'
                    }
                  </span>
                </div>
                <div className="text-green-400 text-xs">
                  ✅ Live Data Only
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EntityContextPanel;

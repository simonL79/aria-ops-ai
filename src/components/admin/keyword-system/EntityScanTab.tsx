
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Target, Search, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EntityScanTabProps {
  onEntitySelect: (entityName: string) => void;
}

const EntityScanTab: React.FC<EntityScanTabProps> = ({ onEntitySelect }) => {
  const [entities, setEntities] = useState<any[]>([]);
  const [newEntityName, setNewEntityName] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('Simon Lindsay');

  useEffect(() => {
    loadEntities();
    onEntitySelect(selectedEntity);
  }, [selectedEntity, onEntitySelect]);

  const loadEntities = async () => {
    try {
      const { data } = await supabase
        .from('clients')
        .select('id, name, keywordtargets')
        .order('created_at', { ascending: false });
      
      setEntities(data || []);
    } catch (error) {
      console.error('Error loading entities:', error);
    }
  };

  const addNewEntity = async () => {
    if (!newEntityName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('clients')
        .insert({
          name: newEntityName.trim(),
          keywordtargets: '',
          contactname: 'System Generated',
          contactemail: 'system@example.com',
          industry: 'General',
          website: ''
        });
      
      if (error) throw error;
      
      toast.success(`Added entity: ${newEntityName}`);
      setNewEntityName('');
      loadEntities();
    } catch (error) {
      console.error('Error adding entity:', error);
      toast.error('Failed to add entity');
    }
  };

  const selectEntity = (entityName: string) => {
    setSelectedEntity(entityName);
    onEntitySelect(entityName);
    toast.info(`Selected entity: ${entityName}`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-corporate-accent" />
            Entity Threat Scanning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Entity */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter entity name (e.g., Simon Lindsay, Daniel O'Reilly)"
              value={newEntityName}
              onChange={(e) => setNewEntityName(e.target.value)}
              className="bg-corporate-darkTertiary border-corporate-border text-white"
              onKeyPress={(e) => e.key === 'Enter' && addNewEntity()}
            />
            <Button 
              onClick={addNewEntity}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Entity Selection */}
          <div>
            <h4 className="text-white font-medium mb-3">Select Entity to Scan:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedEntity === entity.name
                      ? 'border-corporate-accent bg-corporate-accent/10'
                      : 'border-corporate-border bg-corporate-darkTertiary hover:border-corporate-lightGray'
                  }`}
                  onClick={() => selectEntity(entity.name)}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-white font-medium">{entity.name}</h5>
                    {selectedEntity === entity.name && (
                      <Badge className="bg-corporate-accent text-black">Selected</Badge>
                    )}
                  </div>
                  {entity.keywordtargets && (
                    <p className="text-corporate-lightGray text-sm mt-1">
                      Keywords: {entity.keywordtargets}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Selection Summary */}
          {selectedEntity && (
            <div className="p-4 bg-corporate-accent/10 border border-corporate-accent rounded-lg">
              <h4 className="text-corporate-accent font-medium mb-2">Currently Selected Entity:</h4>
              <p className="text-white">{selectedEntity}</p>
              <p className="text-corporate-lightGray text-sm mt-1">
                This entity will be used across all pipeline stages (CIA Precision, Counter Narratives, Article Generation)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityScanTab;

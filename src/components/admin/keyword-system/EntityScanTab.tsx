
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Target, Search, Plus, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { EnforcedIntelligencePipeline } from '@/services/ariaCore/enforcedIntelligencePipeline';
import { toast } from 'sonner';

interface EntityScanTabProps {
  onEntitySelect: (entityName: string) => void;
}

const EntityScanTab: React.FC<EntityScanTabProps> = ({ onEntitySelect }) => {
  const [entities, setEntities] = useState<any[]>([]);
  const [newEntityName, setNewEntityName] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('Simon Lindsay');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);

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

  const runEnforcedScan = async () => {
    if (!selectedEntity) {
      toast.error('Please select an entity first');
      return;
    }

    setIsScanning(true);
    try {
      toast.info(`🔍 Starting enforced entity scan for ${selectedEntity}...`);
      
      const results = await EnforcedIntelligencePipeline.executeEntityScan(selectedEntity);
      setScanResults(results);
      
      toast.success(`✅ Enforced scan complete: ${results.length} live verified results`);
    } catch (error) {
      console.error('Enforced scan failed:', error);
      toast.error('❌ Enforced entity scan failed - live data enforcement active');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-corporate-accent" />
            Entity Threat Scanning (ENFORCED)
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

          {/* Enforced Scan Control */}
          <div className="p-4 bg-corporate-accent/10 border border-corporate-accent rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-corporate-accent font-medium mb-1">Live Data Enforcement Active</h4>
                <p className="text-white text-sm">Selected: {selectedEntity}</p>
                <p className="text-corporate-lightGray text-xs">
                  All results validated for entity relevance and live data integrity
                </p>
              </div>
              <Button
                onClick={runEnforcedScan}
                disabled={isScanning || !selectedEntity}
                className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
              >
                {isScanning ? (
                  <>
                    <Shield className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Run Enforced Scan
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Scan Results */}
          {scanResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-white font-medium">Live Scan Results ({scanResults.length})</h4>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {scanResults.slice(0, 5).map((result, index) => (
                  <div key={index} className="p-3 bg-corporate-darkSecondary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-green-500">LIVE VERIFIED</Badge>
                      <Badge variant="outline" className="text-corporate-lightGray">
                        {result.severity}
                      </Badge>
                    </div>
                    <p className="text-white text-sm">{result.content.substring(0, 100)}...</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-corporate-lightGray text-xs">
                        Platform: {result.platform}
                      </span>
                      <Shield className="h-3 w-3 text-green-400" />
                      <span className="text-green-400 text-xs">Enforcement Passed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityScanTab;


import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  getAllEntities, 
  batchProcessEntities, 
  getEntityStatistics, 
  getScanResultsByEntity 
} from '@/services/entityRecognition';

export interface PanelEntity {
  name: string;
  type: 'person' | 'organization' | 'handle' | 'unknown';
  confidence: number;
  mentions: number;
}

export const useEntityRecognition = () => {
  const [entities, setEntities] = useState<PanelEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<PanelEntity | null>(null);
  const [entityResults, setEntityResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState({
    totalEntities: 0,
    personEntities: 0,
    orgEntities: 0,
    handleEntities: 0,
    mostMentioned: null as PanelEntity | null
  });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    setLoading(true);
    try {
      // Map the service entities to the panel entity type for type safety
      const allEntities = await getAllEntities();
      const mappedEntities: PanelEntity[] = allEntities.map(e => ({
        name: e.name,
        // Map 'location' type to 'unknown' for compatibility
        type: e.type === 'location' ? 'unknown' : e.type as PanelEntity['type'],
        confidence: e.confidence,
        mentions: e.mentions || 0
      }));
      setEntities(mappedEntities);
      
      const statistics = await getEntityStatistics();
      setStats({
        totalEntities: statistics.totalEntities,
        personEntities: statistics.personEntities,
        orgEntities: statistics.orgEntities,
        handleEntities: statistics.handleEntities,
        mostMentioned: statistics.mostMentioned ? {
          name: statistics.mostMentioned.name,
          // Map 'location' type to 'unknown' for compatibility
          type: statistics.mostMentioned.type === 'location' ? 'unknown' : 
                statistics.mostMentioned.type as PanelEntity['type'],
          confidence: statistics.mostMentioned.confidence,
          mentions: statistics.mostMentioned.mentions || 0
        } : null
      });
    } catch (error) {
      console.error('Error loading entities:', error);
      toast.error('Failed to load entity data');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessEntities = async () => {
    setProcessing(true);
    try {
      const processedCount = await batchProcessEntities();
      if (processedCount > 0) {
        await loadEntities();
        toast.success(`Processed ${processedCount} items for entity recognition`);
      } else {
        toast.info('No new items to process');
      }
    } catch (error) {
      console.error('Error processing entities:', error);
      toast.error('Failed to process entities');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewEntity = async (entity: PanelEntity) => {
    setSelectedEntity(entity);
    try {
      const results = await getScanResultsByEntity(entity.name);
      setEntityResults(results);
    } catch (error) {
      console.error('Error fetching entity results:', error);
      setEntityResults([]);
    }
  };

  const filteredEntities = entities.filter(entity => {
    if (activeTab === 'all') return true;
    return entity.type === activeTab;
  });

  return {
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
  };
};

export default useEntityRecognition;

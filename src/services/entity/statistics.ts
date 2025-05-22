
import { Entity, EntityStatistics } from '@/types/entity';
import { getAllEntities } from './entities';

/**
 * Get entity statistics
 */
export const getEntityStatistics = async (): Promise<EntityStatistics> => {
  try {
    const entities = await getAllEntities();
    
    const personEntities = entities.filter(e => e.type === 'person').length;
    const orgEntities = entities.filter(e => e.type === 'organization').length;
    const handleEntities = entities.filter(e => e.type === 'handle').length;
    
    // Sort by mentions to find most mentioned
    const sortedEntities = [...entities].sort((a, b) => (b.mentions || 0) - (a.mentions || 0));
    
    return {
      totalEntities: entities.length,
      personEntities,
      orgEntities,
      handleEntities,
      mostMentioned: sortedEntities.length > 0 ? sortedEntities[0] : null
    };
  } catch (error) {
    console.error('Error getting entity statistics:', error);
    return {
      totalEntities: 0,
      personEntities: 0,
      orgEntities: 0,
      handleEntities: 0,
      mostMentioned: null
    };
  }
};

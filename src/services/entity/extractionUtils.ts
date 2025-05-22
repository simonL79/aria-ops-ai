
import { Entity } from '@/types/entity';

/**
 * Extract entities from text content using regex and heuristics
 */
export const extractEntitiesFromText = (text: string): Entity[] => {
  if (!text) return [];
  
  const entities: Map<string, Entity> = new Map();
  
  // Extract mentions (@username)
  const mentionRegex = /@[\w\d_]{2,}/g;
  const mentions = text.match(mentionRegex) || [];
  
  mentions.forEach(mention => {
    entities.set(mention, {
      name: mention,
      type: 'handle',
      confidence: 0.9,
      mentions: 1
    });
  });
  
  // Extract person names (capitalized words in sequence)
  const nameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
  const names = text.match(nameRegex) || [];
  
  names.forEach(name => {
    // Skip if name contains common words that might be false positives
    const commonWords = ['The', 'This', 'That', 'These', 'Those', 'Their', 'Your', 'Our'];
    if (commonWords.some(word => name.includes(word))) return;
    
    if (entities.has(name)) {
      const entity = entities.get(name)!;
      entities.set(name, { ...entity, mentions: entity.mentions! + 1 });
    } else {
      entities.set(name, {
        name,
        type: 'person',
        confidence: 0.7,
        mentions: 1
      });
    }
  });
  
  // Extract organization names (simplistic approach)
  const orgIndicators = [
    'Inc', 'LLC', 'Ltd', 'Limited', 'Corp', 'Corporation', 
    'Company', 'Co', 'Group', 'Foundation', 'Association'
  ];
  
  orgIndicators.forEach(indicator => {
    const orgRegex = new RegExp(`\\b[A-Z][\\w\\s]*\\s+${indicator}\\b`, 'g');
    const orgs = text.match(orgRegex) || [];
    
    orgs.forEach(org => {
      if (entities.has(org)) {
        const entity = entities.get(org)!;
        entities.set(org, { ...entity, type: 'organization', mentions: entity.mentions! + 1 });
      } else {
        entities.set(org, {
          name: org,
          type: 'organization',
          confidence: 0.8,
          mentions: 1
        });
      }
    });
  });
  
  return Array.from(entities.values());
};

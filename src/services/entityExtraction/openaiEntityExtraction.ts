
import { supabase } from '@/integrations/supabase/client';

export interface ScanEntity {
  name: string;
  type: 'PERSON' | 'ORG' | 'SOCIAL' | 'LOCATION';
}

const ENTITY_EXTRACTION_PROMPT = (text: string) => `
Extract all identifiable entities from the text below.

Return ONLY a JSON array of objects with this exact format:
[
  { "name": "Jane Doe", "type": "PERSON" },
  { "name": "ACME Corp", "type": "ORG" },
  { "name": "@johndoe", "type": "SOCIAL" }
]

Types to identify:
- PERSON: People's names (first/last names)
- ORG: Company names, organizations, brands
- SOCIAL: Social media handles (@username, usernames)
- LOCATION: Cities, countries, places

Text:
"""${text}"""

Return only the JSON array, no other text.
`;

export async function extractEntitiesWithOpenAI(text: string): Promise<ScanEntity[]> {
  try {
    console.log('Extracting entities from text:', text.substring(0, 100) + '...');
    
    const { data, error } = await supabase.functions.invoke('entity-recognition', {
      body: {
        content: text,
        mode: 'advanced'
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      return fallbackEntityExtraction(text);
    }

    if (data?.entities && Array.isArray(data.entities)) {
      // Convert to our format
      const entities: ScanEntity[] = data.entities.map((entity: any) => ({
        name: entity.name,
        type: mapEntityType(entity.type)
      }));
      
      console.log('Extracted entities:', entities);
      return entities;
    }

    return fallbackEntityExtraction(text);
  } catch (err) {
    console.error('Entity extraction failed:', err);
    return fallbackEntityExtraction(text);
  }
}

function mapEntityType(type: string): ScanEntity['type'] {
  switch (type.toLowerCase()) {
    case 'person':
      return 'PERSON';
    case 'organization':
    case 'org':
      return 'ORG';
    case 'handle':
      return 'SOCIAL';
    case 'location':
      return 'LOCATION';
    default:
      return 'PERSON';
  }
}

function fallbackEntityExtraction(text: string): ScanEntity[] {
  const entities: ScanEntity[] = [];
  
  // Extract social handles
  const socialRegex = /@[\w\d_]{2,}/g;
  const socialMatches = text.match(socialRegex) || [];
  socialMatches.forEach(handle => {
    entities.push({ name: handle, type: 'SOCIAL' });
  });
  
  // Extract potential names (capitalized words)
  const nameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
  const nameMatches = text.match(nameRegex) || [];
  nameMatches.forEach(name => {
    // Skip common false positives
    const commonWords = ['The', 'This', 'That', 'These', 'Those'];
    if (!commonWords.some(word => name.startsWith(word))) {
      entities.push({ name, type: 'PERSON' });
    }
  });
  
  // Extract potential organizations
  const orgIndicators = ['Inc', 'LLC', 'Ltd', 'Corp', 'Company', 'Co'];
  orgIndicators.forEach(indicator => {
    const orgRegex = new RegExp(`\\b[A-Z][\\w\\s]*\\s+${indicator}\\b`, 'g');
    const orgMatches = text.match(orgRegex) || [];
    orgMatches.forEach(org => {
      entities.push({ name: org, type: 'ORG' });
    });
  });
  
  return entities;
}

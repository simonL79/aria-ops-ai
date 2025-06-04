
export interface EntityFingerprint {
  entity_id: string;
  primary_name: string;
  aliases: string[];
  context_terms: string[];
  locations: string[];
  exclude_entities: string[];
}

export interface EntityMatchResult {
  match: boolean;
  confidence: number;
  matched_on: string[];
  discard_reason?: string;
}

export interface EntityMatchLog {
  url: string;
  title: string;
  content_excerpt: string;
  match: boolean;
  confidence: number;
  matched_on: string[];
  discard_reason?: string;
  timestamp: string;
}

export class EntityFingerprintMatcher {
  static createFingerprint(entityName: string): EntityFingerprint {
    // Default fingerprints for common entities
    const fingerprintMap: Record<string, EntityFingerprint> = {
      'Simon Lindsay': {
        entity_id: 'simon-lindsay-ksl',
        primary_name: 'Simon Lindsay',
        aliases: ['Simon L.', 'S. Lindsay', '@simonlindsay', 'Simon KSL'],
        context_terms: ['KSL Hair', 'Glasgow', 'Scotland', 'bench warrant', 'fraud'],
        locations: ['Glasgow', 'Scotland', 'UK'],
        exclude_entities: ['Lindsay Lohan', 'Simon Cowell', 'Lindsay Graham', 'Simon Pegg']
      },
      'Daniel O\'Reilly': {
        entity_id: 'daniel-oreilly-comedian',
        primary_name: 'Daniel O\'Reilly',
        aliases: ['Dapper Laughs', 'Daniel O.', 'Dan O\'Reilly'],
        context_terms: ['comedian', 'ITV', 'mental health', 'father', 'KSL Hair'],
        locations: ['UK', 'London'],
        exclude_entities: ['Lindsay Lohan', 'Simon Cowell']
      }
    };

    // Return specific fingerprint or create a generic one
    return fingerprintMap[entityName] || {
      entity_id: entityName.toLowerCase().replace(/\s+/g, '-'),
      primary_name: entityName,
      aliases: [],
      context_terms: [],
      locations: [],
      exclude_entities: ['Lindsay Lohan', 'Simon Cowell', 'Lindsay Graham', 'Simon Pegg', 'Simon Baker']
    };
  }

  static matchEntity(text: string, title: string, entity: EntityFingerprint): EntityMatchResult {
    const fullText = `${title} ${text}`.toLowerCase();
    const primaryName = entity.primary_name.toLowerCase();
    
    let score = 0;
    const matchedOn: string[] = [];

    // CRITICAL: Check for false positive exclusions FIRST
    for (const excludeEntity of entity.exclude_entities) {
      if (fullText.includes(excludeEntity.toLowerCase())) {
        console.log(`🚫 EXCLUDED: Found "${excludeEntity}" in content - rejecting`);
        return {
          match: false,
          confidence: 0,
          matched_on: [],
          discard_reason: `Contains excluded entity: ${excludeEntity}`
        };
      }
    }

    // Primary name match (highest weight)
    if (fullText.includes(primaryName)) {
      score += 0.6;
      matchedOn.push('primary_name');
      console.log(`✅ Primary name match: "${primaryName}"`);
    }

    // Alias matches
    for (const alias of entity.aliases) {
      if (fullText.includes(alias.toLowerCase())) {
        score += 0.2;
        matchedOn.push('alias');
        console.log(`✅ Alias match: "${alias}"`);
        break; // Only count one alias match
      }
    }

    // Context terms (lower weight)
    let contextMatches = 0;
    for (const term of entity.context_terms) {
      if (fullText.includes(term.toLowerCase())) {
        contextMatches++;
        matchedOn.push('context_terms');
        console.log(`✅ Context match: "${term}"`);
      }
    }
    if (contextMatches > 0) {
      score += Math.min(contextMatches * 0.05, 0.1); // Max 0.1 from context
    }

    // Location context
    for (const location of entity.locations) {
      if (fullText.includes(location.toLowerCase())) {
        score += 0.05;
        matchedOn.push('location');
        console.log(`✅ Location match: "${location}"`);
        break; // Only count one location match
      }
    }

    const finalConfidence = Math.min(score, 1.0);
    const isMatch = finalConfidence >= 0.7; // High threshold for precision

    if (!isMatch) {
      return {
        match: false,
        confidence: finalConfidence,
        matched_on: matchedOn,
        discard_reason: `Entity confidence ${finalConfidence.toFixed(2)} below threshold 0.7`
      };
    }

    return {
      match: true,
      confidence: finalConfidence,
      matched_on: matchedOn
    };
  }

  static logMatch(url: string, title: string, content: string, matchResult: EntityMatchResult): EntityMatchLog {
    return {
      url,
      title,
      content_excerpt: content.substring(0, 200) + '...',
      match: matchResult.match,
      confidence: matchResult.confidence,
      matched_on: matchResult.matched_on,
      discard_reason: matchResult.discard_reason,
      timestamp: new Date().toISOString()
    };
  }
}

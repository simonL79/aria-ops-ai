
/**
 * A.R.I.A™ Enhanced Entity Matcher - Layered Confidence Scoring
 * High Recall, High Precision Intelligence Processing
 */

export interface EntityMatch {
  entity_name: string;
  matched_text: string;
  match_type: 'exact' | 'alias' | 'contextual' | 'fuzzy';
  confidence_score: number;
  matched_alias?: string;
  context_keywords?: string[];
}

export interface EnhancedEntityFingerprint {
  entity_name: string;
  exact_phrases: string[];
  alias_variations: string[];
  contextual_keywords: string[];
  business_contexts: string[];
  location_contexts: string[];
  negative_keywords: string[];
  social_handles: string[];
  fuzzy_variations: string[];
}

/**
 * Generate comprehensive entity fingerprint with expanded variations
 */
export function generateEnhancedEntityFingerprint(entityName: string): EnhancedEntityFingerprint {
  const nameParts = entityName.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  return {
    entity_name: entityName,
    exact_phrases: [
      entityName.toLowerCase(),
      `"${entityName.toLowerCase()}"`,
      `'${entityName.toLowerCase()}'`,
    ],
    alias_variations: [
      `${firstName.toLowerCase()} ${lastName.charAt(0).toLowerCase()}.`,
      `${firstName.charAt(0).toLowerCase()}. ${lastName.toLowerCase()}`,
      `mr. ${lastName.toLowerCase()}`,
      `mr ${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()} ${lastName.toLowerCase()}`,
    ],
    contextual_keywords: [
      'fraud', 'scam', 'warrant', 'arrest', 'lawsuit', 'controversy',
      'investigation', 'allegations', 'misconduct', 'criminal'
    ],
    business_contexts: [
      'ksl hair', 'ksl', 'hair salon', 'glasgow business', 'ceo', 'director'
    ],
    location_contexts: [
      'glasgow', 'scotland', 'uk'
    ],
    negative_keywords: [
      'bench warrant', 'fraud allegations', 'criminal investigation'
    ],
    social_handles: [
      `@${entityName.toLowerCase().replace(/\s+/g, '')}`,
      `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    ],
    fuzzy_variations: [
      entityName.toLowerCase().replace(/\s+/g, ''),
      `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    ]
  };
}

/**
 * Layered entity matching with confidence scoring
 */
export function matchEntityWithConfidence(
  content: string, 
  fingerprint: EnhancedEntityFingerprint
): EntityMatch | null {
  const normalizedContent = content.toLowerCase().trim();
  
  // Layer 1: Exact Match (Confidence: 1.0)
  for (const phrase of fingerprint.exact_phrases) {
    if (normalizedContent.includes(phrase)) {
      return {
        entity_name: fingerprint.entity_name,
        matched_text: phrase,
        match_type: 'exact',
        confidence_score: 1.0,
        matched_alias: phrase
      };
    }
  }
  
  // Layer 2: Alias Match (Confidence: 0.85)
  for (const alias of fingerprint.alias_variations) {
    if (normalizedContent.includes(alias)) {
      return {
        entity_name: fingerprint.entity_name,
        matched_text: alias,
        match_type: 'alias',
        confidence_score: 0.85,
        matched_alias: alias
      };
    }
  }
  
  // Layer 3: Social Handle Match (Confidence: 0.8)
  for (const handle of fingerprint.social_handles) {
    if (normalizedContent.includes(handle)) {
      return {
        entity_name: fingerprint.entity_name,
        matched_text: handle,
        match_type: 'alias',
        confidence_score: 0.8,
        matched_alias: handle
      };
    }
  }
  
  // Layer 4: Contextual Match (Confidence: 0.6)
  const hasEntityReference = fingerprint.alias_variations.some(alias => 
    normalizedContent.includes(alias.split(' ')[0]) || normalizedContent.includes(alias.split(' ')[1])
  );
  
  if (hasEntityReference) {
    const matchedContexts = fingerprint.business_contexts.filter(context => 
      normalizedContent.includes(context)
    );
    
    const matchedLocations = fingerprint.location_contexts.filter(location => 
      normalizedContent.includes(location)
    );
    
    const matchedNegativeKeywords = fingerprint.negative_keywords.filter(keyword => 
      normalizedContent.includes(keyword)
    );
    
    if (matchedContexts.length > 0 || matchedLocations.length > 0 || matchedNegativeKeywords.length > 0) {
      return {
        entity_name: fingerprint.entity_name,
        matched_text: normalizedContent.substring(0, 100),
        match_type: 'contextual',
        confidence_score: 0.6,
        context_keywords: [...matchedContexts, ...matchedLocations, ...matchedNegativeKeywords]
      };
    }
  }
  
  // Layer 5: Fuzzy Match (Confidence: 0.4)
  for (const fuzzy of fingerprint.fuzzy_variations) {
    if (normalizedContent.includes(fuzzy)) {
      return {
        entity_name: fingerprint.entity_name,
        matched_text: fuzzy,
        match_type: 'fuzzy',
        confidence_score: 0.4,
        matched_alias: fuzzy
      };
    }
  }
  
  return null;
}

/**
 * Generate expanded search queries with contextual variations
 */
export function generateExpandedSearchQueries(fingerprint: EnhancedEntityFingerprint): string[] {
  const queries: string[] = [];
  
  // Exact phrase searches
  queries.push(`"${fingerprint.entity_name}"`);
  queries.push(fingerprint.entity_name);
  
  // Business context combinations
  for (const context of fingerprint.business_contexts) {
    queries.push(`"${fingerprint.entity_name}" ${context}`);
    queries.push(`"${fingerprint.entity_name}" "${context}"`);
  }
  
  // Location context combinations
  for (const location of fingerprint.location_contexts) {
    queries.push(`"${fingerprint.entity_name}" ${location}`);
  }
  
  // Negative keyword investigations
  for (const keyword of fingerprint.negative_keywords) {
    queries.push(`"${fingerprint.entity_name}" "${keyword}"`);
  }
  
  // Alias searches
  for (const alias of fingerprint.alias_variations) {
    queries.push(`"${alias}"`);
  }
  
  // Social handle searches
  queries.push(...fingerprint.social_handles);
  
  return [...new Set(queries)]; // Remove duplicates
}

/**
 * Filter results with configurable confidence threshold
 */
export function filterWithConfidenceThreshold(
  results: any[], 
  fingerprint: EnhancedEntityFingerprint,
  minConfidence: number = 0.6
): { 
  filtered: any[], 
  stats: { 
    total: number, 
    matched: number, 
    discarded: number,
    confidence_breakdown: Record<string, number>,
    discarded_reasons: Record<string, number>
  } 
} {
  const total = results.length;
  const filtered = [];
  const confidenceBreakdown: Record<string, number> = {};
  const discardedReasons: Record<string, number> = {};
  
  for (const result of results) {
    const content = (result.content || result.title || result.description || '').toLowerCase();
    const url = (result.url || '').toLowerCase();
    const fullText = `${content} ${url}`;
    
    const match = matchEntityWithConfidence(fullText, fingerprint);
    
    if (match) {
      confidenceBreakdown[match.match_type] = (confidenceBreakdown[match.match_type] || 0) + 1;
      
      if (match.confidence_score >= minConfidence) {
        filtered.push({
          ...result,
          entity_match: match,
          confidence_score: match.confidence_score,
          match_type: match.match_type
        });
      } else {
        discardedReasons['confidence_too_low'] = (discardedReasons['confidence_too_low'] || 0) + 1;
      }
    } else {
      discardedReasons['no_entity_match'] = (discardedReasons['no_entity_match'] || 0) + 1;
    }
  }
  
  const matched = filtered.length;
  const discarded = total - matched;
  
  console.log(`🔍 Enhanced Entity Filtering: ${total} total → ${matched} matched → ${discarded} discarded`);
  console.log(`📊 Confidence Breakdown:`, confidenceBreakdown);
  console.log(`❌ Discard Reasons:`, discardedReasons);
  
  return {
    filtered,
    stats: { 
      total, 
      matched, 
      discarded,
      confidence_breakdown: confidenceBreakdown,
      discarded_reasons: discardedReasons
    }
  };
}

/**
 * Log comprehensive filtering statistics
 */
export function logEnhancedFilteringStats(
  entityName: string,
  platform: string,
  stats: any,
  searchQueries: string[]
): void {
  console.log(`📊 Enhanced Entity Intelligence Stats for "${entityName}" on ${platform}:`);
  console.log(`   🔍 Search Queries (${searchQueries.length}):`, searchQueries.slice(0, 5).join(', '), '...');
  console.log(`   📈 Results: ${stats.total} total → ${stats.matched} matched → ${stats.discarded} discarded`);
  console.log(`   🎯 Precision Rate: ${stats.total > 0 ? ((stats.matched / stats.total) * 100).toFixed(1) : 0}%`);
  console.log(`   🔬 Confidence Breakdown:`, stats.confidence_breakdown);
  console.log(`   ❌ Discard Reasons:`, stats.discarded_reasons);
}


/**
 * A.R.I.A™ Entity Matcher - Precision Entity-Specific Filtering
 * Ensures only content specifically about the target entity is captured
 */

export interface EntityFingerprint {
  entity_name: string;
  exact_phrases: string[];
  contextual_phrases: string[];
  social_handles: string[];
  location_contexts: string[];
  business_contexts: string[];
}

/**
 * Generate comprehensive entity fingerprint for precise matching
 */
export function generateEntityFingerprint(entityName: string): EntityFingerprint {
  const nameParts = entityName.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  return {
    entity_name: entityName,
    exact_phrases: [
      entityName.toLowerCase(),
      `"${entityName.toLowerCase()}"`,
      `'${entityName.toLowerCase()}'`,
      entityName.toLowerCase().replace(/\s+/g, ''),
    ],
    contextual_phrases: [
      `${firstName.toLowerCase()} ${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()} ${lastName.charAt(0).toLowerCase()}.`,
      `${firstName.charAt(0).toLowerCase()}. ${lastName.toLowerCase()}`,
    ],
    social_handles: [
      `@${entityName.toLowerCase().replace(/\s+/g, '')}`,
      `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    ],
    location_contexts: [
      `${entityName.toLowerCase()} glasgow`,
      `${entityName.toLowerCase()} scotland`,
    ],
    business_contexts: [
      `${entityName.toLowerCase()} ksl hair`,
      `${entityName.toLowerCase()} ksl`,
      `${entityName.toLowerCase()} hair salon`,
    ]
  };
}

/**
 * Check if content is specifically about the target entity
 */
export function isEntitySpecificMatch(content: string, fingerprint: EntityFingerprint): boolean {
  const normalizedContent = content.toLowerCase().trim();
  
  // First check: Exact phrase matches (highest confidence)
  const hasExactMatch = fingerprint.exact_phrases.some(phrase => 
    normalizedContent.includes(phrase)
  );
  
  if (hasExactMatch) {
    console.log('✅ Exact entity match found:', fingerprint.entity_name);
    return true;
  }
  
  // Second check: Contextual phrases with business/location context
  const hasContextualMatch = fingerprint.contextual_phrases.some(phrase => {
    if (normalizedContent.includes(phrase)) {
      // Require additional context for partial name matches
      const hasBusinessContext = fingerprint.business_contexts.some(context => 
        normalizedContent.includes(context.split(' ').slice(1).join(' ')) // Remove name part
      );
      const hasLocationContext = fingerprint.location_contexts.some(context => 
        normalizedContent.includes(context.split(' ').slice(1).join(' ')) // Remove name part
      );
      
      return hasBusinessContext || hasLocationContext;
    }
    return false;
  });
  
  if (hasContextualMatch) {
    console.log('✅ Contextual entity match found:', fingerprint.entity_name);
    return true;
  }
  
  // Third check: Social handle matches
  const hasSocialMatch = fingerprint.social_handles.some(handle => 
    normalizedContent.includes(handle)
  );
  
  if (hasSocialMatch) {
    console.log('✅ Social handle match found:', fingerprint.entity_name);
    return true;
  }
  
  console.log('❌ No entity-specific match found for:', fingerprint.entity_name);
  return false;
}

/**
 * Generate search queries for entity discovery (broad search, precise filter)
 */
export function generateEntitySearchQueries(fingerprint: EntityFingerprint): string[] {
  return [
    // Start with exact phrases for best precision
    `"${fingerprint.entity_name}"`,
    fingerprint.entity_name,
    
    // Add business context searches
    ...fingerprint.business_contexts.map(context => `"${context}"`),
    
    // Add location context searches
    ...fingerprint.location_contexts.map(context => `"${context}"`),
    
    // Add social handle searches
    ...fingerprint.social_handles,
  ];
}

/**
 * Filter scan results to only entity-specific content
 */
export function filterEntitySpecificResults(
  results: any[], 
  fingerprint: EntityFingerprint
): { filtered: any[], stats: { total: number, matched: number, discarded: number } } {
  const total = results.length;
  
  const filtered = results.filter(result => {
    const content = (result.content || result.title || result.description || '').toLowerCase();
    const url = (result.url || '').toLowerCase();
    const fullText = `${content} ${url}`;
    
    return isEntitySpecificMatch(fullText, fingerprint);
  });
  
  const matched = filtered.length;
  const discarded = total - matched;
  
  console.log(`🔍 Entity filtering: ${total} total → ${matched} matched → ${discarded} discarded`);
  
  return {
    filtered,
    stats: { total, matched, discarded }
  };
}

/**
 * Log entity matching statistics for debugging
 */
export function logEntityMatchingStats(
  entityName: string,
  platform: string,
  stats: { total: number, matched: number, discarded: number },
  searchQueries: string[]
): void {
  console.log(`📊 Entity Matching Stats for "${entityName}" on ${platform}:`);
  console.log(`   Search Queries: ${searchQueries.join(', ')}`);
  console.log(`   Total Results: ${stats.total}`);
  console.log(`   Entity-Specific Matches: ${stats.matched}`);
  console.log(`   Discarded as Noise: ${stats.discarded}`);
  console.log(`   Precision Rate: ${stats.total > 0 ? ((stats.matched / stats.total) * 100).toFixed(1) : 0}%`);
}

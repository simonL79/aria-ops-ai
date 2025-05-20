
import { supabase } from '@/integrations/supabase/client';

/**
 * Detect entities in content using AI or regex
 */
export const detectEntities = async (content: string, platform: string): Promise<string[]> => {
  try {
    // In a real implementation, you would call an AI API service here
    // For now, we'll use an enhanced implementation
    
    // Entity detection with improved patterns
    const entities: string[] = [];
    
    // Detect company names (more comprehensive regex)
    const companyRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(Inc|Corp|LLC|Ltd|Limited|Company|Technologies|Solutions|Group|Associates|Partners)\b/g;
    let match;
    
    while ((match = companyRegex.exec(content)) !== null) {
      entities.push(match[1] + ' ' + match[2]);
    }
    
    // Detect brand names (capitalized words that might be brands)
    const brandRegex = /\b([A-Z][a-z]+)\b/g;
    while ((match = brandRegex.exec(content)) !== null) {
      const potentialBrand = match[1];
      // Exclude common words that are often capitalized
      const commonWords = ['I', 'A', 'The', 'This', 'That', 'My', 'Your', 'It', 'They', 'We', 'He', 'She'];
      if (!commonWords.includes(potentialBrand) && !entities.includes(potentialBrand)) {
        entities.push(potentialBrand);
      }
    }
    
    // Detect people names (consecutive capitalized words)
    const nameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
    while ((match = nameRegex.exec(content)) !== null) {
      if (!entities.includes(match[0])) {
        entities.push(match[0]);
      }
    }
    
    // Detect products (words followed by version numbers or product identifiers)
    const productRegex = /\b([A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(v\d+|[0-9]+\.[0-9]+|Pro|Plus|Premium|Enterprise|Ultimate)\b/g;
    while ((match = productRegex.exec(content)) !== null) {
      if (!entities.includes(match[0])) {
        entities.push(match[0]);
      }
    }
    
    // Add ARIA Security as a detected entity if it's mentioned
    if (content.includes('ARIA') || content.includes('A.R.I.A.') || content.toLowerCase().includes('aria security')) {
      entities.push('ARIA Security');
    }
    
    // Add some default entities for demo purposes if none found
    if (entities.length === 0) {
      const defaultEntities = ['Brand', 'Company', 'Product', 'Service'];
      entities.push(defaultEntities[Math.floor(Math.random() * defaultEntities.length)]);
    }
    
    // Log the detection to activity logs
    await supabase.from("activity_logs").insert({
      action: "entity_detection",
      details: `Detected ${entities.length} entities in content from ${platform}`,
      entity_type: platform,
      entity_id: "entity_detection",
      user_email: "system"
    });
    
    return entities;
  } catch (error) {
    console.error("Error detecting entities:", error);
    return [];
  }
};

/**
 * Calculate potential reach based on platform and content
 */
export const calculatePotentialReach = (platform: string): number => {
  // Platform-specific base factors
  const baseFactor: Record<string, number> = {
    'Twitter': 2000,
    'Facebook': 1500,
    'LinkedIn': 1000,
    'Instagram': 3000,
    'News': 5000,
    'Reddit': 1200,
  };
  
  // Get platform factor or default to 1000
  const platformFactor = baseFactor[platform] || 1000;
  
  // Add more variation with a random factor between 0.5 and 2.0
  const randomFactor = Math.random() * 1.5 + 0.5;
  
  // Time-based factor (content posted during business hours gets more reach)
  const hour = new Date().getHours();
  const timeOfDayFactor = (hour >= 9 && hour <= 17) ? 1.2 : 0.9;
  
  // Calculate final reach
  return Math.round(platformFactor * randomFactor * timeOfDayFactor);
};

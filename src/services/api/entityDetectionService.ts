
import { supabase } from '@/integrations/supabase/client';

/**
 * Detect entities in content using AI or regex
 */
export const detectEntities = async (content: string, platform: string): Promise<string[]> => {
  try {
    // In a real implementation, you would call an AI API service here
    // For now, we'll use a simple implementation
    
    // Simple regex-based entity detection
    const entities: string[] = [];
    
    // Detect company names (capitalized words followed by Inc, Corp, LLC, etc.)
    const companyRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(Inc|Corp|LLC|Ltd|Limited|Company)\b/g;
    let match;
    
    while ((match = companyRegex.exec(content)) !== null) {
      entities.push(match[1] + ' ' + match[2]);
    }
    
    // Detect people names (consecutive capitalized words)
    const nameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
    while ((match = nameRegex.exec(content)) !== null) {
      if (!entities.includes(match[0])) {
        entities.push(match[0]);
      }
    }
    
    // Add some default entities for demo purposes if none found
    if (entities.length === 0) {
      const defaultEntities = ['Brand', 'Company', 'Product', 'Service'];
      entities.push(defaultEntities[Math.floor(Math.random() * defaultEntities.length)]);
    }
    
    // Log the detection to activity logs instead of trying to use a non-existent table
    await supabase.from("activity_logs").insert({
      action: "entity_detection",
      details: content.substring(0, 100),
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
  // In a real implementation, this would use platform-specific algorithms
  const baseFactor = {
    'Twitter': 2000,
    'Facebook': 1500,
    'LinkedIn': 1000,
    'Instagram': 3000,
    'News': 5000,
    'Reddit': 1200,
  };
  
  const platformFactor = baseFactor[platform as keyof typeof baseFactor] || 1000;
  const randomFactor = Math.random() * 0.5 + 0.75; // 0.75 to 1.25
  
  return Math.round(platformFactor * randomFactor);
};

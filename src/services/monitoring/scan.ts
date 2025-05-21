import { Mention, ScanResult } from './types';
import { saveMention } from './mentions';
import { getMonitoredPlatforms } from './platforms';
import { detectEntities, calculatePotentialReach } from '@/services/api/entityDetectionService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Run a monitoring scan to detect mentions
 */
export const runMonitoringScan = async (): Promise<ScanResult[]> => {
  console.log("Running monitoring scan...");
  
  try {
    const platforms = getMonitoredPlatforms();
    const enabledPlatforms = platforms.filter(p => p.isActive);
    const results: ScanResult[] = [];
    
    // Log scan activity
    try {
      await supabase.from("activity_logs").insert({
        action: "monitoring_scan",
        details: `Scan initiated for ${enabledPlatforms.length} platforms`,
        entity_type: "monitoring",
        entity_id: "scan",
        user_email: "system"
      });
    } catch (error) {
      console.error("Error logging scan activity:", error);
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate results for each enabled platform
    for (const platform of enabledPlatforms) {
      const count = Math.floor(Math.random() * 3) + 1; // 1-3 mentions per platform
      
      for (let i = 0; i < count; i++) {
        // Generate more realistic content based on platform
        const content = generatePlatformSpecificContent(platform.name);
        
        // Use a more accurate sentiment algorithm that returns a number between -100 and 100
        const sentiment = calculateSentiment(content);
        
        // Determine severity based on sentiment and a probability factor
        // More negative sentiment has higher probability of being high severity
        const severityProbability = (sentiment < -50) ? 0.7 : (sentiment < 0) ? 0.3 : 0.1;
        const severity = Math.random() < severityProbability ? 'high' : 
                        Math.random() < 0.5 ? 'medium' : 'low';
        
        // Add entity detection - use the existing function with improved content
        const entities = await detectEntities(content, platform.name);
        
        // Calculate potential reach based on platform-specific algorithm
        const reach = calculatePotentialReach(platform.name);
        
        // Determine threat type based on content and platform
        const threatType = determineThreatType(content, platform.name);
        
        // Save the mention with more detailed information
        const mention = saveMention(
          platform.name,
          content,
          generateRealisticURL(platform.name),
          severity as 'high' | 'medium' | 'low',
          threatType
        );
        
        const result: ScanResult = {
          id: mention.id,
          platform: mention.platform,
          content: mention.content,
          date: mention.date.toISOString(),
          severity: mention.severity,
          status: mention.status || 'new',
          url: mention.source,
          threatType: mention.threatType,
          sentiment: sentiment,
          detectedEntities: entities || [],
          potentialReach: reach || 0,
          category: threatType === 'customerInquiry' ? 'customer_enquiry' : undefined
        };
        
        results.push(result);
      }
    }
    
    // Log the scan results
    try {
      await supabase.from("activity_logs").insert({
        action: "monitoring_results",
        details: `Found ${results.length} mentions across ${enabledPlatforms.length} platforms`,
        entity_type: "monitoring",
        entity_id: "scan_results",
        user_email: "system"
      });
    } catch (error) {
      console.error("Error logging scan results:", error);
    }
    
    return results;
    
  } catch (error) {
    console.error("Error during monitoring scan:", error);
    return []; // Return empty array on error instead of crashing
  }
};

/**
 * Generate platform-specific content
 */
function generatePlatformSpecificContent(platform: string): string {
  const brandName = "ARIA Security";
  const platforms: Record<string, string[]> = {
    'Twitter': [
      `Just heard about ${brandName} and their reputation services. Anyone tried them?`,
      `Not happy with my experience at ${brandName}. Customer service needs improvement #disappointed`,
      `${brandName} really helped my business deal with online negativity. Recommended!`,
      `Is ${brandName} worth the money? Looking for opinions on their services.`
    ],
    'Facebook': [
      `I've been using ${brandName} for about 3 months now and I'm impressed with their monitoring system.`,
      `Had a terrible experience with ${brandName}. They promised to fix our reputation issues but made things worse.`,
      `Our company switched to ${brandName} last year and our online presence has improved dramatically.`,
      `Does anyone have any experience with ${brandName}? Considering their services for my business.`
    ],
    'LinkedIn': [
      `Proud to announce our partnership with ${brandName} to enhance our brand protection strategy.`,
      `Just published an article about how ${brandName} is changing the reputation management industry.`,
      `Looking for recommendations on alternatives to ${brandName} for our enterprise-level needs.`,
      `Our experience with ${brandName} has been mixed. Great technology but support is lacking.`
    ],
    'Instagram': [
      `Check out how @${brandName.replace(/\s+/g, '')} transformed our brand image in just two months! #ReputationManagement`,
      `Not impressed with @${brandName.replace(/\s+/g, '')} services. Overpriced and underdelivered. #Disappointed`,
      `Best decision we made was hiring @${brandName.replace(/\s+/g, '')} for our crisis management last month.`,
      `Has anyone worked with @${brandName.replace(/\s+/g, '')}? Need feedback before we sign the contract.`
    ],
    'News': [
      `${brandName} Announces New AI-Powered Reputation Defense System`,
      `Local Business Files Complaint Against ${brandName} Over Undelivered Services`,
      `Tech Industry Report Names ${brandName} As Leading Innovator In Digital Defense`,
      `${brandName} CEO Interviewed About Rising Digital Threats to Businesses`
    ],
    'Reddit': [
      `[Discussion] My honest review of ${brandName} after 6 months of use`,
      `Has anyone else noticed that ${brandName} seems to be astroturfing reviews online?`,
      `I work at ${brandName} AMA (throwaway for obvious reasons)`,
      `${brandName} vs competitors - worth the extra cost or just hype?`
    ]
  };

  // Default content if platform not found
  const defaultContent = [`New mention of ${brandName} detected on ${platform}.`];
  
  // Get platform-specific content or use default
  const contentOptions = platforms[platform] || defaultContent;
  
  // Return a random content from the options
  return contentOptions[Math.floor(Math.random() * contentOptions.length)];
}

/**
 * Simple sentiment analysis algorithm
 * Returns a value between -100 and 100
 */
function calculateSentiment(content: string): number {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'best', 'love', 
                        'impressive', 'recommended', 'positive', 'helpful', 'fantastic', 'improved'];
  
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disappointed', 
                         'poor', 'negative', 'issues', 'problem', 'disappointment', 'overpriced'];

  const content_lower = content.toLowerCase();
  
  let sentimentScore = 0;
  
  // Check for positive words
  positiveWords.forEach(word => {
    if (content_lower.includes(word)) {
      sentimentScore += 15; // Each positive word adds 15 points
    }
  });
  
  // Check for negative words
  negativeWords.forEach(word => {
    if (content_lower.includes(word)) {
      sentimentScore -= 15; // Each negative word subtracts 15 points
    }
  });
  
  // Add some randomness (-10 to +10)
  sentimentScore += Math.floor(Math.random() * 21) - 10;
  
  // Ensure the score is within bounds
  return Math.max(-100, Math.min(100, sentimentScore));
}

/**
 * Generate a realistic URL for the given platform
 */
function generateRealisticURL(platform: string): string {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 100000);
  
  switch (platform) {
    case 'Twitter':
      return `https://twitter.com/user${randomId}/status/${timestamp}`;
    case 'Facebook':
      return `https://facebook.com/posts/${timestamp}_${randomId}`;
    case 'LinkedIn':
      return `https://linkedin.com/feed/update/urn:li:activity:${timestamp}${randomId}`;
    case 'Instagram':
      return `https://instagram.com/p/${btoa(timestamp.toString()).substring(0, 11)}`;
    case 'News':
      return `https://news-source.com/article/${timestamp}-reputation-management`;
    case 'Reddit':
      return `https://reddit.com/r/business/comments/${btoa(timestamp.toString()).substring(0, 7)}/reputation_management_discussion/`;
    default:
      return `https://example.com/${platform.toLowerCase()}/item-${timestamp}-${randomId}`;
  }
}

/**
 * Determine threat type based on content and platform
 */
function determineThreatType(content: string, platform: string): string | undefined {
  const content_lower = content.toLowerCase();
  
  // Check for negative reviews or complaints
  if (content_lower.includes('disappointed') || 
      content_lower.includes('not happy') || 
      content_lower.includes('terrible') ||
      content_lower.includes('awful')) {
    return 'negativeReview';
  }
  
  // Check for false information
  if (content_lower.includes('false') || 
      content_lower.includes('not true') || 
      content_lower.includes('fake')) {
    return 'falseInformation';
  }
  
  // Check for coordinated attacks
  if (platform === 'Reddit' && 
      (content_lower.includes('boycott') || 
       content_lower.includes('campaign against'))) {
    return 'coordinatedAttack';
  }
  
  // Check for customer inquiries
  if (content_lower.includes('anyone tried') || 
      content_lower.includes('looking for opinions') || 
      content_lower.includes('any experience with') ||
      content_lower.includes('worth the money')) {
    return 'customerInquiry';
  }
  
  // If no specific threat type is detected
  if (content_lower.includes('positive') || 
      content_lower.includes('good') || 
      content_lower.includes('recommend')) {
    return 'positiveEngagement';
  }
  
  // Default threat type
  return 'generalMention';
}

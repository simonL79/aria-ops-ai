
import { Mention, ScanResult } from './types';
import { saveMention } from './mentions';
import { getMonitoredPlatforms } from './platforms';

/**
 * Run a monitoring scan to detect mentions
 */
export const runMonitoringScan = async (): Promise<ScanResult[]> => {
  console.log("Running monitoring scan...");
  
  const platforms = getMonitoredPlatforms();
  const enabledPlatforms = platforms.filter(p => p.isActive);
  const results: ScanResult[] = [];
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock results for each enabled platform
  for (const platform of enabledPlatforms) {
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 mentions per platform
    
    for (let i = 0; i < count; i++) {
      const severity = Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';
      const sentiment = Math.floor(Math.random() * 200) - 100; // -100 to 100
      
      // Add entity detection
      const entities = detectEntities(`New mention detected on ${platform.name} during automated scan.`);
      const reach = Math.floor(Math.random() * 10000) + 500; // 500 to 10,500 potential reach
      
      const mention = saveMention(
        platform.name,
        `New mention detected on ${platform.name} during automated scan.`,
        `https://example.com/${platform.name.toLowerCase()}/scan-result-${Date.now()}-${i}`,
        severity as 'high' | 'medium' | 'low'
      );
      
      const result: ScanResult = {
        id: mention.id,
        platform: mention.platform,
        content: mention.content,
        date: mention.date.toISOString(),
        severity: mention.severity,
        status: mention.status || 'new',
        url: mention.url,
        threatType: mention.threatType,
        sentiment: sentiment,
        detectedEntities: entities,
        potentialReach: reach
      };
      
      results.push(result);
    }
  }
  
  return results;
};

/**
 * Detect entities in content using AI or regex
 * This is a simple implementation that will be replaced with AI-powered entity detection
 */
function detectEntities(content: string): string[] {
  const entities: string[] = [];
  
  // Simple regex-based entity detection
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
  
  return entities;
}


import { Mention, ScanResult } from './types';
import { saveMention } from './mentions';
import { getMonitoredPlatforms } from './platforms';
import { detectEntities } from '@/services/api/entityDetectionService';

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
      const content = `New mention detected on ${platform.name} during automated scan.`;
      
      // Add entity detection - use the new function
      const entities = await detectEntities(content, platform.name);
      
      // Calculate potential reach
      const reach = Math.floor(Math.random() * 10000) + 500; // 500 to 10,500 potential reach
      
      const mention = saveMention(
        platform.name,
        content,
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
        url: mention.source, // Use source as url
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

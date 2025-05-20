
import { Mention } from './types';
import { saveMention } from './mentions';
import { getMonitoredPlatforms } from './platforms';

/**
 * Run a monitoring scan to detect mentions
 */
export const runMonitoringScan = async (): Promise<Mention[]> => {
  console.log("Running monitoring scan...");
  
  const platforms = getMonitoredPlatforms();
  const enabledPlatforms = platforms.filter(p => p.isActive);
  const results: Mention[] = [];
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock results for each enabled platform
  for (const platform of enabledPlatforms) {
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 mentions per platform
    
    for (let i = 0; i < count; i++) {
      const severity = Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';
      
      const mention = saveMention(
        platform.name,
        `New mention detected on ${platform.name} during automated scan.`,
        `https://example.com/${platform.name.toLowerCase()}/scan-result-${Date.now()}-${i}`,
        severity as 'high' | 'medium' | 'low'
      );
      
      results.push(mention);
    }
  }
  
  return results;
};

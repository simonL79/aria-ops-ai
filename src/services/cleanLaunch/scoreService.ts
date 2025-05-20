
import { NewCompany } from '@/types/newco';

/**
 * Calculate Clean Launch score
 */
export const calculateCleanLaunchScore = async (company: Partial<NewCompany>): Promise<{
  score: number;
  category: 'green' | 'yellow' | 'red';
}> => {
  let score = 70; // Base score
  
  // Add points for each director with low risk
  if (company.directors) {
    for (const director of company.directors) {
      if (director.reputationScan) {
        // Adjust score based on director reputation
        if (director.reputationScan.riskCategory === 'low') {
          score += 5;
        } else if (director.reputationScan.riskCategory === 'medium') {
          score -= 10;
        } else if (director.reputationScan.riskCategory === 'high') {
          score -= 25;
        }
      }
    }
  }
  
  // Limit score to 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  // Determine category
  let category: 'green' | 'yellow' | 'red';
  if (score >= 80) {
    category = 'green';
  } else if (score >= 50) {
    category = 'yellow';
  } else {
    category = 'red';
  }
  
  return { score, category };
};

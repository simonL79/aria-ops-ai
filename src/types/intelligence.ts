
// Define intelligence types
export type IntelligenceLevel = 'basic' | 'advanced' | 'expert';
export type ContentThreatType = 'falseReviews' | 'coordinatedAttack' | 'competitorSmear' | 'botActivity';

export interface ContentThreat {
  type: ContentThreatType;
  description: string;
  icon: React.ReactNode;
  detectionRate: number;
  difficulty: 'easy' | 'moderate' | 'hard';
}

export interface IntelligenceStrategy {
  name: string;
  description: string;
  effectivenessRate: number;
  platforms: string[];
  timeToImplement: string;
  icon: React.ReactNode;
}

export const getIntelligenceLevelColor = (level: IntelligenceLevel) => {
  switch (level) {
    case 'basic': 
      return 'bg-blue-500 hover:bg-blue-600';
    case 'advanced':
      return 'bg-purple-600 hover:bg-purple-700';
    case 'expert':
      return 'bg-red-600 hover:bg-red-700';
    default:
      return 'bg-gray-500';
  }
};

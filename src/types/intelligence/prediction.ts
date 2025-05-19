
// Define prediction model
export interface PredictionModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastTrained: string;
  predictionType: 'virality' | 'sentiment' | 'seo' | 'attack';
  activeIndicators: string[];
}

// Define simulation scenario
export interface RedTeamSimulation {
  id: string;
  title: string;
  description: string;
  scenario: string;
  status: 'planned' | 'running' | 'completed';
  results?: {
    defenseScore: number;
    vulnerabilities: string[];
    recommendations: string[];
  };
  createdAt: string;
  completedAt?: string;
}

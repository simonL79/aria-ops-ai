
// Define prediction model interface
export interface PredictionModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastUpdated: string;
  predictionTimeframe: 'hours' | 'days' | 'weeks' | 'months';
  dataPoints: string[];
  confidenceScore: number;
  active: boolean;
  lastTrained?: string;
  predictionType?: string;
  activeIndicators?: string[];
}

// Define red team simulation interface
export interface RedTeamSimulation {
  id: string;
  name: string;
  description: string;
  scenario: string;
  impact: number;
  probability: number;
  mitigationSteps: string[];
  stakeholders: string[];
  status: 'planned' | 'active' | 'completed' | 'reviewed';
  results?: string;
}

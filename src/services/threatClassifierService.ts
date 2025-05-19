
// This file is kept for backward compatibility
// All functionality has been moved to more specific modules
// Import and re-export from new modularized services

import { 
  classifyThreat as classifyT,
  classifyThreatAdvanced as classifyTA,
  runMultiAgentAnalysis as runMA,
  runPredictiveAnalysis as runPA
} from './index';

export const classifyThreat = classifyT;
export const classifyThreatAdvanced = classifyTA;
export const runMultiAgentAnalysis = runMA;
export const runPredictiveAnalysis = runPA;

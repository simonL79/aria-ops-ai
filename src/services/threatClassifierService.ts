
// This file is kept for backward compatibility
// All functionality has been moved to more specific modules
// Import and re-export from new modularized services

import { 
  classifyThreat,
  classifyThreatAdvanced,
  runMultiAgentAnalysis,
  runPredictiveAnalysis
} from './intelligence/threatClassifier';

export const classifyThreat = classifyThreat;
export const classifyThreatAdvanced = classifyThreatAdvanced;
export const runMultiAgentAnalysis = runMultiAgentAnalysis;
export const runPredictiveAnalysis = runPredictiveAnalysis;

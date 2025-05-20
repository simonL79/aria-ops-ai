
// Re-export all intelligence services
export { classifyContentThreat, ThreatClassificationResult } from './contentClassifier';
export { classifyThreat, classifyThreatAdvanced } from './threatClassifier';
export { runMultiAgentAnalysis } from './multiAgentAnalysis';
export { runPredictiveAnalysis } from './predictiveAnalysis';
export { storeMemory, getMemories, addSampleMemories } from './memoryService';
export { runRedTeamSimulation } from './agentSimulationService';

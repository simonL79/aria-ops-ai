
// Main export file for the OpenAI service modules
export { generateAIResponse } from './responseGenerator';
export { classifyContentThreat } from './threatClassifier';
export { generateSeoContent } from './seoGenerator';
export { callSecureOpenAI } from './client';

// Re-export types for backward compatibility
export type { 
  OpenAIMessage, 
  OpenAIResponse, 
  ResponseGenerationProps, 
  ThreatClassificationResult 
} from './types';

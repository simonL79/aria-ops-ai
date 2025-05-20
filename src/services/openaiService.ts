
// This file is kept for backward compatibility
// All functionality has been moved to more specific modules
// Import and re-export from new modularized services

import { 
  generateAIResponse,
  ResponseGenerationProps,
  generateSeoContent,
  classifyContentThreat,
  ThreatClassificationResult
} from './secureOpenaiService';

// Re-export for backward compatibility
export type { OpenAIMessage, OpenAIResponse } from './secureOpenaiService';
export type { ResponseGenerationProps, ThreatClassificationResult };

export const generateAIResponse = generateAIResponse;
export const generateSeoContent = generateSeoContent;
export const classifyContentThreat = classifyContentThreat;

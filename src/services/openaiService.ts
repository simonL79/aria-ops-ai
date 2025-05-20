
// This file is kept for backward compatibility
// All functionality has been moved to more specific modules

import { 
  generateAIResponse,
  generateSeoContent,
  classifyContentThreat
} from './secureOpenaiService';

import type { 
  ResponseGenerationProps, 
  ThreatClassificationResult 
} from './secureOpenaiService';

// Re-export for backward compatibility
export type { OpenAIMessage, OpenAIResponse } from './secureOpenaiService';
export type { ResponseGenerationProps, ThreatClassificationResult };

// Re-export functions
export { generateAIResponse, generateSeoContent, classifyContentThreat };


// OpenAI API types and interfaces
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
    index: number;
  }[];
  model: string;
  usage: {
    total_tokens: number;
  };
}

export interface ResponseGenerationProps {
  responseType: string;
  toneStyle: ResponseToneStyle;
  content: string;
  platform?: string; 
  severity?: string;
  threatType?: ContentThreatType | string;
  language?: string;
  autoRespond?: boolean;
}

export interface ThreatClassificationResult {
  category: 'Neutral' | 'Positive' | 'Complaint' | 'Reputation Threat' | 'Misinformation' | 'Legal Risk';
  severity: number; // 1-10
  action: string;
  explanation?: string;
}

// Import the types we need from other modules
import { ContentThreatType } from "@/types/intelligence";
import { ResponseToneStyle } from "@/types/dashboard";

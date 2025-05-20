
import { ContentAlert } from "@/types/dashboard";

// Define monitoring status type
export interface MonitoringStatus {
  isActive: boolean;
  lastRun: Date;
  nextRun: Date;
  sources: number;
}

// Define platforms we can monitor
export type MonitorablePlatform = 
  'twitter' | 
  'reddit' | 
  'google_news' | 
  'discord' | 
  'tiktok' | 
  'telegram' | 
  'whatsapp';

// Define mention type
export interface Mention {
  source: string;
  content: string;
  url: string;
  timestamp: Date;
  category?: string;
  severity?: number;
  recommendation?: string;
  ai_reasoning?: string;
}

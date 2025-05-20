
import { ContentAlert } from "@/types/dashboard";

export interface ThreatSource {
  id: string;
  name: string;
  type: string;
  platform: string;
  active: boolean;
  lastScan?: string;
  credentials: {
    type: string;
    status: 'valid' | 'invalid' | 'expired';
  };
}

export interface IngestionOptions {
  keywords: string[];
  sources: string[];
  startDate?: Date;
  endDate?: Date;
  maxResults?: number;
}

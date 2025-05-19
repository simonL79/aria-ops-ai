
// Define threat source
export interface ThreatSource {
  id: string;
  name: string;
  type: string;
  confidence?: number;
  lastUpdated?: string;
  platform: string;
  active: boolean;
  lastScan?: string;
  credentials: {
    type: string;
    status: string;
  };
}

export interface DataSourceStats {
  source: string;
  mentions: number;
  sentiment: number;
  coverage: number;
}

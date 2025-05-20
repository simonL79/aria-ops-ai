
// Define threat source
export interface ThreatSource {
  id: string;
  name: string;
  type: 'social' | 'news' | 'review' | 'messaging' | 'dark';
  platform: string;
  active: boolean;
  lastScan?: string;
  credentials: {
    type: 'api' | 'oauth' | 'bot' | 'business' | 'credentials';
    status: 'valid' | 'invalid' | 'expired';
  };
}

// Define data source stats
export interface DataSourceStats {
  source: string;
  mentions: number;
  sentiment: number;
  coverage: number;
}

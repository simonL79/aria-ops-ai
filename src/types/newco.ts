export interface NewCompany {
  id: string;
  name: string;
  incorporationDate: string;
  jurisdiction: string;
  industry: string;
  sicCode?: string;
  source: 'companies_house' | 'opencorporates' | 'secretary_of_state' | 'manual';
  cleanLaunchScore?: number; // 0-100 score
  cleanLaunchCategory?: 'green' | 'yellow' | 'red';
  status: 'new' | 'scanned' | 'contacted' | 'onboarded' | 'declined';
  directors: CompanyDirector[];
  address?: string; // Adding address field
}

export interface CompanyDirector {
  id: string;
  name: string;
  role: string;
  address?: string;
  reputationScan?: ReputationScan;
}

export interface ReputationScan {
  id: string;
  personId: string;
  scanDate: string;
  overallSentiment: number; // -1 to 1 scale
  riskScore: number; // 0-100 scale
  riskCategory: 'low' | 'medium' | 'high';
  issues: ReputationIssue[];
  sources: {
    news: number; // count of sources
    social: number;
    legal: number;
    other: number;
  };
}

export interface ReputationIssue {
  id: string;
  type: 'lawsuit' | 'negative_press' | 'controversy' | 'political' | 'financial' | 'other';
  title: string;
  description: string;
  source: string;
  url?: string;
  date?: string;
  severity: 'low' | 'medium' | 'high';
  remediationStatus?: 'not_started' | 'in_progress' | 'resolved';
  remediationStrategy?: string;
}

export interface NewCoFilters {
  timeframe: 'today' | 'this_week' | 'this_month' | 'custom';
  jurisdictions: string[];
  industries: string[];
  cleanLaunchCategories: ('green' | 'yellow' | 'red')[];
  status: ('new' | 'scanned' | 'contacted' | 'onboarded' | 'declined')[];
}

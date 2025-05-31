import { supabase } from '@/integrations/supabase/client';

export interface ActionItem {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  status: string;
  platform: string;
  action: string;
  timestamp: string;
}

export const fetchActionItems = async (): Promise<ActionItem[]> => {
  try {
    // Use existing activity_logs table instead of content_actions
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching action items:', error);
      return getMockActionItems();
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      type: item.entity_type || 'system',
      description: item.details || 'Activity logged',
      createdAt: item.created_at,
      status: 'completed',
      platform: 'System',
      action: item.action || 'logged',
      timestamp: item.created_at,
    }));
  } catch (error) {
    console.error('Error in fetchActionItems:', error);
    return getMockActionItems();
  }
};

const getMockActionItems = (): ActionItem[] => {
  return [
    {
      id: '1',
      type: 'threat_response',
      description: 'Automated threat mitigation executed',
      createdAt: new Date().toISOString(),
      status: 'completed',
      platform: 'Reddit',
      action: 'monitor',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'scan',
      description: 'Deep scan completed for entity monitoring',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'completed',
      platform: 'Twitter',
      action: 'scan',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    }
  ];
};

export interface ContentAlert {
  id: string;
  title: string;
  content: string;
  platform: string;
  severity: string;
  timestamp: string;
  status: string;
}

export const mockContentAlerts: ContentAlert[] = [
  {
    id: '1',
    title: 'Potential Brand Attack Detected',
    content: 'Multiple negative posts identified on social media platforms.',
    platform: 'Twitter',
    severity: 'high',
    timestamp: new Date().toISOString(),
    status: 'new',
  },
  {
    id: '2',
    title: 'Unusual Activity on Corporate Accounts',
    content: 'Suspicious login attempts detected from unknown locations.',
    platform: 'LinkedIn',
    severity: 'medium',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 'pending',
  },
];

export interface SystemStats {
  id: string;
  name: string;
  value: number;
  trend: number;
  description: string;
}

export const mockSystemStats: SystemStats[] = [
  {
    id: '1',
    name: 'Active Threats',
    value: 12,
    trend: 3,
    description: 'Number of currently active threat incidents.',
  },
  {
    id: '2',
    name: 'Content Scanned',
    value: 4567,
    trend: 150,
    description: 'Total amount of content scanned in the last 24 hours.',
  },
];

export interface PerformanceMetrics {
  id: string;
  name: string;
  value: number;
  unit: string;
  description: string;
}

export const mockPerformanceMetrics: PerformanceMetrics[] = [
  {
    id: '1',
    name: 'Response Time',
    value: 2.3,
    unit: 's',
    description: 'Average time to respond to a threat.',
  },
  {
    id: '2',
    name: 'Accuracy Rate',
    value: 98.5,
    unit: '%',
    description: 'Accuracy of threat detection algorithms.',
  },
];

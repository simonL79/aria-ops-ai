
import { ContentAlert } from '@/types/dashboard';

export interface ScanParameters {
  platforms?: string[];
  keywordFilters?: string[];
  maxResults: number;
  prioritizeSeverity?: 'high' | 'medium' | 'low';
  includeCustomerEnquiries: boolean;
}

export const defaultScanParameters: ScanParameters = {
  platforms: ['Twitter', 'Reddit', 'News Article'],
  keywordFilters: [],
  maxResults: 5,
  includeCustomerEnquiries: false
};

export const mockScanResults: ContentAlert[] = [
  {
    id: '1',
    platform: 'Twitter',
    content: 'Terrible experience with this company. Will never use their services again!',
    date: '2024-01-15',
    severity: 'high',
    status: 'new',
    url: 'https://twitter.com/user/status/123',
    threatType: 'reputation',
    sourceType: 'social',
    confidenceScore: 95,
    sentiment: 'negative',
    detectedEntities: ['company', 'services']
  },
  {
    id: '2',
    platform: 'Reddit',
    content: 'Has anyone else had issues with this company? Their customer support is non-existent.',
    date: '2024-01-14',
    severity: 'medium',
    status: 'new',
    url: 'https://reddit.com/r/complaints/post/456',
    threatType: 'support',
    sourceType: 'forum',
    confidenceScore: 82,
    sentiment: 'negative',
    detectedEntities: ['customer support', 'issues']
  }
];

export const performMockScan = async (query: string, platforms: string[]): Promise<ContentAlert[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock results based on query and platforms
  const results: ContentAlert[] = [];
  
  platforms.forEach(platform => {
    const mockResult: ContentAlert = {
      id: `${platform}-${Date.now()}-${Math.random()}`,
      platform: platform,
      content: `Mock result for "${query}" on ${platform}: This is a simulated scan result.`,
      date: new Date().toISOString(),
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      status: 'new',
      url: `https://${platform.toLowerCase()}.com/mock-url`,
      threatType: 'reputation',
      sourceType: platform.toLowerCase().includes('reddit') ? 'forum' : 'social',
      confidenceScore: Math.floor(Math.random() * 40) + 60,
      sentiment: 'negative',
      detectedEntities: ['company', 'service']
    };
    
    results.push(mockResult);
  });
  
  return results;
};

export const generateMockAlert = (): ContentAlert => {
  const platforms = ['Twitter', 'Facebook', 'Reddit', 'LinkedIn'];
  const severities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
  const sentiments: ('positive' | 'negative' | 'neutral' | 'threatening')[] = ['positive', 'negative', 'neutral', 'threatening'];
  
  return {
    id: `mock-${Date.now()}-${Math.random()}`,
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    content: `Mock alert generated at ${new Date().toLocaleTimeString()}`,
    date: new Date().toISOString(),
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: 'new',
    url: `https://example.com/mock-${Date.now()}`,
    threatType: 'reputation',
    sourceType: 'social',
    confidenceScore: Math.floor(Math.random() * 40) + 60,
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    detectedEntities: ['entity1', 'entity2']
  };
};

// Simulate scanning with different intensities
export const simulateIntensiveScan = async (): Promise<ContentAlert[]> => {
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const results: ContentAlert[] = [];
  const count = Math.floor(Math.random() * 10) + 5; // 5-15 results
  
  for (let i = 0; i < count; i++) {
    const alert = generateMockAlert();
    results.push(alert);
  }
  
  return results;
};

export const simulateQuickScan = async (): Promise<ContentAlert[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const results: ContentAlert[] = [];
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 results
  
  for (let i = 0; i < count; i++) {
    const alert = generateMockAlert();
    results.push(alert);
  }
  
  return results;
};

export const getMonitoringStatus = async () => {
  return {
    isActive: true,
    sources: 8,
    platforms: 5,
    lastRun: new Date().toISOString()
  };
};

export const registerAlertListener = (callback: (alert: ContentAlert) => void) => {
  // Mock implementation
  console.log('Alert listener registered');
  return () => console.log('Alert listener unregistered');
};

export const unregisterAlertListener = (listenerId: string) => {
  // Mock implementation
  console.log('Alert listener unregistered:', listenerId);
};

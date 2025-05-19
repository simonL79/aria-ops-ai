
import { ContentAlert, ContentSource, ContentAction } from "@/types/dashboard";

// Sample data with enhanced threat intelligence
export const mockAlerts: ContentAlert[] = [
  {
    id: '1',
    platform: 'Twitter',
    content: 'This company has terrible customer service. I waited for hours and no one helped me. #awful #scam',
    date: '2 hours ago',
    severity: 'high',
    status: 'new',
    threatType: 'viralThreat',
    confidenceScore: 89,
    sourceType: 'social',
    sentiment: 'negative',
    potentialReach: 6500,
    detectedEntities: ['Customer Service', 'Company']
  },
  {
    id: '2',
    platform: 'Reddit',
    content: 'Just found evidence that this business is using fake reviews to boost their ratings. Look at these screenshots of identical reviews across different accounts.',
    date: '5 hours ago',
    severity: 'high',
    status: 'new',
    threatType: 'misinformation',
    confidenceScore: 73,
    sourceType: 'forum',
    sentiment: 'threatening',
    potentialReach: 12400,
    detectedEntities: ['Business', 'Reviews']
  },
  {
    id: '3',
    platform: 'Trustpilot',
    content: 'Not the best service, but the staff were polite. Food was just okay.',
    date: '1 day ago',
    severity: 'low',
    status: 'reviewing',
    threatType: 'falseReviews',
    confidenceScore: 42,
    sourceType: 'review',
    sentiment: 'neutral',
    detectedEntities: ['Service', 'Staff', 'Food']
  },
  {
    id: '4',
    platform: 'Dark Web Forum',
    content: 'Looking for people to help coordinate negative reviews for [BRAND]. Will pay $5 per review that stays up for at least 2 weeks.',
    date: '3 hours ago',
    severity: 'high',
    status: 'new',
    threatType: 'coordinatedAttack',
    confidenceScore: 95,
    sourceType: 'darkweb',
    sentiment: 'threatening',
    potentialReach: 1200,
    detectedEntities: ['BRAND']
  },
  {
    id: '5',
    platform: 'Business Competitor Blog',
    content: 'Our investigation reveals questionable business practices at [COMPANY]. We\'ve found evidence suggesting potential ethical violations.',
    date: '12 hours ago',
    severity: 'medium',
    status: 'reviewing',
    threatType: 'competitorSmear',
    confidenceScore: 82,
    sourceType: 'news',
    sentiment: 'negative',
    potentialReach: 3800,
    detectedEntities: ['COMPANY', 'Ethical Violations']
  }
];

export const mockSources: ContentSource[] = [
  { 
    id: '1',
    name: 'Twitter', 
    status: 'critical', 
    positiveRatio: 35, 
    total: 120, 
    active: true,
    lastUpdated: '2 hours ago',
    mentionCount: 120,
    sentiment: -15
  },
  { 
    id: '2',
    name: 'Facebook', 
    status: 'good', 
    positiveRatio: 87, 
    total: 230, 
    active: true,
    lastUpdated: '5 hours ago',
    mentionCount: 230,
    sentiment: 25
  },
  { 
    id: '3',
    name: 'Reddit', 
    status: 'warning', 
    positiveRatio: 62, 
    total: 85, 
    active: true,
    lastUpdated: '1 day ago',
    mentionCount: 85,
    sentiment: 5
  },
  { 
    id: '4',
    name: 'Yelp', 
    status: 'good', 
    positiveRatio: 78, 
    total: 45, 
    active: true,
    lastUpdated: '3 days ago',
    mentionCount: 45,
    sentiment: 18
  }
];

export const mockActions: ContentAction[] = [
  { 
    id: '1', 
    type: 'removal',
    description: 'Requested removal of negative review',
    timestamp: '3 hours ago', 
    status: 'completed',
    user: 'admin',
    platform: 'Twitter', 
    action: 'removal_requested', 
    date: '3 hours ago'
  },
  { 
    id: '2', 
    type: 'report',
    description: 'Reported false review to platform',
    timestamp: '1 day ago', 
    status: 'pending',
    user: 'manager',
    platform: 'Yelp', 
    action: 'reported', 
    date: '1 day ago'
  },
  { 
    id: '3', 
    type: 'hide',
    description: 'Content hidden from public view',
    timestamp: '2 days ago', 
    status: 'completed',
    user: 'admin',
    platform: 'Reddit', 
    action: 'content_hidden', 
    date: '2 days ago'
  },
  { 
    id: '4', 
    type: 'removal',
    description: 'Requested removal of negative post',
    timestamp: '3 days ago', 
    status: 'rejected',
    user: 'analyst',
    platform: 'Facebook', 
    action: 'removal_requested', 
    date: '3 days ago'
  }
];

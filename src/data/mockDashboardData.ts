
import { ContentAlert, ContentSource, ContentAction } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";

// Function to fetch real alerts from database
export const fetchRealAlerts = async (): Promise<ContentAlert[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      platform: item.platform,
      content: item.content,
      date: new Date(item.created_at).toLocaleDateString(),
      severity: item.severity as 'high' | 'medium' | 'low',
      status: item.status as 'new' | 'read' | 'actioned' | 'reviewing' | 'resolved',
      threatType: item.threat_type,
      confidenceScore: item.confidence_score,
      sourceType: item.source_type,
      sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
      potentialReach: item.potential_reach,
      detectedEntities: item.detected_entities ? JSON.parse(JSON.stringify(item.detected_entities)) : [],
      url: item.url
    }));
  } catch (error) {
    console.error('Error in fetchRealAlerts:', error);
    return [];
  }
};

// Function to fetch real sources from database
export const fetchRealSources = async (): Promise<ContentSource[]> => {
  try {
    const { data, error } = await supabase
      .from('monitored_platforms')
      .select('*')
      .eq('active', true);
    
    if (error) {
      console.error('Error fetching sources:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      status: item.status as "critical" | "good" | "warning",
      positiveRatio: item.positive_ratio,
      total: item.total,
      active: item.active,
      lastUpdated: new Date(item.last_updated).toLocaleDateString(),
      mentionCount: item.mention_count,
      sentiment: item.sentiment
    }));
  } catch (error) {
    console.error('Error in fetchRealSources:', error);
    return [];
  }
};

// Function to fetch real actions from database
export const fetchRealActions = async (): Promise<ContentAction[]> => {
  try {
    const { data, error } = await supabase
      .from('content_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching actions:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      type: item.type,
      description: item.description,
      timestamp: new Date(item.created_at).toLocaleDateString(),
      status: item.status,
      user: 'system', // Default value since we don't have user names
      platform: item.platform,
      action: item.action,
      date: new Date(item.created_at).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Error in fetchRealActions:', error);
    return [];
  }
};

// Fallback mock data (kept for development/testing)
export const mockAlerts: ContentAlert[] = [
  {
    id: '1',
    platform: 'Twitter',
    content: '@JohnDoe at TechCorp Inc is spreading false information about our services. This company has terrible customer service. #scam #terrible',
    date: '2 hours ago',
    severity: 'high',
    status: 'new',
    threatType: 'viralThreat',
    confidenceScore: 89,
    sourceType: 'social',
    sentiment: 'negative',
    potentialReach: 6500,
    detectedEntities: ['JohnDoe', 'TechCorp Inc', 'Customer Service']
  },
  {
    id: '2',
    platform: 'Reddit',
    content: 'Sarah Johnson from Global Solutions LLC posted evidence that @AcmeSupport is using fake reviews. Look at these screenshots #FakeReviews #Scam',
    date: '5 hours ago',
    severity: 'high',
    status: 'new',
    threatType: 'misinformation',
    confidenceScore: 73,
    sourceType: 'forum',
    sentiment: 'threatening',
    potentialReach: 12400,
    detectedEntities: ['Sarah Johnson', 'Global Solutions LLC', 'AcmeSupport']
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
  }
];

export const mockActions: ContentAction[] = [
  { 
    id: '1', 
    type: 'removal',
    description: 'Requested removal of negative review targeting Emma Smith at DataTech Corp',
    timestamp: '3 hours ago', 
    status: 'completed',
    user: 'admin',
    platform: 'Twitter', 
    action: 'removal_requested', 
    date: '3 hours ago'
  }
];


import { ContentItem } from "@/types/monitor";
import { supabase } from "@/integrations/supabase/client";

export const fetchRealContent = async (): Promise<ContentItem[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching content:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      platform: item.platform,
      type: 'post',
      content: item.content,
      date: new Date(item.created_at).toLocaleDateString(),
      sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
      impact: item.severity as 'high' | 'medium' | 'low',
      url: item.url || ''
    }));
  } catch (error) {
    console.error('Error in fetchRealContent:', error);
    return [];
  }
};

// All mock data removed - production environment
export const mockContent: ContentItem[] = [];

export const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'negative': return 'bg-alert-negative text-white';
    case 'neutral': return 'bg-gray-500 text-white';
    case 'positive': return 'bg-alert-positive text-white';
    default: return 'bg-gray-200';
  }
};

export const getImpactColor = (impact: string): string => {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100';
  }
};

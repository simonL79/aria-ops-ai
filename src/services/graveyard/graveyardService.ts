
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LegacyPost {
  id: string;
  url: string;
  title: string;
  content_snippet: string;
  rank_score: number;
  suppression_status: 'active' | 'suppressed' | 'monitoring';
  is_active: boolean;
  client_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SuppressionAsset {
  id: string;
  asset_url: string;
  asset_type: 'article' | 'press_release' | 'social_post' | 'directory_listing';
  target_keywords: string[];
  rank_goal: number;
  current_rank?: number;
  gsc_impressions?: number;
  gsc_clicks?: number;
  created_at: string;
  updated_at: string;
}

export const scanForLegacyContent = async (entityName: string, domain?: string) => {
  try {
    console.log('Scanning for legacy content via edge functions...');
    
    const { data, error } = await supabase.functions.invoke('google-search-crawler', {
      body: {
        query: `"${entityName}" negative OR controversy OR scandal`,
        domain: domain,
        scan_type: 'legacy_content'
      }
    });

    if (error) {
      console.error('Legacy content scan error:', error);
      toast.error('Failed to scan for legacy content');
      return [];
    }

    toast.success(`Found ${data?.results?.length || 0} legacy content items`);
    return data?.results || [];

  } catch (error) {
    console.error('Error scanning for legacy content:', error);
    toast.error('Legacy content scan failed');
    return [];
  }
};

export const generateSuppressionAssets = async (targetKeywords: string[], clientId?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-response', {
      body: {
        content_type: 'suppression_content',
        keywords: targetKeywords,
        client_id: clientId,
        strategy: 'serp_suppression'
      }
    });

    if (error) {
      console.error('Suppression asset generation error:', error);
      toast.error('Failed to generate suppression assets');
      return null;
    }

    toast.success('Suppression assets generated successfully');
    return data;
  } catch (error) {
    console.error('Error generating suppression assets:', error);
    return null;
  }
};

export const trackGSCRankings = async (assetUrls: string[]) => {
  try {
    const { data, error } = await supabase.functions.invoke('google-search-crawler', {
      body: {
        urls: assetUrls,
        action: 'track_rankings',
        include_gsc_data: true
      }
    });

    if (error) {
      console.error('GSC ranking tracking error:', error);
      toast.error('Failed to track GSC rankings');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error tracking GSC rankings:', error);
    return null;
  }
};

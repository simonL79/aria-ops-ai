
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ScanResult {
  id: string;
  content: string;
  platform: string;
  url: string;
  sentiment: number;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'read' | 'actioned' | 'resolved';
  threat_type?: string;
  client_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get scan results with pagination
 */
export const getScanResults = async (limit: number = 20, page: number = 0): Promise<ScanResult[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);
    
    if (error) {
      console.error("Error fetching scan results:", error);
      toast.error("Failed to fetch scan results");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getScanResults:", error);
    toast.error("An error occurred while fetching scan results");
    return [];
  }
};

/**
 * Get a single scan result by ID
 */
export const getScanResultById = async (id: string): Promise<ScanResult | null> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching scan result:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getScanResultById:", error);
    return null;
  }
};

/**
 * Update scan result status
 */
export const updateScanResultStatus = async (id: string, status: 'read' | 'actioned' | 'resolved'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scan_results')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error("Error updating scan result status:", error);
      toast.error("Failed to update status");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateScanResultStatus:", error);
    return false;
  }
};

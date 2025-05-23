
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ScanResult } from '../types/scanTypes';
import { parseDetectedEntities } from '../utils/entityParser';

/**
 * Get scan results by entity name
 */
export const getScanResultsByEntity = async (entityName: string): Promise<ScanResult[]> => {
  try {
    let results: ScanResult[] = [];
    
    // Try with detected_entities field using contains operator
    const { data: arrayData, error: arrayError } = await supabase
      .from('scan_results')
      .select('*')
      .contains('detected_entities', [entityName]);
    
    if (!arrayError && arrayData) {
      // Cast to any to break type inference chain
      const rows: any[] = arrayData;
      
      for (const row of rows) {
        results.push({
          id: row.id,
          content: row.content,
          platform: row.platform,
          url: row.url,
          severity: row.severity,
          status: row.status,
          threat_type: row.threat_type,
          risk_entity_name: null, // These fields don't exist in DB
          risk_entity_type: null, // These fields don't exist in DB
          created_at: row.created_at,
          confidence_score: row.confidence_score || null,
          is_identified: false, // This field doesn't exist in DB
          detected_entities: parseDetectedEntities(row.detected_entities)
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in getScanResultsByEntity:', error);
    toast.error("Failed to fetch scan results for entity");
    return [];
  }
};

/**
 * Get all scan results
 */
export const getAllScanResults = async (): Promise<ScanResult[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error || !data) {
      console.error("Failed to fetch scan results:", error);
      return [];
    }
    
    // Cast to any to break type inference chain
    const rows: any[] = data;
    const results: ScanResult[] = [];
    
    for (const row of rows) {
      results.push({
        id: row.id,
        content: row.content,
        platform: row.platform,
        url: row.url,
        severity: row.severity,
        status: row.status,
        threat_type: row.threat_type,
        risk_entity_name: null, // These fields don't exist in DB
        risk_entity_type: null, // These fields don't exist in DB
        created_at: row.created_at,
        confidence_score: row.confidence_score || null,
        is_identified: false, // This field doesn't exist in DB
        detected_entities: parseDetectedEntities(row.detected_entities)
      });
    }
    
    return results;
  } catch (error) {
    console.error("Error fetching scan results:", error);
    return [];
  }
};

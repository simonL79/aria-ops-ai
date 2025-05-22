
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
    
    // Try with risk_entity_name field
    const { data: nameData, error: nameError } = await supabase
      .from('scan_results')
      .select('*')
      .eq('risk_entity_name', entityName);
    
    if (!nameError && nameData && nameData.length > 0) {
      // Explicitly map each field to avoid type recursion
      return nameData.map((row: any) => ({
        id: row.id,
        content: row.content,
        platform: row.platform,
        url: row.url,
        severity: row.severity,
        status: row.status,
        threat_type: row.threat_type,
        risk_entity_name: row.risk_entity_name,
        risk_entity_type: row.risk_entity_type,
        created_at: row.created_at,
        confidence_score: row.confidence_score,
        is_identified: row.is_identified,
        detected_entities: parseDetectedEntities(row.detected_entities)
      }));
    }
    
    // Try with detected_entities field
    const { data: arrayData, error: arrayError } = await supabase
      .from('scan_results')
      .select('*')
      .contains('detected_entities', [entityName]);
    
    if (!arrayError && arrayData) {
      results = arrayData.map((row: any) => ({
        id: row.id,
        content: row.content,
        platform: row.platform,
        url: row.url,
        severity: row.severity,
        status: row.status,
        threat_type: row.threat_type,
        risk_entity_name: row.risk_entity_name,
        risk_entity_type: row.risk_entity_type,
        created_at: row.created_at,
        confidence_score: row.confidence_score,
        is_identified: row.is_identified,
        detected_entities: parseDetectedEntities(row.detected_entities)
      }));
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
    
    return data.map((row: any) => ({
      id: row.id,
      content: row.content,
      platform: row.platform,
      url: row.url,
      severity: row.severity,
      status: row.status,
      threat_type: row.threat_type,
      risk_entity_name: row.risk_entity_name,
      risk_entity_type: row.risk_entity_type,
      created_at: row.created_at,
      confidence_score: row.confidence_score,
      is_identified: row.is_identified,
      detected_entities: parseDetectedEntities(row.detected_entities)
    }));
  } catch (error) {
    console.error("Error fetching scan results:", error);
    return [];
  }
};

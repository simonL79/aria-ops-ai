
import { extractEntitiesWithOpenAI, ScanEntity } from './openaiEntityExtraction';
import { supabase } from '@/integrations/supabase/client';

export interface ScanResult {
  id: string;
  content: string;
  platform: string;
  detected_entities: ScanEntity[];
  risk_entity_name: string | null;
  risk_entity_type: string | null;
  is_identified: boolean;
}

export async function processScanWithEntityExtraction(scanResultId: string, text: string): Promise<Partial<ScanResult>> {
  try {
    console.log('Processing scan with entity extraction for:', scanResultId);
    
    // Extract entities using OpenAI
    const entities = await extractEntitiesWithOpenAI(text);
    
    // Find the primary entity (prefer PERSON, then ORG)
    const namedEntity = entities.find(e => e.type === 'PERSON') || 
                       entities.find(e => e.type === 'ORG') ||
                       entities.find(e => e.type === 'SOCIAL');
    
    const updateData = {
      detected_entities: entities.map(e => e.name),
      risk_entity_name: namedEntity?.name ?? null,
      risk_entity_type: namedEntity?.type?.toLowerCase() ?? null,
      is_identified: entities.length > 0
    };
    
    // Update the scan result in the database
    const { error } = await supabase
      .from('scan_results')
      .update(updateData)
      .eq('id', scanResultId);
    
    if (error) {
      console.error('Error updating scan result with entities:', error);
    } else {
      console.log('Successfully updated scan result with entities:', updateData);
    }
    
    return {
      detected_entities: entities,
      risk_entity_name: namedEntity?.name ?? null,
      risk_entity_type: namedEntity?.type ?? null,
      is_identified: entities.length > 0
    };
  } catch (error) {
    console.error('Error in processScanWithEntityExtraction:', error);
    return {
      detected_entities: [],
      risk_entity_name: null,
      risk_entity_type: null,
      is_identified: false
    };
  }
}

export async function batchProcessExistingScanResults(): Promise<number> {
  try {
    console.log('Starting batch processing of existing scan results...');
    
    // Get scan results that haven't been processed for entities
    const { data: scanResults, error } = await supabase
      .from('scan_results')
      .select('id, content')
      .is('is_identified', null)
      .or('is_identified.eq.false')
      .limit(50); // Process in batches
    
    if (error) {
      console.error('Error fetching scan results for batch processing:', error);
      return 0;
    }
    
    if (!scanResults || scanResults.length === 0) {
      console.log('No scan results to process');
      return 0;
    }
    
    let processedCount = 0;
    
    for (const scanResult of scanResults) {
      try {
        await processScanWithEntityExtraction(scanResult.id, scanResult.content);
        processedCount++;
        
        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing scan result ${scanResult.id}:`, error);
      }
    }
    
    console.log(`Batch processing completed. Processed ${processedCount} scan results.`);
    return processedCount;
  } catch (error) {
    console.error('Error in batch processing:', error);
    return 0;
  }
}

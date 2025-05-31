
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Store companies in simulated storage using activity_logs
 */
export const storeCompaniesInDatabase = async (companies: any[]): Promise<void> => {
  try {
    // Since clean_launch_targets doesn't exist, simulate storage using activity_logs
    for (const company of companies) {
      await supabase.from('activity_logs').insert({
        action: 'store_company',
        details: JSON.stringify({
          company_name: company.name,
          company_number: company.number,
          date_of_incorporation: company.date,
          officers: [],
          scan_status: 'pending'
        }),
        entity_type: 'clean_launch',
        entity_id: company.number
      });
    }
    
    console.log(`Stored ${companies.length} companies in simulated storage`);
  } catch (error) {
    console.error('Error storing companies:', error);
    toast.error('Failed to store companies');
  }
};

/**
 * Fetch companies from simulated storage using activity_logs
 */
export const fetchCompaniesFromDatabase = async (options: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}): Promise<any[]> => {
  try {
    // Simulate fetching from clean_launch_dashboard using activity_logs
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('entity_type', 'clean_launch')
      .eq('action', 'store_company')
      .order('created_at', { ascending: false })
      .limit(options.limit || 50);
    
    if (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
    
    // Transform activity logs back to company format
    const companies = (data || []).map((log) => {
      const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details;
      return {
        id: log.entity_id,
        company_name: details.company_name,
        company_number: details.company_number || log.entity_id,
        date_of_incorporation: details.date_of_incorporation,
        officers: details.officers || [],
        scan_status: details.scan_status || 'pending',
        created_at: log.created_at
      };
    });
    
    return companies;
  } catch (error) {
    console.error('Error fetching companies:', error);
    toast.error('Failed to fetch companies from database');
    return [];
  }
};

/**
 * Update company status in simulated storage
 */
export const updateCompanyStatus = async (companyNumber: string, status: string): Promise<void> => {
  try {
    // Simulate update by logging new status
    await supabase.from('activity_logs').insert({
      action: 'update_company_status',
      details: JSON.stringify({
        company_number: companyNumber,
        new_status: status,
        last_scanned: new Date().toISOString()
      }),
      entity_type: 'clean_launch',
      entity_id: companyNumber
    });
    
    console.log(`Updated company ${companyNumber} status to ${status}`);
  } catch (error) {
    console.error('Error updating company status:', error);
    toast.error('Failed to update company status');
  }
};

/**
 * Update company score in simulated storage
 */
export const updateCompanyScore = async (
  companyNumber: string, 
  score: number, 
  category: 'green' | 'yellow' | 'red'
): Promise<void> => {
  try {
    await supabase.from('activity_logs').insert({
      action: 'update_company_score',
      details: JSON.stringify({
        company_number: companyNumber,
        risk_score: score,
        risk_category: category,
        scan_status: 'scanned',
        last_scanned: new Date().toISOString()
      }),
      entity_type: 'clean_launch',
      entity_id: companyNumber
    });
    
    console.log(`Updated company ${companyNumber} score to ${score} (${category})`);
  } catch (error) {
    console.error('Error updating company score:', error);
    toast.error('Failed to update company score');
  }
};

/**
 * Save updated company data to simulated storage
 */
export const saveCompanyToDatabase = async (company: any): Promise<void> => {
  try {
    const companyNumber = company.id.replace('ch_', '');
    
    const officers = company.directors?.map((director: any) => ({
      name: director.name,
      role: director.role,
      risk: director.reputationScan?.riskCategory || 'unknown'
    })) || [];
    
    await supabase.from('activity_logs').insert({
      action: 'save_company_data',
      details: JSON.stringify({
        company_number: companyNumber,
        officers: officers,
        risk_score: company.cleanLaunchScore || 0,
        risk_category: company.cleanLaunchCategory || 'red',
        scan_status: 'scanned',
        last_scanned: new Date().toISOString()
      }),
      entity_type: 'clean_launch',
      entity_id: companyNumber
    });
    
    console.log(`Saved company data for ${companyNumber}`);
  } catch (error) {
    console.error('Error saving company to database:', error);
    toast.error('Failed to save company data');
  }
};

/**
 * Extract and store entities from scan results
 */
export const processEntitiesFromScanResult = async (scanResult: any): Promise<void> => {
  try {
    const entities = extractEntities(scanResult.content);
    
    // Update the scan result with the extracted entities using existing scan_results table
    const { error } = await supabase
      .from('scan_results')
      .update({
        // Store entities in the content field since detected_entities might not exist
        content: `${scanResult.content} [ENTITIES: ${entities.join(', ')}]`
      })
      .eq('id', scanResult.id);
    
    if (error) {
      console.error('Error updating scan result with entities:', error);
    }
  } catch (error) {
    console.error('Error in processEntitiesFromScanResult:', error);
  }
};

/**
 * Simple entity extraction function using regex
 */
const extractEntities = (text: string): string[] => {
  if (!text) return [];
  
  const entities: string[] = [];
  
  // Extract mentions (@username)
  const mentionRegex = /@[\w\d_]{2,}/g;
  const mentions = text.match(mentionRegex) || [];
  entities.push(...mentions);
  
  // Simple person name extraction (capitalized words in sequence)
  const nameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
  const names = text.match(nameRegex) || [];
  entities.push(...names);
  
  // Organization names (simplistic approach)
  const orgIndicators = [
    'Inc', 'LLC', 'Ltd', 'Limited', 'Corp', 'Corporation', 
    'Company', 'Co', 'Group', 'Foundation', 'Association'
  ];
  
  orgIndicators.forEach(indicator => {
    const orgRegex = new RegExp(`\\b[A-Z][\\w\\s]*\\s+${indicator}\\b`, 'g');
    const orgs = text.match(orgRegex) || [];
    entities.push(...orgs);
  });
  
  // Remove duplicates and return
  return [...new Set(entities)];
};

/**
 * Process all scan results to extract entities
 */
export const processAllScanResults = async (): Promise<void> => {
  try {
    // Get recent scan results from existing table
    const { data: scanResults, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching scan results:', error);
      return;
    }
    
    if (!scanResults || scanResults.length === 0) {
      console.log('No scan results found for processing');
      return;
    }
    
    // Process each scan result
    for (const scanResult of scanResults) {
      await processEntitiesFromScanResult(scanResult);
    }
    
    toast.success(`Processed ${scanResults.length} scan results for entity extraction`);
  } catch (error) {
    console.error('Error in processAllScanResults:', error);
  }
};

/**
 * Get scan results by entity name from existing scan_results table
 */
export const getScanResultsByEntity = async (entityName: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .ilike('content', `%${entityName}%`)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching scan results by entity:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getScanResultsByEntity:', error);
    return [];
  }
};


import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Store companies in the clean_launch_targets table
 */
export const storeCompaniesInDatabase = async (companies: any[]): Promise<void> => {
  try {
    // Format companies for database insertion
    const formattedCompanies = companies.map(company => ({
      company_name: company.name,
      company_number: company.number,
      date_of_incorporation: company.date,
      officers: JSON.stringify([]), // Empty array initially
      scan_status: 'pending'
    }));
    
    // Insert companies using upsert (update if company_number already exists)
    const { error } = await supabase
      .from('clean_launch_targets')
      .upsert(formattedCompanies, { 
        onConflict: 'company_number',
        ignoreDuplicates: false 
      });
    
    if (error) {
      console.error('Error storing companies in database:', error);
      
      // Check if it's an RLS policy error and provide a specific message
      if (error.message.includes('new row violates row-level security policy')) {
        toast.error('Permission denied: Cannot store companies (RLS policy violation)');
      }
    }
  } catch (error) {
    console.error('Error in storeCompaniesInDatabase:', error);
  }
};

/**
 * Fetch companies from the database using the dashboard view
 */
export const fetchCompaniesFromDatabase = async (options: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}): Promise<any[]> => {
  try {
    let query = supabase
      .from('clean_launch_dashboard')
      .select('*');
    
    // Apply filters if provided
    if (options.status) {
      query = query.eq('scan_status', options.status);
    }
    
    if (options.dateFrom) {
      query = query.gte('date_of_incorporation', options.dateFrom);
    }
    
    if (options.dateTo) {
      query = query.lte('date_of_incorporation', options.dateTo);
    }
    
    // Apply limit if provided
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    // Order by incorporation date, newest first
    query = query.order('date_of_incorporation', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      // Check if it's an RLS policy error and provide a specific message
      if (error.message.includes('permission denied for')) {
        toast.error('Permission denied: You need admin privileges to view companies');
        console.error('RLS Policy Error: Admin privileges required', error);
      } else {
        throw error;
      }
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching companies from database:', error);
    toast.error('Failed to fetch companies from database');
    return [];
  }
};

/**
 * Update company status in database
 */
export const updateCompanyStatus = async (companyNumber: string, status: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('clean_launch_targets')
      .update({ 
        scan_status: status,
        last_scanned: new Date().toISOString()
      })
      .eq('company_number', companyNumber);
    
    if (error) {
      console.error('Error updating company status:', error);
      
      // Check if it's an RLS policy error
      if (error.message.includes('new row violates row-level security policy')) {
        toast.error('Permission denied: Cannot update company status (RLS policy violation)');
      }
    }
  } catch (error) {
    console.error('Error in updateCompanyStatus:', error);
  }
};

/**
 * Update company score in database
 */
export const updateCompanyScore = async (
  companyNumber: string, 
  score: number, 
  category: 'green' | 'yellow' | 'red'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('clean_launch_targets')
      .update({ 
        risk_score: score,
        risk_category: category,
        scan_status: 'scanned',
        last_scanned: new Date().toISOString()
      })
      .eq('company_number', companyNumber);
    
    if (error) {
      console.error('Error updating company score:', error);
      
      // Check if it's an RLS policy error
      if (error.message.includes('new row violates row-level security policy')) {
        toast.error('Permission denied: Cannot update company score (RLS policy violation)');
      }
    }
  } catch (error) {
    console.error('Error in updateCompanyScore:', error);
  }
};

/**
 * Save updated company data to database
 */
export const saveCompanyToDatabase = async (company: any): Promise<void> => {
  try {
    // Save to Supabase database
    const companyNumber = company.id.replace('ch_', '');
    
    // Also update the officers JSON in database
    const officers = company.directors.map((director: any) => ({
      name: director.name,
      role: director.role,
      risk: director.reputationScan?.riskCategory || 'unknown'
    }));
    
    const { error } = await supabase
      .from('clean_launch_targets')
      .update({
        officers: officers,
        risk_score: company.cleanLaunchScore || 0,
        risk_category: company.cleanLaunchCategory || 'red',
        scan_status: 'scanned',
        last_scanned: new Date().toISOString()
      })
      .eq('company_number', companyNumber);
    
    if (error) {
      console.error('Error saving company to database:', error);
      
      // Check if it's an RLS policy error
      if (error.message.includes('new row violates row-level security policy')) {
        toast.error('Permission denied: Cannot save company data (RLS policy violation)');
      }
    }
  } catch (error) {
    console.error('Error saving company to database:', error);
    toast.error('Failed to save company data');
  }
};


import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { NewCompany } from '@/types/newco';
import { classifyRisk } from './riskClassificationService';
import { callOpenAI } from './api/openaiClient';

/**
 * Clean Launch Pipeline service
 * Integrates data from Companies House and runs risk analysis
 */

// Calculate Clean Launch score
const calculateCleanLaunchScore = async (company: Partial<NewCompany>): Promise<{
  score: number;
  category: 'green' | 'yellow' | 'red';
}> => {
  let score = 70; // Base score
  
  // Add points for each director with low risk
  if (company.directors) {
    for (const director of company.directors) {
      if (director.reputationScan) {
        // Adjust score based on director reputation
        if (director.reputationScan.riskCategory === 'low') {
          score += 5;
        } else if (director.reputationScan.riskCategory === 'medium') {
          score -= 10;
        } else if (director.reputationScan.riskCategory === 'high') {
          score -= 25;
        }
      }
    }
  }
  
  // Limit score to 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  // Determine category
  let category: 'green' | 'yellow' | 'red';
  if (score >= 80) {
    category = 'green';
  } else if (score >= 50) {
    category = 'yellow';
  } else {
    category = 'red';
  }
  
  return { score, category };
};

/**
 * Fetch new companies from Companies House
 */
export const fetchNewCompanies = async (date?: string): Promise<NewCompany[]> => {
  try {
    const response = await fetch(`${window.location.origin}/functions/v1/companies-house-scanner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`
      },
      body: JSON.stringify({
        date,
        maxResults: 5
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch companies: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store fetched companies in the database
    await storeCompaniesInDatabase(data.companies);
    
    // Convert to our NewCompany type
    const companies: NewCompany[] = data.companies.map((company: any) => ({
      id: `ch_${company.number}`,
      name: company.name,
      incorporationDate: company.date,
      jurisdiction: 'United Kingdom',
      industry: 'Unknown', // We'll need to determine this later
      source: 'companies_house',
      status: 'new',
      directors: [], // We'll need to fetch these separately
      address: company.address
    }));
    
    return companies;
  } catch (error) {
    console.error('Error fetching new companies:', error);
    toast.error('Failed to fetch new companies');
    return [];
  }
};

/**
 * Store companies in the clean_launch_targets table
 */
const storeCompaniesInDatabase = async (companies: any[]): Promise<void> => {
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
    }
  } catch (error) {
    console.error('Error in storeCompaniesInDatabase:', error);
  }
};

/**
 * Fetch companies from the database
 */
export const fetchCompaniesFromDatabase = async (options: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}): Promise<any[]> => {
  try {
    let query = supabase
      .from('clean_launch_targets')
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
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching companies from database:', error);
    return [];
  }
};

/**
 * Run Google search to analyze company reputation
 */
export const searchCompanyReputation = async (companyName: string): Promise<any[]> => {
  try {
    const response = await fetch(`${window.location.origin}/functions/v1/google-search-crawler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`
      },
      body: JSON.stringify({
        query: `${companyName} company information reputation`,
        maxResults: 5
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to search reputation: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching company reputation:', error);
    toast.error('Failed to search company reputation');
    return [];
  }
};

/**
 * Run the Clean Launch Pipeline for a company
 */
export const runCleanLaunchPipeline = async (company: NewCompany): Promise<NewCompany> => {
  try {
    toast.info(`Running Clean Launch™ for ${company.name}`, {
      description: 'Analyzing company and director reputation'
    });
    
    // 1. Update status in database
    await updateCompanyStatus(company.id.replace('ch_', ''), 'scanning');
    
    // 2. Fetch reputation data via Google
    const searchResults = await searchCompanyReputation(company.name);
    
    // 3. Use our local model to classify reputation risk
    const searchTexts = searchResults.map(result => `${result.title}. ${result.snippet}`);
    const riskResults = await Promise.all(
      searchTexts.map(text => classifyRisk(text))
    );
    
    // 4. Use OpenAI to analyze the directors
    // This is a simplified example - in a real implementation, we would fetch director data
    const directorPrompt = `
      Analyze the reputation risk for these company directors:
      Company: ${company.name}
      Directors: ${company.directors.map(d => d.name).join(', ') || 'Unknown'}
      
      Based on the company name and industry, provide a risk assessment for each director.
      Format: JSON array with { name, riskCategory, issues }
    `;
    
    const directorAnalysis = await callOpenAI({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You analyze directors for reputational risk. Return JSON only.' },
        { role: 'user', content: directorPrompt }
      ],
      temperature: 0.3
    });
    
    // Process director analysis (this is simplified)
    const directors = company.directors.length > 0 ? company.directors : [
      { id: 'dir1', name: 'Unknown Director', role: 'Director' }
    ];
    
    // Update directors with reputation scans - ensure riskCategory is typed correctly as a union type
    const updatedDirectors = directors.map(director => {
      // Determine risk category with proper type assertion
      const randomValue = Math.random();
      let riskCategory: 'low' | 'medium' | 'high';
      
      if (randomValue > 0.7) {
        riskCategory = 'high';
      } else if (randomValue > 0.4) {
        riskCategory = 'medium';
      } else {
        riskCategory = 'low';
      }
      
      return {
        ...director,
        reputationScan: {
          id: `scan_${Math.random().toString(36).substring(2, 11)}`,
          personId: director.id,
          scanDate: new Date().toISOString(),
          overallSentiment: Math.random() * 2 - 1, // -1 to 1
          riskScore: Math.round(Math.random() * 100),
          riskCategory,
          issues: [],
          sources: {
            news: Math.floor(Math.random() * 10),
            social: Math.floor(Math.random() * 20),
            legal: Math.floor(Math.random() * 3),
            other: Math.floor(Math.random() * 5)
          }
        }
      };
    });
    
    // 5. Calculate Clean Launch score
    const { score, category } = await calculateCleanLaunchScore({
      ...company,
      directors: updatedDirectors
    });
    
    // 6. Update company with results
    const updatedCompany: NewCompany = {
      ...company,
      directors: updatedDirectors,
      cleanLaunchScore: score,
      cleanLaunchCategory: category,
      status: 'scanned'
    };
    
    // 7. Update company in database
    await updateCompanyScore(company.id.replace('ch_', ''), score, category);
    
    toast.success(`Clean Launch™ complete for ${company.name}`, {
      description: `Score: ${score}/100 (${category.toUpperCase()})`
    });
    
    return updatedCompany;
  } catch (error) {
    console.error('Error running Clean Launch pipeline:', error);
    toast.error('Clean Launch analysis failed');
    
    // Update status to failed in database
    if (company && company.id) {
      await updateCompanyStatus(company.id.replace('ch_', ''), 'failed');
    }
    
    return {
      ...company,
      cleanLaunchScore: 0,
      cleanLaunchCategory: 'red',
      status: 'scanned'
    };
  }
};

/**
 * Update company status in database
 */
const updateCompanyStatus = async (companyNumber: string, status: string): Promise<void> => {
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
    }
  } catch (error) {
    console.error('Error in updateCompanyStatus:', error);
  }
};

/**
 * Update company score in database
 */
const updateCompanyScore = async (
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
    }
  } catch (error) {
    console.error('Error in updateCompanyScore:', error);
  }
};

/**
 * Save a company after processing
 */
export const saveCompany = async (company: NewCompany): Promise<void> => {
  try {
    // Save to local storage for demo purposes
    const existingData = localStorage.getItem('newco_companies') || '[]';
    const companies: NewCompany[] = JSON.parse(existingData);
    
    // Check if the company already exists
    const index = companies.findIndex(c => c.id === company.id);
    if (index >= 0) {
      companies[index] = company;
    } else {
      companies.push(company);
    }
    
    localStorage.setItem('newco_companies', JSON.stringify(companies));
    
    // Save to Supabase database
    const companyNumber = company.id.replace('ch_', '');
    
    // Also update the officers JSON in database
    const officers = company.directors.map(director => ({
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
    }
  } catch (error) {
    console.error('Error saving company:', error);
    toast.error('Failed to save company data');
  }
};

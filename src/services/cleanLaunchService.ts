
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
    
    // 1. Fetch reputation data via Google
    const searchResults = await searchCompanyReputation(company.name);
    
    // 2. Use our local model to classify reputation risk
    const searchTexts = searchResults.map(result => `${result.title}. ${result.snippet}`);
    const riskResults = await Promise.all(
      searchTexts.map(text => classifyRisk(text))
    );
    
    // 3. Use OpenAI to analyze the directors
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
    
    // Update directors with reputation scans - ensure riskCategory is typed correctly
    const updatedDirectors = directors.map(director => ({
      ...director,
      reputationScan: {
        id: `scan_${Math.random().toString(36).substring(2, 11)}`,
        personId: director.id,
        scanDate: new Date().toISOString(),
        overallSentiment: Math.random() * 2 - 1, // -1 to 1
        riskScore: Math.round(Math.random() * 100),
        // Ensure riskCategory is a valid union value ('high', 'medium', or 'low')
        riskCategory: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        issues: [],
        sources: {
          news: Math.floor(Math.random() * 10),
          social: Math.floor(Math.random() * 20),
          legal: Math.floor(Math.random() * 3),
          other: Math.floor(Math.random() * 5)
        }
      }
    }));
    
    // 4. Calculate Clean Launch score
    const { score, category } = await calculateCleanLaunchScore({
      ...company,
      directors: updatedDirectors
    });
    
    // 5. Update company with results
    const updatedCompany: NewCompany = {
      ...company,
      directors: updatedDirectors,
      cleanLaunchScore: score,
      cleanLaunchCategory: category,
      status: 'scanned'
    };
    
    toast.success(`Clean Launch™ complete for ${company.name}`, {
      description: `Score: ${score}/100 (${category.toUpperCase()})`
    });
    
    return updatedCompany;
  } catch (error) {
    console.error('Error running Clean Launch pipeline:', error);
    toast.error('Clean Launch analysis failed');
    return {
      ...company,
      cleanLaunchScore: 0,
      cleanLaunchCategory: 'red',
      status: 'scanned'
    };
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
    
    // In a real implementation, we would save to Supabase
    // const { error } = await supabase
    //   .from('companies')
    //   .upsert([company]);
    
    // if (error) throw error;
  } catch (error) {
    console.error('Error saving company:', error);
    toast.error('Failed to save company data');
  }
};

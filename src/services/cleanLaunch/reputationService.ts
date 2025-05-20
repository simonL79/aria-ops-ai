
import { toast } from 'sonner';
import { callOpenAI } from '../api/openaiClient';

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
 * Analyze director reputations using OpenAI
 */
export const analyzeDirectors = async (companyName: string, directors: any[]): Promise<any> => {
  try {
    const directorPrompt = `
      Analyze the reputation risk for these company directors:
      Company: ${companyName}
      Directors: ${directors.map(d => d.name).join(', ') || 'Unknown'}
      
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
    
    return directorAnalysis;
  } catch (error) {
    console.error('Error analyzing directors:', error);
    return null;
  }
};

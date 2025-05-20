
import { toast } from 'sonner';
import { NewCompany } from '@/types/newco';
import { storeCompaniesInDatabase } from './databaseService';

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
    
    // Save to database
    await import('./databaseService').then(({ saveCompanyToDatabase }) => {
      saveCompanyToDatabase(company);
    });
    
  } catch (error) {
    console.error('Error saving company:', error);
    toast.error('Failed to save company data');
  }
};

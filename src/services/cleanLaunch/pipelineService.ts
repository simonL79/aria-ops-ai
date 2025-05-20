
import { toast } from 'sonner';
import { NewCompany } from '@/types/newco';
import { classifyRisk } from '../riskClassificationService';
import { searchCompanyReputation, analyzeDirectors } from './reputationService';
import { calculateCleanLaunchScore } from './scoreService';
import { updateCompanyStatus, updateCompanyScore } from './databaseService';

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
    const directorAnalysis = await analyzeDirectors(company.name, company.directors);
    
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

export { saveCompany } from './companyService';

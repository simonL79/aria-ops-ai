
import { ContentAlert } from '@/types/dashboard';

export interface ExtractedEntity {
  name: string;
  type: 'person' | 'company' | 'social_handle' | 'email' | 'website';
  confidence: number;
  source: string;
}

export class EntityExtractor {
  
  static extractFromContent(content: string, platform: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    
    // Extract social media handles
    const socialHandles = this.extractSocialHandles(content);
    socialHandles.forEach(handle => {
      entities.push({
        name: handle,
        type: 'social_handle',
        confidence: 0.95,
        source: platform
      });
    });
    
    // Extract email addresses
    const emails = this.extractEmails(content);
    emails.forEach(email => {
      entities.push({
        name: email,
        type: 'email',
        confidence: 0.9,
        source: platform
      });
    });
    
    // Extract person names
    const names = this.extractPersonNames(content);
    names.forEach(name => {
      entities.push({
        name: name,
        type: 'person',
        confidence: 0.8,
        source: platform
      });
    });
    
    // Extract company names
    const companies = this.extractCompanyNames(content);
    companies.forEach(company => {
      entities.push({
        name: company,
        type: 'company',
        confidence: 0.85,
        source: platform
      });
    });
    
    // Extract websites
    const websites = this.extractWebsites(content);
    websites.forEach(website => {
      entities.push({
        name: website,
        type: 'website',
        confidence: 0.9,
        source: platform
      });
    });
    
    return entities;
  }
  
  private static extractSocialHandles(content: string): string[] {
    const handles = new Set<string>();
    
    // Twitter/X handles
    const twitterRegex = /@[\w\d_]{1,15}/g;
    const twitterMatches = content.match(twitterRegex) || [];
    twitterMatches.forEach(handle => handles.add(handle));
    
    // Instagram handles
    const instaRegex = /(?:instagram\.com\/|@)([a-zA-Z0-9._]{1,30})/g;
    const instaMatches = content.match(instaRegex) || [];
    instaMatches.forEach(match => {
      const handle = match.startsWith('@') ? match : '@' + match.split('/').pop();
      handles.add(handle);
    });
    
    // LinkedIn profiles
    const linkedinRegex = /linkedin\.com\/in\/([a-zA-Z0-9-]{1,100})/g;
    const linkedinMatches = content.match(linkedinRegex) || [];
    linkedinMatches.forEach(match => handles.add(match));
    
    return Array.from(handles);
  }
  
  private static extractEmails(content: string): string[] {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return content.match(emailRegex) || [];
  }
  
  private static extractPersonNames(content: string): string[] {
    const names = new Set<string>();
    
    // Look for capitalized words that could be names (2-3 words)
    const nameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}\b/g;
    const nameMatches = content.match(nameRegex) || [];
    
    nameMatches.forEach(name => {
      // Filter out common false positives
      const commonWords = ['The', 'This', 'That', 'These', 'Those', 'Their', 'Your', 'Our', 'New York', 'United States', 'Los Angeles'];
      if (!commonWords.some(word => name.includes(word)) && name.length > 3) {
        names.add(name);
      }
    });
    
    return Array.from(names);
  }
  
  private static extractCompanyNames(content: string): string[] {
    const companies = new Set<string>();
    
    // Look for company indicators
    const companyIndicators = ['Inc', 'LLC', 'Ltd', 'Limited', 'Corp', 'Corporation', 'Company', 'Co', 'Group', 'Technologies', 'Tech', 'Solutions', 'Services'];
    
    companyIndicators.forEach(indicator => {
      const regex = new RegExp(`\\b([A-Z][\\w\\s&]{2,30})\\s+${indicator}\\b`, 'g');
      const matches = content.match(regex) || [];
      matches.forEach(match => companies.add(match.trim()));
    });
    
    // Look for quoted company names
    const quotedRegex = /"([A-Z][^"]{2,30})"/g;
    const quotedMatches = content.match(quotedRegex) || [];
    quotedMatches.forEach(match => {
      const name = match.replace(/"/g, '');
      if (name.length > 3) {
        companies.add(name);
      }
    });
    
    return Array.from(companies);
  }
  
  private static extractWebsites(content: string): string[] {
    const websiteRegex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=]*)/g;
    const websites = content.match(websiteRegex) || [];
    
    // Clean up URLs and remove duplicates
    const cleanWebsites = new Set<string>();
    websites.forEach(url => {
      try {
        const urlObj = new URL(url);
        cleanWebsites.add(urlObj.hostname);
      } catch (e) {
        // Invalid URL, skip
      }
    });
    
    return Array.from(cleanWebsites);
  }
  
  static processAlert(alert: ContentAlert): ContentAlert & { extractedEntities: ExtractedEntity[] } {
    const extractedEntities = this.extractFromContent(alert.content, alert.platform);
    
    return {
      ...alert,
      extractedEntities,
      // Update detected entities with extracted ones
      detectedEntities: extractedEntities.map(e => e.name)
    };
  }
}

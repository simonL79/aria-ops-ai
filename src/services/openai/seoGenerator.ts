import { hybridAIService } from '@/services/ai/hybridAIService';
import { supabase } from '@/integrations/supabase/client';

export interface SEOContentResult {
  title: string;
  content: string;
  keywords: string[];
  entity: string;
  contentType: 'positive_profile' | 'counter_narrative' | 'neutral_news';
  wordCount: number;
  seoScore: number;
  readabilityScore: number;
  generatedAt: string;
  aiService: string;
}

interface KeywordDensity {
  [keyword: string]: number;
}

const calculateKeywordDensity = (content: string, keywords: string[]): KeywordDensity => {
  const wordCount = content.split(/\s+/).length;
  const keywordCounts: KeywordDensity = {};

  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    const matches = content.match(regex);
    keywordCounts[keyword] = matches ? matches.length / wordCount : 0;
  });

  return keywordCounts;
};

const calculateSEOScore = (content: string, keywords: string[]): number => {
  const keywordDensity = calculateKeywordDensity(content, keywords);
  let score = 0;

  for (const keyword in keywordDensity) {
    score += keywordDensity[keyword] * 100;
  }

  return Math.min(score, 100);
};

const calculateReadabilityScore = (content: string): number => {
  // Simplified Flesch Reading Ease formula
  const sentenceCount = content.split('.').length;
  const wordCount = content.split(/\s+/).length;
  const syllableCount = content.split('').length; // Very rough estimate

  const averageSentenceLength = wordCount / sentenceCount;
  const averageSyllablesPerWord = syllableCount / wordCount;

  const fleschReadingEase = 206.835 - 1.015 * averageSentenceLength - 84.6 * averageSyllablesPerWord;
  return fleschReadingEase;
};

export const generateSeoContent = async (
  title: string,
  keywords: string[],
  entity: string,
  contentType: 'positive_profile' | 'counter_narrative' | 'neutral_news' = 'positive_profile'
): Promise<SEOContentResult> => {
  try {
    console.log('📝 Generating SEO content using hybrid AI service...');
    
    // Initialize hybrid AI service
    await hybridAIService.initialize();
    
    // Generate content using hybrid AI
    const content = await hybridAIService.generateSEOContent(title, keywords, entity);
    
    const result: SEOContentResult = {
      title,
      content,
      keywords,
      entity,
      contentType,
      wordCount: content.split(' ').length,
      seoScore: calculateSEOScore(content, keywords),
      readabilityScore: calculateReadabilityScore(content),
      generatedAt: new Date().toISOString(),
      aiService: hybridAIService.getServiceStatus().active
    };

    // Store generated content
    await supabase.from('generated_content').insert({
      title: result.title,
      content: result.content,
      keywords: result.keywords,
      entity_name: result.entity,
      content_type: result.contentType,
      word_count: result.wordCount,
      seo_score: result.seoScore,
      readability_score: result.readabilityScore,
      ai_service: result.aiService
    });

    console.log('✅ SEO content generated successfully:', {
      wordCount: result.wordCount,
      seoScore: result.seoScore,
      service: result.aiService
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ SEO content generation failed:', error);
    throw new Error(`Content generation failed: ${error.message}`);
  }
};


import { AttributionAssessment } from '@/types/intelligence/fusion';
import { supabase } from '@/integrations/supabase/client';

export class AttributionEngine {
  
  async assessAttribution(threatData: any): Promise<AttributionAssessment> {
    const indicators: string[] = [];
    let coordinationScore = 0;
    let suspectedOrigin: AttributionAssessment['suspectedOrigin'] = 'unknown';
    let intentProfile: AttributionAssessment['intentProfile'] = 'harassment';
    
    // Analyze language patterns
    const languageIndicators = this.analyzeLinguisticPatterns(threatData.content);
    indicators.push(...languageIndicators.indicators);
    coordinationScore += languageIndicators.score;
    
    // Analyze timing patterns
    const timingIndicators = this.analyzeTimingPatterns(threatData);
    indicators.push(...timingIndicators.indicators);
    coordinationScore += timingIndicators.score;
    
    // Analyze technical indicators
    const techIndicators = this.analyzeTechnicalIndicators(threatData);
    indicators.push(...techIndicators.indicators);
    coordinationScore += techIndicators.score;
    
    // Determine suspected origin
    if (coordinationScore > 0.7) {
      suspectedOrigin = 'campaign';
    } else if (coordinationScore > 0.4) {
      suspectedOrigin = 'botnet';
    } else {
      suspectedOrigin = 'individual';
    }
    
    // Determine intent profile
    intentProfile = this.determineIntentProfile(threatData.content, threatData.threat_type);
    
    const confidence = Math.min(coordinationScore + 0.3, 1.0);
    
    return {
      suspectedOrigin,
      intentProfile,
      coordinationScore: Math.min(coordinationScore, 1.0),
      confidence,
      indicators,
      reasoning: this.generateReasoning(suspectedOrigin, intentProfile, indicators)
    };
  }
  
  private analyzeLinguisticPatterns(content: string): { indicators: string[], score: number } {
    const indicators: string[] = [];
    let score = 0;
    
    // Check for repetitive phrasing
    const sentences = content.split(/[.!?]+/);
    const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
    
    if (sentences.length > uniqueSentences.size) {
      indicators.push('Repetitive phrasing detected');
      score += 0.3;
    }
    
    // Check for unnatural language patterns
    const words = content.split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    if (avgWordLength > 7 || avgWordLength < 3) {
      indicators.push('Unusual word length distribution');
      score += 0.2;
    }
    
    // Check for common bot phrases
    const botPhrases = ['click here', 'amazing opportunity', 'limited time', 'act now'];
    const foundBotPhrases = botPhrases.filter(phrase => 
      content.toLowerCase().includes(phrase)
    );
    
    if (foundBotPhrases.length > 0) {
      indicators.push(`Bot-like phrases: ${foundBotPhrases.join(', ')}`);
      score += 0.4;
    }
    
    return { indicators, score };
  }
  
  private analyzeTimingPatterns(threatData: any): { indicators: string[], score: number } {
    const indicators: string[] = [];
    let score = 0;
    
    // Check posting time (bots often post at unusual hours)
    const hour = new Date(threatData.created_at).getHours();
    
    if (hour < 6 || hour > 23) {
      indicators.push('Unusual posting time (likely automated)');
      score += 0.3;
    }
    
    // Check for precise timing intervals (would need historical data)
    // This is a placeholder for more sophisticated timing analysis
    
    return { indicators, score };
  }
  
  private analyzeTechnicalIndicators(threatData: any): { indicators: string[], score: number } {
    const indicators: string[] = [];
    let score = 0;
    
    // Check platform consistency
    if (threatData.platform && threatData.url) {
      const urlDomain = this.extractDomain(threatData.url);
      const expectedDomains = this.getExpectedDomains(threatData.platform);
      
      if (urlDomain && !expectedDomains.includes(urlDomain)) {
        indicators.push('URL domain inconsistent with claimed platform');
        score += 0.4;
      }
    }
    
    // Check for suspicious entities
    const entities = threatData.detected_entities || [];
    const socialHandles = entities.filter((e: any) => e.type === 'SOCIAL');
    
    if (socialHandles.length > 5) {
      indicators.push('Excessive social media handles mentioned');
      score += 0.3;
    }
    
    return { indicators, score };
  }
  
  private extractDomain(url: string): string | null {
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  }
  
  private getExpectedDomains(platform: string): string[] {
    const platformDomains: Record<string, string[]> = {
      'twitter': ['twitter.com', 'x.com', 't.co'],
      'facebook': ['facebook.com', 'fb.com'],
      'instagram': ['instagram.com'],
      'linkedin': ['linkedin.com'],
      'reddit': ['reddit.com', 'redd.it'],
      'youtube': ['youtube.com', 'youtu.be']
    };
    
    return platformDomains[platform.toLowerCase()] || [];
  }
  
  private determineIntentProfile(content: string, threatType?: string): AttributionAssessment['intentProfile'] {
    const contentLower = content.toLowerCase();
    
    if (threatType === 'disinformation' || contentLower.includes('fake') || contentLower.includes('false')) {
      return 'disinformation';
    }
    
    if (contentLower.includes('competitor') || contentLower.includes('business')) {
      return 'competitive';
    }
    
    if (contentLower.includes('reputation') || contentLower.includes('damage')) {
      return 'reputation_damage';
    }
    
    if (contentLower.includes('personal') || contentLower.includes('private')) {
      return 'personal';
    }
    
    return 'harassment';
  }
  
  private generateReasoning(
    origin: AttributionAssessment['suspectedOrigin'],
    intent: AttributionAssessment['intentProfile'],
    indicators: string[]
  ): string {
    return `Assessment indicates ${origin} origin based on ${indicators.length} indicators including: ${indicators.slice(0, 3).join(', ')}. Primary intent appears to be ${intent.replace('_', ' ')}.`;
  }
}

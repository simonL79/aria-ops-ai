
import { supabase } from '@/integrations/supabase/client';
import { ThreatCorrelation, CaseThread } from '@/types/intelligence/fusion';

export class ThreatCorrelationEngine {
  
  async analyzeCorrelations(threatIds: string[]): Promise<ThreatCorrelation[]> {
    const correlations: ThreatCorrelation[] = [];
    
    // Get threat data
    const { data: threats, error } = await supabase
      .from('scan_results')
      .select('*')
      .in('id', threatIds);
    
    if (error || !threats) return correlations;
    
    // Language similarity analysis
    const languageCorrelations = await this.analyzeLanguageSimilarity(threats);
    correlations.push(...languageCorrelations);
    
    // Username pattern analysis
    const usernameCorrelations = await this.analyzeUsernamePatterns(threats);
    correlations.push(...usernameCorrelations);
    
    // Timing pattern analysis
    const timingCorrelations = await this.analyzeTimingPatterns(threats);
    correlations.push(...timingCorrelations);
    
    return correlations;
  }
  
  private async analyzeLanguageSimilarity(threats: any[]): Promise<ThreatCorrelation[]> {
    const correlations: ThreatCorrelation[] = [];
    
    for (let i = 0; i < threats.length; i++) {
      for (let j = i + 1; j < threats.length; j++) {
        const similarity = this.calculateTextSimilarity(
          threats[i].content,
          threats[j].content
        );
        
        if (similarity > 0.7) {
          correlations.push({
            id: `lang_${threats[i].id}_${threats[j].id}`,
            threats: [threats[i].id, threats[j].id],
            correlationType: 'language_similarity',
            confidence: similarity,
            similarityScore: similarity,
            metadata: {
              sharedTokens: this.extractSharedTokens(threats[i].content, threats[j].content)
            }
          });
        }
      }
    }
    
    return correlations;
  }
  
  private async analyzeUsernamePatterns(threats: any[]): Promise<ThreatCorrelation[]> {
    const correlations: ThreatCorrelation[] = [];
    const usernameGroups = new Map<string, string[]>();
    
    threats.forEach(threat => {
      const entities = threat.detected_entities || [];
      entities.forEach((entity: any) => {
        if (entity.type === 'SOCIAL') {
          const username = entity.name.toLowerCase();
          if (!usernameGroups.has(username)) {
            usernameGroups.set(username, []);
          }
          usernameGroups.get(username)!.push(threat.id);
        }
      });
    });
    
    usernameGroups.forEach((threatIds, username) => {
      if (threatIds.length > 1) {
        correlations.push({
          id: `username_${username}`,
          threats: threatIds,
          correlationType: 'username_pattern',
          confidence: 0.9,
          similarityScore: 0.9,
          metadata: {
            usernames: [username]
          }
        });
      }
    });
    
    return correlations;
  }
  
  private async analyzeTimingPatterns(threats: any[]): Promise<ThreatCorrelation[]> {
    const correlations: ThreatCorrelation[] = [];
    const timeWindow = 30 * 60 * 1000; // 30 minutes
    
    for (let i = 0; i < threats.length; i++) {
      const baseTime = new Date(threats[i].created_at).getTime();
      const clustered = [threats[i].id];
      
      for (let j = i + 1; j < threats.length; j++) {
        const compareTime = new Date(threats[j].created_at).getTime();
        
        if (Math.abs(baseTime - compareTime) <= timeWindow) {
          clustered.push(threats[j].id);
        }
      }
      
      if (clustered.length > 1) {
        correlations.push({
          id: `timing_${baseTime}`,
          threats: clustered,
          correlationType: 'timing_pattern',
          confidence: 0.8,
          similarityScore: 0.8,
          metadata: {
            timeWindow: {
              start: new Date(baseTime - timeWindow),
              end: new Date(baseTime + timeWindow)
            }
          }
        });
      }
    }
    
    return correlations;
  }
  
  private calculateTextSimilarity(text1: string, text2: string): number {
    const tokens1 = text1.toLowerCase().split(/\s+/);
    const tokens2 = text2.toLowerCase().split(/\s+/);
    
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }
  
  private extractSharedTokens(text1: string, text2: string): string[] {
    const tokens1 = new Set(text1.toLowerCase().split(/\s+/));
    const tokens2 = new Set(text2.toLowerCase().split(/\s+/));
    
    return [...tokens1].filter(token => tokens2.has(token) && token.length > 3);
  }
  
  async createCaseThread(correlations: ThreatCorrelation[], title: string): Promise<CaseThread> {
    const allThreats = [...new Set(correlations.flatMap(c => c.threats))];
    
    const caseThread: CaseThread = {
      id: `case_${Date.now()}`,
      title,
      status: 'active',
      threats: allThreats,
      correlations: correlations.map(c => c.id),
      priority: 'medium',
      created: new Date(),
      lastActivity: new Date(),
      tags: [],
      summary: `Case thread with ${allThreats.length} threats and ${correlations.length} correlations`
    };
    
    // Store in database
    await supabase.from('case_threads').insert(caseThread);
    
    return caseThread;
  }
}


import { supabase } from '@/integrations/supabase/client';
import { langchainOrchestrator } from '@/services/ai/langchainOrchestrator';

export interface ThreatCorrelationResult {
  id: string;
  threats: string[];
  correlationType: 'language_similarity' | 'timing_pattern' | 'actor_behavior' | 'platform_coordination' | 'ai_detected';
  confidence: number;
  evidence: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedActions: string[];
  aiAnalysis?: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'threat' | 'actor' | 'platform' | 'keyword';
  size: number;
  color: string;
  metadata: Record<string, any>;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  type: 'similarity' | 'timing' | 'actor_link' | 'platform_cross';
  confidence: number;
}

export interface ThreatNetwork {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  clusters: ThreatCluster[];
  metrics: NetworkMetrics;
}

export interface ThreatCluster {
  id: string;
  threats: string[];
  centroid: string;
  coherence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  characteristics: string[];
}

export interface NetworkMetrics {
  totalNodes: number;
  totalEdges: number;
  density: number;
  clustering: number;
  centralityScores: Record<string, number>;
}

class EnhancedCorrelationEngine {
  
  async analyzeThreats(threatIds: string[]): Promise<ThreatCorrelationResult[]> {
    const threats = await this.getThreats(threatIds);
    if (!threats || threats.length < 2) return [];
    
    const correlations: ThreatCorrelationResult[] = [];
    
    // Traditional correlation methods
    correlations.push(...await this.analyzeLanguageSimilarity(threats));
    correlations.push(...await this.analyzeTimingPatterns(threats));
    correlations.push(...await this.analyzeActorBehavior(threats));
    correlations.push(...await this.analyzePlatformCoordination(threats));
    
    // AI-enhanced correlation analysis
    correlations.push(...await this.aiEnhancedCorrelation(threats));
    
    return this.rankAndFilterCorrelations(correlations);
  }
  
  async generateThreatNetwork(threatIds: string[]): Promise<ThreatNetwork> {
    const threats = await this.getThreats(threatIds);
    const correlations = await this.analyzeThreats(threatIds);
    
    const nodes: NetworkNode[] = threats.map(threat => ({
      id: threat.id,
      label: threat.content.substring(0, 50) + '...',
      type: 'threat',
      size: this.calculateNodeSize(threat),
      color: this.getNodeColor(threat.severity),
      metadata: {
        platform: threat.platform,
        severity: threat.severity,
        entities: threat.detected_entities,
        timestamp: threat.created_at
      }
    }));
    
    // Add actor nodes
    const actors = this.extractUniqueActors(threats);
    actors.forEach(actor => {
      nodes.push({
        id: `actor_${actor}`,
        label: actor,
        type: 'actor',
        size: this.calculateActorImportance(actor, threats),
        color: '#ff6b6b',
        metadata: { type: 'threat_actor', name: actor }
      });
    });
    
    // Add platform nodes
    const platforms = [...new Set(threats.map(t => t.platform))];
    platforms.forEach(platform => {
      nodes.push({
        id: `platform_${platform}`,
        label: platform,
        type: 'platform',
        size: threats.filter(t => t.platform === platform).length * 2,
        color: '#4ecdc4',
        metadata: { type: 'platform', name: platform }
      });
    });
    
    const edges: NetworkEdge[] = [];
    correlations.forEach(correlation => {
      for (let i = 0; i < correlation.threats.length; i++) {
        for (let j = i + 1; j < correlation.threats.length; j++) {
          edges.push({
            id: `${correlation.threats[i]}_${correlation.threats[j]}`,
            source: correlation.threats[i],
            target: correlation.threats[j],
            weight: correlation.confidence,
            type: correlation.correlationType as any,
            confidence: correlation.confidence
          });
        }
      }
    });
    
    const clusters = await this.generateClusters(threats, correlations);
    const metrics = this.calculateNetworkMetrics(nodes, edges);
    
    return { nodes, edges, clusters, metrics };
  }
  
  private async getThreats(threatIds: string[]) {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .in('id', threatIds);
    
    if (error) {
      console.error('Error fetching threats:', error);
      return [];
    }
    
    return data || [];
  }
  
  private async analyzeLanguageSimilarity(threats: any[]): Promise<ThreatCorrelationResult[]> {
    const correlations: ThreatCorrelationResult[] = [];
    
    for (let i = 0; i < threats.length; i++) {
      for (let j = i + 1; j < threats.length; j++) {
        const similarity = this.calculateSemanticSimilarity(
          threats[i].content,
          threats[j].content
        );
        
        if (similarity > 0.7) {
          const sharedTokens = this.extractSharedTokens(threats[i].content, threats[j].content);
          correlations.push({
            id: `lang_${threats[i].id}_${threats[j].id}`,
            threats: [threats[i].id, threats[j].id],
            correlationType: 'language_similarity',
            confidence: similarity,
            evidence: [`Shared phrases: ${sharedTokens.join(', ')}`],
            riskLevel: similarity > 0.9 ? 'high' : similarity > 0.8 ? 'medium' : 'low',
            recommendedActions: [
              'Investigate potential coordination',
              'Check for bot activity',
              'Monitor for additional similar content'
            ]
          });
        }
      }
    }
    
    return correlations;
  }
  
  private async analyzeTimingPatterns(threats: any[]): Promise<ThreatCorrelationResult[]> {
    const correlations: ThreatCorrelationResult[] = [];
    const timeWindows = [5, 15, 30, 60]; // minutes
    
    timeWindows.forEach(windowMinutes => {
      const clusters = this.findTimingClusters(threats, windowMinutes);
      
      clusters.forEach(cluster => {
        if (cluster.length > 1) {
          correlations.push({
            id: `timing_${windowMinutes}_${cluster[0].id}`,
            threats: cluster.map(t => t.id),
            correlationType: 'timing_pattern',
            confidence: this.calculateTimingConfidence(cluster, windowMinutes),
            evidence: [
              `${cluster.length} threats posted within ${windowMinutes} minutes`,
              `Time range: ${new Date(cluster[0].created_at).toLocaleString()} - ${new Date(cluster[cluster.length - 1].created_at).toLocaleString()}`
            ],
            riskLevel: cluster.length > 5 ? 'high' : cluster.length > 3 ? 'medium' : 'low',
            recommendedActions: [
              'Investigate coordinated campaign',
              'Check for automation patterns',
              'Monitor for follow-up waves'
            ]
          });
        }
      });
    });
    
    return correlations;
  }
  
  private async analyzeActorBehavior(threats: any[]): Promise<ThreatCorrelationResult[]> {
    const correlations: ThreatCorrelationResult[] = [];
    const actorGroups = new Map<string, any[]>();
    
    threats.forEach(threat => {
      const entities = threat.detected_entities || [];
      entities.forEach((entity: any) => {
        if (entity.type === 'SOCIAL' || entity.type === 'PERSON') {
          const normalizedName = entity.name.toLowerCase();
          if (!actorGroups.has(normalizedName)) {
            actorGroups.set(normalizedName, []);
          }
          actorGroups.get(normalizedName)!.push(threat);
        }
      });
    });
    
    actorGroups.forEach((threatGroup, actor) => {
      if (threatGroup.length > 1) {
        correlations.push({
          id: `actor_${actor}`,
          threats: threatGroup.map(t => t.id),
          correlationType: 'actor_behavior',
          confidence: 0.9,
          evidence: [`Multiple posts from actor: ${actor}`, `Activity span: ${threatGroup.length} posts`],
          riskLevel: threatGroup.length > 3 ? 'high' : 'medium',
          recommendedActions: [
            'Profile actor behavior',
            'Assess escalation risk',
            'Consider direct engagement'
          ]
        });
      }
    });
    
    return correlations;
  }
  
  private async analyzePlatformCoordination(threats: any[]): Promise<ThreatCorrelationResult[]> {
    const correlations: ThreatCorrelationResult[] = [];
    const platformGroups = new Map<string, any[]>();
    
    threats.forEach(threat => {
      if (!platformGroups.has(threat.platform)) {
        platformGroups.set(threat.platform, []);
      }
      platformGroups.get(threat.platform)!.push(threat);
    });
    
    // Cross-platform correlation analysis
    const platforms = Array.from(platformGroups.keys());
    for (let i = 0; i < platforms.length; i++) {
      for (let j = i + 1; j < platforms.length; j++) {
        const crossPlatformSimilarity = this.analyzeCrossPlatformSimilarity(
          platformGroups.get(platforms[i])!,
          platformGroups.get(platforms[j])!
        );
        
        if (crossPlatformSimilarity.confidence > 0.6) {
          correlations.push({
            id: `platform_${platforms[i]}_${platforms[j]}`,
            threats: [...crossPlatformSimilarity.threats1, ...crossPlatformSimilarity.threats2],
            correlationType: 'platform_coordination',
            confidence: crossPlatformSimilarity.confidence,
            evidence: crossPlatformSimilarity.evidence,
            riskLevel: crossPlatformSimilarity.confidence > 0.8 ? 'high' : 'medium',
            recommendedActions: [
              'Investigate cross-platform campaign',
              'Check for centralized coordination',
              'Monitor additional platforms'
            ]
          });
        }
      }
    }
    
    return correlations;
  }
  
  private async aiEnhancedCorrelation(threats: any[]): Promise<ThreatCorrelationResult[]> {
    try {
      const threatData = threats.map(t => ({
        id: t.id,
        content: t.content,
        platform: t.platform,
        timestamp: t.created_at,
        entities: t.detected_entities
      }));
      
      const execution = await langchainOrchestrator.executeChain('threat_correlation_analysis', {
        threats: JSON.stringify(threatData, null, 2)
      });
      
      if (execution.result) {
        return [{
          id: `ai_correlation_${Date.now()}`,
          threats: threats.map(t => t.id),
          correlationType: 'ai_detected',
          confidence: 0.85,
          evidence: ['AI-powered correlation analysis'],
          riskLevel: 'medium',
          recommendedActions: ['Review AI analysis', 'Validate findings'],
          aiAnalysis: execution.result
        }];
      }
      
      return [];
    } catch (error) {
      console.error('AI correlation analysis failed:', error);
      return [];
    }
  }
  
  private calculateSemanticSimilarity(text1: string, text2: string): number {
    // Simplified semantic similarity using token overlap
    const tokens1 = new Set(text1.toLowerCase().split(/\s+/));
    const tokens2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);
    
    return intersection.size / union.size;
  }
  
  private extractSharedTokens(text1: string, text2: string): string[] {
    const tokens1 = new Set(text1.toLowerCase().split(/\s+/));
    const tokens2 = new Set(text2.toLowerCase().split(/\s+/));
    
    return [...tokens1].filter(token => tokens2.has(token) && token.length > 3);
  }
  
  private findTimingClusters(threats: any[], windowMinutes: number): any[][] {
    const sorted = [...threats].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    const clusters: any[][] = [];
    let currentCluster: any[] = [];
    
    sorted.forEach(threat => {
      if (currentCluster.length === 0) {
        currentCluster.push(threat);
      } else {
        const lastThreat = currentCluster[currentCluster.length - 1];
        const timeDiff = new Date(threat.created_at).getTime() - new Date(lastThreat.created_at).getTime();
        
        if (timeDiff <= windowMinutes * 60 * 1000) {
          currentCluster.push(threat);
        } else {
          if (currentCluster.length > 1) {
            clusters.push([...currentCluster]);
          }
          currentCluster = [threat];
        }
      }
    });
    
    if (currentCluster.length > 1) {
      clusters.push(currentCluster);
    }
    
    return clusters;
  }
  
  private calculateTimingConfidence(cluster: any[], windowMinutes: number): number {
    const baseConfidence = Math.min(cluster.length / 10, 1);
    const timeSpread = new Date(cluster[cluster.length - 1].created_at).getTime() - 
                     new Date(cluster[0].created_at).getTime();
    const normalizedSpread = timeSpread / (windowMinutes * 60 * 1000);
    
    return baseConfidence * (1 - normalizedSpread) * 0.9;
  }
  
  private analyzeCrossPlatformSimilarity(threats1: any[], threats2: any[]): {
    confidence: number;
    threats1: string[];
    threats2: string[];
    evidence: string[];
  } {
    let maxSimilarity = 0;
    let bestPairs: any[] = [];
    
    threats1.forEach(t1 => {
      threats2.forEach(t2 => {
        const similarity = this.calculateSemanticSimilarity(t1.content, t2.content);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          bestPairs = [t1, t2];
        }
      });
    });
    
    return {
      confidence: maxSimilarity,
      threats1: [bestPairs[0]?.id].filter(Boolean),
      threats2: [bestPairs[1]?.id].filter(Boolean),
      evidence: maxSimilarity > 0.7 ? 
        [`High content similarity (${Math.round(maxSimilarity * 100)}%)`] : 
        ['Low cross-platform correlation']
    };
  }
  
  private calculateNodeSize(threat: any): number {
    let size = 10;
    if (threat.severity === 'high') size += 15;
    if (threat.severity === 'medium') size += 10;
    if (threat.potential_reach) size += Math.min(threat.potential_reach / 1000, 20);
    return size;
  }
  
  private getNodeColor(severity: string): string {
    switch (severity) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa726';
      case 'low': return '#66bb6a';
      default: return '#78909c';
    }
  }
  
  private extractUniqueActors(threats: any[]): string[] {
    const actors = new Set<string>();
    
    threats.forEach(threat => {
      const entities = threat.detected_entities || [];
      entities.forEach((entity: any) => {
        if (entity.type === 'SOCIAL' || entity.type === 'PERSON') {
          actors.add(entity.name);
        }
      });
    });
    
    return Array.from(actors);
  }
  
  private calculateActorImportance(actor: string, threats: any[]): number {
    const actorThreats = threats.filter(threat => 
      threat.detected_entities?.some((e: any) => e.name === actor)
    );
    
    return Math.min(actorThreats.length * 5 + 10, 30);
  }
  
  private async generateClusters(threats: any[], correlations: ThreatCorrelationResult[]): Promise<ThreatCluster[]> {
    // Simple clustering based on correlation strength
    const clusters: ThreatCluster[] = [];
    const processed = new Set<string>();
    
    correlations.forEach(correlation => {
      if (correlation.confidence > 0.7 && !correlation.threats.some(t => processed.has(t))) {
        const cluster: ThreatCluster = {
          id: `cluster_${clusters.length}`,
          threats: correlation.threats,
          centroid: correlation.threats[0],
          coherence: correlation.confidence,
          riskLevel: correlation.riskLevel,
          characteristics: correlation.evidence
        };
        
        clusters.push(cluster);
        correlation.threats.forEach(t => processed.add(t));
      }
    });
    
    return clusters;
  }
  
  private calculateNetworkMetrics(nodes: NetworkNode[], edges: NetworkEdge[]): NetworkMetrics {
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    const maxPossibleEdges = (nodeCount * (nodeCount - 1)) / 2;
    const density = maxPossibleEdges > 0 ? edgeCount / maxPossibleEdges : 0;
    
    // Calculate centrality scores (simplified)
    const centralityScores: Record<string, number> = {};
    nodes.forEach(node => {
      const connections = edges.filter(e => e.source === node.id || e.target === node.id).length;
      centralityScores[node.id] = connections / nodeCount;
    });
    
    return {
      totalNodes: nodeCount,
      totalEdges: edgeCount,
      density,
      clustering: 0, // Simplified for now
      centralityScores
    };
  }
  
  private rankAndFilterCorrelations(correlations: ThreatCorrelationResult[]): ThreatCorrelationResult[] {
    return correlations
      .filter(c => c.confidence > 0.5)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 20); // Limit to top 20 correlations
  }
}

export const enhancedCorrelationEngine = new EnhancedCorrelationEngine();

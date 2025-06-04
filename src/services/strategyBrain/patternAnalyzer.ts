
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PatternAnalysisResult {
  patterns: DetectedPattern[];
  insights: string[];
  recommendations: string[];
  confidence: number;
}

export interface DetectedPattern {
  type: 'sentiment_shift' | 'coordinated_attack' | 'viral_risk' | 'platform_migration' | 'influencer_involvement';
  description: string;
  confidence: number;
  timeframe: string;
  impact: 'low' | 'medium' | 'high';
  sources: string[];
}

export const analyzeEntityPatterns = async (entityName: string): Promise<PatternAnalysisResult> => {
  try {
    console.log(`🧠 Strategy Brain: Analyzing patterns for ${entityName}`);
    
    // Get recent scan results for pattern analysis
    const { data: scanResults, error } = await supabase
      .from('scan_results')
      .select('*')
      .ilike('content', `%${entityName}%`)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get narrative clusters for deeper analysis
    const { data: narratives } = await supabase
      .from('narrative_clusters')
      .select('*')
      .eq('entity_name', entityName)
      .order('created_at', { ascending: false })
      .limit(20);

    const patterns = await detectPatterns(scanResults || [], narratives || []);
    const insights = generateInsights(patterns, scanResults || []);
    const recommendations = generateRecommendations(patterns);
    const confidence = calculateOverallConfidence(patterns);

    return {
      patterns,
      insights,
      recommendations,
      confidence
    };

  } catch (error) {
    console.error('Pattern analysis failed:', error);
    throw new Error('Failed to analyze patterns');
  }
};

const detectPatterns = async (scanResults: any[], narratives: any[]): Promise<DetectedPattern[]> => {
  const patterns: DetectedPattern[] = [];

  // Sentiment shift detection
  const sentimentPattern = detectSentimentShift(scanResults);
  if (sentimentPattern) patterns.push(sentimentPattern);

  // Coordinated attack detection
  const coordinatedPattern = detectCoordinatedAttack(scanResults);
  if (coordinatedPattern) patterns.push(coordinatedPattern);

  // Viral risk assessment
  const viralPattern = detectViralRisk(scanResults);
  if (viralPattern) patterns.push(viralPattern);

  // Platform migration patterns
  const migrationPattern = detectPlatformMigration(scanResults);
  if (migrationPattern) patterns.push(migrationPattern);

  // Influencer involvement
  const influencerPattern = detectInfluencerInvolvement(narratives);
  if (influencerPattern) patterns.push(influencerPattern);

  return patterns;
};

const detectSentimentShift = (scanResults: any[]): DetectedPattern | null => {
  if (scanResults.length < 10) return null;

  const recent = scanResults.slice(0, Math.floor(scanResults.length / 2));
  const older = scanResults.slice(Math.floor(scanResults.length / 2));

  const recentAvg = recent.reduce((sum, r) => sum + (r.sentiment || 0), 0) / recent.length;
  const olderAvg = older.reduce((sum, r) => sum + (r.sentiment || 0), 0) / older.length;

  const shift = Math.abs(recentAvg - olderAvg);

  if (shift > 0.3) {
    return {
      type: 'sentiment_shift',
      description: `Detected ${shift > 0 ? 'positive' : 'negative'} sentiment shift of ${(shift * 100).toFixed(1)}%`,
      confidence: Math.min(0.95, shift * 2),
      timeframe: '7 days',
      impact: shift > 0.5 ? 'high' : 'medium',
      sources: [...new Set(recent.map(r => r.platform))].filter(Boolean)
    };
  }

  return null;
};

const detectCoordinatedAttack = (scanResults: any[]): DetectedPattern | null => {
  const timeGroups = new Map<string, any[]>();
  
  scanResults.forEach(result => {
    const hour = new Date(result.created_at).toISOString().slice(0, 13);
    if (!timeGroups.has(hour)) timeGroups.set(hour, []);
    timeGroups.get(hour)!.push(result);
  });

  for (const [time, results] of timeGroups) {
    if (results.length >= 5) {
      const platforms = new Set(results.map(r => r.platform));
      if (platforms.size >= 2) {
        return {
          type: 'coordinated_attack',
          description: `Detected ${results.length} mentions across ${platforms.size} platforms within 1 hour`,
          confidence: Math.min(0.9, results.length * 0.15),
          timeframe: '1 hour',
          impact: 'high',
          sources: Array.from(platforms)
        };
      }
    }
  }

  return null;
};

const detectViralRisk = (scanResults: any[]): DetectedPattern | null => {
  const last24h = scanResults.filter(r => 
    new Date(r.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  if (last24h.length > 20) {
    const engagementSum = last24h.reduce((sum, r) => sum + (r.potential_reach || 0), 0);
    const avgEngagement = engagementSum / last24h.length;

    if (avgEngagement > 1000) {
      return {
        type: 'viral_risk',
        description: `High volume activity detected: ${last24h.length} mentions with avg reach of ${avgEngagement.toLocaleString()}`,
        confidence: Math.min(0.85, last24h.length * 0.03),
        timeframe: '24 hours',
        impact: 'high',
        sources: [...new Set(last24h.map(r => r.platform))].filter(Boolean)
      };
    }
  }

  return null;
};

const detectPlatformMigration = (scanResults: any[]): DetectedPattern | null => {
  const platformCounts = new Map<string, number>();
  scanResults.forEach(r => {
    if (r.platform) {
      platformCounts.set(r.platform, (platformCounts.get(r.platform) || 0) + 1);
    }
  });

  const dominantPlatform = Array.from(platformCounts.entries())
    .sort((a, b) => b[1] - a[1])[0];

  if (dominantPlatform && dominantPlatform[1] > scanResults.length * 0.6) {
    return {
      type: 'platform_migration',
      description: `Activity concentrated on ${dominantPlatform[0]} (${((dominantPlatform[1] / scanResults.length) * 100).toFixed(1)}% of mentions)`,
      confidence: 0.7,
      timeframe: '30 days',
      impact: 'medium',
      sources: [dominantPlatform[0]]
    };
  }

  return null;
};

const detectInfluencerInvolvement = (narratives: any[]): DetectedPattern | null => {
  const highInfluence = narratives.filter(n => 
    n.influence_score && n.influence_score > 0.7
  );

  if (highInfluence.length > 0) {
    return {
      type: 'influencer_involvement',
      description: `${highInfluence.length} high-influence narrative clusters detected`,
      confidence: 0.8,
      timeframe: 'ongoing',
      impact: 'high',
      sources: [...new Set(highInfluence.map(n => n.source_platform))].filter(Boolean)
    };
  }

  return null;
};

const generateInsights = (patterns: DetectedPattern[], scanResults: any[]): string[] => {
  const insights: string[] = [];

  if (patterns.length === 0) {
    insights.push('No significant patterns detected in current timeframe');
    insights.push('Entity appears to have stable online presence');
  } else {
    insights.push(`${patterns.length} significant patterns identified requiring attention`);
    
    const highImpact = patterns.filter(p => p.impact === 'high');
    if (highImpact.length > 0) {
      insights.push(`${highImpact.length} high-impact patterns require immediate action`);
    }

    const platforms = [...new Set(patterns.flatMap(p => p.sources))];
    insights.push(`Activity spans ${platforms.length} platforms: ${platforms.join(', ')}`);
  }

  return insights;
};

const generateRecommendations = (patterns: DetectedPattern[]): string[] => {
  const recommendations: string[] = [];

  patterns.forEach(pattern => {
    switch (pattern.type) {
      case 'sentiment_shift':
        recommendations.push('Deploy sentiment monitoring and counter-narrative strategy');
        break;
      case 'coordinated_attack':
        recommendations.push('Activate rapid response protocols and platform reporting');
        break;
      case 'viral_risk':
        recommendations.push('Prepare crisis communication plan and positive content saturation');
        break;
      case 'platform_migration':
        recommendations.push('Increase monitoring on concentrated platform and diversify presence');
        break;
      case 'influencer_involvement':
        recommendations.push('Engage influencer outreach team and monitor amplification patterns');
        break;
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('Continue regular monitoring and maintain current strategy');
  }

  return recommendations;
};

const calculateOverallConfidence = (patterns: DetectedPattern[]): number => {
  if (patterns.length === 0) return 0.9; // High confidence in "no patterns"
  
  const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
  return Math.round(avgConfidence * 100) / 100;
};

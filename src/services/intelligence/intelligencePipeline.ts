
import { supabase } from '@/integrations/supabase/client';
import { CIALevelScanner } from './ciaLevelScanner';
import { EntityFingerprintMatcher } from './entityFingerprint';

export interface IntelligencePipelineResult {
  entityScan: {
    threats_detected: number;
    entities_scanned: string[];
    scan_results: any[];
  };
  ciaPrecision: {
    precision_score: number;
    false_positives_blocked: number;
    verified_results: any[];
  };
  counterNarratives: {
    narratives_generated: number;
    strategies: any[];
  };
  articleGeneration: {
    articles_suggested: number;
    content_templates: any[];
  };
  performance: {
    total_processing_time: number;
    pipeline_efficiency: number;
  };
  deployment: {
    ready_for_deployment: boolean;
    suggested_actions: string[];
  };
}

export class IntelligencePipeline {
  private static results: IntelligencePipelineResult | null = null;

  static async executeFullPipeline(entityName: string): Promise<IntelligencePipelineResult> {
    const startTime = Date.now();
    console.log(`🔥 Intelligence Pipeline: Starting coordinated analysis for "${entityName}"`);

    // STEP 1: Entity Scan
    console.log('📊 Step 1: Entity Threat Detection');
    const entityScanResults = await this.performEntityScan(entityName);

    // STEP 2: CIA Precision Filtering
    console.log('🎯 Step 2: CIA-Level Precision Filtering');
    const ciaPrecisionResults = await this.applyCIAPrecision(entityName, entityScanResults.scan_results);

    // STEP 3: Counter Narrative Generation (based on verified threats)
    console.log('📝 Step 3: Strategic Counter-Narrative Generation');
    const counterNarrativeResults = await this.generateCounterNarratives(entityName, ciaPrecisionResults.verified_results);

    // STEP 4: Article Generation Suggestions
    console.log('📄 Step 4: Article Generation Strategy');
    const articleResults = await this.generateArticleSuggestions(entityName, counterNarrativeResults.strategies);

    // STEP 5: Performance Analysis
    const endTime = Date.now();
    const performanceResults = this.analyzePerformance(startTime, endTime, entityScanResults, ciaPrecisionResults);

    // STEP 6: Deployment Readiness
    const deploymentResults = this.assessDeploymentReadiness(ciaPrecisionResults, counterNarrativeResults, articleResults);

    const pipelineResult: IntelligencePipelineResult = {
      entityScan: entityScanResults,
      ciaPrecision: ciaPrecisionResults,
      counterNarratives: counterNarrativeResults,
      articleGeneration: articleResults,
      performance: performanceResults,
      deployment: deploymentResults
    };

    this.results = pipelineResult;
    
    // Store pipeline results for cross-component access
    await this.storePipelineResults(entityName, pipelineResult);

    console.log('✅ Intelligence Pipeline: Complete coordinated analysis finished');
    return pipelineResult;
  }

  private static async performEntityScan(entityName: string) {
    try {
      // Get existing scan results
      const { data: scanResults } = await supabase
        .from('scan_results')
        .select('*')
        .ilike('entity_name', `%${entityName}%`)
        .order('created_at', { ascending: false })
        .limit(50);

      const threats = scanResults || [];
      const highThreatCount = threats.filter(t => t.severity === 'high').length;
      const mediumThreatCount = threats.filter(t => t.severity === 'medium').length;

      return {
        threats_detected: threats.length,
        entities_scanned: [entityName],
        scan_results: threats,
        high_threat_count: highThreatCount,
        medium_threat_count: mediumThreatCount
      };
    } catch (error) {
      console.error('Entity scan failed:', error);
      return { threats_detected: 0, entities_scanned: [], scan_results: [] };
    }
  }

  private static async applyCIAPrecision(entityName: string, scanResults: any[]) {
    try {
      const entityFingerprint = EntityFingerprintMatcher.createFingerprint(entityName);
      let verifiedResults = [];
      let falsePositivesBlocked = 0;
      let totalPrecisionScore = 0;

      for (const result of scanResults) {
        const content = result.content || '';
        const title = result.title || '';
        
        const matchResult = EntityFingerprintMatcher.matchEntity(content, title, entityFingerprint);
        
        if (matchResult.match) {
          verifiedResults.push({
            ...result,
            cia_verified: true,
            precision_score: matchResult.confidence,
            matched_on: matchResult.matched_on
          });
          totalPrecisionScore += matchResult.confidence;
        } else {
          falsePositivesBlocked++;
        }
      }

      const avgPrecisionScore = verifiedResults.length > 0 ? totalPrecisionScore / verifiedResults.length : 0;

      return {
        precision_score: avgPrecisionScore,
        false_positives_blocked: falsePositivesBlocked,
        verified_results: verifiedResults,
        total_processed: scanResults.length
      };
    } catch (error) {
      console.error('CIA precision failed:', error);
      return { precision_score: 0, false_positives_blocked: 0, verified_results: [] };
    }
  }

  private static async generateCounterNarratives(entityName: string, verifiedResults: any[]) {
    const strategies = [];
    
    // Analyze threat patterns to generate targeted strategies
    const threatTypes = verifiedResults.reduce((acc, result) => {
      const type = result.threat_type || 'general';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const platforms = verifiedResults.reduce((acc, result) => {
      const platform = result.platform || 'unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});

    // Generate strategies based on detected patterns
    Object.entries(threatTypes).forEach(([type, count]) => {
      strategies.push({
        id: `strategy-${type}-${Date.now()}`,
        threat_type: type,
        recommended_approach: this.getRecommendedApproach(type as string),
        target_platforms: Object.keys(platforms),
        urgency: count > 3 ? 'high' : count > 1 ? 'medium' : 'low',
        suggested_tone: this.getSuggestedTone(type as string),
        content_themes: this.getContentThemes(entityName, type as string)
      });
    });

    // Store generated strategies
    if (strategies.length > 0) {
      try {
        await supabase.from('counter_narratives').insert(
          strategies.map(strategy => ({
            entity_name: entityName,
            message: `Strategic response for ${strategy.threat_type} threats`,
            platform: strategy.target_platforms[0] || 'general',
            tone: strategy.suggested_tone,
            status: 'pending',
            strategy_data: strategy
          }))
        );
      } catch (error) {
        console.error('Failed to store counter narratives:', error);
      }
    }

    return {
      narratives_generated: strategies.length,
      strategies: strategies
    };
  }

  private static async generateArticleSuggestions(entityName: string, strategies: any[]) {
    const articleSuggestions = [];

    strategies.forEach(strategy => {
      const suggestions = this.generateArticleTemplates(entityName, strategy);
      articleSuggestions.push(...suggestions);
    });

    return {
      articles_suggested: articleSuggestions.length,
      content_templates: articleSuggestions
    };
  }

  private static analyzePerformance(startTime: number, endTime: number, entityScan: any, ciaPrecision: any) {
    const totalTime = endTime - startTime;
    const threatsProcessed = entityScan.threats_detected;
    const precisionRate = ciaPrecision.total_processed > 0 ? 
      (ciaPrecision.verified_results.length / ciaPrecision.total_processed) * 100 : 0;

    return {
      total_processing_time: totalTime,
      pipeline_efficiency: Math.min(100, Math.max(0, 100 - (totalTime / 1000) + precisionRate)),
      threats_per_second: totalTime > 0 ? (threatsProcessed / (totalTime / 1000)) : 0,
      precision_rate: precisionRate
    };
  }

  private static assessDeploymentReadiness(ciaPrecision: any, counterNarratives: any, articles: any) {
    const suggestions = [];
    let readyForDeployment = true;

    if (ciaPrecision.precision_score < 0.7) {
      suggestions.push('Improve entity matching precision before deployment');
      readyForDeployment = false;
    }

    if (counterNarratives.narratives_generated === 0) {
      suggestions.push('Generate counter-narrative strategies');
      readyForDeployment = false;
    }

    if (articles.articles_suggested === 0) {
      suggestions.push('Create article content templates');
    }

    if (readyForDeployment) {
      suggestions.push('System ready for deployment');
      suggestions.push('Monitor performance metrics');
      suggestions.push('Review generated content before publishing');
    }

    return {
      ready_for_deployment: readyForDeployment,
      suggested_actions: suggestions
    };
  }

  private static async storePipelineResults(entityName: string, results: IntelligencePipelineResult) {
    try {
      await supabase.from('intelligence_pipeline_results').upsert({
        entity_name: entityName,
        pipeline_data: results,
        executed_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to store pipeline results:', error);
    }
  }

  private static getRecommendedApproach(threatType: string): string {
    const approaches = {
      'reputation': 'Proactive reputation management',
      'legal': 'Legal compliance and transparency',
      'social': 'Community engagement and dialogue',
      'media': 'Strategic media relations',
      'default': 'Balanced response strategy'
    };
    return approaches[threatType] || approaches.default;
  }

  private static getSuggestedTone(threatType: string): string {
    const tones = {
      'reputation': 'professional',
      'legal': 'formal',
      'social': 'empathetic',
      'media': 'confident',
      'default': 'balanced'
    };
    return tones[threatType] || tones.default;
  }

  private static getContentThemes(entityName: string, threatType: string): string[] {
    const baseThemes = [
      'Transparency and accountability',
      'Commitment to improvement',
      'Value to community'
    ];
    
    const specificThemes = {
      'reputation': ['Professional achievements', 'Client testimonials', 'Industry recognition'],
      'legal': ['Compliance measures', 'Legal transparency', 'Due process'],
      'social': ['Community engagement', 'Social responsibility', 'Dialogue and listening'],
      'media': ['Factual clarification', 'Context provision', 'Expert perspectives']
    };

    return [...baseThemes, ...(specificThemes[threatType] || [])];
  }

  private static generateArticleTemplates(entityName: string, strategy: any) {
    return [
      {
        id: `template-${strategy.id}`,
        title: `Response Strategy: ${strategy.recommended_approach}`,
        content_type: 'blog_post',
        target_audience: 'general_public',
        key_messages: strategy.content_themes,
        suggested_length: '800-1200 words',
        urgency: strategy.urgency,
        platforms: strategy.target_platforms
      },
      {
        id: `template-social-${strategy.id}`,
        title: `Social Media Response Pack`,
        content_type: 'social_media',
        target_audience: 'social_followers',
        key_messages: strategy.content_themes.slice(0, 2),
        suggested_length: '280 characters',
        urgency: strategy.urgency,
        platforms: ['twitter', 'facebook', 'linkedin']
      }
    ];
  }

  static getLatestResults(): IntelligencePipelineResult | null {
    return this.results;
  }
}

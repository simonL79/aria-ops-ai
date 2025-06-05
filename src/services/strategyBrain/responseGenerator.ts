import { supabase } from '@/integrations/supabase/client';
import { DetectedPattern } from './patternAnalyzer';

export interface ResponseStrategy {
  id: string;
  type: 'defensive' | 'proactive' | 'counter_narrative' | 'legal' | 'engagement';
  title: string;
  description: string;
  actions: ResponseAction[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeframe: string;
  resources: string[];
}

export interface ResponseAction {
  action: string;
  platform?: string;
  timeline: string;
  responsible: string;
  kpi: string;
}

export const generateResponseStrategies = async (
  entityName: string,
  patterns: DetectedPattern[]
): Promise<ResponseStrategy[]> => {
  try {
    console.log(`🎯 Strategy Brain: Generating response strategies for ${entityName}`);
    
    const strategies: ResponseStrategy[] = [];

    // Generate strategies based on detected patterns
    for (const pattern of patterns) {
      const strategy = await generateStrategyForPattern(pattern, entityName);
      if (strategy) strategies.push(strategy);
    }

    // Add baseline monitoring strategy if no patterns
    if (patterns.length === 0) {
      strategies.push(generateBaselineStrategy(entityName));
    }

    // Store strategies in database for tracking
    await storeStrategies(entityName, strategies);

    return strategies;

  } catch (error) {
    console.error('Response generation failed:', error);
    throw new Error('Failed to generate response strategies');
  }
};

export const generateStrategy = async (
  entityName: string,
  threatType: string,
  priority: 'low' | 'medium' | 'high' | 'critical'
): Promise<ResponseStrategy> => {
  const strategyId = `strategy-${Date.now()}`;
  
  return {
    id: strategyId,
    type: 'defensive',
    title: `${threatType} Response Strategy`,
    description: `Automated response strategy for ${threatType} threat affecting ${entityName}`,
    priority,
    timeframe: priority === 'critical' ? '1-4 hours' : '24-48 hours',
    resources: ['Content Team', 'Social Media Manager', 'Analytics Team'],
    actions: [
      {
        action: 'Monitor threat evolution',
        timeline: '1 hour',
        responsible: 'Analytics Team',
        kpi: 'Threat status tracking'
      },
      {
        action: 'Deploy counter-narrative content',
        timeline: priority === 'critical' ? '2 hours' : '4 hours',
        responsible: 'Content Team',
        kpi: 'Positive sentiment increase'
      }
    ]
  };
};

const generateStrategyForPattern = async (
  pattern: DetectedPattern,
  entityName: string
): Promise<ResponseStrategy | null> => {
  const strategyId = `${pattern.type}-${Date.now()}`;

  switch (pattern.type) {
    case 'sentiment_shift':
      return {
        id: strategyId,
        type: 'counter_narrative',
        title: 'Sentiment Recovery Campaign',
        description: `Address detected sentiment shift through targeted positive content deployment`,
        priority: pattern.impact === 'high' ? 'critical' : 'high',
        timeframe: '48-72 hours',
        resources: ['Content Team', 'Social Media Manager', 'PR Team'],
        actions: [
          {
            action: 'Deploy positive content across affected platforms',
            platform: pattern.sources.join(', '),
            timeline: '6 hours',
            responsible: 'Content Team',
            kpi: 'Sentiment score improvement'
          },
          {
            action: 'Engage with positive mentions and testimonials',
            timeline: '12 hours',
            responsible: 'Social Media Manager',
            kpi: 'Engagement rate increase'
          },
          {
            action: 'Monitor sentiment metrics hourly',
            timeline: 'Ongoing',
            responsible: 'Analytics Team',
            kpi: 'Sentiment tracking'
          }
        ]
      };

    case 'coordinated_attack':
      return {
        id: strategyId,
        type: 'defensive',
        title: 'Coordinated Attack Response',
        description: `Counter coordinated attack through platform reporting and rapid response`,
        priority: 'critical',
        timeframe: '2-6 hours',
        resources: ['Legal Team', 'Platform Relations', 'Crisis Response'],
        actions: [
          {
            action: 'File platform violation reports',
            platform: pattern.sources.join(', '),
            timeline: '1 hour',
            responsible: 'Platform Relations',
            kpi: 'Reports filed'
          },
          {
            action: 'Activate crisis communication protocols',
            timeline: '2 hours',
            responsible: 'Crisis Response',
            kpi: 'Response deployment'
          },
          {
            action: 'Document attack for legal analysis',
            timeline: '4 hours',
            responsible: 'Legal Team',
            kpi: 'Evidence collection'
          }
        ]
      };

    case 'viral_risk':
      return {
        id: strategyId,
        type: 'proactive',
        title: 'Viral Risk Mitigation',
        description: `Proactive measures to control viral spread and narrative`,
        priority: 'critical',
        timeframe: '1-4 hours',
        resources: ['Crisis Team', 'Influencer Network', 'Content Team'],
        actions: [
          {
            action: 'Activate influencer network for positive amplification',
            timeline: '30 minutes',
            responsible: 'Influencer Relations',
            kpi: 'Positive mention velocity'
          },
          {
            action: 'Deploy counter-narrative content',
            timeline: '1 hour',
            responsible: 'Content Team',
            kpi: 'Content reach and engagement'
          },
          {
            action: 'Monitor amplification metrics',
            timeline: 'Real-time',
            responsible: 'Analytics Team',
            kpi: 'Viral coefficient tracking'
          }
        ]
      };

    case 'influencer_involvement':
      return {
        id: strategyId,
        type: 'engagement',
        title: 'Influencer Engagement Strategy',
        description: `Strategic engagement with involved influencers`,
        priority: pattern.impact === 'high' ? 'high' : 'medium',
        timeframe: '24-48 hours',
        resources: ['Influencer Relations', 'PR Team', 'Legal Counsel'],
        actions: [
          {
            action: 'Identify and categorize involved influencers',
            timeline: '4 hours',
            responsible: 'Research Team',
            kpi: 'Influencer mapping complete'
          },
          {
            action: 'Reach out to positive influencers',
            timeline: '8 hours',
            responsible: 'Influencer Relations',
            kpi: 'Positive responses'
          },
          {
            action: 'Monitor influencer sentiment shifts',
            timeline: 'Ongoing',
            responsible: 'Analytics Team',
            kpi: 'Sentiment tracking'
          }
        ]
      };

    default:
      return null;
  }
};

const generateBaselineStrategy = (entityName: string): ResponseStrategy => {
  return {
    id: `baseline-${Date.now()}`,
    type: 'proactive',
    title: 'Baseline Monitoring & Maintenance',
    description: 'Standard monitoring and positive presence maintenance',
    priority: 'low',
    timeframe: 'Ongoing',
    resources: ['Monitoring Team', 'Content Team'],
    actions: [
      {
        action: 'Continue regular content publishing',
        timeline: 'Daily',
        responsible: 'Content Team',
        kpi: 'Content consistency'
      },
      {
        action: 'Monitor brand mentions across platforms',
        timeline: 'Continuous',
        responsible: 'Monitoring Team',
        kpi: 'Coverage completeness'
      },
      {
        action: 'Engage with positive community interactions',
        timeline: 'Daily',
        responsible: 'Community Manager',
        kpi: 'Engagement rate'
      }
    ]
  };
};

const storeStrategies = async (entityName: string, strategies: ResponseStrategy[]): Promise<void> => {
  try {
    const { error } = await supabase
      .from('strategy_responses')
      .insert(
        strategies.map(strategy => ({
          entity_name: entityName,
          strategy_id: strategy.id,
          strategy_type: strategy.type,
          title: strategy.title,
          description: strategy.description,
          priority: strategy.priority,
          timeframe: strategy.timeframe,
          actions: strategy.actions as any, // Cast to any to resolve Json type compatibility
          resources: strategy.resources,
          status: 'pending'
        }))
      );

    if (error) {
      console.error('Failed to store strategies:', error);
    }
  } catch (error) {
    console.error('Strategy storage error:', error);
  }
};

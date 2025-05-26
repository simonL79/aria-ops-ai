
import { callOpenAI } from '@/services/api/openaiClient';
import { toast } from 'sonner';

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  category: 'threat_analysis' | 'response_generation' | 'correlation' | 'simulation';
}

export interface ChainExecution {
  id: string;
  steps: ChainStep[];
  context: Record<string, any>;
  result?: any;
}

export interface ChainStep {
  id: string;
  name: string;
  prompt: string;
  result?: any;
  timestamp: Date;
}

class LangChainOrchestrator {
  private templates: Map<string, PromptTemplate> = new Map();
  
  constructor() {
    this.initializeTemplates();
  }
  
  private initializeTemplates() {
    const templates: PromptTemplate[] = [
      {
        id: 'threat_escalation_analysis',
        name: 'Threat Escalation Analysis',
        template: `Analyze the following threat content for escalation potential:

Content: "{content}"
Platform: "{platform}"
Context: "{context}"

Provide analysis in this format:
ESCALATION_LIKELIHOOD: [LOW|MEDIUM|HIGH]
AMPLIFICATION_VECTORS: [list potential spread mechanisms]
RECOMMENDED_RESPONSE_TIMEFRAME: [IMMEDIATE|HOURS|DAYS]
RISK_FACTORS: [key factors increasing risk]
MITIGATION_STRATEGIES: [specific actions to take]`,
        variables: ['content', 'platform', 'context'],
        category: 'threat_analysis'
      },
      {
        id: 'threat_actor_profiling',
        name: 'Threat Actor Psychological Profile',
        template: `Create a psychological profile of the threat actor based on this content:

Content: "{content}"
Historical Context: "{history}"

Analyze and provide:
PSYCHOLOGICAL_PROFILE:
- Motivation: [primary drivers]
- Communication Style: [tone, language patterns]
- Escalation Tendency: [behavioral patterns]
- Vulnerability Points: [potential de-escalation approaches]

TACTICAL_ASSESSMENT:
- Sophistication Level: [1-10]
- Resource Access: [estimated capabilities]
- Network Size: [influence reach]
- Response Predictability: [behavioral consistency]`,
        variables: ['content', 'history'],
        category: 'threat_analysis'
      },
      {
        id: 'strategic_response_generator',
        name: 'Strategic Response Generator',
        template: `Generate strategic response options for this threat scenario:

Threat Content: "{content}"
Actor Profile: "{actorProfile}"
Business Context: "{businessContext}"
Escalation Risk: "{escalationRisk}"

Provide 3 strategic response options:

OPTION 1 - ENGAGE:
- Approach: [direct engagement strategy]
- Messaging: [key points to address]
- Risks: [potential downsides]
- Success Probability: [percentage]

OPTION 2 - DE-ESCALATE:
- Approach: [de-escalation tactics]
- Messaging: [conciliatory language]
- Risks: [potential downsides]
- Success Probability: [percentage]

OPTION 3 - MONITOR:
- Approach: [passive monitoring strategy]
- Triggers: [escalation indicators to watch]
- Risks: [potential downsides]
- Success Probability: [percentage]

RECOMMENDED: [which option and why]`,
        variables: ['content', 'actorProfile', 'businessContext', 'escalationRisk'],
        category: 'response_generation'
      },
      {
        id: 'threat_correlation_analysis',
        name: 'Threat Correlation Analysis',
        template: `Analyze these threats for correlations and patterns:

Threats: {threats}

Identify:
CORRELATION_PATTERNS:
- Language Similarity: [shared phrases, terminology]
- Timing Patterns: [coordinated posting times]
- Actor Connections: [username patterns, behavioral similarities]
- Platform Distribution: [cross-platform coordination]

THREAT_CLUSTERING:
- Primary Cluster: [main threat group characteristics]
- Secondary Clusters: [additional groupings]
- Outliers: [standalone threats]

COORDINATION_INDICATORS:
- Evidence Level: [LOW|MEDIUM|HIGH]
- Coordination Type: [organic, managed, bot-assisted]
- Command Structure: [centralized, distributed, ad-hoc]

RECOMMENDED_ACTIONS:
- Investigation Priority: [which clusters to focus on]
- Response Strategy: [coordinated vs individual responses]`,
        variables: ['threats'],
        category: 'correlation'
      }
    ];
    
    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }
  
  async executeChain(templateId: string, variables: Record<string, any>): Promise<ChainExecution> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    const executionId = `exec_${Date.now()}`;
    const prompt = this.interpolateTemplate(template.template, variables);
    
    const step: ChainStep = {
      id: `step_${Date.now()}`,
      name: template.name,
      prompt,
      timestamp: new Date()
    };
    
    try {
      const result = await callOpenAI({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an elite threat intelligence analyst with expertise in digital reputation management, psychological profiling, and strategic response planning.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      });
      
      step.result = result.choices[0].message.content;
      
      const execution: ChainExecution = {
        id: executionId,
        steps: [step],
        context: variables,
        result: step.result
      };
      
      return execution;
      
    } catch (error) {
      console.error('Chain execution failed:', error);
      toast.error('AI analysis failed');
      throw error;
    }
  }
  
  private interpolateTemplate(template: string, variables: Record<string, any>): string {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    });
    
    return result;
  }
  
  async executeMultiStepChain(steps: { templateId: string; variables: Record<string, any> }[]): Promise<ChainExecution> {
    const executionId = `multi_exec_${Date.now()}`;
    const chainSteps: ChainStep[] = [];
    let context: Record<string, any> = {};
    
    for (const stepConfig of steps) {
      const execution = await this.executeChain(stepConfig.templateId, {
        ...stepConfig.variables,
        ...context
      });
      
      chainSteps.push(...execution.steps);
      context = { ...context, [`step_${chainSteps.length}_result`]: execution.result };
    }
    
    return {
      id: executionId,
      steps: chainSteps,
      context,
      result: context
    };
  }
  
  getAvailableTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }
}

export const langchainOrchestrator = new LangChainOrchestrator();

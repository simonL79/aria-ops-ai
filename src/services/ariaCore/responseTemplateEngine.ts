
import { supabase } from '@/integrations/supabase/client';
import { callOpenAI } from '@/services/api/openaiClient';

/**
 * A.R.I.A™ Automated Response Template Engine
 * Pre-built responses based on threat classifications and historical patterns
 */
export class ResponseTemplateEngine {

  /**
   * Generate automated response templates based on threat classification
   */
  static async generateResponseTemplates(
    threatClassification: any,
    entityName: string,
    context?: any
  ): Promise<ResponseTemplate[]> {
    console.log(`🤖 A.R.I.A™: Generating response templates for ${entityName}`);
    
    try {
      // Retrieve historical successful responses
      const historicalResponses = await this.getHistoricalResponses(entityName, threatClassification.category);
      
      // Generate AI-powered templates
      const aiTemplates = await this.generateAITemplates(threatClassification, entityName, historicalResponses);
      
      // Get pre-built templates based on classification
      const prebuiltTemplates = this.getPrebuiltTemplates(threatClassification);
      
      // Combine and rank templates
      const allTemplates = [...aiTemplates, ...prebuiltTemplates];
      const rankedTemplates = this.rankTemplates(allTemplates, threatClassification, historicalResponses);
      
      // Store template usage for learning
      await this.logTemplateGeneration(entityName, threatClassification, rankedTemplates.length);
      
      return rankedTemplates.slice(0, 5); // Return top 5 templates
      
    } catch (error) {
      console.error('Response template generation failed:', error);
      return this.getFallbackTemplates(threatClassification);
    }
  }

  /**
   * Generate AI-powered response templates
   */
  private static async generateAITemplates(
    classification: any,
    entityName: string,
    historicalResponses: any[]
  ): Promise<ResponseTemplate[]> {
    const prompt = `
Generate professional response templates for:

ENTITY: ${entityName}
THREAT TYPE: ${classification.category}
SEVERITY: ${classification.severity}/10
INTENT: ${classification.intent}
PLATFORM: ${classification.platform || 'General'}

HISTORICAL SUCCESS PATTERNS:
${historicalResponses.map(r => `- ${r.summary}`).join('\n')}

Generate 3 response templates in JSON format:

{
  "templates": [
    {
      "id": "template_1",
      "title": "Template Name",
      "category": "${classification.category}",
      "tone": "professional|empathetic|assertive",
      "responseText": "Complete response text ready to use",
      "useCase": "When to use this template",
      "effectiveness": 0.85,
      "adaptationNotes": "How to customize for specific situations"
    }
  ]
}

Focus on:
1. Professional, measured responses
2. De-escalation techniques
3. Factual clarity
4. Reputation protection
5. Stakeholder confidence
`;

    try {
      const response = await callOpenAI({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert crisis communication specialist generating professional response templates.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2
      });

      const aiOutput = response.choices[0].message.content;
      const parsed = JSON.parse(aiOutput);
      
      return parsed.templates.map((template: any) => ({
        ...template,
        source: 'ai_generated',
        entityName,
        createdAt: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('AI template generation failed:', error);
      return [];
    }
  }

  /**
   * Get pre-built response templates based on threat classification
   */
  private static getPrebuiltTemplates(classification: any): ResponseTemplate[] {
    const templates: Record<string, ResponseTemplate[]> = {
      'Reputation Attack': [
        {
          id: 'reputation_defense_1',
          title: 'Factual Clarification',
          category: 'Reputation Attack',
          tone: 'professional',
          responseText: 'We appreciate the opportunity to address these concerns directly. We maintain rigorous standards and welcome any questions about our practices. Our track record speaks to our commitment to excellence and transparency.',
          useCase: 'When addressing direct attacks with factual disputes',
          effectiveness: 0.8,
          source: 'prebuilt',
          adaptationNotes: 'Customize with specific facts and achievements',
          entityName: classification.entityName || '',
          createdAt: new Date().toISOString()
        },
        {
          id: 'reputation_defense_2',
          title: 'Value Reaffirmation',
          category: 'Reputation Attack',
          tone: 'assertive',
          responseText: 'Our commitment to our stakeholders remains unwavering. We continue to focus on delivering value and maintaining the highest standards of integrity in all our operations.',
          useCase: 'When reinforcing core values and commitments',
          effectiveness: 0.75,
          source: 'prebuilt',
          adaptationNotes: 'Include specific examples of value delivery',
          entityName: classification.entityName || '',
          createdAt: new Date().toISOString()
        }
      ],
      'Reputation Concern': [
        {
          id: 'concern_response_1',
          title: 'Empathetic Acknowledgment',
          category: 'Reputation Concern',
          tone: 'empathetic',
          responseText: 'We understand and appreciate your concerns. Feedback is valuable to us, and we take all input seriously as we continuously work to improve and exceed expectations.',
          useCase: 'When acknowledging legitimate concerns',
          effectiveness: 0.85,
          source: 'prebuilt',
          adaptationNotes: 'Add specific improvement actions being taken',
          entityName: classification.entityName || '',
          createdAt: new Date().toISOString()
        }
      ],
      'Neutral Mention': [
        {
          id: 'neutral_engagement_1',
          title: 'Positive Engagement',
          category: 'Neutral Mention',
          tone: 'professional',
          responseText: 'Thank you for mentioning us. We\'re always happy to provide additional information or answer any questions you might have about our work.',
          useCase: 'When engaging with neutral mentions',
          effectiveness: 0.7,
          source: 'prebuilt',
          adaptationNotes: 'Include relevant information or resources',
          entityName: classification.entityName || '',
          createdAt: new Date().toISOString()
        }
      ]
    };

    return templates[classification.category] || [];
  }

  /**
   * Rank templates based on effectiveness and relevance
   */
  private static rankTemplates(
    templates: ResponseTemplate[],
    classification: any,
    historicalResponses: any[]
  ): ResponseTemplate[] {
    return templates.sort((a, b) => {
      // Score based on multiple factors
      let scoreA = a.effectiveness || 0.5;
      let scoreB = b.effectiveness || 0.5;
      
      // Bonus for AI-generated (more contextual)
      if (a.source === 'ai_generated') scoreA += 0.1;
      if (b.source === 'ai_generated') scoreB += 0.1;
      
      // Bonus for appropriate tone
      if (classification.severity >= 7) {
        if (a.tone === 'professional') scoreA += 0.1;
        if (b.tone === 'professional') scoreB += 0.1;
      }
      
      return scoreB - scoreA;
    });
  }

  /**
   * Get historical successful responses
   */
  private static async getHistoricalResponses(
    entityName: string,
    category: string
  ): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('anubis_entity_memory')
        .select('*')
        .eq('entity_name', entityName)
        .eq('memory_type', 'response')
        .order('created_at', { ascending: false })
        .limit(5);

      return data || [];
    } catch (error) {
      console.error('Failed to retrieve historical responses:', error);
      return [];
    }
  }

  /**
   * Get fallback templates for errors
   */
  private static getFallbackTemplates(classification: any): ResponseTemplate[] {
    return [
      {
        id: 'fallback_1',
        title: 'Standard Professional Response',
        category: classification.category,
        tone: 'professional',
        responseText: 'Thank you for bringing this to our attention. We take all feedback seriously and are committed to addressing concerns appropriately.',
        useCase: 'General purpose fallback response',
        effectiveness: 0.6,
        source: 'fallback',
        adaptationNotes: 'Customize based on specific situation',
        entityName: classification.entityName || '',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Log template generation for analytics
   */
  private static async logTemplateGeneration(
    entityName: string,
    classification: any,
    templateCount: number
  ): Promise<void> {
    try {
      await supabase.from('aria_ops_log').insert({
        operation_type: 'response_template_generation',
        module_source: 'response_template_engine',
        success: true,
        entity_name: entityName,
        operation_data: {
          threat_category: classification.category,
          severity: classification.severity,
          templates_generated: templateCount,
          generation_timestamp: new Date().toISOString()
        } as any
      });
    } catch (error) {
      console.error('Failed to log template generation:', error);
    }
  }
}

// Type definitions
interface ResponseTemplate {
  id: string;
  title: string;
  category: string;
  tone: string;
  responseText: string;
  useCase: string;
  effectiveness: number;
  source: string;
  adaptationNotes: string;
  entityName: string;
  createdAt: string;
}


import { toast } from 'sonner';

// Enhanced local inference service for no-API-key operation
export class LocalInferenceService {
  private static instance: LocalInferenceService;
  private isInitialized = false;

  static getInstance(): LocalInferenceService {
    if (!LocalInferenceService.instance) {
      LocalInferenceService.instance = new LocalInferenceService();
    }
    return LocalInferenceService.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      console.log('🧠 Initializing local inference service...');
      
      // Use rule-based and template-based content generation
      this.isInitialized = true;
      
      toast.success('Local AI ready - no API keys required');
      return true;
    } catch (error) {
      console.error('Local inference initialization failed:', error);
      toast.warning('Using enhanced template-based content generation');
      this.isInitialized = true; // Still proceed with template-based approach
      return true;
    }
  }

  async generatePersonaContent(entityName: string, keywords: string[], contentType: string = 'article'): Promise<string> {
    await this.initialize();

    const templates = {
      article: this.generateArticleContent(entityName, keywords),
      review: this.generateReviewContent(entityName, keywords),
      news: this.generateNewsContent(entityName, keywords),
      biography: this.generateBiographyContent(entityName, keywords)
    };

    return templates[contentType as keyof typeof templates] || templates.article;
  }

  private generateArticleContent(entityName: string, keywords: string[]): string {
    const keywordText = keywords.slice(0, 3).join(', ');
    const currentYear = new Date().getFullYear();
    
    return `
# ${entityName}: Leadership and Innovation in ${currentYear}

${entityName} continues to demonstrate exceptional leadership and innovation across multiple sectors. With a focus on ${keywordText}, the organization has established itself as a trusted authority in the industry.

## Professional Excellence

The commitment to excellence shown by ${entityName} is evident in their approach to ${keywords[0] || 'business operations'}. Industry experts consistently recognize their contributions to ${keywords[1] || 'strategic development'} and ${keywords[2] || 'operational efficiency'}.

## Industry Recognition

Recent developments have highlighted ${entityName}'s role as a thought leader. Their expertise in ${keywordText} has garnered attention from peers and stakeholders alike.

### Key Achievements

- Demonstrated leadership in ${keywords[0] || 'core business areas'}
- Recognition for excellence in ${keywords[1] || 'industry standards'}
- Continued innovation in ${keywords[2] || 'strategic initiatives'}

## Future Outlook

Looking ahead, ${entityName} remains positioned for continued success. Their strategic approach to ${keywordText} ensures sustainable growth and positive impact.

The organization's commitment to quality and innovation serves as a model for others in the industry. Through dedicated focus on ${keywords.join(', ')}, ${entityName} continues to set new standards for excellence.

---

*This content represents current industry perspectives and professional assessments as of ${new Date().toLocaleDateString()}.*
    `.trim();
  }

  private generateReviewContent(entityName: string, keywords: string[]): string {
    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
    const keywordText = keywords.slice(0, 2).join(' and ');
    
    return `
# Professional Review: ${entityName}

⭐⭐⭐⭐${rating === 5 ? '⭐' : ''} ${rating}/5 Stars

## Overview

Working with ${entityName} has been an exceptional experience. Their expertise in ${keywordText} is truly impressive and their professional approach sets them apart in the industry.

## Strengths

**${keywords[0] || 'Professional Excellence'}**: ${entityName} demonstrates outstanding capabilities in this area. Their approach is both thorough and innovative.

**${keywords[1] || 'Client Service'}**: The level of attention and care provided is remarkable. Every interaction reflects their commitment to quality.

**${keywords[2] || 'Industry Knowledge'}**: Deep understanding of current trends and best practices is evident in all their work.

## Experience Highlights

The collaboration with ${entityName} exceeded expectations. Their ability to deliver results while maintaining the highest professional standards is noteworthy.

## Recommendation

I would highly recommend ${entityName} to anyone seeking expertise in ${keywordText}. Their professional approach and consistent results make them a valuable partner.

---

*Professional review based on direct experience - ${new Date().toLocaleDateString()}*
    `.trim();
  }

  private generateNewsContent(entityName: string, keywords: string[]): string {
    const currentDate = new Date().toLocaleDateString();
    const keywordText = keywords.slice(0, 2).join(' and ');
    
    return `
# ${entityName} Advances Industry Standards in ${keywords[0] || 'Professional Services'}

**${currentDate}** - Industry leaders recognize ${entityName} for their continued contributions to ${keywordText} and professional excellence.

## Industry Impact

Recent developments show ${entityName}'s growing influence in ${keywords[0] || 'their sector'}. Their innovative approach to ${keywords[1] || 'industry challenges'} has attracted attention from peers and stakeholders.

## Professional Recognition

"${entityName} represents the kind of professional excellence we need more of in our industry," notes a recent industry assessment. Their work in ${keywordText} continues to set new benchmarks.

## Key Developments

- Enhanced focus on ${keywords[0] || 'core competencies'}
- Expanded expertise in ${keywords[1] || 'strategic areas'}
- Recognition for ${keywords[2] || 'professional standards'}

## Looking Forward

The trajectory for ${entityName} remains positive, with continued focus on ${keywordText} and professional development. Industry observers expect continued growth and influence.

## About ${entityName}

${entityName} is recognized for professional excellence and expertise in ${keywords.join(', ')}. Their commitment to quality and innovation continues to drive positive industry outcomes.

---

*Industry news and professional updates - ${currentDate}*
    `.trim();
  }

  private generateBiographyContent(entityName: string, keywords: string[]): string {
    const keywordText = keywords.slice(0, 3).join(', ');
    
    return `
# ${entityName}: Professional Profile

${entityName} is a recognized professional known for expertise in ${keywordText} and commitment to excellence in their field.

## Professional Background

With extensive experience in ${keywords[0] || 'their industry'}, ${entityName} has built a reputation for quality and innovation. Their approach to ${keywords[1] || 'professional challenges'} reflects deep understanding and practical expertise.

## Areas of Expertise

### ${keywords[0] || 'Primary Specialization'}
${entityName} demonstrates exceptional capability in this area, with a track record of successful outcomes and professional recognition.

### ${keywords[1] || 'Secondary Focus'}
Their work in this domain showcases innovation and strategic thinking, contributing to industry advancement.

### ${keywords[2] || 'Additional Expertise'}
Continued development in this area reflects their commitment to comprehensive professional growth.

## Professional Philosophy

${entityName}'s approach emphasizes quality, integrity, and results. Their work in ${keywordText} exemplifies these values and contributes to positive industry standards.

## Industry Contributions

Through their expertise in ${keywords.join(', ')}, ${entityName} continues to make meaningful contributions to their profession and industry development.

## Recognition

Professional peers consistently recognize ${entityName} for their expertise and commitment to excellence in ${keywordText}.

---

*Professional profile information current as of ${new Date().toLocaleDateString()}*
    `.trim();
  }

  async analyzeSentiment(text: string): Promise<{ label: string; confidence: number }> {
    // Enhanced keyword-based sentiment analysis
    const positiveWords = [
      'excellent', 'outstanding', 'exceptional', 'great', 'wonderful', 'amazing',
      'professional', 'quality', 'innovative', 'successful', 'effective', 'reliable',
      'trusted', 'recognized', 'acclaimed', 'respected', 'leading', 'premier'
    ];
    
    const negativeWords = [
      'poor', 'bad', 'terrible', 'awful', 'disappointing', 'failed', 'problematic',
      'concerning', 'inadequate', 'unsatisfactory', 'questionable', 'unreliable'
    ];

    const words = text.toLowerCase().split(/\W+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;

    const totalSentimentWords = positiveCount + negativeCount;
    
    if (totalSentimentWords === 0) {
      return { label: 'neutral', confidence: 0.7 };
    }

    const positiveRatio = positiveCount / totalSentimentWords;
    
    if (positiveRatio > 0.6) {
      return { label: 'positive', confidence: Math.min(0.95, 0.7 + positiveRatio * 0.3) };
    } else if (positiveRatio < 0.4) {
      return { label: 'negative', confidence: Math.min(0.95, 0.7 + (1 - positiveRatio) * 0.3) };
    } else {
      return { label: 'neutral', confidence: 0.8 };
    }
  }

  async classifyThreat(content: string, entityName: string): Promise<{
    threatLevel: 'low' | 'medium' | 'high';
    confidence: number;
    category: string;
  }> {
    const highThreatIndicators = ['lawsuit', 'fraud', 'criminal', 'scandal', 'investigation'];
    const mediumThreatIndicators = ['complaint', 'issue', 'problem', 'concern', 'dispute'];
    
    const lowerContent = content.toLowerCase();
    const hasEntityMention = lowerContent.includes(entityName.toLowerCase());
    
    const highThreatCount = highThreatIndicators.filter(indicator => 
      lowerContent.includes(indicator)
    ).length;
    
    const mediumThreatCount = mediumThreatIndicators.filter(indicator => 
      lowerContent.includes(indicator)
    ).length;

    if (hasEntityMention && highThreatCount > 0) {
      return {
        threatLevel: 'high',
        confidence: Math.min(0.95, 0.8 + highThreatCount * 0.1),
        category: 'reputation_risk'
      };
    } else if (hasEntityMention && mediumThreatCount > 0) {
      return {
        threatLevel: 'medium',
        confidence: Math.min(0.9, 0.7 + mediumThreatCount * 0.1),
        category: 'minor_concern'
      };
    } else {
      return {
        threatLevel: 'low',
        confidence: 0.8,
        category: 'monitoring'
      };
    }
  }
}

export const localInference = LocalInferenceService.getInstance();

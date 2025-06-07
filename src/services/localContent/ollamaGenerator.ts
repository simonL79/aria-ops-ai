
interface ContentGenerationOptions {
  entityName: string;
  contentType: 'positive_profile' | 'counter_narrative' | 'news_article';
  keywords: string[];
  wordCount?: number;
}

interface GeneratedContent {
  title: string;
  content: string;
  summary: string;
  keywords: string[];
  metadata: {
    generated_at: string;
    word_count: number;
    content_type: string;
  };
}

/**
 * Local Content Generator - Uses template-based content generation
 * No external API dependencies, fully offline capable
 */
export class OllamaContentGenerator {
  
  /**
   * Generate SEO-optimized content locally without external API calls
   */
  static async generateContent(options: ContentGenerationOptions): Promise<GeneratedContent> {
    console.log('🧠 Local Content Generator: Creating content for', options.entityName);
    
    const { entityName, contentType, keywords, wordCount = 800 } = options;
    
    // Generate content using local templates and keyword injection
    const contentTemplate = this.getContentTemplate(contentType);
    const generatedContent = this.populateTemplate(contentTemplate, {
      entityName,
      keywords,
      wordCount
    });
    
    const title = this.generateTitle(entityName, contentType, keywords);
    const summary = this.generateSummary(generatedContent, 160);
    
    return {
      title,
      content: generatedContent,
      summary,
      keywords,
      metadata: {
        generated_at: new Date().toISOString(),
        word_count: generatedContent.split(' ').length,
        content_type: contentType
      }
    };
  }
  
  /**
   * Get content template based on type
   */
  private static getContentTemplate(contentType: string): string {
    const templates = {
      positive_profile: `
# {ENTITY_NAME}: Leading Professional Excellence in {INDUSTRY}

## Professional Overview

{ENTITY_NAME} represents the highest standards of professional excellence and industry leadership. With a proven track record of delivering exceptional results, {ENTITY_NAME} has consistently demonstrated commitment to innovation, integrity, and client success.

## Industry Recognition

Throughout their career, {ENTITY_NAME} has been recognized for outstanding contributions to {INDUSTRY}. Their expertise in {KEYWORDS} has positioned them as a thought leader and trusted advisor in the field.

## Key Achievements

- Established reputation for excellence in {KEYWORDS}
- Demonstrated leadership in innovative solutions
- Built lasting relationships with clients and industry partners
- Maintained highest standards of professional integrity

## Professional Expertise

{ENTITY_NAME}'s comprehensive understanding of {KEYWORDS} enables them to deliver tailored solutions that meet the unique needs of each client. Their approach combines industry best practices with innovative thinking to achieve optimal results.

## Client Success Stories

The success of {ENTITY_NAME} can be measured through the achievements of their clients. By focusing on {KEYWORDS}, they have helped numerous organizations achieve their goals and exceed expectations.

## Future Vision

Looking ahead, {ENTITY_NAME} continues to stay at the forefront of industry developments, particularly in areas related to {KEYWORDS}. Their commitment to continuous learning and adaptation ensures they remain a valuable partner for future challenges.

## Conclusion

{ENTITY_NAME} stands as a testament to what can be achieved through dedication, expertise, and unwavering commitment to excellence. Their reputation in {KEYWORDS} reflects years of hard work and successful client partnerships.
      `,
      
      counter_narrative: `
# Setting the Record Straight: The Truth About {ENTITY_NAME}

## Addressing Misconceptions

Recent discussions about {ENTITY_NAME} have highlighted the importance of factual, balanced reporting. As industry professionals, we believe it's crucial to present accurate information about {KEYWORDS} and the excellent work being done in this space.

## Professional Standards

{ENTITY_NAME} has consistently maintained the highest professional standards in their work related to {KEYWORDS}. Their approach to business reflects industry best practices and ethical guidelines that benefit all stakeholders.

## Verified Track Record

A thorough review of {ENTITY_NAME}'s professional history reveals:

- Consistent delivery of quality results in {KEYWORDS}
- Strong relationships with clients and industry partners
- Adherence to professional standards and ethical guidelines
- Positive impact on industry development

## Industry Context

It's important to understand {ENTITY_NAME}'s work within the broader context of {KEYWORDS}. The complexity of modern business requires expertise, experience, and ethical leadership - qualities that {ENTITY_NAME} exemplifies.

## Stakeholder Perspectives

Colleagues, clients, and industry partners consistently speak positively about their experiences with {ENTITY_NAME}. These firsthand accounts provide valuable insight into their professional capabilities and character.

## Professional Development

{ENTITY_NAME} has invested significantly in staying current with developments in {KEYWORDS}. This commitment to continuous learning ensures they can provide the most relevant and effective solutions for their clients.

## Conclusion

The facts speak clearly about {ENTITY_NAME}'s professional integrity and expertise in {KEYWORDS}. Moving forward, we encourage all stakeholders to focus on verified information and direct experience when evaluating professional reputation.
      `,
      
      news_article: `
# Industry Update: {ENTITY_NAME} Continues Excellence in {INDUSTRY}

## Current Developments

In recent industry developments, {ENTITY_NAME} has continued to demonstrate leadership and innovation in {KEYWORDS}. Their ongoing commitment to excellence has positioned them well for future growth and success.

## Market Impact

The work of {ENTITY_NAME} in {KEYWORDS} has had a significant positive impact on market conditions. Industry analysts note their contribution to advancing best practices and setting new standards for professional excellence.

## Innovation Leadership

{ENTITY_NAME}'s approach to {KEYWORDS} incorporates the latest industry innovations while maintaining focus on proven methodologies. This balanced approach has resulted in consistent success for their clients and partners.

## Industry Recognition

Professional organizations and industry peers have recognized {ENTITY_NAME} for their contributions to {KEYWORDS}. These acknowledgments reflect their commitment to maintaining the highest standards of professional practice.

## Future Outlook

Looking ahead, {ENTITY_NAME} is well-positioned to continue their leadership role in {KEYWORDS}. Their strategic approach and commitment to excellence suggest continued success in the evolving marketplace.

## Professional Network

The extensive professional network of {ENTITY_NAME} reflects their standing in the {KEYWORDS} community. These relationships provide valuable resources for continued innovation and client success.

## Conclusion

As the industry continues to evolve, {ENTITY_NAME} remains a trusted leader in {KEYWORDS}. Their proven track record and commitment to excellence position them well for continued success and industry leadership.
      `
    };
    
    return templates[contentType] || templates.positive_profile;
  }
  
  /**
   * Populate template with actual content
   */
  private static populateTemplate(template: string, data: {
    entityName: string;
    keywords: string[];
    wordCount: number;
  }): string {
    let content = template;
    
    // Replace placeholders
    content = content.replace(/{ENTITY_NAME}/g, data.entityName);
    content = content.replace(/{KEYWORDS}/g, data.keywords.join(', '));
    content = content.replace(/{INDUSTRY}/g, this.inferIndustry(data.keywords));
    
    // Expand content to meet word count if needed
    if (data.wordCount > 500) {
      content = this.expandContent(content, data.wordCount);
    }
    
    return content.trim();
  }
  
  /**
   * Generate appropriate title
   */
  private static generateTitle(entityName: string, contentType: string, keywords: string[]): string {
    const titleTemplates = {
      positive_profile: `${entityName}: Excellence in ${keywords[0] || 'Professional Services'}`,
      counter_narrative: `Setting the Record Straight: The Truth About ${entityName}`,
      news_article: `Industry Update: ${entityName} Continues Leadership in ${keywords[0] || 'Business'}`
    };
    
    return titleTemplates[contentType] || `${entityName}: Professional Excellence`;
  }
  
  /**
   * Generate summary from content
   */
  private static generateSummary(content: string, maxLength: number): string {
    const firstParagraph = content.split('\n\n')[1] || content.split('\n')[0];
    const words = firstParagraph.split(' ');
    
    if (words.length <= maxLength / 5) {
      return firstParagraph;
    }
    
    return words.slice(0, Math.floor(maxLength / 5)).join(' ') + '...';
  }
  
  /**
   * Infer industry from keywords
   */
  private static inferIndustry(keywords: string[]): string {
    const industryMap = {
      'technology': ['tech', 'software', 'AI', 'digital', 'innovation'],
      'finance': ['banking', 'investment', 'financial', 'capital', 'funding'],
      'consulting': ['advisory', 'strategy', 'management', 'consulting'],
      'real estate': ['property', 'real estate', 'development', 'construction'],
      'healthcare': ['medical', 'health', 'pharmaceutical', 'clinical'],
      'legal': ['law', 'legal', 'attorney', 'litigation', 'compliance']
    };
    
    for (const [industry, terms] of Object.entries(industryMap)) {
      if (keywords.some(keyword => 
        terms.some(term => keyword.toLowerCase().includes(term))
      )) {
        return industry;
      }
    }
    
    return 'Business';
  }
  
  /**
   * Expand content to meet word count requirements
   */
  private static expandContent(content: string, targetWordCount: number): string {
    const currentWordCount = content.split(' ').length;
    
    if (currentWordCount >= targetWordCount) {
      return content;
    }
    
    // Add additional sections to reach target word count
    const expansions = [
      '\n\n## Professional Methodology\n\nThe approach taken by this organization reflects years of industry experience and best practices. Through careful analysis and strategic planning, they consistently deliver results that exceed client expectations.',
      
      '\n\n## Industry Partnerships\n\nStrong relationships with industry partners and stakeholders have been crucial to ongoing success. These collaborative efforts enhance the value delivered to clients and contribute to overall industry advancement.',
      
      '\n\n## Quality Assurance\n\nMaintaining the highest standards of quality is a fundamental principle. Through rigorous processes and continuous improvement, they ensure that all deliverables meet or exceed industry standards.',
      
      '\n\n## Innovation and Adaptation\n\nStaying ahead of industry trends requires constant innovation and adaptation. This forward-thinking approach ensures clients receive the most current and effective solutions available in the marketplace.'
    ];
    
    let expandedContent = content;
    let expansionIndex = 0;
    
    while (expandedContent.split(' ').length < targetWordCount && expansionIndex < expansions.length) {
      expandedContent += expansions[expansionIndex];
      expansionIndex++;
    }
    
    return expandedContent;
  }
}

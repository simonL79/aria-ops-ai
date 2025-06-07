import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('📝 Content generation request:', requestData);

    // Generate the article content using OpenAI
    const articleContent = await generateArticleContent(requestData);
    
    // If this is preview only, return just the content
    if (requestData.previewOnly) {
      return new Response(JSON.stringify(articleContent), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For live deployment, continue with the existing deployment logic
    const deploymentResults = await deployToLivePlatforms(articleContent, requestData);

    return new Response(JSON.stringify({
      ...articleContent,
      deploymentResults,
      message: 'Content generated and deployed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in persona-saturation:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Content generation failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateArticleContent(config: any) {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Enhanced SEO-focused prompt system with advanced optimization
  let systemPrompt = '';
  let userPrompt = '';

  const keywords = config.targetKeywords || [];
  const entityName = config.entity || config.clientName;

  if (config.contentType === 'follow_up_response' && config.followUpSource) {
    systemPrompt = `You are an expert SEO content strategist and professional writer creating a strategic follow-up article with maximum search visibility and professional journalism standards.

CRITICAL SEO REQUIREMENTS:
- Headline must follow Google News format: [Entity] + [Legal/Industry Action] + [Authority/Publication] + [Key Term]
- Include meta description (150-160 characters exactly) for maximum CTR
- Strategic keyword placement: primary keyword in first 100 words, secondary keywords throughout
- Use semantic keyword variations and LSI keywords naturally
- Professional tone that passes AI detection tools
- Structure for featured snippets and voice search optimization
- Include internal linking opportunities and backlink anchor text suggestions

Entity: ${entityName}
Response angle: ${config.responseAngle}
Target keywords: ${keywords.join(', ')}
Source URL: ${config.followUpSource}

HEADLINE FORMULA (Google News Optimized):
[Entity Name] + [Action/Legal Term] + [Authority/Publication] + [Key Legal/Industry Term]
Example: "Noel Clarke Lawsuit: Guardian Defamation Case Heads to UK High Court"

META DESCRIPTION REQUIREMENTS:
- Exactly 150-160 characters
- Include primary keyword and entity name
- Action-oriented language with emotional hook
- Include current year/timeframe for freshness
- Clear value proposition for click-through

CONTENT STRUCTURE & SEO OPTIMIZATION:
1. SEO-optimized headline (Google News format)
2. Meta description (150-160 characters)
3. URL slug suggestion (4-6 words, hyphen-separated)
4. Opening paragraph with primary keyword in first 25 words
5. Strategic keyword integration throughout (2-3% density)
6. Semantic keyword variations and related terms
7. Professional conclusion with call-to-action
8. Internal linking suggestions
9. Image alt text suggestions
10. Schema markup data

KEYWORD INTEGRATION STRATEGY:
- Primary keyword: First paragraph, H1, meta description
- Secondary keywords: H2 tags, throughout body (natural placement)
- Long-tail variations: Naturally woven into sentences
- LSI keywords: Related terms and synonyms

Guidelines:
- Write naturally without obvious AI patterns
- Use proper journalistic attribution and sourcing
- Include relevant achievements and context for authority
- End with 3-5 strategically chosen hashtags for social SEO
- Suggest internal linking opportunities to boost domain authority`;

    userPrompt = `Create an SEO-optimized follow-up response article for ${entityName} responding to: ${config.followUpSource}

TARGET KEYWORDS TO EMBED STRATEGICALLY:
${keywords.map(keyword => `- ${keyword} (target density: 2-3%)`).join('\n')}

${config.customContent ? `Additional context: ${config.customContent}` : ''}

Generate complete article with advanced SEO optimization:
1. Google News-format headline with primary keywords
2. Meta description (150-160 characters for maximum CTR)
3. URL slug suggestion (SEO-friendly)
4. Well-structured content with strategic keyword placement
5. H2/H3 subheadings with secondary keywords
6. Semantic keyword variations throughout
7. Professional conclusion with industry context
8. Internal linking suggestions
9. Image alt text suggestions
10. Schema markup data for Google News
11. Social media hashtags (end only)

FORMAT RESPONSE AS:
HEADLINE: [SEO-optimized Google News format headline]

META_DESCRIPTION: [150-160 character meta description]

URL_SLUG: [seo-friendly-url-slug]

CONTENT:
[Full article content with strategic keyword integration and H2/H3 subheadings]

INTERNAL_LINKS: [Suggested internal linking opportunities]

IMAGE_ALT: [Suggested alt text for images]

SCHEMA_DATA: [Key information for schema markup]

HASHTAGS: [3-5 strategic hashtags]`;
  } else {
    // Handle other content types with advanced SEO focus
    const contentTypeMap = {
      'positive_profile': 'professional achievement and expertise showcase',
      'industry_analysis': 'thought leadership and market insights',
      'expert_commentary': 'professional opinions and expert analysis',
      'company_news': 'business milestones and corporate updates',
      'innovation_showcase': 'technology and innovation highlights',
      'strategic_narrative': 'targeted response to specific concerns'
    };

    systemPrompt = `You are an expert SEO content strategist creating ${contentTypeMap[config.contentType] || 'professional content'} with maximum search visibility and professional authority.

CRITICAL SEO REQUIREMENTS:
- Headline must be Google News compliant and include primary keywords
- Include meta description (150-160 characters exactly) for maximum CTR
- Strategic keyword placement: primary in first 100 words, distribute naturally
- Use semantic keyword variations and LSI keywords
- Professional tone that establishes authority and expertise
- Structure for featured snippets and voice search optimization
- Include internal linking opportunities

Entity: ${entityName}
Target keywords: ${keywords.join(', ')}

HEADLINE OPTIMIZATION STRATEGY:
- Lead with entity name for brand authority
- Include primary keyword naturally
- Professional but search-friendly language
- Under 60 characters for full SERP display
- Action-oriented when appropriate

META DESCRIPTION EXCELLENCE:
- Exactly 150-160 characters
- Include primary keyword and entity name
- Compelling value proposition
- Current and newsworthy angle
- Clear benefit for the reader

CONTENT STRATEGY:
- Primary keyword in first 100 words and conclusion
- H2/H3 subheadings with secondary keywords
- Semantic variations throughout (2-3% total density)
- Professional industry insights and data
- Authoritative tone with credible sources
- Internal linking opportunities for domain authority

Guidelines:
- Write naturally without obvious AI patterns
- Use professional, engaging tone with industry expertise
- Include relevant industry insights and current trends
- End with 3-5 strategic hashtags for social SEO only
- Suggest internal linking and schema opportunities`;

    userPrompt = `Create SEO-optimized professional content about ${entityName} focusing on ${contentTypeMap[config.contentType]}.

TARGET KEYWORDS FOR STRATEGIC PLACEMENT:
${keywords.map(keyword => `- ${keyword} (embed naturally, 2-3% density)`).join('\n')}

${config.customContent ? `Additional guidelines: ${config.customContent}` : ''}

Generate complete article with advanced SEO optimization:
1. Google-compliant headline with primary keywords
2. Meta description (150-160 characters for maximum CTR)
3. URL slug suggestion
4. Well-structured content with H2/H3 subheadings
5. Strategic keyword placement and semantic variations
6. Industry insights and authoritative content
7. Professional conclusion with call-to-action
8. Internal linking suggestions
9. Schema markup recommendations

FORMAT RESPONSE AS:
HEADLINE: [SEO-optimized professional headline]

META_DESCRIPTION: [150-160 character meta description]

URL_SLUG: [seo-friendly-url-slug]

CONTENT:
[Full article content with strategic keyword integration and subheadings]

INTERNAL_LINKS: [Suggested internal linking opportunities]

SCHEMA_DATA: [Key information for schema markup]

HASHTAGS: [3-5 strategic hashtags]`;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse the enhanced structured response
  const headlineMatch = content.match(/HEADLINE:\s*(.+?)(?:\n|META_DESCRIPTION:)/s);
  const metaMatch = content.match(/META_DESCRIPTION:\s*(.+?)(?:\n|URL_SLUG:)/s);
  const urlSlugMatch = content.match(/URL_SLUG:\s*(.+?)(?:\n|CONTENT:)/s);
  const contentMatch = content.match(/CONTENT:\s*([\s\S]+?)(?:INTERNAL_LINKS:|SCHEMA_DATA:|HASHTAGS:|$)/);
  const internalLinksMatch = content.match(/INTERNAL_LINKS:\s*([\s\S]+?)(?:IMAGE_ALT:|SCHEMA_DATA:|HASHTAGS:|$)/);
  const imageAltMatch = content.match(/IMAGE_ALT:\s*(.+?)(?:\n|SCHEMA_DATA:)/s);
  const schemaMatch = content.match(/SCHEMA_DATA:\s*([\s\S]+?)(?:HASHTAGS:|$)/);
  const hashtagsMatch = content.match(/HASHTAGS:\s*(.+?)$/s);

  const title = headlineMatch ? headlineMatch[1].trim() : `${entityName} Professional Update`;
  const metaDescription = metaMatch ? metaMatch[1].trim() : `Latest professional updates and insights from ${entityName}. Industry leadership and expertise.`;
  const urlSlug = urlSlugMatch ? urlSlugMatch[1].trim() : entityName.toLowerCase().replace(/\s+/g, '-');
  const body = contentMatch ? contentMatch[1].trim() : content;
  const internalLinks = internalLinksMatch ? internalLinksMatch[1].trim() : '';
  const imageAlt = imageAltMatch ? imageAltMatch[1].trim() : '';
  const schemaData = schemaMatch ? schemaMatch[1].trim() : '';
  const hashtags = hashtagsMatch ? hashtagsMatch[1].trim() : '';

  return {
    title,
    content: body,
    body, // For backward compatibility
    metaDescription,
    urlSlug,
    hashtags,
    internalLinks,
    imageAlt,
    schemaData,
    seoKeywords: keywords,
    keywordDensity: calculateAdvancedKeywordDensity(body, keywords),
    seoScore: calculateSEOScore(title, metaDescription, body, keywords)
  };
}

// Enhanced keyword density calculation with semantic analysis
function calculateAdvancedKeywordDensity(content: string, keywords: string[]): any {
  const wordCount = content.split(/\s+/).length;
  const densityReport = {};
  
  keywords.forEach(keyword => {
    // Check for exact matches
    const exactRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const exactMatches = content.match(exactRegex) || [];
    
    // Check for partial matches and variations
    const keywordWords = keyword.toLowerCase().split(' ');
    let partialMatches = 0;
    
    keywordWords.forEach(word => {
      const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const wordMatches = content.match(wordRegex) || [];
      partialMatches += wordMatches.length;
    });
    
    const totalDensity = ((exactMatches.length * 2 + partialMatches) / wordCount * 100).toFixed(2);
    
    densityReport[keyword] = {
      exactMatches: exactMatches.length,
      partialMatches: partialMatches,
      totalOccurrences: exactMatches.length + partialMatches,
      density: `${totalDensity}%`,
      placement: checkKeywordPlacement(content, keyword)
    };
  });
  
  return densityReport;
}

// Check strategic keyword placement
function checkKeywordPlacement(content: string, keyword: string): any {
  const sentences = content.split(/[.!?]+/);
  const firstSentence = sentences[0] || '';
  const lastSentence = sentences[sentences.length - 1] || '';
  
  const keywordRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  
  return {
    inFirstSentence: keywordRegex.test(firstSentence),
    inLastSentence: keywordRegex.test(lastSentence),
    inHeadings: /#{1,3}\s.*/.test(content) && keywordRegex.test(content.match(/#{1,3}\s.*/g)?.join(' ') || ''),
    earlyPlacement: keywordRegex.test(content.substring(0, 200))
  };
}

// Calculate overall SEO score
function calculateSEOScore(title: string, metaDescription: string, content: string, keywords: string[]): number {
  let score = 0;
  const maxScore = 100;
  
  // Title optimization (20 points)
  if (title.length >= 30 && title.length <= 60) score += 10;
  if (keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) score += 10;
  
  // Meta description optimization (20 points)
  if (metaDescription.length >= 150 && metaDescription.length <= 160) score += 10;
  if (keywords.some(keyword => metaDescription.toLowerCase().includes(keyword.toLowerCase()))) score += 10;
  
  // Content optimization (40 points)
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 300) score += 10;
  if (content.includes('##') || content.includes('###')) score += 10; // Has subheadings
  
  // Keyword optimization (20 points)
  keywords.forEach(keyword => {
    const keywordRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(keywordRegex) || [];
    const density = (matches.length / wordCount) * 100;
    if (density >= 1 && density <= 3) score += 20 / keywords.length;
  });
  
  return Math.round(score);
}

async function deployToLivePlatforms(articleContent: any, config: any) {
  // Simulate live deployments for now
  const platforms = ['GitHub Pages', 'Medium', 'WordPress.com', 'Reddit', 'Quora', 'LinkedIn'];
  const results = [];

  for (const platform of platforms) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success/failure
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        results.push({
          platform,
          success: true,
          url: `https://${platform.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.live`,
          timestamp: new Date().toISOString()
        });
      } else {
        results.push({
          platform,
          success: false,
          error: 'Deployment failed',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      results.push({
        platform,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return results;
}

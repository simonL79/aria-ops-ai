import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';
import { contentSafetyCheck } from '../_shared/contentSafety.ts';

interface GenerateContentParams {
  entity: string;
  contentType: string;
  customContent?: string;
  followUpSource?: string;
  responseAngle?: string;
  targetKeywords: string[];
  clientId?: string;
  clientName?: string;
  timestamp?: string;
  previewOnly?: boolean;
  deploymentTargets?: string[];
  liveDeployment?: boolean;
  platformEndpoint?: string;
}

export default async function handler(req: Request) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    console.log('📝 Content generation request:', body);

    // Extract parameters from the request body
    const {
      entity,
      contentType,
      customContent,
      followUpSource,
      responseAngle,
      targetKeywords
    } = body as GenerateContentParams;

    if (!entity || !contentType || !targetKeywords) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Prepare the entity and keywords
    const entityCleaned = entity.replace(/[^a-zA-Z0-9\s]/g, '');
    const targetKeywordsCleaned = targetKeywords.map(keyword =>
      keyword.replace(/[^a-zA-Z0-9\s]/g, '')
    );

    // OpenAI API Key (use environment variable)
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('Missing OpenAI API Key');
    }

    // Generate SEO-optimized content with natural flow
    const contentPrompt = `You are an expert content writer creating a professional news article about ${entity}. 

CRITICAL FORMATTING REQUIREMENTS:
- Write in natural, flowing paragraphs WITHOUT any markdown formatting
- NO bold text (**text**) 
- NO headings (# or ##)
- NO bullet points or lists
- Write like a professional journalist for a major publication
- Use proper paragraph structure with natural transitions
- Make it sound completely human-written, not AI-generated

CONTENT REQUIREMENTS:
- Professional, objective tone
- 800-1000 words
- Include the following target keywords naturally: ${targetKeywords.join(', ')}
- ${responseAngle ? `Response angle: ${responseAngle}` : ''}
- ${followUpSource ? `This is a response to: ${followUpSource}` : ''}

SEO OPTIMIZATION REQUIREMENTS:
- Create a Google News-compliant headline that includes primary keywords
- Strategic keyword placement (2-3% density)
- Use semantic variations of keywords
- Include related terms and entities
- Natural, readable flow that doesn't sound over-optimized

${customContent ? `Additional context: ${customContent}` : ''}

Write a complete, professional article that flows naturally and could be published in any major publication.`;

    // Call OpenAI API
    console.log('🤖 Calling OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content writer and SEO specialist. Create professional, natural-flowing content that ranks well in search engines while maintaining journalistic quality.'
          },
          {
            role: 'user',
            content: contentPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0]?.message?.content || '';

    // Generate SEO elements
    const headline = await generateSEOHeadline(entity, targetKeywords, contentType, responseAngle);
    const metaDescription = await generateMetaDescription(generatedContent, targetKeywords);
    const urlSlug = generateUrlSlug(headline);
    const keywordAnalysis = analyzeKeywordDensity(generatedContent, targetKeywords);
    const seoScore = calculateSEOScore(generatedContent, headline, metaDescription, targetKeywords);

    // Generate social media hashtags
    const socialHashtags = generateSocialMediaHashtags(targetKeywords, entity);

    // Suggest internal links
    const internalLinkSuggestions = suggestInternalLinks(generatedContent, entity);

    // Generate image alt text
    const imageAltText = generateImageAltText(entity, targetKeywords[0]);

    // Generate schema markup
    const schemaMarkup = generateSchemaMarkup(entity, contentType, generatedContent);

    return new Response(JSON.stringify({
      success: true,
      content: generatedContent,
      title: headline,
      metaDescription,
      urlSlug,
      hashtags: socialHashtags,
      internalLinks: internalLinkSuggestions,
      imageAlt: imageAltText,
      schemaData: schemaMarkup,
      seoKeywords: targetKeywords,
      keywordDensity: keywordAnalysis,
      seoScore,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('🔥 Error generating content:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function generateSEOHeadline(entity: string, keywords: string[], contentType: string, responseAngle?: string): Promise<string> {
  const headlinePrompt = `Create a professional, Google News-compliant headline for an article about ${entity}. 

Requirements:
- Include primary keywords: ${keywords.slice(0, 3).join(', ')}
- 50-60 characters max
- Professional journalism style
- ${responseAngle ? `Angle: ${responseAngle}` : ''}
- No quotation marks around the headline
- Format: "Subject: Main Topic Details"

Return ONLY the headline, nothing else.`;

  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('Missing OpenAI API Key');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert headline writer for a major news publication.'
        },
        {
          role: 'user',
          content: headlinePrompt
        }
      ],
      temperature: 0.6,
      max_tokens: 80
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const aiResponse = await response.json();
  const headline = aiResponse.choices[0]?.message?.content?.trim() || `Article about ${entity}`;
  return headline;
}

async function generateMetaDescription(content: string, keywords: string[]): Promise<string> {
  const metaDescriptionPrompt = `Create a concise meta description (150-160 characters) for the following content. Include these keywords: ${keywords.slice(0, 3).join(', ')}.

Content:
${content}

Return ONLY the meta description, nothing else.`;

  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('Missing OpenAI API Key');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO specialist creating meta descriptions.'
        },
        {
          role: 'user',
          content: metaDescriptionPrompt
        }
      ],
      temperature: 0.5,
      max_tokens: 100
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const aiResponse = await response.json();
  const metaDescription = aiResponse.choices[0]?.message?.content?.trim() || `Read more about this article.`;
  return metaDescription;
}

function generateUrlSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 100)
    .replace(/^-+|-+$/g, '');
}

function analyzeKeywordDensity(text: string, keywords: string[]) {
  const wordCount = text.split(/\s+/).length;
  const analysis: any = {};

  keywords.forEach(keyword => {
    const keywordRegex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = text.toLowerCase().match(keywordRegex) || [];
    const density = wordCount > 0 ? ((matches.length / wordCount) * 100).toFixed(2) + '%' : '0%';

    analysis[keyword] = {
      count: matches.length,
      density,
      exactMatches: matches.length,
      partialMatches: 0
    };
  });

  return analysis;
}

function calculateSEOScore(content: string, headline: string, metaDescription: string, keywords: string[]): number {
  let score = 0;

  // Keyword in headline
  keywords.slice(0, 3).forEach(keyword => {
    if (headline.toLowerCase().includes(keyword.toLowerCase())) {
      score += 20;
    }
  });

  // Keyword density
  const keywordAnalysis = analyzeKeywordDensity(content, keywords);
  Object.values(keywordAnalysis).forEach((keywordData: any) => {
    const density = parseFloat(keywordData.density);
    if (density >= 1 && density <= 3) {
      score += 25;
    } else if (density > 0) {
      score += 15;
    }
  });

  // Meta description quality
  if (metaDescription.length >= 150 && metaDescription.length <= 160) {
    score += 20;
  }
  keywords.slice(0, 2).forEach(keyword => {
    if (metaDescription.toLowerCase().includes(keyword.toLowerCase())) {
      score += 10;
    }
  });

  // Content length
  if (content.length >= 800) {
    score += 15;
  }

  return Math.min(score, 100); // Cap at 100
}

function generateSocialMediaHashtags(keywords: string[], entity: string): string {
  const combinedTerms = [...keywords.slice(0, 4), entity];
  const hashtags = combinedTerms
    .map(term => term.replace(/\s+/g, ''))
    .map(term => `#${term}`)
    .join(' ');
  return hashtags;
}

function suggestInternalLinks(content: string, entity: string): string {
  const suggestions = [
    `Learn more about ${entity} on our website.`,
    `Read our latest news about ${entity}.`,
    `Explore our services related to ${entity}.`
  ];
  return suggestions.join('\n');
}

function generateImageAltText(entity: string, keyword: string): string {
  return `Image of ${entity} related to ${keyword}`;
}

function generateSchemaMarkup(entity: string, contentType: string, content: string): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: `News about ${entity}`,
    description: `Article discussing ${contentType} related to ${entity}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://example.com/article'
    },
    author: {
      '@type': 'Organization',
      name: entity
    },
    publisher: {
      '@type': 'Organization',
      name: entity,
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png'
      }
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    image: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg'
    ],
    content: content
  };
  return JSON.stringify(schema, null, 2);
}

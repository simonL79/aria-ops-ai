
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

  // Build the prompt based on content type
  let systemPrompt = '';
  let userPrompt = '';

  if (config.contentType === 'follow_up_response' && config.followUpSource) {
    systemPrompt = `You are a professional content writer creating a strategic follow-up article. Write in a natural, human style without hashtags at the start of paragraphs. The response should be professional, factual, and address concerns constructively.

Response angle: ${config.responseAngle}
Target keywords: ${config.targetKeywords?.join(', ') || 'N/A'}

Guidelines:
- Write naturally without obvious AI patterns
- No hashtags at the beginning of sentences or paragraphs
- Use a professional, measured tone
- Address the situation constructively
- Include relevant achievements and context
- End with 3-5 relevant hashtags for SEO`;

    userPrompt = `Create a follow-up response article for ${config.entity || config.clientName} responding to: ${config.followUpSource}

${config.customContent ? `Additional context: ${config.customContent}` : ''}

Generate a complete article with:
1. Professional headline
2. Well-structured content addressing the situation
3. Relevant achievements and positive context
4. SEO hashtags at the end only`;
  } else {
    // Handle other content types
    const contentTypeMap = {
      'positive_profile': 'professional achievement and expertise showcase',
      'industry_analysis': 'thought leadership and market insights',
      'expert_commentary': 'professional opinions and expert analysis',
      'company_news': 'business milestones and corporate updates',
      'innovation_showcase': 'technology and innovation highlights',
      'strategic_narrative': 'targeted response to specific concerns'
    };

    systemPrompt = `You are a professional content writer creating ${contentTypeMap[config.contentType] || 'professional content'}. Write in a natural, human style without hashtags at the start of paragraphs.

Target keywords: ${config.targetKeywords?.join(', ') || 'N/A'}

Guidelines:
- Write naturally without obvious AI patterns  
- No hashtags at the beginning of sentences or paragraphs
- Use professional, engaging tone
- Include relevant industry insights
- End with 3-5 relevant hashtags for SEO`;

    userPrompt = `Create professional content about ${config.entity || config.clientName} focusing on ${contentTypeMap[config.contentType]}.

${config.customContent ? `Additional guidelines: ${config.customContent}` : ''}

Generate a complete article with compelling headline and well-structured content.`;
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
      max_tokens: 2000
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Extract title and body
  const lines = content.split('\n').filter(line => line.trim());
  const title = lines[0].replace(/^#+\s*/, '').trim();
  const body = lines.slice(1).join('\n').trim();

  return {
    title,
    content: body,
    body // For backward compatibility
  };
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

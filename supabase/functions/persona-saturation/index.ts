
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const githubToken = Deno.env.get("GITHUB_TOKEN") as string;
const openaiKey = Deno.env.get("OPENAI_API_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SaturationRequest {
  entityName: string;
  targetKeywords: string[];
  contentCount: number;
  deploymentTargets: string[];
  saturationMode: 'defensive' | 'aggressive' | 'nuclear';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entityName, targetKeywords, contentCount = 50, deploymentTargets = ['github-pages'], saturationMode = 'defensive' }: SaturationRequest = await req.json();

    console.log(`🚀 A.R.I.A™ Persona Saturation initiated for: ${entityName}`);

    // Step 1: Generate varied content pieces
    const contentPieces = await generateVariedContent(entityName, targetKeywords, contentCount, saturationMode);
    
    // Step 2: Deploy to multiple platforms
    const deploymentResults = await deployToMultiplePlatforms(contentPieces, deploymentTargets, entityName);
    
    // Step 3: Ping indexers and RSS feeds
    const indexingResults = await notifyIndexers(deploymentResults);
    
    // Step 4: Monitor SERP penetration
    const serpResults = await monitorSERPPenetration(entityName, targetKeywords);

    // Log the saturation campaign
    await supabase.from('aria_ops_log').insert({
      operation_type: 'persona_saturation',
      entity_name: entityName,
      module_source: 'persona_saturation',
      operation_data: {
        contentGenerated: contentPieces.length,
        deploymentsSuccessful: deploymentResults.successful,
        serpPenetration: serpResults.penetrationRate,
        mode: saturationMode
      },
      success: true
    });

    return new Response(
      JSON.stringify({
        success: true,
        entityName,
        campaign: {
          contentGenerated: contentPieces.length,
          deployments: deploymentResults,
          indexing: indexingResults,
          serpAnalysis: serpResults
        },
        estimatedSERPImpact: calculateSERPImpact(deploymentResults, contentCount),
        nextSteps: [
          'Content deployed across multiple platforms',
          'Indexing notifications sent',
          'SERP monitoring activated',
          'Expected visibility improvement: 48-72 hours'
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Persona Saturation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateVariedContent(entityName: string, keywords: string[], count: number, mode: string): Promise<any[]> {
  const contentTypes = [
    'news_article', 'blog_post', 'case_study', 'interview', 'press_release',
    'opinion_piece', 'industry_analysis', 'company_profile', 'success_story', 'thought_leadership'
  ];

  const contentPieces = [];

  for (let i = 0; i < count; i++) {
    const contentType = contentTypes[i % contentTypes.length];
    const keyword = keywords[i % keywords.length];
    
    try {
      const prompt = generateContentPrompt(entityName, keyword, contentType, mode);
      const content = await generateWithOpenAI(prompt);
      
      contentPieces.push({
        id: `content_${i + 1}`,
        type: contentType,
        keyword: keyword,
        title: extractTitle(content),
        content: content,
        seoData: generateSEOData(entityName, keyword, content),
        metadata: {
          wordCount: content.split(' ').length,
          readability: calculateReadabilityScore(content),
          keywordDensity: calculateKeywordDensity(content, keyword)
        }
      });
    } catch (error) {
      console.error(`Error generating content piece ${i + 1}:`, error);
    }
  }

  return contentPieces;
}

async function deployToMultiplePlatforms(contentPieces: any[], targets: string[], entityName: string): Promise<any> {
  const results = {
    successful: 0,
    failed: 0,
    deployments: []
  };

  for (const piece of contentPieces) {
    for (const target of targets) {
      try {
        let deployResult;
        
        switch (target) {
          case 'github-pages':
            deployResult = await deployToGitHubPages(piece, entityName);
            break;
          case 'telegra-ph':
            deployResult = await deployToTelegraph(piece);
            break;
          case 'medium':
            deployResult = await deployToMedium(piece);
            break;
          default:
            continue;
        }

        if (deployResult.success) {
          results.successful++;
          results.deployments.push({
            platform: target,
            url: deployResult.url,
            contentId: piece.id,
            title: piece.title
          });
        } else {
          results.failed++;
        }
      } catch (error) {
        console.error(`Deployment error for ${target}:`, error);
        results.failed++;
      }
    }
  }

  return results;
}

async function deployToGitHubPages(content: any, entityName: string): Promise<any> {
  if (!githubToken) {
    throw new Error('GitHub token not configured');
  }

  const repoName = `${entityName.toLowerCase().replace(/\s+/g, '-')}-${content.id}`;
  const htmlContent = generateHTMLPage(content);

  try {
    // Create repository
    const createRepoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repoName,
        description: `Positive content for ${entityName}`,
        homepage: `https://github.com/${repoName}`,
        public: true,
        has_issues: false,
        has_projects: false,
        has_wiki: false
      })
    });

    if (!createRepoResponse.ok) {
      throw new Error('Failed to create GitHub repository');
    }

    const repoData = await createRepoResponse.json();

    // Create index.html file
    const createFileResponse = await fetch(`https://api.github.com/repos/${repoData.full_name}/contents/index.html`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add content for ${entityName}`,
        content: btoa(htmlContent)
      })
    });

    if (!createFileResponse.ok) {
      throw new Error('Failed to create HTML file');
    }

    // Enable GitHub Pages
    await fetch(`https://api.github.com/repos/${repoData.full_name}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: {
          branch: 'main',
          path: '/'
        }
      })
    });

    return {
      success: true,
      url: `https://${repoData.owner.login}.github.io/${repoName}`,
      repoUrl: repoData.html_url
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function deployToTelegraph(content: any): Promise<any> {
  try {
    const response = await fetch('https://api.telegra.ph/createPage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        access_token: 'anonymous',
        title: content.title,
        content: content.content,
        return_content: false
      })
    });

    const data = await response.json();
    
    if (data.ok) {
      return {
        success: true,
        url: data.result.url
      };
    }
    
    throw new Error('Telegraph API error');
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function deployToMedium(content: any): Promise<any> {
  // Note: Medium requires OAuth, this is a placeholder for the structure
  return {
    success: false,
    error: 'Medium deployment requires OAuth setup'
  };
}

async function notifyIndexers(deploymentResults: any): Promise<any> {
  const indexers = [
    'http://pingomatic.com/ping/',
    'http://rpc.pingler.com/ping/'
  ];

  const results = [];

  for (const deployment of deploymentResults.deployments) {
    for (const indexer of indexers) {
      try {
        const response = await fetch(indexer, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            name: deployment.title,
            url: deployment.url,
            rss: `${deployment.url}/rss.xml`
          })
        });

        results.push({
          indexer,
          url: deployment.url,
          success: response.ok
        });
      } catch (error) {
        results.push({
          indexer,
          url: deployment.url,
          success: false,
          error: error.message
        });
      }
    }
  }

  return results;
}

async function monitorSERPPenetration(entityName: string, keywords: string[]): Promise<any> {
  // Use DuckDuckGo for SERP checking (Google blocks scraping)
  const results = [];

  for (const keyword of keywords) {
    try {
      const searchQuery = `${entityName} ${keyword}`;
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1`);
      
      if (response.ok) {
        const data = await response.json();
        results.push({
          keyword,
          query: searchQuery,
          resultsFound: data.Results?.length || 0,
          topResult: data.Results?.[0]?.FirstURL || null
        });
      }
    } catch (error) {
      console.error(`SERP monitoring error for ${keyword}:`, error);
    }
  }

  return {
    penetrationRate: results.length > 0 ? results.filter(r => r.resultsFound > 0).length / results.length : 0,
    results
  };
}

function generateContentPrompt(entityName: string, keyword: string, contentType: string, mode: string): string {
  const intensityMap = {
    defensive: 'balanced and factual',
    aggressive: 'highly positive and promotional',
    nuclear: 'exceptionally positive with strong credibility signals'
  };

  const intensity = intensityMap[mode] || 'balanced and factual';

  return `Write a ${contentType} about ${entityName} focusing on ${keyword}. 
  
  Make it ${intensity}. Include:
  - SEO-optimized title with ${keyword}
  - ${contentType === 'news_article' ? '500-700' : '800-1200'} words
  - Natural keyword integration
  - Credible sources and quotes
  - Professional tone
  - Meta description under 160 characters
  
  Format as HTML with proper headings, meta tags, and schema markup.`;
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  if (!openaiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert content writer and SEO specialist.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

function generateHTMLPage(content: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title}</title>
    <meta name="description" content="${content.seoData.description}">
    <meta name="keywords" content="${content.seoData.keywords}">
    ${content.seoData.schemaMarkup}
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1 { color: #333; border-bottom: 2px solid #007cba; padding-bottom: 10px; }
        .meta { color: #666; font-size: 0.9em; margin-bottom: 20px; }
    </style>
</head>
<body>
    <article>
        <h1>${content.title}</h1>
        <div class="meta">Published: ${new Date().toLocaleDateString()} | Type: ${content.type}</div>
        <div class="content">
            ${content.content}
        </div>
    </article>
</body>
</html>`;
}

function extractTitle(content: string): string {
  const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/) || content.match(/^#\s(.+)$/m);
  return titleMatch ? titleMatch[1] : 'Untitled Content';
}

function generateSEOData(entityName: string, keyword: string, content: string): any {
  const description = content.substring(0, 157) + '...';
  const keywords = [entityName, keyword, 'industry leader', 'expertise', 'professional'].join(', ');
  
  const schemaMarkup = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${extractTitle(content)}",
      "about": "${entityName}",
      "keywords": "${keywords}",
      "datePublished": "${new Date().toISOString()}",
      "author": {
        "@type": "Organization",
        "name": "Industry Expert"
      }
    }
    </script>`;

  return { description, keywords, schemaMarkup };
}

function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).length;
  const words = content.split(/\s+/).length;
  return Math.round((words / sentences) * 10) / 10;
}

function calculateKeywordDensity(content: string, keyword: string): number {
  const words = content.toLowerCase().split(/\s+/);
  const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
  return Math.round((keywordCount / words.length) * 100 * 10) / 10;
}

function calculateSERPImpact(deploymentResults: any, contentCount: number): string {
  const successRate = deploymentResults.successful / (deploymentResults.successful + deploymentResults.failed);
  
  if (successRate > 0.8) return '85-95% SERP improvement expected';
  if (successRate > 0.6) return '65-80% SERP improvement expected';
  if (successRate > 0.4) return '45-65% SERP improvement expected';
  return '25-45% SERP improvement expected';
}

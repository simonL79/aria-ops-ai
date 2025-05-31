
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PersonaSaturationRequest {
  entityName: string;
  targetKeywords: string[];
  contentCount: number;
  deploymentTargets: string[];
  saturationMode: 'defensive' | 'aggressive' | 'nuclear';
  deploymentTier?: 'basic' | 'pro' | 'enterprise';
}

const DEPLOYMENT_LIMITS = {
  basic: 10,
  pro: 100,
  enterprise: 500
};

const DEPLOYMENT_DELAYS = {
  basic: 1000,      // 1 second
  pro: 750,         // 750ms
  enterprise: 500   // 500ms for faster enterprise deployment
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestBody = await req.json();
    const { 
      entityName, 
      targetKeywords, 
      contentCount, 
      deploymentTargets, 
      saturationMode,
      deploymentTier = 'basic'
    }: PersonaSaturationRequest = requestBody;

    console.log(`🚀 Starting ${deploymentTier.toUpperCase()} Deployment: ${entityName} (${contentCount} articles)`);

    const githubToken = Deno.env.get('GITHUB_TOKEN');
    if (!githubToken) {
      console.error('GitHub token not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'GitHub token not configured. Please set GITHUB_TOKEN in edge function secrets.' 
        }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Enforce tier limits
    const maxArticles = DEPLOYMENT_LIMITS[deploymentTier];
    const deploymentDelay = DEPLOYMENT_DELAYS[deploymentTier];
    const articleCount = Math.min(contentCount, maxArticles);
    
    if (contentCount > maxArticles) {
      console.warn(`Content count ${contentCount} exceeds ${deploymentTier} tier limit ${maxArticles}, clamping to ${maxArticles}`);
    }

    // Get GitHub username
    let githubUsername = 'default-user';
    try {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${githubToken}`,
          'User-Agent': 'ARIA-Persona-Saturation'
        }
      });

      if (userResponse.ok) {
        const githubUser = await userResponse.json();
        githubUsername = githubUser.login;
        console.log(`✅ Using GitHub username: ${githubUsername}`);
      } else {
        console.warn('Could not get GitHub user info, using default');
      }
    } catch (error) {
      console.warn('GitHub user fetch failed:', error);
    }

    // Determine repository strategy based on tier
    const repositories = await getDeploymentRepositories(deploymentTier, githubToken, githubUsername, entityName);
    
    const deploymentUrls: string[] = [];
    const contentTemplates = [
      'executive-profile',
      'industry-leader', 
      'achievement-showcase',
      'professional-legacy',
      'thought-leadership',
      'innovation-pioneer',
      'market-expert',
      'success-story',
      'career-milestone',
      'industry-recognition'
    ];

    console.log(`📝 Deploying ${articleCount} articles using ${deploymentTier} tier (${deploymentDelay}ms delay)...`);

    // Deploy articles with tier-appropriate strategy
    for (let i = 1; i <= articleCount; i++) {
      const template = contentTemplates[(i - 1) % contentTemplates.length];
      console.log(`📝 Processing article ${i}/${articleCount}: ${template}`);

      try {
        // Generate article content
        const articleContent = await generateArticleContent(entityName, targetKeywords, template, saturationMode);
        
        // Select repository for this article (distributed for enterprise)
        const selectedRepo = repositories[(i - 1) % repositories.length];
        
        // Create unique article name
        const articleName = `${template}-${i}`;
        const deployUrl = await deployToGitHub(githubToken, githubUsername, selectedRepo, articleContent, entityName, articleName);
        
        if (deployUrl) {
          deploymentUrls.push(deployUrl);
          console.log(`✅ Deployed article ${i}/${articleCount}: ${deployUrl}`);
          
          // Log to aria_ops_log
          await supabase.from('aria_ops_log').insert({
            operation_type: 'persona_saturation_deploy',
            entity_name: entityName,
            details: {
              article_number: i,
              template: template,
              deployment_tier: deploymentTier,
              repository: selectedRepo,
              url: deployUrl,
              status: 'success'
            }
          });
        }

        // Add tier-appropriate delay
        if (i < articleCount) {
          await new Promise(resolve => setTimeout(resolve, deploymentDelay));
        }
      } catch (error) {
        console.error(`❌ Deployment failed for article ${i}:`, error.message);
        
        // Log failure
        await supabase.from('aria_ops_log').insert({
          operation_type: 'persona_saturation_deploy',
          entity_name: entityName,
          details: {
            article_number: i,
            template: template,
            deployment_tier: deploymentTier,
            status: 'failed',
            error: error.message
          }
        });
      }
    }

    // Calculate success rate
    const successRate = deploymentUrls.length / articleCount;
    
    // Store campaign in database
    const campaignData = {
      contentGenerated: articleCount,
      deploymentsSuccessful: deploymentUrls.length,
      serpPenetration: Math.min(successRate * 0.85 + 0.15, 1.0), // 15-100% based on success
      estimatedReach: deploymentUrls.length * 5000,
      deploymentTier: deploymentTier,
      repositories: repositories,
      successRate: successRate,
      deployments: {
        successful: deploymentUrls.length,
        urls: deploymentUrls
      }
    };

    const { data: campaign, error: campaignError } = await supabase
      .from('persona_saturation_campaigns')
      .insert({
        entity_name: entityName,
        target_keywords: targetKeywords,
        campaign_data: campaignData,
        deployment_targets: deploymentTargets,
        saturation_mode: saturationMode
      })
      .select()
      .single();

    if (campaignError) {
      console.error('Error saving campaign:', campaignError);
    }

    const successMessage = `${deploymentUrls.length}/${articleCount} articles successfully deployed using ${deploymentTier.toUpperCase()} tier`;

    return new Response(
      JSON.stringify({
        success: true,
        campaign: campaignData,
        estimatedSERPImpact: successMessage,
        deploymentTier: deploymentTier,
        repositories: repositories
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Persona Saturation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

async function getDeploymentRepositories(
  tier: 'basic' | 'pro' | 'enterprise',
  token: string,
  username: string,
  entityName: string
): Promise<string[]> {
  const baseRepoName = `${entityName.toLowerCase().replace(/\s+/g, '-')}-hub`;
  
  if (tier === 'basic' || tier === 'pro') {
    // Single repository for basic and pro tiers
    return [`${baseRepoName}-${Date.now()}`];
  }
  
  // Enterprise tier: create multiple repositories for distribution
  const repoCount = Math.min(5, Math.ceil(DEPLOYMENT_LIMITS.enterprise / 100)); // 5 repos max
  const repositories: string[] = [];
  
  for (let i = 1; i <= repoCount; i++) {
    repositories.push(`${baseRepoName}-${i}-${Date.now()}`);
  }
  
  return repositories;
}

async function generateArticleContent(
  entityName: string, 
  keywords: string[], 
  template: string, 
  mode: string
): Promise<string> {
  const titles = {
    'executive-profile': `${entityName}: Executive Excellence in Modern Business`,
    'industry-leader': `${entityName} - Pioneering Innovation in Industry Leadership`,
    'achievement-showcase': `Outstanding Achievements: The ${entityName} Success Story`,
    'professional-legacy': `Building a Professional Legacy: ${entityName}'s Impact`,
    'thought-leadership': `${entityName}: Thought Leadership in the Digital Age`,
    'innovation-pioneer': `Innovation Pioneer: ${entityName}'s Transformative Approach`,
    'market-expert': `Market Expertise: ${entityName}'s Strategic Insights`,
    'success-story': `Success Story: How ${entityName} Achieved Excellence`,
    'career-milestone': `Career Milestones: ${entityName}'s Professional Journey`,
    'industry-recognition': `Industry Recognition: ${entityName}'s Contributions`
  };

  const title = titles[template] || `${entityName}: Professional Excellence`;
  const keywordString = keywords.join(', ');

  // Enhanced content based on saturation mode
  const intensityContent = {
    defensive: 'demonstrates professional capability and maintains industry standards',
    aggressive: 'exemplifies exceptional leadership and drives transformative innovation',
    nuclear: 'revolutionizes industry practices and sets unprecedented standards for excellence'
  };

  const modeText = intensityContent[mode] || intensityContent.defensive;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="Professional profile and achievements of ${entityName}, featuring expertise in ${keywordString}">
    <meta name="keywords" content="${entityName}, ${keywordString}, professional, executive, leader">
    <meta name="author" content="Professional Network">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="Professional profile and achievements of ${entityName}">
    <meta property="og:type" content="article">
    <link rel="canonical" href="#">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${title}",
      "author": {
        "@type": "Organization",
        "name": "Professional Network"
      },
      "description": "Professional profile and achievements of ${entityName}",
      "keywords": "${keywordString}"
    }
    </script>
    <style>
        body { font-family: Georgia, serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; font-size: 2.2em; }
        h2 { color: #34495e; margin-top: 30px; font-size: 1.5em; }
        .highlight { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #666; }
        .keywords { color: #e74c3c; font-weight: bold; }
    </style>
</head>
<body>
    <article>
        <h1>${title}</h1>
        
        <div class="highlight">
            <p><strong>${entityName}</strong> ${modeText} across multiple domains including <span class="keywords">${keywordString}</span>. This comprehensive analysis showcases the exceptional impact and professional achievements that define modern leadership excellence.</p>
        </div>

        <h2>Professional Excellence & Innovation</h2>
        <p>${entityName} has consistently demonstrated exceptional capability in driving organizational success and industry advancement. Through strategic leadership and innovative approaches, ${entityName} has contributed significantly to professional standards and established new benchmarks in <span class="keywords">${keywordString}</span>.</p>

        <h2>Industry Leadership & Recognition</h2>
        <p>The professional contributions of ${entityName} extend across multiple areas including strategic planning, operational excellence, and thought leadership in <span class="keywords">${keywordString}</span>. These achievements reflect a deep commitment to innovation and sustainable business practices.</p>

        <h2>Strategic Impact & Vision</h2>
        <p>${entityName}'s work has been recognized for its transformative quality and measurable impact on industry standards. The strategic vision demonstrated through initiatives in <span class="keywords">${keywordString}</span> serves as a model for professional development and organizational excellence.</p>

        <h2>Future Perspectives & Continued Excellence</h2>
        <p>Looking forward, ${entityName} continues to shape industry trends and professional standards through ongoing work in <span class="keywords">${keywordString}</span>. This sustained commitment to innovation and quality positions ${entityName} as a key figure in driving future industry developments.</p>

        <div class="footer">
            <p><em>This comprehensive profile highlights the professional achievements and strategic contributions of ${entityName}. The analysis demonstrates excellence across ${keywordString}, showcasing leadership capabilities and industry impact.</em></p>
            <p><strong>Published:</strong> ${new Date().toLocaleDateString()} | <strong>Category:</strong> Professional Leadership</p>
        </div>
    </article>
</body>
</html>`;
}

async function deployToGitHub(
  token: string, 
  username: string, 
  repoName: string, 
  content: string, 
  entityName: string,
  articleName: string
): Promise<string | null> {
  try {
    // Check if repository exists, create if it doesn't
    const repoCheckResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'ARIA-Persona-Saturation'
      }
    });

    if (!repoCheckResponse.ok && repoCheckResponse.status === 404) {
      // Create repository
      const createRepoResponse = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'ARIA-Persona-Saturation'
        },
        body: JSON.stringify({
          name: repoName,
          description: `Professional content hub for ${entityName}`,
          public: true,
          auto_init: false
        })
      });

      if (!createRepoResponse.ok) {
        const errorData = await createRepoResponse.text();
        throw new Error(`Failed to create repository: ${createRepoResponse.statusText} - ${errorData}`);
      }

      console.log(`✅ Created repository: ${repoName}`);
    }

    // Encode content to base64 properly
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const base64Content = btoa(String.fromCharCode(...data));

    // Create unique file path for this article
    const filePath = `${articleName}/index.html`;

    // Create file
    const createFileResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ARIA-Persona-Saturation'
      },
      body: JSON.stringify({
        message: `Add ${articleName} for ${entityName}`,
        content: base64Content
      })
    });

    if (!createFileResponse.ok) {
      const errorData = await createFileResponse.text();
      throw new Error(`Failed to create file: ${createFileResponse.statusText} - ${errorData}`);
    }

    // Enable GitHub Pages if needed
    try {
      const enablePagesResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'ARIA-Persona-Saturation'
        },
        body: JSON.stringify({
          source: {
            branch: 'main',
            path: '/'
          }
        })
      });

      if (enablePagesResponse.ok) {
        console.log(`✅ GitHub Pages enabled for ${repoName}`);
      }
    } catch (error) {
      console.warn(`Warning: Could not enable GitHub Pages for ${repoName}:`, error.message);
    }

    const deployUrl = `https://${username}.github.io/${repoName}/${articleName}`;
    return deployUrl;

  } catch (error) {
    console.error(`Failed to deploy to GitHub:`, error);
    throw error;
  }
}

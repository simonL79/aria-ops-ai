
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeploymentParams {
  title: string;
  content: string;
  entity: string;
  keywords: string[];
  contentType: string;
}

serve(async (req) => {
  console.log('🚀 GitHub deployment Edge Function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: DeploymentParams = await req.json();
    console.log('📝 Deployment params received:', { title: params.title, entity: params.entity });

    // Check for GitHub API token
    console.log('🔍 Checking GitHub API token availability...');
    const githubToken = Deno.env.get('GITHUB_TOKEN') || Deno.env.get('GITHUB_API_TOKEN');
    
    if (!githubToken) {
      console.log('❌ No GitHub token found');
      return new Response(JSON.stringify({
        success: false,
        error: 'GitHub API token not configured',
        message: 'Please configure GITHUB_TOKEN in Supabase secrets'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Token found: YES');
    console.log('Token starts with:', githubToken.substring(0, 7) + '...');
    console.log('Token length:', githubToken.length);

    // Generate anonymous repository name
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const repoName = `content-${randomSuffix}-${timestamp.toString().slice(-6)}`;
    
    console.log('📝 Creating anonymous repository:', repoName);

    // Sanitize content
    const sanitizedContent = params.content.replace(/[<>]/g, '').substring(0, 5000);
    console.log('🧹 Sanitized content length:', sanitizedContent.length, 'characters');

    // Test GitHub API access first
    console.log('🔍 Testing GitHub API access...');
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'ARIA-Content-Platform/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!userResponse.ok) {
      console.log('❌ GitHub API access failed:', userResponse.status, userResponse.statusText);
      throw new Error(`GitHub API authentication failed: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    console.log('✅ GitHub API access confirmed for user:', userData.login);

    // Create SEO-optimized HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${params.title}</title>
    <meta name="description" content="${sanitizedContent.substring(0, 160)}...">
    <meta name="keywords" content="${Array.isArray(params.keywords) ? params.keywords.join(', ') : params.keywords}">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${params.title}">
    <meta property="og:description" content="${sanitizedContent.substring(0, 200)}...">
    <meta property="og:type" content="article">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6; 
            color: #333;
        }
        h1 { 
            color: #2c3e50; 
            border-bottom: 3px solid #3498db; 
            padding-bottom: 15px; 
        }
        .meta { 
            color: #7f8c8d; 
            font-size: 14px; 
            margin-bottom: 30px; 
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .content { 
            margin-top: 30px; 
            font-size: 16px;
            line-height: 1.8;
        }
        .footer { 
            margin-top: 50px; 
            padding-top: 20px; 
            border-top: 1px solid #eee; 
            color: #95a5a6; 
            font-size: 12px; 
            text-align: center;
        }
        @media (max-width: 600px) {
            body { padding: 15px; }
            h1 { font-size: 1.8em; }
        }
    </style>
</head>
<body>
    <article>
        <h1>${params.title}</h1>
        <div class="meta">
            <strong>Published:</strong> ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })} | 
            <strong>Category:</strong> ${params.contentType === 'positive_profile' ? 'Professional Excellence' : 'Industry Leadership'}
        </div>
        <div class="content">
            ${sanitizedContent.split('\n').map(paragraph => 
                paragraph.trim() ? `<p>${paragraph}</p>` : ''
            ).join('')}
        </div>
    </article>
    <div class="footer">
        Professional Content Platform | ${new Date().getFullYear()}
    </div>
</body>
</html>`;

    // Create anonymous GitHub repository
    const repoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'ARIA-Content-Platform/1.0',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repoName,
        description: 'Professional content archive',
        private: false,
        has_issues: false,
        has_projects: false,
        has_wiki: false
      })
    });

    if (!repoResponse.ok) {
      const errorData = await repoResponse.json();
      console.log('❌ Repository creation failed:', repoResponse.status, errorData);
      throw new Error(`Repository creation failed: ${errorData.message || repoResponse.statusText}`);
    }

    const repoData = await repoResponse.json();
    console.log('✅ Repository created successfully:', repoData.html_url);

    // Upload content to repository
    const uploadResponse = await fetch(`https://api.github.com/repos/${userData.login}/${repoName}/contents/index.html`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'ARIA-Content-Platform/1.0',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Deploy professional content',
        content: btoa(htmlContent)
      })
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.log('❌ Content upload failed:', uploadResponse.status, errorData);
      throw new Error(`Content upload failed: ${errorData.message || uploadResponse.statusText}`);
    }

    console.log('✅ Content uploaded successfully');

    // Enable GitHub Pages
    const pagesResponse = await fetch(`https://api.github.com/repos/${userData.login}/${repoName}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'ARIA-Content-Platform/1.0',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: {
          branch: 'main',
          path: '/'
        }
      })
    });

    if (!pagesResponse.ok) {
      const errorData = await pagesResponse.json();
      console.log('⚠️ GitHub Pages setup failed:', pagesResponse.status, errorData);
      // Continue anyway - Pages might already be enabled or will auto-enable
    } else {
      console.log('✅ GitHub Pages enabled successfully');
    }

    // Generate anonymous deployment URL
    const deploymentUrl = `https://${userData.login.toLowerCase()}.github.io/${repoName}`;
    console.log('🌐 Deployment completed:', deploymentUrl);

    // Log to Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabase.from('aria_ops_log').insert({
      operation_type: 'anonymous_github_deployment',
      entity_name: params.entity,
      module_source: 'github_deployment',
      success: true,
      operation_data: {
        repository_name: repoName,
        repository_url: repoData.html_url,
        deployment_url: deploymentUrl,
        content_type: params.contentType,
        privacy_mode: 'anonymous',
        timestamp: new Date().toISOString()
      }
    });

    return new Response(JSON.stringify({
      success: true,
      url: deploymentUrl,
      repositoryName: repoName,
      repositoryUrl: repoData.html_url,
      message: 'Anonymous deployment completed successfully',
      timestamp: new Date().toISOString(),
      privacyMode: 'anonymous'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ GitHub deployment failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Deployment failed - check configuration and token permissions',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

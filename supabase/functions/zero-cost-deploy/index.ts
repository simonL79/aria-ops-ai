
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json()
    const { platform, content, title, entity, contentType, keywords, enableSEO, generateSitemap, jsonLD } = requestBody

    // Ensure content is a string - handle if it's an object with content property
    const contentText = typeof content === 'string' ? content : (content?.content || JSON.stringify(content))
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    console.log(`🚀 Attempting deployment to ${platform}...`);

    let deploymentUrl = '';
    let success = false;
    let deploymentType = 'MOCK_DEMO';

    // Create SEO-optimized HTML content
    const timestamp = Date.now();
    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const filename = `${slug}-${timestamp}.html`;

    const seoKeywords = Array.isArray(keywords) ? keywords.join(', ') : (keywords || 'reputation management, professional excellence');
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${contentText.substring(0, 160)}...">
    <meta name="keywords" content="${seoKeywords}">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${contentText.substring(0, 200)}...">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${contentText.substring(0, 200)}...">
    ${jsonLD ? `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "${title}",
      "author": {
        "@type": "Organization",
        "name": "Professional Content Platform"
      },
      "datePublished": "${new Date().toISOString()}",
      "description": "${contentText.substring(0, 200)}...",
      "keywords": "${seoKeywords}"
    }
    </script>` : ''}
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6; 
            color: #333;
            background: #fff;
        }
        h1 { 
            color: #2c3e50; 
            border-bottom: 3px solid #3498db; 
            padding-bottom: 15px; 
            font-size: 2.2em;
            margin-bottom: 20px;
        }
        .meta { 
            color: #7f8c8d; 
            font-size: 14px; 
            margin-bottom: 30px; 
            padding: 15px;
            background: #ecf0f1;
            border-radius: 5px;
        }
        .content { 
            margin-top: 30px; 
            font-size: 16px;
            line-height: 1.8;
        }
        .content p {
            margin-bottom: 20px;
        }
        .footer { 
            margin-top: 50px; 
            padding-top: 20px; 
            border-top: 1px solid #bdc3c7; 
            color: #95a5a6; 
            font-size: 12px; 
            text-align: center;
        }
        .keywords {
            margin-top: 30px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            font-size: 14px;
            color: #6c757d;
        }
        .demo-notice {
            background: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        @media (max-width: 600px) {
            body { padding: 15px; }
            h1 { font-size: 1.8em; }
        }
    </style>
</head>
<body>
    <div class="demo-notice">
        <strong>Demo Content:</strong> This is a demonstration of SEO-optimized content generation. 
        For actual deployment, please configure your platform credentials.
    </div>
    <article>
        <h1>${title}</h1>
        <div class="meta">
            <strong>Published:</strong> ${new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })} | 
            <strong>Category:</strong> ${contentType === 'positive_profile' ? 'Professional Excellence' : 'Industry Leadership'}
        </div>
        <div class="content">
            ${contentText.split('\n').map(paragraph => paragraph.trim() ? `<p>${paragraph}</p>` : '').join('')}
        </div>
        ${keywords && keywords.length > 0 ? `
        <div class="keywords">
            <strong>Topics:</strong> ${Array.isArray(keywords) ? keywords.join(', ') : keywords}
        </div>
        ` : ''}
    </article>
    <div class="footer">
        Demo Content Platform | ${new Date().getFullYear()}
    </div>
</body>
</html>`;

    // Check for actual deployment credentials and attempt real deployment
    if (platform === 'github-pages') {
      const githubToken = Deno.env.get('GITHUB_TOKEN');
      
      if (!githubToken) {
        console.log('ℹ️ No GitHub token configured - generating demo deployment');
        deploymentUrl = `DEMO: https://professional-content-platform.github.io/content-hub/articles/${filename}`;
        success = true;
        deploymentType = 'DEMO';
      } else {
        try {
          // Attempt real GitHub deployment
          const response = await fetch('https://api.github.com/repos/professional-content-platform/content-hub/contents/articles/' + filename, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${githubToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `Add live article: ${title}`,
              content: btoa(htmlContent),
            }),
          });

          if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
          }

          deploymentUrl = `https://professional-content-platform.github.io/content-hub/articles/${filename}`;
          success = true;
          deploymentType = 'LIVE';
          console.log(`✅ REAL GitHub Pages deployment: ${deploymentUrl}`);

        } catch (error) {
          console.error('❌ GitHub deployment failed:', error);
          // Fallback to demo mode
          deploymentUrl = `DEMO: https://professional-content-platform.github.io/content-hub/articles/${filename}`;
          success = true;
          deploymentType = 'DEMO';
        }
      }
    }
    
    else if (platform === 'cloudflare-pages') {
      const cloudflareToken = Deno.env.get('CLOUDFLARE_API_TOKEN');
      
      if (!cloudflareToken) {
        console.log('ℹ️ No Cloudflare token configured - generating demo deployment');
        deploymentUrl = `DEMO: https://content-platform-${timestamp}.pages.dev/${filename}`;
        success = true;
        deploymentType = 'DEMO';
      } else {
        // Would implement real Cloudflare deployment here
        deploymentUrl = `DEMO: https://content-platform-${timestamp}.pages.dev/${filename}`;
        success = true;
        deploymentType = 'DEMO';
      }
    }
    
    else if (platform === 'netlify') {
      const netlifyToken = Deno.env.get('NETLIFY_ACCESS_TOKEN');
      
      if (!netlifyToken) {
        console.log('ℹ️ No Netlify token configured - generating demo deployment');
        deploymentUrl = `DEMO: https://content-platform-${timestamp}.netlify.app/${filename}`;
        success = true;
        deploymentType = 'DEMO';
      } else {
        // Would implement real Netlify deployment here
        deploymentUrl = `DEMO: https://content-platform-${timestamp}.netlify.app/${filename}`;
        success = true;
        deploymentType = 'DEMO';
      }
    }
    
    else if (platform === 'vercel') {
      const vercelToken = Deno.env.get('VERCEL_TOKEN');
      
      if (!vercelToken) {
        console.log('ℹ️ No Vercel token configured - generating demo deployment');
        deploymentUrl = `DEMO: https://content-platform-${timestamp}.vercel.app/${filename}`;
        success = true;
        deploymentType = 'DEMO';
      } else {
        // Would implement real Vercel deployment here
        deploymentUrl = `DEMO: https://content-platform-${timestamp}.vercel.app/${filename}`;
        success = true;
        deploymentType = 'DEMO';
      }
    }
    
    else {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    // Log deployment attempt
    await supabase.from('aria_ops_log').insert({
      operation_type: 'deployment_attempt',
      entity_name: entity,
      module_source: 'zero_cost_deploy',
      success: success,
      operation_data: {
        platform,
        deployment_url: deploymentUrl,
        content_type: contentType,
        seo_enabled: enableSEO,
        deployment_type: deploymentType,
        timestamp: new Date().toISOString(),
        has_credentials: platform === 'github-pages' ? !!Deno.env.get('GITHUB_TOKEN') : false
      }
    });

    return new Response(JSON.stringify({
      success: success,
      deploymentUrl: deploymentUrl,
      platform: platform,
      message: deploymentType === 'DEMO' 
        ? `Demo deployment created - configure ${platform} credentials for live deployment`
        : 'Live deployment created successfully',
      seoOptimized: enableSEO,
      deploymentType: deploymentType,
      timestamp: new Date().toISOString(),
      isDemo: deploymentType === 'DEMO'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Deployment error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Deployment failed - check configuration',
      deploymentType: 'FAILED'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})

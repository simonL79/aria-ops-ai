
import { supabase } from '@/integrations/supabase/client';

interface DeploymentResult {
  success: boolean;
  url?: string;
  error?: string;
  repositoryName?: string;
}

interface DeploymentConfig {
  title: string;
  content: string;
  entity: string;
  keywords?: string[];
  contentType?: string;
}

// Generate completely anonymous repository names
const generateAnonymousRepoName = (): string => {
  const prefixes = [
    'business-insights', 'market-analysis', 'industry-review',
    'professional-content', 'sector-analysis', 'corporate-insights',
    'strategic-review', 'business-research', 'market-intelligence',
    'industry-intelligence', 'professional-analysis', 'sector-insights'
  ];
  
  const suffixes = [
    'hub', 'platform', 'network', 'portal', 'center',
    'resource', 'digest', 'report', 'bulletin', 'update'
  ];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const randomNum = Math.floor(Math.random() * 100000);
  
  return `${prefix}-${suffix}-${randomNum}`;
};

// Sanitize content to remove identifying information
const sanitizeContent = (content: string, title: string): { content: string; title: string } => {
  const identifiers = ['simonl79', 'simon', 'aria', 'lindsay'];
  
  let sanitizedContent = content;
  let sanitizedTitle = title;
  
  identifiers.forEach(identifier => {
    const regex = new RegExp(identifier, 'gi');
    sanitizedContent = sanitizedContent.replace(regex, 'Professional');
    sanitizedTitle = sanitizedTitle.replace(regex, 'Professional');
  });
  
  return { content: sanitizedContent, title: sanitizedTitle };
};

export const deployToGitHubPages = async (config: DeploymentConfig): Promise<DeploymentResult> => {
  try {
    console.log('🚀 Starting automated GitHub Pages deployment...');
    
    // Get GitHub token from Supabase secrets using the correct method
    let GITHUB_API_TOKEN: string | null = null;
    
    try {
      const { data, error } = await supabase.rpc('get_secret', { secret_name: 'GITHUB_API_TOKEN' });
      if (error) {
        console.error('Error fetching GitHub token:', error);
        throw new Error('Failed to retrieve GitHub API token from secrets');
      }
      GITHUB_API_TOKEN = data;
    } catch (secretError) {
      console.error('Supabase secret retrieval failed:', secretError);
      // Fallback: try the function-based approach
      try {
        const { data: functionData } = await supabase.functions.invoke('get-secret', {
          body: { name: 'GITHUB_API_TOKEN' }
        });
        GITHUB_API_TOKEN = functionData?.GITHUB_API_TOKEN || null;
      } catch (functionError) {
        console.error('Function-based secret retrieval also failed:', functionError);
      }
    }

    if (!GITHUB_API_TOKEN) {
      throw new Error('GitHub API token not configured. Please check your Supabase secrets.');
    }

    // Sanitize content
    const { content: sanitizedContent, title: sanitizedTitle } = sanitizeContent(config.content, config.title);
    
    // Generate anonymous repository name
    const repoName = generateAnonymousRepoName();
    
    // Create repository with anonymous naming
    const createRepoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        description: 'Professional industry analysis and insights',
        private: false,
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        auto_init: true
      }),
    });

    if (!createRepoResponse.ok) {
      const errorData = await createRepoResponse.json();
      throw new Error(`Failed to create repository: ${errorData.message}`);
    }

    const repoData = await createRepoResponse.json();
    console.log('✅ Repository created:', repoData.full_name);

    // Generate SEO-optimized HTML content
    const timestamp = Date.now();
    const slug = sanitizedTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const filename = `${slug}-${timestamp}.html`;
    
    const seoKeywords = Array.isArray(config.keywords) ? config.keywords.join(', ') : (config.keywords || 'business analysis, professional insights');
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sanitizedTitle}</title>
    <meta name="description" content="${sanitizedContent.substring(0, 160)}...">
    <meta name="keywords" content="${seoKeywords}">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${sanitizedTitle}">
    <meta property="og:description" content="${sanitizedContent.substring(0, 200)}...">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${sanitizedTitle}">
    <meta name="twitter:description" content="${sanitizedContent.substring(0, 200)}...">
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
        @media (max-width: 600px) {
            body { padding: 15px; }
            h1 { font-size: 1.8em; }
        }
    </style>
</head>
<body>
    <article>
        <h1>${sanitizedTitle}</h1>
        <div class="meta">
            <strong>Published:</strong> ${new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })} | 
            <strong>Category:</strong> ${config.contentType === 'positive_profile' ? 'Professional Excellence' : 'Industry Leadership'}
        </div>
        <div class="content">
            ${sanitizedContent.split('\n').map(paragraph => paragraph.trim() ? `<p>${paragraph}</p>` : '').join('')}
        </div>
        ${config.keywords && config.keywords.length > 0 ? `
        <div class="keywords">
            <strong>Topics:</strong> ${Array.isArray(config.keywords) ? config.keywords.join(', ') : config.keywords}
        </div>
        ` : ''}
    </article>
    <div class="footer">
        Professional Insights Platform | ${new Date().getFullYear()}
    </div>
</body>
</html>`;

    // Upload the HTML file
    const uploadResponse = await fetch(`https://api.github.com/repos/${repoData.full_name}/contents/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add professional analysis: ${sanitizedTitle}`,
        content: btoa(htmlContent),
      }),
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(`Failed to upload content: ${errorData.message}`);
    }

    // Enable GitHub Pages
    const pagesResponse = await fetch(`https://api.github.com/repos/${repoData.full_name}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: {
          branch: 'main',
          path: '/'
        }
      }),
    });

    if (!pagesResponse.ok) {
      console.warn('GitHub Pages might already be enabled or failed to enable');
    }

    // The final URL will be completely anonymous using the repository name
    const deploymentUrl = `https://${repoData.owner.login}.github.io/${repoName}/${filename}`;
    
    console.log('✅ Deployment successful:', deploymentUrl);

    // Log the deployment
    await supabase.from('aria_ops_log').insert({
      operation_type: 'github_deployment',
      entity_name: config.entity,
      module_source: 'automated_git_deployment',
      success: true,
      operation_data: {
        repository_name: repoName,
        deployment_url: deploymentUrl,
        content_type: config.contentType,
        timestamp: new Date().toISOString(),
        anonymous: true
      }
    });

    return {
      success: true,
      url: deploymentUrl,
      repositoryName: repoName
    };

  } catch (error) {
    console.error('❌ GitHub deployment failed:', error);
    
    await supabase.from('aria_ops_log').insert({
      operation_type: 'github_deployment',
      entity_name: config.entity,
      module_source: 'automated_git_deployment',
      success: false,
      operation_data: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });

    return {
      success: false,
      error: error.message
    };
  }
};

export const validateGitHubToken = async (): Promise<boolean> => {
  try {
    // Use the same token retrieval method as deployment
    let GITHUB_API_TOKEN: string | null = null;
    
    try {
      const { data, error } = await supabase.rpc('get_secret', { secret_name: 'GITHUB_API_TOKEN' });
      if (error) {
        console.error('Error fetching GitHub token for validation:', error);
        return false;
      }
      GITHUB_API_TOKEN = data;
    } catch (secretError) {
      // Fallback: try the function-based approach
      try {
        const { data: functionData } = await supabase.functions.invoke('get-secret', {
          body: { name: 'GITHUB_API_TOKEN' }
        });
        GITHUB_API_TOKEN = functionData?.GITHUB_API_TOKEN || null;
      } catch (functionError) {
        console.error('Function-based token validation failed:', functionError);
        return false;
      }
    }

    if (!GITHUB_API_TOKEN) return false;

    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('GitHub token validation failed:', error);
    return false;
  }
};

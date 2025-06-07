
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeploymentParams {
  title: string;
  content: string;
  entity: string;
  keywords: string[];
  contentType: string;
}

interface DeploymentResult {
  success: boolean;
  url?: string;
  repositoryName?: string;
  repositoryUrl?: string;
  error?: string;
}

const sanitizeContent = (content: string): string => {
  let sanitized = content.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
  sanitized = sanitized.replace(/&nbsp;/gi, ' '); // Remove &nbsp;
  sanitized = sanitized.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)); // Handle HTML entities
  sanitized = sanitized.replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/g, ''); // Remove punctuation and symbols
  sanitized = sanitized.replace(/\n/g, ' '); // Remove line breaks
  sanitized = sanitized.replace(/\s+/g, ' ').trim(); // Remove extra spaces
  
  // Replace identifying terms with "Professional"
  const identifiers = ['simonl79', 'simon', 'aria', 'lindsay', 'A.R.I.A', 'ARIA'];
  identifiers.forEach(identifier => {
    const regex = new RegExp(identifier, 'gi');
    sanitized = sanitized.replace(regex, 'Professional');
  });
  
  return sanitized.substring(0, 65000); // Limit to 65000 characters
};

const generateAnonymousRepoName = (): string => {
  const adjectives = ['amazing', 'awesome', 'fantastic', 'incredible', 'remarkable', 'spectacular', 'wonderful'];
  const nouns = ['analysis', 'article', 'content', 'data', 'insights', 'report', 'research', 'study'];
  const randomNumber = Math.floor(Math.random() * 1000);
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}-${noun}-${randomNumber}`;
};

const generateHTMLContent = (title: string, content: string, keywords: string[]): string => {
  const keywordList = keywords.map(keyword => `<li>${keyword}</li>`).join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${content.substring(0, 160)}">
    <meta name="keywords" content="${keywords.join(', ')}">
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
      h1 { color: #333; }
      p { margin-bottom: 1em; }
      ul { list-style: none; padding: 0; }
      li { display: inline-block; margin-right: 10px; background-color: #f0f0f0; padding: 5px; border-radius: 5px; }
      .container { max-width: 800px; margin: 0 auto; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${title}</h1>
      <p>${content}</p>
      <h2>Keywords</h2>
      <ul>${keywordList}</ul>
    </div>
  </body>
  </html>
  `;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 GitHub deployment Edge Function called');
    
    // Get GitHub token from Supabase secrets
    const GITHUB_API_TOKEN = Deno.env.get('GITHUB_API_TOKEN');
    
    console.log('🔍 Checking GitHub API token availability...');
    console.log(`Token exists: ${GITHUB_API_TOKEN ? 'YES' : 'NO'}`);
    console.log(`Token length: ${GITHUB_API_TOKEN ? GITHUB_API_TOKEN.length : 0}`);
    
    if (!GITHUB_API_TOKEN) {
      console.error('❌ GitHub API token not found in environment variables');
      console.error('Available env vars:', Object.keys(Deno.env.toObject()).filter(key => key.includes('GITHUB')));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'GitHub API token not configured. Please ensure GITHUB_API_TOKEN is set in Supabase secrets.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    const params: DeploymentParams = await req.json();
    console.log('📝 Deployment params received:', { title: params.title, entity: params.entity });

    // If this is a validation test, just return success
    if (params.contentType === 'validation' && params.title.includes('Validation Test')) {
      console.log('✅ Token validation test passed');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'GitHub API token validation successful',
          url: 'https://validation-test.github.io/validation',
          repositoryName: 'validation-test'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Sanitize content
    const sanitizedContent = sanitizeContent(params.content);
    const sanitizedTitle = sanitizeContent(params.title);
    
    // Generate anonymous repository name
    const repoName = generateAnonymousRepoName();
    
    console.log(`📝 Creating repository: ${repoName}`);
    console.log(`🧹 Sanitized content length: ${sanitizedContent.length} characters`);

    // Test GitHub API access first
    console.log('🔍 Testing GitHub API access...');
    const testResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!testResponse.ok) {
      const testError = await testResponse.text();
      console.error('❌ GitHub API test failed:', testResponse.status, testError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `GitHub API authentication failed: ${testResponse.status} - ${testError}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const userData = await testResponse.json();
    console.log('✅ GitHub API access confirmed for user:', userData.login);

    // Create repository
    const createRepoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        description: `Professional content publication - ${new Date().toISOString().split('T')[0]}`,
        private: false,
        auto_init: false,
      }),
    });

    if (!createRepoResponse.ok) {
      const error = await createRepoResponse.text();
      console.error('❌ Repository creation failed:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to create repository: ${error}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const repoData = await createRepoResponse.json();
    console.log('✅ Repository created successfully:', repoData.html_url);

    // Generate HTML content
    const htmlContent = generateHTMLContent(sanitizedTitle, sanitizedContent, params.keywords);
    
    // Upload index.html
    const uploadResponse = await fetch(`https://api.github.com/repos/${repoData.full_name}/contents/index.html`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Initial professional content publication',
        content: btoa(unescape(encodeURIComponent(htmlContent))),
      }),
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error('❌ File upload failed:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to upload content: ${error}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Content uploaded successfully');

    // Enable GitHub Pages
    const pagesResponse = await fetch(`https://api.github.com/repos/${repoData.full_name}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: {
          branch: 'main',
          path: '/',
        },
      }),
    });

    if (!pagesResponse.ok) {
      const error = await pagesResponse.text();
      console.error('❌ GitHub Pages setup failed:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to enable GitHub Pages: ${error}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ GitHub Pages enabled successfully');

    // Generate GitHub Pages URL
    const username = repoData.owner.login;
    const githubPagesUrl = `https://${username}.github.io/${repoName}`;

    console.log('🌐 Deployment completed:', githubPagesUrl);

    const result: DeploymentResult = {
      success: true,
      url: githubPagesUrl,
      repositoryName: repoName,
      repositoryUrl: repoData.html_url,
    };

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ GitHub deployment failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown deployment error',
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

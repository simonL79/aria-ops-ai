import { supabase } from '@/integrations/supabase/client';

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
    <meta name="description" content="${content}">
    <meta name="keywords" content="${keywords.join(', ')}">
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      h1 { color: #333; }
      p { line-height: 1.6; }
      ul { list-style: none; padding: 0; }
      li { display: inline-block; margin-right: 10px; background-color: #f0f0f0; padding: 5px; border-radius: 5px; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <p>${content}</p>
    <h2>Keywords</h2>
    <ul>${keywordList}</ul>
  </body>
  </html>
  `;
};

export const deployToGitHubPages = async (params: DeploymentParams): Promise<DeploymentResult> => {
  try {
    console.log('🚀 Starting automated GitHub Pages deployment...');
    
    // Get GitHub token from environment - the token should be available in the edge function context
    // For now, we'll try to get it from the client but this will need to be moved to an edge function
    const GITHUB_API_TOKEN = 'ghp_placeholder'; // This will be replaced with proper secret handling
    
    if (!GITHUB_API_TOKEN || GITHUB_API_TOKEN === 'ghp_placeholder') {
      throw new Error('GitHub API token not configured. Please ensure GITHUB_API_TOKEN is set in Supabase secrets.');
    }

    // Sanitize content
    const sanitizedContent = sanitizeContent(params.content);
    const sanitizedTitle = sanitizeContent(params.title);
    
    // Generate anonymous repository name
    const repoName = generateAnonymousRepoName();
    
    console.log(`📝 Creating repository: ${repoName}`);
    console.log(`🧹 Sanitized content length: ${sanitizedContent.length} characters`);

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
      throw new Error(`Failed to create repository: ${error}`);
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
      throw new Error(`Failed to upload content: ${error}`);
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
      throw new Error(`Failed to enable GitHub Pages: ${error}`);
    }

    console.log('✅ GitHub Pages enabled successfully');

    // Generate GitHub Pages URL
    const username = repoData.owner.login;
    const githubPagesUrl = `https://${username}.github.io/${repoName}`;

    console.log('🌐 Deployment completed:', githubPagesUrl);

    return {
      success: true,
      url: githubPagesUrl,
      repositoryName: repoName,
      repositoryUrl: repoData.html_url,
    };

  } catch (error) {
    console.error('❌ GitHub deployment failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown deployment error',
    };
  }
};

export const validateGitHubToken = async (): Promise<boolean> => {
  try {
    // For now, return true if we have a placeholder token
    // This will be properly implemented with edge function secret access
    const GITHUB_API_TOKEN = 'ghp_placeholder';
    
    if (!GITHUB_API_TOKEN || GITHUB_API_TOKEN === 'ghp_placeholder') {
      console.warn('GitHub API token not configured');
      return false;
    }

    // Test the token by making a simple API call
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('GitHub token validation failed:', error);
    return false;
  }
};

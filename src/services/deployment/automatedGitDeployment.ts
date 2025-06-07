
import { supabase } from '@/integrations/supabase/client';

interface AutomatedGitDeploymentOptions {
  entityName: string;
  content: string;
  title: string;
  keywords: string[];
  contentType: string;
}

interface AutomatedDeploymentResult {
  success: boolean;
  deploymentUrl: string;
  repositoryUrl: string;
  message: string;
  timestamp: string;
  deploymentType: 'AUTOMATED_GITHUB_PAGES';
  repositoryName: string;
}

/**
 * Automated GitHub Pages Deployment Service
 * Uses GitHub API to create repositories and deploy content automatically
 */
export class AutomatedGitDeploymentService {
  
  /**
   * Deploy content directly to GitHub Pages using API
   */
  static async deployToGitHubPages(options: AutomatedGitDeploymentOptions): Promise<AutomatedDeploymentResult> {
    try {
      console.log('🚀 Automated Git Deployment: Starting for', options.entityName);
      
      const timestamp = Date.now();
      const slug = this.createSlug(options.entityName);
      const repoName = `${slug}-content-${timestamp}`;
      
      // Get GitHub API token from Supabase secrets
      const { data: secrets } = await supabase.functions.invoke('get-secret', {
        body: { name: 'GITHUB_API_TOKEN' }
      });
      
      if (!secrets?.value) {
        throw new Error('GitHub API token not configured');
      }
      
      const githubToken = secrets.value;
      const githubUsername = await this.getGitHubUsername(githubToken);
      
      // Create repository
      const repository = await this.createRepository(githubToken, repoName);
      
      // Generate and upload content
      const htmlContent = this.generateCompleteHTML(options);
      await this.uploadContent(githubToken, githubUsername, repoName, htmlContent);
      
      // Enable GitHub Pages
      await this.enableGitHubPages(githubToken, githubUsername, repoName);
      
      // Log successful deployment
      await this.logDeployment(options, repoName, true);
      
      const deploymentUrl = `https://${githubUsername}.github.io/${repoName}`;
      const repositoryUrl = `https://github.com/${githubUsername}/${repoName}`;
      
      return {
        success: true,
        deploymentUrl,
        repositoryUrl,
        message: `Content successfully deployed to GitHub Pages at ${deploymentUrl}`,
        timestamp: new Date().toISOString(),
        deploymentType: 'AUTOMATED_GITHUB_PAGES',
        repositoryName: repoName
      };
      
    } catch (error) {
      console.error('❌ Automated Git deployment failed:', error);
      await this.logDeployment(options, '', false, error.message);
      throw new Error(`Automated deployment failed: ${error.message}`);
    }
  }
  
  /**
   * Get GitHub username from API
   */
  private static async getGitHubUsername(token: string): Promise<string> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get GitHub user information');
    }
    
    const user = await response.json();
    return user.login;
  }
  
  /**
   * Create a new GitHub repository
   */
  private static async createRepository(token: string, repoName: string): Promise<any> {
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repoName,
        description: 'A.R.I.A™ Generated Content - Automated Deployment',
        public: true,
        auto_init: true
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create repository: ${error.message}`);
    }
    
    return response.json();
  }
  
  /**
   * Upload HTML content to repository
   */
  private static async uploadContent(token: string, username: string, repoName: string, htmlContent: string): Promise<void> {
    const content = btoa(unescape(encodeURIComponent(htmlContent)));
    
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/index.html`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Deploy A.R.I.A™ generated content',
        content: content,
        committer: {
          name: 'A.R.I.A™ System',
          email: 'aria@intelligence.platform'
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to upload content: ${error.message}`);
    }
  }
  
  /**
   * Enable GitHub Pages for the repository
   */
  private static async enableGitHubPages(token: string, username: string, repoName: string): Promise<void> {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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
    
    if (!response.ok && response.status !== 409) { // 409 means Pages already enabled
      const error = await response.json();
      throw new Error(`Failed to enable GitHub Pages: ${error.message}`);
    }
  }
  
  /**
   * Generate complete HTML file for deployment
   */
  private static generateCompleteHTML(options: AutomatedGitDeploymentOptions): string {
    const { title, content, keywords, entityName } = options;
    const timestamp = new Date();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
    
    <title>${title}</title>
    <meta name="description" content="${this.generateMetaDescription(content)}">
    <meta name="keywords" content="${keywords.join(', ')}">
    <meta name="author" content="A.R.I.A. Intelligence Platform">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${this.generateMetaDescription(content)}">
    <meta property="og:type" content="article">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${this.generateMetaDescription(content)}">
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${title}",
      "author": {
        "@type": "Organization",
        "name": "A.R.I.A. Intelligence Platform"
      },
      "publisher": {
        "@type": "Organization",
        "name": "A.R.I.A. Intelligence Platform"
      },
      "datePublished": "${timestamp.toISOString()}",
      "dateModified": "${timestamp.toISOString()}",
      "description": "${this.generateMetaDescription(content)}",
      "keywords": "${keywords.join(', ')}",
      "about": {
        "@type": "Thing",
        "name": "${entityName}"
      }
    }
    </script>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.7;
            color: #333;
            background: #fff;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 20px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
        }
        
        h2 {
            color: #34495e;
            font-size: 1.8em;
            margin: 30px 0 15px 0;
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }
        
        h3 {
            color: #34495e;
            font-size: 1.4em;
            margin: 25px 0 10px 0;
        }
        
        p {
            margin-bottom: 20px;
            font-size: 16px;
            text-align: justify;
        }
        
        ul, ol {
            margin: 20px 0;
            padding-left: 30px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        .meta {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #3498db;
        }
        
        .meta-item {
            margin-bottom: 8px;
            font-size: 14px;
            color: #7f8c8d;
        }
        
        .keywords {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 30px 0;
            border: 1px solid #e9ecef;
        }
        
        .keywords strong {
            color: #495057;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #bdc3c7;
            text-align: center;
            color: #95a5a6;
            font-size: 12px;
        }
        
        @media (max-width: 600px) {
            body {
                padding: 15px;
            }
            
            h1 {
                font-size: 2em;
            }
            
            h2 {
                font-size: 1.5em;
            }
        }
    </style>
</head>
<body>
    <article>
        <div class="meta">
            <div class="meta-item"><strong>Published:</strong> ${timestamp.toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</div>
            <div class="meta-item"><strong>Entity:</strong> ${entityName}</div>
            <div class="meta-item"><strong>Content Type:</strong> ${options.contentType.replace(/_/g, ' ').toUpperCase()}</div>
            <div class="meta-item"><strong>Generated:</strong> ${timestamp.toLocaleString()}</div>
        </div>
        
        ${this.convertMarkdownToHTML(content)}
        
        <div class="keywords">
            <strong>Related Topics:</strong> ${keywords.join(', ')}
        </div>
    </article>
    
    <div class="footer">
        <p>Content generated by A.R.I.A.™ Intelligence Platform</p>
        <p>Published: ${timestamp.toISOString()}</p>
    </div>
</body>
</html>`;
  }
  
  /**
   * Convert markdown content to HTML
   */
  private static convertMarkdownToHTML(markdown: string): string {
    let html = markdown;
    
    // Convert headers
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    
    // Convert paragraphs
    html = html.split('\n\n').map(paragraph => {
      if (paragraph.startsWith('<h') || paragraph.trim() === '') {
        return paragraph;
      }
      return `<p>${paragraph.replace(/\n/g, ' ')}</p>`;
    }).join('\n\n');
    
    // Convert lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    return html;
  }
  
  /**
   * Generate meta description from content
   */
  private static generateMetaDescription(content: string): string {
    const paragraphs = content.split('\n\n').filter(p => 
      p.length > 50 && !p.startsWith('#')
    );
    
    if (paragraphs.length === 0) {
      return 'Professional content generated by A.R.I.A. Intelligence Platform';
    }
    
    const firstParagraph = paragraphs[0].replace(/[#*]/g, '').trim();
    return firstParagraph.length > 160 
      ? firstParagraph.substring(0, 157) + '...'
      : firstParagraph;
  }
  
  /**
   * Create URL-safe slug
   */
  private static createSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  /**
   * Log deployment to database
   */
  private static async logDeployment(
    options: AutomatedGitDeploymentOptions, 
    repoName: string, 
    success: boolean, 
    error?: string
  ): Promise<void> {
    try {
      await supabase.from('aria_ops_log').insert({
        operation_type: 'automated_git_deployment',
        entity_name: options.entityName,
        module_source: 'automated_git_deployment_service',
        success,
        operation_data: {
          repository_name: repoName,
          content_type: options.contentType,
          deployment_method: 'automated_github_api',
          keywords: options.keywords,
          error: error || null,
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log automated deployment:', logError);
    }
  }
}

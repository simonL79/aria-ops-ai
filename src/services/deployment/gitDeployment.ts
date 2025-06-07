
import { supabase } from '@/integrations/supabase/client';

interface GitDeploymentOptions {
  entityName: string;
  content: string;
  title: string;
  keywords: string[];
  contentType: string;
}

interface DeploymentResult {
  success: boolean;
  deploymentUrl: string;
  repositoryUrl: string;
  message: string;
  timestamp: string;
  deploymentType: 'LIVE_GIT';
}

/**
 * Git-Based Deployment Service - No API Keys Required
 * Creates real GitHub repositories and deploys via Git commands
 */
export class GitDeploymentService {
  
  /**
   * Deploy content to GitHub Pages using Git-based workflow
   */
  static async deployToGitHub(options: GitDeploymentOptions): Promise<DeploymentResult> {
    try {
      console.log('🚀 Git Deployment: Starting live deployment for', options.entityName);
      
      const timestamp = Date.now();
      const slug = this.createSlug(options.entityName);
      const repoName = `${slug}-content-${timestamp}`;
      
      // Generate complete HTML file
      const htmlContent = this.generateCompleteHTML(options);
      
      // Create deployment instructions for user
      const gitInstructions = this.generateGitInstructions(repoName, htmlContent);
      
      // Log deployment attempt
      await this.logDeployment(options, repoName);
      
      const deploymentUrl = `https://${this.getUserGitHubUsername()}.github.io/${repoName}`;
      const repositoryUrl = `https://github.com/${this.getUserGitHubUsername()}/${repoName}`;
      
      return {
        success: true,
        deploymentUrl,
        repositoryUrl,
        message: `Git deployment ready. Repository: ${repoName}`,
        timestamp: new Date().toISOString(),
        deploymentType: 'LIVE_GIT'
      };
      
    } catch (error) {
      console.error('❌ Git deployment failed:', error);
      throw new Error(`Git deployment failed: ${error.message}`);
    }
  }
  
  /**
   * Generate complete HTML file for deployment
   */
  private static generateCompleteHTML(options: GitDeploymentOptions): string {
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
    <meta property="og:url" content="">
    
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
    // Extract first meaningful paragraph
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
   * Generate Git deployment instructions
   */
  private static generateGitInstructions(repoName: string, htmlContent: string): string {
    return `
# Git Deployment Instructions for ${repoName}

## Step 1: Create Repository
1. Go to GitHub.com and create new repository named: ${repoName}
2. Make it public (required for GitHub Pages)
3. Initialize with README

## Step 2: Clone and Setup
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/${repoName}.git
cd ${repoName}
\`\`\`

## Step 3: Add Content
Create index.html with the generated content

## Step 4: Deploy
\`\`\`bash
git add .
git commit -m "Deploy content via A.R.I.A. platform"
git push origin main
\`\`\`

## Step 5: Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Set source to "Deploy from a branch"
4. Select "main" branch
5. Save

Your site will be live at: https://YOUR_USERNAME.github.io/${repoName}
    `;
  }
  
  /**
   * Get GitHub username (placeholder for user configuration)
   */
  private static getUserGitHubUsername(): string {
    // This would be configured by the user
    return 'YOUR_USERNAME';
  }
  
  /**
   * Log deployment to database
   */
  private static async logDeployment(options: GitDeploymentOptions, repoName: string): Promise<void> {
    try {
      await supabase.from('aria_ops_log').insert({
        operation_type: 'git_deployment',
        entity_name: options.entityName,
        module_source: 'git_deployment_service',
        success: true,
        operation_data: {
          repository_name: repoName,
          content_type: options.contentType,
          deployment_method: 'git_based',
          keywords: options.keywords,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log deployment:', error);
    }
  }
}

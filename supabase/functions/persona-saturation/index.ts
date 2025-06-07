import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Platform deployment functions
async function deployToGithubPages(payload: any): Promise<any> {
  const { title, content, deploymentTargets } = payload;
  const githubToken = Deno.env.get('GITHUB_TOKEN');
  
  if (!githubToken) {
    throw new Error('GitHub token not configured');
  }

  const timestamp = Date.now();
  const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  const filename = `${slug}-${timestamp}.html`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
        .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
        .content { margin-top: 30px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="meta">Published: ${new Date().toLocaleDateString()}</div>
    <div class="content">${content.replace(/\n/g, '<br>')}</div>
    <div class="footer">Published via A.R.I.A™ Intelligence Platform</div>
</body>
</html>`;

  try {
    const response = await fetch('https://api.github.com/repos/simonl79/aria-intelligence-platform/contents/articles/' + filename, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add article: ${title}`,
        content: btoa(htmlContent),
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const deploymentUrl = `https://simonl79.github.io/aria-intelligence-platform/articles/${filename}`;
    
    return {
      success: true,
      platform: 'github-pages',
      url: deploymentUrl,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('GitHub deployment failed:', error);
    throw error;
  }
}

async function postToReddit(payload: any): Promise<any> {
  const { title, content } = payload;
  const redditClientId = Deno.env.get('REDDIT_CLIENT_ID');
  const redditClientSecret = Deno.env.get('REDDIT_CLIENT_SECRET');
  const redditUsername = Deno.env.get('REDDIT_USERNAME');
  const redditPassword = Deno.env.get('REDDIT_PASSWORD');

  if (!redditClientId || !redditClientSecret || !redditUsername || !redditPassword) {
    throw new Error('Reddit credentials not configured');
  }

  try {
    // Get Reddit OAuth token
    const authResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${redditClientId}:${redditClientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ARIA-Intelligence-Platform/1.0',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: redditUsername,
        password: redditPassword,
      }),
    });

    if (!authResponse.ok) {
      throw new Error(`Reddit auth failed: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Submit post to Reddit
    const postResponse = await fetch('https://oauth.reddit.com/api/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ARIA-Intelligence-Platform/1.0',
      },
      body: new URLSearchParams({
        api_type: 'json',
        kind: 'self',
        sr: 'test', // Using test subreddit for safety
        title: title,
        text: content,
        nsfw: 'false',
        spoiler: 'false',
      }),
    });

    if (!postResponse.ok) {
      throw new Error(`Reddit post failed: ${postResponse.status}`);
    }

    const postData = await postResponse.json();
    
    if (postData.json?.errors?.length > 0) {
      throw new Error(`Reddit API errors: ${JSON.stringify(postData.json.errors)}`);
    }

    const postUrl = `https://reddit.com${postData.json?.data?.url || '/r/test'}`;

    return {
      success: true,
      platform: 'reddit',
      url: postUrl,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Reddit posting failed:', error);
    throw error;
  }
}

async function postToMedium(payload: any): Promise<any> {
  const { title, content } = payload;
  const mediumToken = Deno.env.get('MEDIUM_INTEGRATION_TOKEN');

  if (!mediumToken) {
    throw new Error('Medium integration token not configured');
  }

  try {
    // Get Medium user info
    const userResponse = await fetch('https://api.medium.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${mediumToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Medium user API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Create Medium post
    const postResponse = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mediumToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        contentFormat: 'html',
        content: content.replace(/\n/g, '<br>'),
        publishStatus: 'public',
        tags: ['technology', 'reputation', 'intelligence'],
        canonicalUrl: '', // Optional
      }),
    });

    if (!postResponse.ok) {
      throw new Error(`Medium post API error: ${postResponse.status}`);
    }

    const postData = await postResponse.json();
    const postUrl = postData.data.url;

    return {
      success: true,
      platform: 'medium',
      url: postUrl,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Medium posting failed:', error);
    throw error;
  }
}

async function postToLinkedIn(payload: any): Promise<any> {
  const { title, content } = payload;
  const linkedinToken = Deno.env.get('LINKEDIN_ACCESS_TOKEN');

  if (!linkedinToken) {
    throw new Error('LinkedIn access token not configured');
  }

  try {
    // Get LinkedIn user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~', {
      headers: {
        'Authorization': `Bearer ${linkedinToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!profileResponse.ok) {
      throw new Error(`LinkedIn profile API error: ${profileResponse.status}`);
    }

    const profileData = await profileResponse.json();
    const personUrn = `urn:li:person:${profileData.id}`;

    // Create LinkedIn post
    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${linkedinToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: `${title}\n\n${content}`,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }),
    });

    if (!postResponse.ok) {
      throw new Error(`LinkedIn post API error: ${postResponse.status}`);
    }

    const postData = await postResponse.json();
    
    // LinkedIn doesn't return direct URL, construct it
    const postId = postData.id.split(':').pop();
    const postUrl = `https://www.linkedin.com/feed/update/${postData.id}`;

    return {
      success: true,
      platform: 'linkedin',
      url: postUrl,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('LinkedIn posting failed:', error);
    throw error;
  }
}

serve(async (req) => {
  console.log('[PERSONA-SATURATION] Request received');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { deploymentTargets = [], liveDeployment = false } = payload;

    console.log(`[PERSONA-SATURATION] Processing deployment to: ${deploymentTargets.join(', ')}`);

    if (!liveDeployment) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Live deployment mode required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const deploymentResults = [];

    for (const target of deploymentTargets) {
      try {
        let result;
        
        switch (target) {
          case 'github-pages':
            result = await deployToGithubPages(payload);
            break;
          case 'reddit':
            result = await postToReddit(payload);
            break;
          case 'medium':
            result = await postToMedium(payload);
            break;
          case 'linkedin':
            result = await postToLinkedIn(payload);
            break;
          default:
            throw new Error(`Unsupported platform: ${target}`);
        }

        deploymentResults.push(result);
        console.log(`[PERSONA-SATURATION] Successfully deployed to ${target}: ${result.url}`);

      } catch (error) {
        console.error(`[PERSONA-SATURATION] Failed to deploy to ${target}:`, error);
        deploymentResults.push({
          success: false,
          platform: target,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      action: 'persona_saturation_deployment',
      details: `Live deployment to ${deploymentTargets.length} platforms`,
      entity_type: 'deployment'
    });

    console.log('[PERSONA-SATURATION] Deployment batch completed');

    return new Response(JSON.stringify({
      success: true,
      deploymentResults,
      message: 'Live deployment completed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[PERSONA-SATURATION] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

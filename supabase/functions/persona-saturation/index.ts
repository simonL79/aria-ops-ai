import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

async function authenticateRequest(req: Request): Promise<{ user: any } | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  
  const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') || supabaseServiceKey);
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  
  // Check admin role
  const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: roleData } = await adminSupabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .single();
  
  if (!roleData) return null;
  return { user };
}

async function deployToGithubPages(payload: any): Promise<any> {
  const { title, content } = payload;
  const githubToken = Deno.env.get('GITHUB_TOKEN');
  if (!githubToken) throw new Error('GitHub token not configured');

  const timestamp = Date.now();
  const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  const filename = `${slug}-${timestamp}.html`;

  const htmlContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title></head><body><h1>${title}</h1><div>${content.replace(/\n/g, '<br>')}</div></body></html>`;

  const response = await fetch('https://api.github.com/repos/simonl79/aria-intelligence-platform/contents/articles/' + filename, {
    method: 'PUT',
    headers: { 'Authorization': `token ${githubToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `Add article: ${title}`, content: btoa(htmlContent) }),
  });

  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
  return { success: true, platform: 'github-pages', url: `https://simonl79.github.io/aria-intelligence-platform/articles/${filename}`, timestamp: new Date().toISOString() };
}

async function postToReddit(payload: any): Promise<any> {
  const { title, content } = payload;
  const redditClientId = Deno.env.get('REDDIT_CLIENT_ID');
  const redditClientSecret = Deno.env.get('REDDIT_CLIENT_SECRET');
  const redditUsername = Deno.env.get('REDDIT_USERNAME');
  const redditPassword = Deno.env.get('REDDIT_PASSWORD');
  if (!redditClientId || !redditClientSecret || !redditUsername || !redditPassword) throw new Error('Reddit credentials not configured');

  const authResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${btoa(`${redditClientId}:${redditClientSecret}`)}`, 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'ARIA/1.0' },
    body: new URLSearchParams({ grant_type: 'password', username: redditUsername, password: redditPassword }),
  });
  if (!authResponse.ok) throw new Error(`Reddit auth failed: ${authResponse.status}`);
  const authData = await authResponse.json();

  const postResponse = await fetch('https://oauth.reddit.com/api/submit', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authData.access_token}`, 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'ARIA/1.0' },
    body: new URLSearchParams({ api_type: 'json', kind: 'self', sr: 'test', title, text: content, nsfw: 'false', spoiler: 'false' }),
  });
  if (!postResponse.ok) throw new Error(`Reddit post failed: ${postResponse.status}`);
  const postData = await postResponse.json();
  return { success: true, platform: 'reddit', url: `https://reddit.com${postData.json?.data?.url || '/r/test'}`, timestamp: new Date().toISOString() };
}

async function postToMedium(payload: any): Promise<any> {
  const { title, content } = payload;
  const mediumToken = Deno.env.get('MEDIUM_INTEGRATION_TOKEN');
  if (!mediumToken) throw new Error('Medium integration token not configured');

  const userResponse = await fetch('https://api.medium.com/v1/me', { headers: { 'Authorization': `Bearer ${mediumToken}` } });
  if (!userResponse.ok) throw new Error(`Medium user API error: ${userResponse.status}`);
  const userData = await userResponse.json();

  const postResponse = await fetch(`https://api.medium.com/v1/users/${userData.data.id}/posts`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${mediumToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, contentFormat: 'html', content: content.replace(/\n/g, '<br>'), publishStatus: 'public', tags: ['technology', 'reputation', 'intelligence'] }),
  });
  if (!postResponse.ok) throw new Error(`Medium post API error: ${postResponse.status}`);
  const postData = await postResponse.json();
  return { success: true, platform: 'medium', url: postData.data.url, timestamp: new Date().toISOString() };
}

async function postToLinkedIn(payload: any): Promise<any> {
  const { title, content } = payload;
  const linkedinToken = Deno.env.get('LINKEDIN_ACCESS_TOKEN');
  if (!linkedinToken) throw new Error('LinkedIn access token not configured');

  const profileResponse = await fetch('https://api.linkedin.com/v2/people/~', { headers: { 'Authorization': `Bearer ${linkedinToken}` } });
  if (!profileResponse.ok) throw new Error(`LinkedIn profile API error: ${profileResponse.status}`);
  const profileData = await profileResponse.json();

  const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${linkedinToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ author: `urn:li:person:${profileData.id}`, lifecycleState: 'PUBLISHED', specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text: `${title}\n\n${content}` }, shareMediaCategory: 'NONE' } }, visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' } }),
  });
  if (!postResponse.ok) throw new Error(`LinkedIn post API error: ${postResponse.status}`);
  const postData = await postResponse.json();
  return { success: true, platform: 'linkedin', url: `https://www.linkedin.com/feed/update/${postData.id}`, timestamp: new Date().toISOString() };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate and authorize
    const auth = await authenticateRequest(req);
    if (!auth) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized: Admin role required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const payload = await req.json();
    const { deploymentTargets = [], liveDeployment = false } = payload;

    if (!liveDeployment) {
      return new Response(JSON.stringify({ success: false, error: 'Live deployment mode required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const deploymentResults = [];
    for (const target of deploymentTargets) {
      try {
        let result;
        switch (target) {
          case 'github-pages': result = await deployToGithubPages(payload); break;
          case 'reddit': result = await postToReddit(payload); break;
          case 'medium': result = await postToMedium(payload); break;
          case 'linkedin': result = await postToLinkedIn(payload); break;
          default: throw new Error(`Unsupported platform: ${target}`);
        }
        deploymentResults.push(result);
      } catch (error) {
        deploymentResults.push({ success: false, platform: target, error: error.message, timestamp: new Date().toISOString() });
      }
    }

    await supabase.from('activity_logs').insert({
      action: 'persona_saturation_deployment',
      details: `Live deployment to ${deploymentTargets.length} platforms`,
      entity_type: 'deployment',
      user_id: auth.user.id
    });

    return new Response(JSON.stringify({ success: true, deploymentResults, message: 'Live deployment completed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[PERSONA-SATURATION] Error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

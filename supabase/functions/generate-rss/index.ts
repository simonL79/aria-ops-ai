
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { blogPosts } from "../../../src/data/blogData.tsx"; 

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Build the RSS XML
    const baseUrl = new URL(req.url).origin;
    
    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>A.R.I.A™ Blog - Insights from Simon Lindsay</title>
  <description>Insights on digital risk, AI-powered protection, and online reputation management.</description>
  <link>${baseUrl}/blog</link>
  <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
  ${blogPosts.map(post => `
  <item>
    <title>${escapeXml(post.title)}</title>
    <description>${escapeXml(post.description)}</description>
    <link>${baseUrl}/blog/${post.slug}</link>
    <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>simon@aria.com (${escapeXml(post.author)})</author>
    <category>${escapeXml(post.category)}</category>
  </item>`).join('')}
</channel>
</rss>`;
    
    return new Response(rssXml, { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600'
      } 
    });
    
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
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

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

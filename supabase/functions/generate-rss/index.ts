
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Include the blog posts data directly in the edge function
// instead of importing from the frontend
const blogPosts = [
  {
    slug: "ai-reputation-influencers",
    title: "AI & Reputation: What Every Influencer Needs to Know",
    description: "Simon Lindsay breaks down how A.R.I.A™ uses real-time AI to flag PR risks and protect visibility in an age of cancel culture.",
    date: "May 22, 2025",
    author: "Simon Lindsay",
    category: "AI Protection"
  },
  {
    slug: "digital-mugshots",
    title: "Digital Mugshots: The True Cost of Old Online Content",
    description: "Even years-old content can impact your reputation today. Learn how A.R.I.A™ scans and protects you from digital ghosts.",
    date: "May 20, 2025",
    author: "Simon Lindsay",
    category: "Digital Footprint"
  },
  {
    slug: "founder-reputation-risks",
    title: "The Hidden Reputation Risks Every Founder Must Address",
    description: "From investor scrutiny to competitor research, learn how founders can protect their most valuable asset — their reputation.",
    date: "May 17, 2025",
    author: "Simon Lindsay",
    category: "Founder Insights"
  },
  {
    slug: "ai-reputation-defense",
    title: "AI-Powered Reputation Defense: Beyond Manual Monitoring",
    description: "How A.R.I.A™'s advanced machine learning models detect threats that traditional methods miss entirely.",
    date: "May 12, 2025",
    author: "Simon Lindsay",
    category: "AI Protection"
  }
];

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

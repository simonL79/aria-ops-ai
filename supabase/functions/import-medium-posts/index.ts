
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const mediumPosts = [
      {
        title: "What I Learned Rebuilding After a Public Crisis: The Story Behind A.R.I.A™",
        slug: "rebuilding-after-public-crisis-story-behind-aria",
        description: "A personal journey through crisis management and the lessons that led to building A.R.I.A™",
        content: "The story of how a public crisis became the catalyst for innovation in reputation management.",
        author: "Simon Lindsay",
        date: "2024-01-15",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
        category: "Leadership",
        status: "published"
      },
      {
        title: "Building A.R.I.A™: A Smarter Way to Understand Online Reputation",
        slug: "building-aria-smarter-online-reputation",
        description: "How artificial intelligence is revolutionizing the way we monitor and protect digital reputations",
        content: "The technical journey of building an AI-powered reputation management platform.",
        author: "Simon Lindsay",
        date: "2024-01-20",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        category: "Technology",
        status: "published"
      },
      {
        title: "From Chaos to Control: How A.R.I.A™ Turns Digital Threats into Strategic Insight",
        slug: "chaos-to-control-digital-threats-strategic-insight",
        description: "Transforming reactive crisis management into proactive strategic intelligence",
        content: "How A.R.I.A™ converts digital chaos into actionable strategic insights for businesses.",
        author: "Simon Lindsay",
        date: "2024-01-25",
        image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop",
        category: "Strategy",
        status: "published"
      },
      {
        title: "What I Learned After Leaving KSL Hair: Lessons in Leadership, Reputation, and Rebuilding",
        slug: "lessons-after-leaving-ksl-hair-leadership-reputation-rebuilding",
        description: "Personal reflections on leadership transitions and reputation management in business",
        content: "Insights gained from navigating business transitions and rebuilding professional reputation.",
        author: "Simon Lindsay",
        date: "2024-02-01",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
        category: "Leadership",
        status: "published"
      },
      {
        title: "Rebuilding in Glasgow and Beyond: What I Learned When Everything Went Public",
        slug: "rebuilding-glasgow-beyond-everything-went-public",
        description: "A Glasgow entrepreneur's journey through public scrutiny and business recovery",
        content: "The challenges and opportunities that come when your business story becomes public.",
        author: "Simon Lindsay",
        date: "2024-02-05",
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
        category: "Entrepreneurship",
        status: "published"
      },
      {
        title: "Eidetic: Advanced Memory Systems for Digital Reputation [WHITE PAPER]",
        slug: "eidetic-advanced-memory-systems-digital-reputation",
        description: "DECLARATION & WHITE PAPER: Exploring the cutting-edge memory systems that power A.R.I.A™'s reputation intelligence - Timestamp: " + new Date().toISOString(),
        content: `DECLARATION TIMESTAMP: ${new Date().toISOString()}

This white paper serves as both a technical declaration and comprehensive overview of the Eidetic memory system and its revolutionary role in digital reputation management.

Deep dive into the Eidetic memory system and its role in reputation management. This document establishes the foundational principles and technical architecture that powers A.R.I.A™'s advanced memory capabilities.

As of this timestamp, we declare the Eidetic system as a cornerstone technology in the future of digital reputation intelligence.`,
        author: "Simon Lindsay",
        date: new Date().toISOString().split('T')[0],
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop",
        category: "White Paper",
        status: "published"
      }
    ]

    // Insert the posts
    const { data, error } = await supabaseClient
      .from('blog_posts')
      .insert(mediumPosts)
      .select()

    if (error) {
      console.error('Error inserting posts:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully imported ${data?.length || 0} Medium posts`,
        posts: data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})


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

    // First, check if posts already exist to avoid duplicates
    const { data: existingPosts } = await supabaseClient
      .from('blog_posts')
      .select('slug')

    const existingSlugs = existingPosts?.map(post => post.slug) || []

    const mediumPosts = [
      {
        title: "What I Learned Rebuilding After a Public Crisis: The Story Behind A.R.I.A™",
        slug: "rebuilding-after-public-crisis-story-behind-aria",
        description: "A personal journey through crisis management and the lessons that led to building A.R.I.A™",
        content: "The story of how a public crisis became the catalyst for innovation in reputation management. This article explores the personal and professional challenges faced during a difficult period and how those experiences shaped the development of A.R.I.A™, an AI-powered reputation management platform.",
        author: "Simon Lindsay",
        date: "2024-01-15",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
        category: "Leadership",
        status: "published",
        meta_title: "Rebuilding After Crisis: The Story Behind A.R.I.A™ Reputation Management",
        meta_description: "How a public crisis became the catalyst for innovation in AI-powered reputation management. Learn the personal journey behind A.R.I.A™ development.",
        meta_keywords: "crisis management, reputation management, ARIA, AI technology, business recovery, leadership lessons",
        medium_url: "https://medium.com/@simonlindsay/what-i-learned-rebuilding-after-a-public-crisis-the-story-behind-aria-a1b2c3d4e5f6"
      },
      {
        title: "Building A.R.I.A™: A Smarter Way to Understand Online Reputation",
        slug: "building-aria-smarter-online-reputation",
        description: "How artificial intelligence is revolutionizing the way we monitor and protect digital reputations",
        content: "The technical journey of building an AI-powered reputation management platform. This article details the challenges, innovations, and breakthrough moments in developing A.R.I.A™, from concept to deployment.",
        author: "Simon Lindsay",
        date: "2024-01-20",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        category: "Technology",
        status: "published",
        meta_title: "Building A.R.I.A™: AI-Powered Online Reputation Management System",
        meta_description: "Discover how AI revolutionizes online reputation monitoring. Learn about the technical innovation behind A.R.I.A™ reputation management platform.",
        meta_keywords: "AI reputation management, online reputation, artificial intelligence, reputation monitoring, digital reputation, A.R.I.A technology",
        medium_url: "https://medium.com/@simonlindsay/building-aria-a-smarter-way-to-understand-online-reputation-b2c3d4e5f6g7"
      },
      {
        title: "From Chaos to Control: How A.R.I.A™ Turns Digital Threats into Strategic Insight",
        slug: "chaos-to-control-digital-threats-strategic-insight",
        description: "Transforming reactive crisis management into proactive strategic intelligence",
        content: "How A.R.I.A™ converts digital chaos into actionable strategic insights for businesses. This article examines the shift from reactive to proactive reputation management and the strategic advantages this provides.",
        author: "Simon Lindsay",
        date: "2024-01-25",
        image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop",
        category: "Strategy",
        status: "published",
        meta_title: "From Chaos to Control: Digital Threat Intelligence with A.R.I.A™",
        meta_description: "Transform reactive crisis management into proactive strategy. Learn how A.R.I.A™ converts digital threats into actionable business intelligence.",
        meta_keywords: "digital threats, threat intelligence, proactive reputation management, strategic intelligence, crisis prevention, business strategy",
        medium_url: "https://medium.com/@simonlindsay/from-chaos-to-control-how-aria-turns-digital-threats-into-strategic-insight-c3d4e5f6g7h8"
      },
      {
        title: "What I Learned After Leaving KSL Hair: Lessons in Leadership, Reputation, and Rebuilding",
        slug: "lessons-after-leaving-ksl-hair-leadership-reputation-rebuilding",
        description: "Personal reflections on leadership transitions and reputation management in business",
        content: "Insights gained from navigating business transitions and rebuilding professional reputation. This article shares personal lessons about leadership, the importance of reputation management, and the process of rebuilding trust.",
        author: "Simon Lindsay",
        date: "2024-02-01",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
        category: "Leadership",
        status: "published",
        meta_title: "Lessons from KSL Hair: Leadership, Reputation Management & Business Rebuilding",
        meta_description: "Personal insights on business transitions, leadership challenges, and rebuilding professional reputation. Key lessons from real-world experience.",
        meta_keywords: "business transitions, leadership lessons, reputation rebuilding, professional development, business recovery, trust building",
        medium_url: "https://medium.com/@simonlindsay/what-i-learned-after-leaving-ksl-hair-lessons-in-leadership-reputation-and-rebuilding-d4e5f6g7h8i9"
      },
      {
        title: "Rebuilding in Glasgow and Beyond: What I Learned When Everything Went Public",
        slug: "rebuilding-glasgow-beyond-everything-went-public",
        description: "A Glasgow entrepreneur's journey through public scrutiny and business recovery",
        content: "The challenges and opportunities that come when your business story becomes public. This article explores the unique challenges faced by entrepreneurs in Glasgow and how public exposure can become a catalyst for growth.",
        author: "Simon Lindsay",
        date: "2024-02-05",
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
        category: "Entrepreneurship",
        status: "published",
        meta_title: "Rebuilding in Glasgow: Entrepreneur's Journey Through Public Crisis",
        meta_description: "A Glasgow entrepreneur's story of rebuilding after public scrutiny. Learn how transparency and resilience can turn crisis into opportunity.",
        meta_keywords: "Glasgow entrepreneur, public crisis, business rebuilding, entrepreneurship lessons, public scrutiny, business resilience",
        medium_url: "https://medium.com/@simonlindsay/rebuilding-in-glasgow-and-beyond-what-i-learned-when-everything-went-public-e5f6g7h8i9j0"
      },
      {
        title: "Eidetic: Advanced Memory Systems for Digital Reputation [WHITE PAPER]",
        slug: "eidetic-advanced-memory-systems-digital-reputation",
        description: "DECLARATION & WHITE PAPER: Exploring the cutting-edge memory systems that power A.R.I.A™'s reputation intelligence - Timestamp: " + new Date().toISOString(),
        content: `DECLARATION TIMESTAMP: ${new Date().toISOString()}

This white paper serves as both a technical declaration and comprehensive overview of the Eidetic memory system and its revolutionary role in digital reputation management.

## Executive Summary

The Eidetic system represents a breakthrough in digital memory architecture, designed specifically for reputation intelligence applications. This document establishes the foundational principles and technical architecture that powers A.R.I.A™'s advanced memory capabilities.

## Technical Architecture

The Eidetic memory system employs a multi-layered approach to information retention and recall, incorporating:

- Adaptive learning algorithms
- Real-time threat correlation
- Predictive reputation modeling
- Dynamic memory allocation

## Declaration Statement

As of this timestamp (${new Date().toISOString()}), we declare the Eidetic system as a cornerstone technology in the future of digital reputation intelligence. This system represents significant intellectual property and technical innovation in the field of AI-powered reputation management.

## Implementation

The Eidetic system has been successfully integrated into A.R.I.A™'s core architecture, providing enhanced threat detection, reputation monitoring, and strategic intelligence capabilities.

This document serves as both technical documentation and intellectual property declaration for the Eidetic memory system.`,
        author: "Simon Lindsay",
        date: new Date().toISOString().split('T')[0],
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop",
        category: "White Paper",
        status: "published",
        meta_title: "Eidetic Memory Systems for Digital Reputation | A.R.I.A™ White Paper",
        meta_description: "Technical white paper on Eidetic advanced memory systems powering A.R.I.A™ reputation intelligence. Breakthrough technology in AI memory architecture.",
        meta_keywords: "Eidetic memory, digital reputation, AI memory systems, reputation intelligence, technical white paper, A.R.I.A technology, memory architecture",
        medium_url: "https://medium.com/@simonlindsay/eidetic-advanced-memory-systems-for-digital-reputation-white-paper-f6g7h8i9j0k1"
      }
    ]

    // Filter out posts that already exist
    const newPosts = mediumPosts.filter(post => !existingSlugs.includes(post.slug))

    if (newPosts.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: "All Medium posts have already been imported",
          existingCount: mediumPosts.length
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Insert only new posts
    const { data, error } = await supabaseClient
      .from('blog_posts')
      .insert(newPosts)
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
        message: `Successfully imported ${data?.length || 0} new Medium posts`,
        posts: data,
        skipped: mediumPosts.length - newPosts.length
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

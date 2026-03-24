import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SITE_URL = 'https://aria-ops-ai.lovable.app'
const WEBHOOK_TOKEN = 'aseo_wh_bd0be7d2a482b9fedd06895c3ba641e1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text.split(' ').filter(w => w.length > 0).length
  return Math.max(1, Math.ceil(words / 200))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (token !== WEBHOOK_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()

    // Handle test event
    if (body.event === 'test') {
      return new Response(JSON.stringify({ url: `${SITE_URL}/blog/test`, status: 'ok' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const {
      id,
      title,
      slug,
      metaDescription,
      content_html,
      content_markdown,
      heroImageUrl,
      heroImageAlt,
      infographicImageUrl,
      keywords,
      metaKeywords,
      wordpressTags,
      faqSchema,
      languageCode,
      publishedAt,
      updatedAt,
      createdAt,
    } = body

    if (!id || !title || !slug) {
      return new Response(JSON.stringify({ error: 'Missing required fields: id, title, slug' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const reading_time = content_html ? calculateReadingTime(content_html) : 1

    // Parse tags and keywords
    const tagsArray = wordpressTags
      ? wordpressTags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : []
    const keywordsArray = keywords && Array.isArray(keywords) ? keywords : []
    const metaKeywordsStr = metaKeywords || keywordsArray.join(', ')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const row = {
      id: String(id),
      title,
      slug,
      content_html: content_html || null,
      content_markdown: content_markdown || null,
      summary: metaDescription || null,
      meta_description: metaDescription || null,
      meta_keywords: metaKeywordsStr ? metaKeywordsStr.split(',').map((k: string) => k.trim()).filter(Boolean) : [],
      image_url: heroImageUrl || null,
      hero_image_url: heroImageUrl || null,
      hero_image_alt: heroImageAlt || null,
      infographic_url: infographicImageUrl || null,
      tags: tagsArray,
      faq_schema: faqSchema || null,
      language: languageCode || 'en',
      reading_time,
      published_at: publishedAt || null,
      updated_at: updatedAt || null,
      modified_at: updatedAt || null,
      created_at: createdAt || null,
      received_at: new Date().toISOString(),
      synced_at: new Date().toISOString(),
    }

    const { error: upsertError } = await supabase
      .from('blog_posts')
      .upsert(row, { onConflict: 'id' })

    if (upsertError) {
      console.error('Upsert error:', upsertError)
      return new Response(JSON.stringify({ error: upsertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ url: `${SITE_URL}/blog/${slug}` }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

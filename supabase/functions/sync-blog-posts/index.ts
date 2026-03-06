import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const FEED_URL = 'https://getautoseo.com/feeds/14237/jk-unsGNI0FWRs6DS_Mx0WJqmzRFLgcEoG39QeOCWN0.json'

function extractSlug(url: string, id: string): string {
  try {
    const pathname = new URL(url).pathname
    const segments = pathname.split('/').filter(Boolean)
    return segments[segments.length - 1] || id
  } catch {
    return id
  }
}

function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text.split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Fetch the JSON feed
    const feedResponse = await fetch(FEED_URL)
    if (!feedResponse.ok) {
      return new Response(JSON.stringify({
        success: false,
        error: `Feed fetch failed with status ${feedResponse.status}`
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const feed = await feedResponse.json()
    const items = feed.items || []

    if (items.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        synced: 0,
        deleted: 0,
        message: 'Feed returned 0 items, skipping deletion'
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Map feed items to blog_posts rows
    const rows = items.map((item: any) => {
      const seo = item._seo || {}
      const contentHtml = item.content_html || ''
      
      return {
        id: String(item.id),
        title: item.title || 'Untitled',
        slug: extractSlug(item.url || '', String(item.id)),
        summary: item.summary || null,
        content_html: contentHtml,
        image_url: item.image || null,
        canonical_url: item.url || null,
        tags: Array.isArray(item.tags) ? item.tags : [],
        language: item.language || 'en',
        meta_description: seo.meta_description || item.summary || null,
        meta_keywords: Array.isArray(seo.meta_keywords) ? seo.meta_keywords : [],
        faq_schema: Array.isArray(seo.faq_schema) ? seo.faq_schema : null,
        reading_time: calculateReadingTime(contentHtml),
        published_at: item.date_published || null,
        modified_at: item.date_modified || null,
        synced_at: new Date().toISOString(),
      }
    })

    // Upsert all articles
    const { error: upsertError } = await supabase
      .from('blog_posts')
      .upsert(rows, { onConflict: 'id' })

    if (upsertError) {
      console.error('Upsert error:', upsertError)
      return new Response(JSON.stringify({
        success: false,
        error: upsertError.message
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Delete articles no longer in the feed
    const feedIds = rows.map((r: any) => r.id)
    const { data: existingRows } = await supabase
      .from('blog_posts')
      .select('id')

    const idsToDelete = (existingRows || [])
      .map((r: any) => r.id)
      .filter((id: string) => !feedIds.includes(id))

    let deletedCount = 0
    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .in('id', idsToDelete)

      if (!deleteError) {
        deletedCount = idsToDelete.length
      }
    }

    return new Response(JSON.stringify({
      success: true,
      synced: rows.length,
      deleted: deletedCount
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (err) {
    console.error('Sync error:', err)
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

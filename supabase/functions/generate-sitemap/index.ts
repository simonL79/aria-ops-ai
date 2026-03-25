import { createClient } from 'npm:@supabase/supabase-js@2'

const SITE_URL = 'https://aria-ops-ai.lovable.app'

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, modified_at')
      .order('published_at', { ascending: false })

    let urls = `  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`

    for (const post of (posts || [])) {
      const lastmod = post.modified_at ? `\n    <lastmod>${new Date(post.modified_at).toISOString().split('T')[0]}</lastmod>` : ''
      urls += `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>${lastmod}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' }
    })
  } catch (err) {
    console.error('Sitemap error:', err)
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      headers: { 'Content-Type': 'application/xml' }
    })
  }
})

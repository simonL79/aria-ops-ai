
import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicLayout from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock } from 'lucide-react';
import { useBlogPost, useRelatedPosts } from '@/hooks/useBlogPosts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const SITE_URL = 'https://aria-ops-ai.lovable.app';
const SITE_NAME = 'A.R.I.A™ Ops';

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug);
  const related = useRelatedPosts(post);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-background py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-muted rounded w-32" />
              <div className="h-64 bg-muted rounded-lg" />
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-3 bg-muted rounded" />)}
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !post) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-background py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Article not found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Button asChild variant="outline">
              <Link to="/blog">← Back to all articles</Link>
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const articleUrl = `${SITE_URL}/blog/${post.slug}`;
  const description = post.meta_description || post.summary || '';
  const keywords = (post.meta_keywords || []).join(', ');
  const faqItems = post.faq_schema && post.faq_schema.length > 0 ? post.faq_schema : null;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.image_url || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.modified_at || post.published_at || undefined,
    description,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };

  const faqJsonLd = faqItems ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <PublicLayout>
      <Helmet>
        <title>{post.title} | {SITE_NAME}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta property="og:url" content={articleUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={description} />
        {post.image_url && <meta name="twitter:image" content={post.image_url} />}
        <link rel="canonical" href={articleUrl} />
        <link rel="alternate" type="application/json" title="Blog Feed" href="https://getautoseo.com/feeds/14237/jk-unsGNI0FWRs6DS_Mx0WJqmzRFLgcEoG39QeOCWN0.json" />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        {faqJsonLd && <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>}
      </Helmet>

      <div className="min-h-screen bg-background py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-[720px] mx-auto">
            {/* Back link */}
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-8 transition-colors cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back to all articles
            </Link>

            {/* Hero image */}
            {(post.hero_image_url || post.image_url) && (
              <div className="mb-8 rounded-lg overflow-hidden" style={{ maxHeight: 400 }}>
                <img
                  src={post.hero_image_url || post.image_url!}
                  alt={post.hero_image_alt || post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLElement).parentElement!.style.display = 'none'; }}
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8">
              {post.published_at && <span>{formatDate(post.published_at)}</span>}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.reading_time} min read
              </span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs cursor-default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div
              className="blog-prose mb-12"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content_html || '') }}
            />

            {/* Infographic */}
            {post.infographic_url && (
              <div className="mb-12">
                <img
                  src={post.infographic_url}
                  alt={`${post.title} infographic`}
                  className="w-full rounded-lg border border-border"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
            )}

            {/* FAQ Accordion */}
            {faqItems && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" defaultValue="faq-0" collapsible className="space-y-2">
                  {faqItems.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
                      <AccordionTrigger className="text-left text-foreground hover:text-primary cursor-pointer">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="border-t border-border pt-10">
                <h2 className="text-xl font-bold text-foreground mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map(r => (
                    <Link
                      key={r.id}
                      to={`/blog/${r.slug}`}
                      className="group flex gap-3 sm:flex-col rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-all cursor-pointer"
                    >
                      {r.image_url && (
                        <div className="w-24 sm:w-full h-20 sm:h-32 flex-shrink-0 overflow-hidden">
                          <img
                            src={r.image_url}
                            alt={r.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLElement).parentElement!.style.display = 'none'; }}
                          />
                        </div>
                      )}
                      <div className="p-3 flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {r.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(r.published_at)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-12 pt-8 border-t border-border text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">Ready to Protect Your Reputation?</h3>
              <p className="text-muted-foreground mb-6">Get started with a comprehensive assessment of your digital risk profile.</p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/scan">Request Assessment</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BlogPostPage;

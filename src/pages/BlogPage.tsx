
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PublicLayout from '@/components/layout/PublicLayout';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const SkeletonCard = () => (
  <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-800" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-800 rounded w-3/4" />
      <div className="h-3 bg-gray-800 rounded w-full" />
      <div className="h-3 bg-gray-800 rounded w-2/3" />
      <div className="flex justify-between pt-2">
        <div className="h-3 bg-gray-800 rounded w-24" />
        <div className="h-3 bg-gray-800 rounded w-16" />
      </div>
    </div>
  </div>
);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const truncate = (text: string | null, max: number) => {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
};

const BlogPage = () => {
  const { blogPosts, loading, syncing, error, hasMore, loadMore, refetch } = useBlogPosts();
  const { ref, visible } = useScrollReveal(0.05);

  return (
    <PublicLayout>
      <Helmet>
        <title>Blog | A.R.I.A™ Ops</title>
        <meta name="description" content="Read our latest articles and insights on digital reputation management, online security, and brand protection." />
        <link rel="alternate" type="application/json" title="Blog Feed" href="https://getautoseo.com/feeds/14237/jk-unsGNI0FWRs6DS_Mx0WJqmzRFLgcEoG39QeOCWN0.json" />
      </Helmet>
      <div className="min-h-screen bg-black py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div
            ref={ref}
            className={`max-w-5xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="text-center mb-10 sm:mb-14">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">Blog</h1>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                Insights, analysis, and updates on digital reputation management
              </p>
            </div>

            {/* Loading / Syncing */}
            {(loading || syncing) && (
              <div>
                {syncing && (
                  <p className="text-center text-gray-400 text-sm mb-6 flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" /> Loading articles…
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="text-center py-16">
                <p className="text-destructive mb-4">Couldn't load articles. Please try again.</p>
                <Button onClick={refetch} variant="outline" className="border-gray-700 text-gray-300 hover:border-orange-500/50">Retry</Button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && blogPosts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-gray-400 text-lg">Articles are on the way! Check back soon.</p>
              </div>
            )}

            {/* Posts grid */}
            {!loading && !error && blogPosts.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.map(post => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group rounded-lg border border-gray-800 bg-black/50 backdrop-blur-sm overflow-hidden hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      {post.image_url && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLElement).parentElement!.style.display = 'none'; }}
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                          {truncate(post.summary, 160)}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatDate(post.published_at)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.reading_time} min read
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-10">
                    <Button onClick={loadMore} variant="outline" className="px-8 border-orange-500/50 text-orange-500 hover:bg-orange-500/10 hover:border-orange-500">
                      Load More
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BlogPage;

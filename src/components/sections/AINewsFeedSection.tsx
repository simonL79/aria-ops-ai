import React, { useEffect, useState } from 'react';
import { ExternalLink, Newspaper } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Skeleton } from '@/components/ui/skeleton';

interface Article {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image: string;
}

const AINewsFeedSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, visible } = useScrollReveal(0.1);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('ai-news-feed');
        if (error) throw error;
        setArticles(data?.articles || []);
      } catch (err) {
        console.error('Failed to fetch AI news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    } catch { return ''; }
  };

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Newspaper className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-primary">Live Intelligence</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI Intelligence Feed
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time coverage from AI Business — informing, educating & connecting the global AI community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))
            : articles.map((article, i) => (
                <a
                  key={i}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-xl border border-border bg-card hover:border-primary/40 p-5 flex flex-col gap-3 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-3">
                      {article.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                  </div>
                  {article.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-primary/70 bg-primary/10 px-2 py-0.5 rounded">
                      AI Business
                    </span>
                    {article.pubDate && (
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(article.pubDate)}
                      </span>
                    )}
                  </div>
                </a>
              ))}
        </div>

        {!loading && articles.length === 0 && (
          <p className="text-center text-muted-foreground text-sm mt-8">
            Unable to load news feed at this time.
          </p>
        )}

        <p className="text-center text-[11px] text-muted-foreground/50 mt-10">
          Powered by AI Business — aibusiness.com
        </p>
      </div>
    </section>
  );
};

export default AINewsFeedSection;

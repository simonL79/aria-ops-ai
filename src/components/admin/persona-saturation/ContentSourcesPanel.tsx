
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  RefreshCw, 
  ExternalLink, 
  Calendar,
  Tag,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentSource {
  id: string;
  title: string;
  url: string;
  summary: string;
  source_type: string;
  published_at: string;
  tags: string[];
  created_at: string;
}

interface ScanResult {
  success: boolean;
  summary: {
    feeds_processed: number;
    total_feeds: number;
    articles_found: number;
    new_articles: number;
    duplicates_skipped: number;
  };
  message: string;
}

const ContentSourcesPanel = () => {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    watchtower: 0,
    operator: 0,
    recent: 0
  });

  const loadContentSources = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content_sources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setSources(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const watchtower = data?.filter(s => s.source_type === 'watchtower').length || 0;
      const operator = data?.filter(s => s.source_type === 'operator').length || 0;
      const recent = data?.filter(s => 
        new Date(s.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length || 0;

      setStats({ total, watchtower, operator, recent });

    } catch (error) {
      console.error('Error loading content sources:', error);
      toast.error('Failed to load content sources');
    } finally {
      setLoading(false);
    }
  };

  const runWatchtowerScan = async () => {
    setScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('watchtower-scan');
      
      if (error) throw error;

      setLastScan(data);
      toast.success(`Scan complete: ${data.summary.new_articles} new articles ingested`);
      
      // Reload sources
      await loadContentSources();
      
    } catch (error) {
      console.error('Error running watchtower scan:', error);
      toast.error('Failed to run watchtower scan');
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    loadContentSources();
  }, []);

  const getSourceTypeColor = (type: string) => {
    switch (type) {
      case 'watchtower': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'operator': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'client': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'news': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Globe className="h-5 w-5 text-corporate-accent" />
            Content Sources Manager
          </CardTitle>
          <div className="text-sm text-corporate-lightGray">
            Real articles ingested for persona saturation campaigns
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 bg-corporate-darkSecondary rounded-lg">
              <div className="text-sm text-corporate-lightGray">Total Sources</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="p-3 bg-corporate-darkSecondary rounded-lg">
              <div className="text-sm text-corporate-lightGray">Watchtower</div>
              <div className="text-2xl font-bold text-blue-400">{stats.watchtower}</div>
            </div>
            <div className="p-3 bg-corporate-darkSecondary rounded-lg">
              <div className="text-sm text-corporate-lightGray">Operator</div>
              <div className="text-2xl font-bold text-green-400">{stats.operator}</div>
            </div>
            <div className="p-3 bg-corporate-darkSecondary rounded-lg">
              <div className="text-sm text-corporate-lightGray">Last 24h</div>
              <div className="text-2xl font-bold text-corporate-accent">{stats.recent}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button
              onClick={runWatchtowerScan}
              disabled={scanning}
              className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
            >
              {scanning ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Scanning RSS Feeds...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Run Watchtower Scan
                </div>
              )}
            </Button>

            <Button
              onClick={loadContentSources}
              disabled={loading}
              variant="outline"
              className="border-corporate-border text-corporate-lightGray hover:bg-corporate-darkSecondary"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Last Scan Results */}
          {lastScan && (
            <div className="p-4 bg-corporate-darkSecondary rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-white">Last Scan Results</span>
              </div>
              <div className="text-sm text-corporate-lightGray space-y-1">
                <div>Feeds processed: {lastScan.summary.feeds_processed}/{lastScan.summary.total_feeds}</div>
                <div>Articles found: {lastScan.summary.articles_found}</div>
                <div>New articles: {lastScan.summary.new_articles}</div>
                <div>Duplicates skipped: {lastScan.summary.duplicates_skipped}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Sources List */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <FileText className="h-5 w-5 text-corporate-accent" />
            Recent Content Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-corporate-accent" />
            </div>
          ) : sources.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
              <h3 className="text-lg font-medium text-white mb-2">No Content Sources</h3>
              <p className="text-corporate-lightGray">
                Run a watchtower scan to ingest real articles from RSS feeds.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sources.map((source) => (
                <div key={source.id} className="p-4 bg-corporate-darkSecondary rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-white line-clamp-2">{source.title}</h4>
                      <p className="text-sm text-corporate-lightGray mt-1 line-clamp-2">
                        {source.summary}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2 text-corporate-accent hover:text-white"
                      onClick={() => window.open(source.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getSourceTypeColor(source.source_type)}>
                        {source.source_type}
                      </Badge>
                      {source.published_at && (
                        <div className="flex items-center gap-1 text-xs text-corporate-lightGray">
                          <Calendar className="h-3 w-3" />
                          {new Date(source.published_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {source.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {source.tags?.length > 3 && (
                        <span className="text-xs text-corporate-lightGray">
                          +{source.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentSourcesPanel;

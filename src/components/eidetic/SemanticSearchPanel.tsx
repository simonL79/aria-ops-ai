import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Match {
  id: string;
  content_url: string | null;
  memory_context: string | null;
  narrative_summary: string | null;
  memory_type: string | null;
  decay_score: number | null;
  similarity: number;
}

const SemanticSearchPanel = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [embedding, setEmbedding] = useState(false);
  const [results, setResults] = useState<Match[]>([]);

  const runSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      // Embed query via edge function (reuse eidetic-embed by invoking a helper path)
      const { data: embedRes, error: embedErr } = await supabase.functions.invoke('eidetic-search', {
        body: { query: query.trim() },
      });
      if (embedErr) throw embedErr;
      setResults((embedRes?.matches as Match[]) ?? []);
      if (!embedRes?.matches?.length) toast.info('No semantic matches found');
    } catch (e) {
      console.error(e);
      toast.error('Semantic search failed');
    } finally {
      setLoading(false);
    }
  };

  const embedAll = async () => {
    setEmbedding(true);
    try {
      const { data, error } = await supabase.functions.invoke('eidetic-embed', {
        body: { all_unembedded: true },
      });
      if (error) throw error;
      toast.success(`Embedded ${data?.processed ?? 0} memories`);
    } catch (e) {
      console.error(e);
      toast.error('Embedding job failed');
    } finally {
      setEmbedding(false);
    }
  };

  return (
    <Card className="border-orange-500/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-orange-500" />
          Semantic Memory Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            placeholder="Search memories by meaning, not keywords..."
            className="flex-1"
          />
          <Button onClick={runSearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
          <Button onClick={embedAll} disabled={embedding} variant="outline">
            {embedding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Embed Backlog'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((r) => (
              <div key={r.id} className="rounded-lg border border-border/50 p-3 hover:border-orange-500/40 transition">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Badge variant="outline" className="text-orange-500 border-orange-500/40">
                    {(r.similarity * 100).toFixed(1)}% match
                  </Badge>
                  {r.memory_type && <Badge variant="secondary">{r.memory_type}</Badge>}
                </div>
                <p className="text-sm text-foreground">
                  {r.narrative_summary || r.memory_context || '(no summary)'}
                </p>
                {r.content_url && (
                  <a
                    href={r.content_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-orange-500 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {new URL(r.content_url).hostname}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SemanticSearchPanel;

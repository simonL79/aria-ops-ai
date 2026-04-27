import { useEffect, useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink } from 'lucide-react';

const PortalFindings = () => {
  const [findings, setFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await (supabase.from('scan_results') as any)
        .select('id, entity_name, platform, content, url, severity, sentiment, source_type, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) console.error(error);
      setFindings(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <PortalLayout title="New Findings">
      <p className="text-sm text-white/50 mb-4">Discoveries from the last 30 days.</p>
      {loading ? (
        <div className="text-white/50">Loading…</div>
      ) : findings.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 text-center text-white/60">No new findings in the last 30 days.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {findings.map((f) => (
            <Card key={f.id} className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {f.platform && <Badge variant="outline" className="text-xs">{f.platform}</Badge>}
                    {f.severity && <Badge variant="outline" className="text-xs">{f.severity}</Badge>}
                    {f.sentiment && <Badge variant="outline" className="text-xs">{f.sentiment}</Badge>}
                  </div>
                  <span className="text-xs text-white/40 shrink-0">
                    {new Date(f.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-white/80 mb-2 line-clamp-3">{f.content || '—'}</div>
                {f.url && (
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:underline">
                    Source <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PortalLayout>
  );
};

export default PortalFindings;

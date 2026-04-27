import { useEffect, useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink } from 'lucide-react';

const severityColor = (sev?: string) => {
  switch ((sev || '').toLowerCase()) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    default: return 'bg-white/10 text-white/60 border-white/20';
  }
};

const PortalThreats = () => {
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await (supabase.from('threats') as any)
        .select('id, entity_name, threat_type, severity, source, content, url, status, created_at')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) console.error(error);
      setThreats(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <PortalLayout title="Threats">
      {loading ? (
        <div className="text-white/50">Loading…</div>
      ) : threats.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 text-center text-white/60">No threats detected on your monitored entities.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {threats.map((t) => (
            <Card key={t.id} className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={severityColor(t.severity)}>{t.severity || 'unknown'}</Badge>
                    {t.threat_type && <Badge variant="outline" className="text-xs">{t.threat_type}</Badge>}
                    {t.source && <span className="text-xs text-white/40">{t.source}</span>}
                  </div>
                  <span className="text-xs text-white/40 shrink-0">
                    {new Date(t.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-white/80 mb-2 line-clamp-3">{t.content || '—'}</div>
                {t.url && (
                  <a href={t.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:underline">
                    View source <ExternalLink className="h-3 w-3" />
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

export default PortalThreats;

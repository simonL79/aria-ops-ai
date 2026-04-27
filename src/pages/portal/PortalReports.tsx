import { useEffect, useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Download } from 'lucide-react';

const PortalReports = () => {
  const { clientIds } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (clientIds.length === 0) {
        setLoading(false);
        return;
      }
      const { data, error } = await (supabase.from('executive_reports') as any)
        .select('id, title, report_type, executive_summary, period_start, period_end, status, pdf_url, created_at')
        .in('client_id', clientIds)
        .order('created_at', { ascending: false });
      if (error) console.error(error);
      setReports(data ?? []);
      setLoading(false);
    };
    load();
  }, [clientIds]);

  return (
    <PortalLayout title="Reports">
      {loading ? (
        <div className="text-white/50">Loading…</div>
      ) : reports.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 text-center text-white/60">
            No reports have been published for your account yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-5 flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <div className="h-10 w-10 rounded-md bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{r.title}</h3>
                      {r.status && <Badge variant="outline" className="text-xs">{r.status}</Badge>}
                    </div>
                    {r.executive_summary && (
                      <p className="text-sm text-white/60 line-clamp-2 mb-2">{r.executive_summary}</p>
                    )}
                    <div className="text-xs text-white/40">
                      {r.report_type} · {r.period_start} – {r.period_end}
                    </div>
                  </div>
                </div>
                {r.pdf_url && (
                  <Button asChild size="sm" variant="outline" className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10">
                    <a href={r.pdf_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PortalLayout>
  );
};

export default PortalReports;

import { useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Footprint {
  id: string;
  narrative_category: string | null;
  decay_score: number | null;
  threat_persistence_30d: number | null;
  content_url: string | null;
  cluster_id: string | null;
}

const MemoryGraph = () => {
  const [data, setData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(e.contentRect.width);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    (async () => {
      const { data: fps } = await (supabase.from('memory_footprints') as any)
        .select('id,narrative_category,decay_score,threat_persistence_30d,content_url,cluster_id')
        .eq('is_active', true).limit(150);

      const footprints = (fps as Footprint[]) ?? [];
      const categories = new Map<string, string>();
      const nodes: any[] = [];
      const links: any[] = [];

      footprints.forEach(f => {
        const cat = f.narrative_category ?? 'unknown';
        if (!categories.has(cat)) {
          categories.set(cat, `cat-${cat}`);
          nodes.push({ id: `cat-${cat}`, name: cat, kind: 'category', val: 8 });
        }
        nodes.push({
          id: f.id,
          name: (f.content_url ?? f.id).slice(0, 40),
          kind: 'footprint',
          val: 2 + (f.threat_persistence_30d ?? 0) * 6,
          decay: f.decay_score ?? 0,
          threat: f.threat_persistence_30d ?? 0,
        });
        links.push({ source: `cat-${cat}`, target: f.id });
      });

      setData({ nodes, links });
    })();
  }, []);

  const colorFor = (n: any) => {
    if (n.kind === 'category') return 'hsl(var(--primary))';
    const t = n.threat ?? 0;
    if (t > 0.7) return 'hsl(0 80% 55%)';
    if (t > 0.4) return 'hsl(30 90% 55%)';
    if (t > 0.2) return 'hsl(50 90% 55%)';
    return 'hsl(140 60% 50%)';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5" /> Memory Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="w-full h-[480px] rounded-md border border-border/50 overflow-hidden bg-background">
          {data.nodes.length > 0 && (
            <ForceGraph2D
              graphData={data}
              width={width}
              height={480}
              nodeRelSize={4}
              nodeColor={colorFor}
              nodeLabel={(n: any) => `${n.kind}: ${n.name}`}
              linkColor={() => 'hsl(var(--border))'}
              backgroundColor="transparent"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryGraph;

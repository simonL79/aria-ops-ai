import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function PromoteToShieldButton({ threatId }: { threatId: string }) {
  const navigate = useNavigate();
  const [existingId, setExistingId] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).from('shield_alerts').select('id').eq('source_threat_id', threatId).maybeSingle();
      if (data?.id) setExistingId(data.id);
    })();
  }, [threatId]);

  if (existingId) {
    return (
      <Button variant="outline" size="sm" onClick={() => navigate(`/admin/shield/alerts/${existingId}`)}>
        <Shield className="h-4 w-4 mr-1" /> View Shield Alert <ExternalLink className="h-3 w-3 ml-1" />
      </Button>
    );
  }

  const handle = async () => {
    setWorking(true);
    const { data, error } = await supabase.functions.invoke('shield-promote-threat', { body: { threat_id: threatId } });
    setWorking(false);
    if (error || !data?.alert_id) { toast.error('Promotion failed'); return; }
    toast.success(`Shield alert created (${data.severity})`);
    navigate(`/admin/shield/alerts/${data.alert_id}`);
  };

  return (
    <Button size="sm" onClick={handle} disabled={working}>
      <Shield className="h-4 w-4 mr-1" /> {working ? 'Promoting…' : 'Promote to Shield Alert'}
    </Button>
  );
}

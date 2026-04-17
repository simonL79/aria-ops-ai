import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

type Notification = {
  id: string;
  event_type: string;
  summary: string | null;
  entity_name: string | null;
  priority: string | null;
  seen: boolean | null;
  created_at: string;
  metadata: any;
};

const priColor = (p: string | null) =>
  p === 'critical' ? 'destructive' : p === 'high' ? 'default' : 'secondary';

const AdminNotificationsPage = () => {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unseen'>('all');

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase.from('aria_notifications') as any)
      .select('*').order('created_at', { ascending: false }).limit(200);
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markAllSeen = async () => {
    const unseen = items.filter(i => !i.seen).map(i => i.id);
    if (unseen.length === 0) return;
    await (supabase.from('aria_notifications') as any).update({ seen: true }).in('id', unseen);
    load();
  };

  const filtered = items.filter(i => {
    if (filter === 'unseen' && i.seen) return false;
    if (search) {
      const hay = `${i.event_type} ${i.summary} ${i.entity_name}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const unseenCount = items.filter(i => !i.seen).length;

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-4">
      <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Back to admin
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6 text-purple-600" /> Notifications
          {unseenCount > 0 && <Badge variant="destructive">{unseenCount} unread</Badge>}
        </h1>
        {unseenCount > 0 && <Button variant="outline" size="sm" onClick={markAllSeen}>Mark all as read</Button>}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search notifications…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
        <Button variant={filter === 'unseen' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('unseen')}>Unread</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No notifications</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => (
            <Card key={n.id} className={!n.seen ? 'border-purple-200 bg-purple-50/30' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Badge variant={priColor(n.priority) as any}>{n.priority || 'medium'}</Badge>
                    <span className="capitalize">{n.event_type.replace(/_/g, ' ')}</span>
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {n.summary && <p className="text-sm">{n.summary}</p>}
                {n.entity_name && <p className="text-xs text-muted-foreground mt-1">Entity: {n.entity_name}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsPage;

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Bell, BellOff, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const EVENT_COLUMNS =
  'id, event_type, severity, narrative_category, content_excerpt, content_url, status, created_at';
const LIMIT = 50;

type FeedItem = {
  id: string;
  event_type: string;
  severity: string;
  narrative_category: string | null;
  content_excerpt: string | null;
  content_url: string | null;
  status: string;
  created_at: string;
  read: boolean;
};

const severityColor = (sev?: string) => {
  switch ((sev || '').toLowerCase()) {
    case 'critical':
      return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'high':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    default:
      return 'bg-white/10 text-white/60 border-white/20';
  }
};

const PortalNotifications = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [eventsRes, readsRes] = await Promise.all([
      (supabase.from('eidetic_resurfacing_events') as any)
        .select(EVENT_COLUMNS)
        .order('created_at', { ascending: false })
        .limit(LIMIT),
      (supabase.from('portal_notification_reads') as any)
        .select('event_id')
        .eq('user_id', user.id),
    ]);

    if (eventsRes.error) console.error(eventsRes.error);
    if (readsRes.error) console.error(readsRes.error);

    const readSet = new Set<string>((readsRes.data ?? []).map((r: any) => r.event_id));
    const feed: FeedItem[] = (eventsRes.data ?? []).map((ev: any) => ({
      ...ev,
      read: readSet.has(ev.id),
    }));

    setItems(feed);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = items.filter((i) => !i.read).length;
  const visible = filter === 'unread' ? items.filter((i) => !i.read) : items;

  const markRead = async (id: string) => {
    if (!user) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
    const { error } = await (supabase.from('portal_notification_reads') as any).upsert(
      { user_id: user.id, event_id: id },
      { onConflict: 'user_id,event_id' },
    );
    if (error) {
      console.error(error);
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: false } : i)));
    }
  };

  const markUnread = async (id: string) => {
    if (!user) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: false } : i)));
    const { error } = await (supabase.from('portal_notification_reads') as any)
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', id);
    if (error) {
      console.error(error);
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    const unread = items.filter((i) => !i.read);
    if (unread.length === 0) return;
    setBusy(true);
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    const rows = unread.map((i) => ({ user_id: user.id, event_id: i.id }));
    const { error } = await (supabase.from('portal_notification_reads') as any).upsert(rows, {
      onConflict: 'user_id,event_id',
    });
    if (error) {
      console.error(error);
      await load();
    }
    setBusy(false);
  };

  return (
    <PortalLayout title="Notifications">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-white/10 overflow-hidden">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 text-sm transition-colors ${
                  filter === 'all' ? 'bg-orange-500/15 text-orange-400' : 'text-white/60 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-1.5 text-sm transition-colors ${
                  filter === 'unread' ? 'bg-orange-500/15 text-orange-400' : 'text-white/60 hover:text-white'
                }`}
              >
                Unread{unreadCount > 0 ? ` (${unreadCount})` : ''}
              </button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            disabled={busy || unreadCount === 0}
            className="text-white/70 hover:text-white hover:bg-white/5"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>

        {loading ? (
          <div className="text-white/50 text-sm py-12 text-center">Loading notifications…</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 text-white/50">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">
              {filter === 'unread' ? 'No unread notifications.' : 'No resurfacing events detected yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((item) => (
              <Card
                key={item.id}
                className={`border-white/10 transition-colors ${
                  item.read ? 'bg-white/[0.02]' : 'bg-orange-500/[0.06] border-orange-500/20'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {!item.read && <span className="block h-2 w-2 rounded-full bg-orange-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className={severityColor(item.severity)}>
                          {item.severity}
                        </Badge>
                        <span className="text-sm font-medium text-white capitalize">
                          {(item.event_type || 'resurfacing event').replace(/_/g, ' ')}
                        </span>
                        {item.narrative_category && (
                          <span className="text-xs text-white/40">· {item.narrative_category}</span>
                        )}
                      </div>
                      {item.content_excerpt && (
                        <p className="text-sm text-white/60 line-clamp-2 mb-2">{item.content_excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                        <Link
                          to={`/portal/threats/resurfacing/${item.id}`}
                          className="inline-flex items-center gap-1 text-orange-400/80 hover:text-orange-400"
                        >
                          View details <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {item.read ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markUnread(item.id)}
                          className="text-white/50 hover:text-white hover:bg-white/5"
                        >
                          <BellOff className="h-4 w-4 mr-1" /> Unread
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markRead(item.id)}
                          className="text-white/60 hover:text-white hover:bg-white/5"
                        >
                          <Check className="h-4 w-4 mr-1" /> Read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default PortalNotifications;

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
};

const priDot = (p: string | null) =>
  p === 'critical' ? 'bg-red-500' : p === 'high' ? 'bg-orange-500' : p === 'low' ? 'bg-gray-400' : 'bg-yellow-500';

export const NotificationCenter = () => {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await (supabase.from('aria_notifications') as any)
      .select('*').order('created_at', { ascending: false }).limit(20);
    setItems(data ?? []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel('notification-center')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'aria_notifications' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const unseenCount = items.filter(i => !i.seen).length;

  const markAllSeen = async () => {
    const ids = items.filter(i => !i.seen).map(i => i.id);
    if (ids.length === 0) return;
    await (supabase.from('aria_notifications') as any).update({ seen: true }).in('id', ids);
    load();
  };

  const onOpenChange = (o: boolean) => {
    setOpen(o);
    if (o && unseenCount > 0) markAllSeen();
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unseenCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs">
              {unseenCount > 9 ? '9+' : unseenCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="p-3 border-b flex items-center justify-between">
          <span className="font-semibold text-sm">Notifications</span>
          <Link to="/admin/notifications" className="text-xs text-purple-600 hover:underline" onClick={() => setOpen(false)}>
            View all
          </Link>
        </div>
        <div className="max-h-96 overflow-auto">
          {items.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            items.map(n => (
              <div key={n.id} className="px-3 py-2 border-b last:border-b-0 hover:bg-muted/50 text-sm">
                <div className="flex items-start gap-2">
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${priDot(n.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium capitalize truncate">{n.event_type.replace(/_/g, ' ')}</p>
                    {n.summary && <p className="text-xs text-muted-foreground line-clamp-2">{n.summary}</p>}
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;

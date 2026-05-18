import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Eye, EyeOff, Trash2, RotateCcw, Plus, X, Flag } from 'lucide-react';

interface CommentRow {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  status: 'visible' | 'hidden' | 'removed';
  hidden_reason: string | null;
  report_count: number;
  created_at: string;
}

interface BlocklistRow {
  id: string;
  term: string;
  severity: string;
  created_at: string;
}

const STATUS_FILTERS: Array<CommentRow['status'] | 'all'> = ['hidden', 'visible', 'removed', 'all'];

const ModerationQueue: React.FC = () => {
  const [filter, setFilter] = useState<CommentRow['status'] | 'all'>('hidden');
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [blocklist, setBlocklist] = useState<BlocklistRow[]>([]);
  const [newTerm, setNewTerm] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    let q = (supabase as any)
      .from('blog_comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (filter !== 'all') q = q.eq('status', filter);
    const { data, error } = await q;
    if (error) toast.error('Failed to load comments');
    setComments((data ?? []) as CommentRow[]);
    setLoading(false);
  }, [filter]);

  const loadBlocklist = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from('moderation_blocklist')
      .select('*')
      .order('term', { ascending: true });
    if (!error) setBlocklist((data ?? []) as BlocklistRow[]);
  }, []);

  useEffect(() => { void loadComments(); }, [loadComments]);
  useEffect(() => { void loadBlocklist(); }, [loadBlocklist]);

  const moderate = async (id: string, status: CommentRow['status']) => {
    setBusyId(id);
    const { data, error } = await supabase.functions.invoke('moderate-comment', {
      body: { comment_id: id, status },
    });
    setBusyId(null);
    if (error || data?.error) {
      toast.error(data?.error || 'Action failed');
      return;
    }
    toast.success(`Comment marked ${status}`);
    void loadComments();
  };

  const addTerm = async () => {
    const term = newTerm.trim().toLowerCase();
    if (!term) return;
    const { error } = await (supabase as any)
      .from('moderation_blocklist')
      .insert({ term, severity: 'block' });
    if (error) {
      toast.error(error.message || 'Failed to add term');
      return;
    }
    setNewTerm('');
    toast.success('Term added');
    void loadBlocklist();
  };

  const removeTerm = async (id: string) => {
    const { error } = await (supabase as any).from('moderation_blocklist').delete().eq('id', id);
    if (error) {
      toast.error('Failed to remove');
      return;
    }
    void loadBlocklist();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle>Comment moderation queue</CardTitle>
            <div className="flex gap-1">
              {STATUS_FILTERS.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={filter === s ? 'default' : 'outline'}
                  onClick={() => setFilter(s)}
                  className="capitalize"
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments in this view.</p>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="p-3 rounded-md border border-border bg-card/40">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{c.author_name}</span>
                      <Badge variant="outline" className="text-xs capitalize">{c.status}</Badge>
                      {c.report_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          <Flag className="h-3 w-3 mr-1" />
                          {c.report_count}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words mb-2">{c.content}</p>
                  {c.hidden_reason && (
                    <p className="text-xs text-muted-foreground italic mb-2">{c.hidden_reason}</p>
                  )}
                  <p className="text-xs text-muted-foreground mb-2">Post: <code>{c.post_id}</code></p>
                  <div className="flex gap-2 flex-wrap">
                    {c.status !== 'visible' && (
                      <Button size="sm" variant="outline" disabled={busyId === c.id} onClick={() => moderate(c.id, 'visible')}>
                        <Eye className="h-3 w-3 mr-1" /> Approve
                      </Button>
                    )}
                    {c.status !== 'hidden' && (
                      <Button size="sm" variant="outline" disabled={busyId === c.id} onClick={() => moderate(c.id, 'hidden')}>
                        <EyeOff className="h-3 w-3 mr-1" /> Hide
                      </Button>
                    )}
                    {c.status !== 'removed' && (
                      <Button size="sm" variant="destructive" disabled={busyId === c.id} onClick={() => moderate(c.id, 'removed')}>
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    )}
                    {c.status === 'removed' && (
                      <Button size="sm" variant="outline" disabled={busyId === c.id} onClick={() => moderate(c.id, 'visible')}>
                        <RotateCcw className="h-3 w-3 mr-1" /> Restore
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blocklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              placeholder="Add term..."
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void addTerm(); } }}
            />
            <Button size="icon" onClick={() => void addTerm()}><Plus className="h-4 w-4" /></Button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Comments containing any term (case-insensitive substring) are auto-hidden.
          </p>
          <ul className="space-y-1 max-h-96 overflow-auto">
            {blocklist.map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-secondary/40">
                <code className="text-xs">{t.term}</code>
                <button onClick={() => void removeTerm(t.id)} aria-label={`Remove ${t.term}`} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
            {blocklist.length === 0 && <li className="text-xs text-muted-foreground">Empty.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModerationQueue;

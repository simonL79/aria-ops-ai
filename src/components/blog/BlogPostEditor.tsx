
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { syncBlogPosts } from '@/hooks/useBlogPosts';

interface BlogPostEditorProps {
  post?: any;
  onCancel: () => void;
  onSave: () => void;
}

const BlogPostEditor = ({ post, onCancel, onSave }: BlogPostEditorProps) => {
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = async () => {
    setSyncing(true);
    const result = await syncBlogPosts();
    setSyncing(false);
    if (result.success) {
      toast.success(`Synced ${result.synced} articles, deleted ${result.deleted}`);
      onSave();
    } else {
      toast.error(result.error || 'Sync failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Sync</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Blog posts are synced automatically from the JSON feed. Use the button below to manually trigger a sync.
        </p>
        <div className="flex gap-2">
          <Button onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>
          <Button variant="outline" onClick={onCancel}>Back</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostEditor;

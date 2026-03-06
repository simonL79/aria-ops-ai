
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { syncBlogPosts } from '@/hooks/useBlogPosts';

interface BulkArticleImportProps {
  onArticlesAdded: () => void;
}

const BulkArticleImport = ({ onArticlesAdded }: BulkArticleImportProps) => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    const result = await syncBlogPosts();
    setSyncing(false);
    if (result.success) {
      toast.success(`Synced ${result.synced} articles`);
      onArticlesAdded();
    } else {
      toast.error(result.error || 'Sync failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync from Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Articles are managed via the JSON feed and synced automatically. Click below to force a manual sync.
        </p>
        <Button onClick={handleSync} disabled={syncing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync from Feed'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkArticleImport;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Shield } from 'lucide-react';
import { ContentAlert } from '@/types/dashboard';

interface LatestMentionsProps {
  mentions: ContentAlert[];
  onViewAll: () => void;
}

const LatestMentions = ({ mentions, onViewAll }: LatestMentionsProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium">Latest Mentions</p>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          <Eye className="mr-2 h-4 w-4" />
          View All
        </Button>
      </div>
      {mentions.length > 0 ? (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {mentions.slice(0, 3).map((mention) => (
            <div key={mention.id} className="border rounded-md p-2 text-sm">
              <div className="flex justify-between items-center mb-1">
                <Badge variant="outline">{mention.platform}</Badge>
                <span className="text-xs text-muted-foreground">{mention.date}</span>
              </div>
              <p className="line-clamp-2">{mention.content}</p>
              {mention.category && (
                <div className="mt-1 flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {mention.category}
                  </Badge>
                  {mention.severity === 'high' && (
                    <Badge variant="destructive" className="text-xs">
                      High Priority
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No recent mentions found. Run a scan to check for new mentions.
        </div>
      )}
    </div>
  );
};

export default LatestMentions;

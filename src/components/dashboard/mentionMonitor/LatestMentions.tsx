
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ContentAlert } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';

interface LatestMentionsProps {
  mentions: ContentAlert[];
  onViewAll: () => void;
}

const LatestMentions = ({ mentions, onViewAll }: LatestMentionsProps) => {
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Latest Mentions</h3>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="h-7 text-xs">
          View All <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {mentions.length > 0 ? (
          mentions.map((mention, index) => (
            <div key={index} className="border rounded-md p-2 text-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium">{mention.platform}</span>
                <Badge 
                  variant="outline"
                  className={getSeverityColor(mention.severity)}
                >
                  {mention.severity}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs mb-1 line-clamp-2">
                {mention.content}
              </p>
              <div className="text-xs text-muted-foreground">
                {mention.date}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 border rounded-md text-muted-foreground text-sm">
            No mentions found. Start scanning to discover brand mentions.
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestMentions;

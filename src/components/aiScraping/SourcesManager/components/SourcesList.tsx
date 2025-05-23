
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Trash2, Link } from 'lucide-react';
import { ScrapingSource } from '@/types/aiScraping';

interface SourcesListProps {
  sources: ScrapingSource[];
  onToggleSource: (id: string, enabled: boolean) => void;
  onDeleteSource: (id: string) => void;
  onRefreshSource: (source: ScrapingSource) => void;
}

const SourcesList: React.FC<SourcesListProps> = ({
  sources,
  onToggleSource,
  onDeleteSource,
  onRefreshSource
}) => {
  const getSourceTypeDescription = (type: ScrapingSource['type']) => {
    switch(type) {
      case 'google': return 'Uses Google Search via proxy APIs to find mentions';
      case 'news': return 'Aggregates news sources for relevant articles';
      case 'manual': return 'Manually entered content for analysis';
      case 'crawler': return 'Custom web crawler for specific sites';
      case 'zapier': return 'Integration with Zapier workflows';
      default: return '';
    }
  };

  if (sources.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No sources configured yet. Add your first source to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sources.map((source) => (
        <div key={source.id} className="border rounded-lg p-4 bg-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{source.name}</h3>
                <Badge variant={source.enabled ? "default" : "outline"}>
                  {source.type.charAt(0).toUpperCase() + source.type.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {getSourceTypeDescription(source.type)}
              </p>
              {source.lastScan && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last scan: {new Date(source.lastScan).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onRefreshSource(source)}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              {source.type === 'zapier' && source.config?.url && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-blue-600"
                  title="Open Zapier webhook URL"
                  onClick={() => window.open(source.config?.url, '_blank')}
                >
                  <Link className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600"
                onClick={() => onDeleteSource(source.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Switch 
                checked={source.enabled}
                onCheckedChange={(checked) => onToggleSource(source.id, checked)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SourcesList;

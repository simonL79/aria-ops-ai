
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrapingResult } from '@/types/aiScraping';
import { ArrowUpRight, Calendar, Link as LinkIcon } from "lucide-react";

interface ScrapingResultItemProps {
  result: ScrapingResult;
  onViewDetails: (result: ScrapingResult) => void;
}

const ScrapingResultItem = ({ result, onViewDetails }: ScrapingResultItemProps) => {
  const getSentimentColor = (sentiment: number): string => {
    if (sentiment < -0.5) return 'bg-red-500 text-white';
    if (sentiment < 0) return 'bg-orange-500 text-white';
    if (sentiment > 0.5) return 'bg-green-500 text-white';
    if (sentiment > 0) return 'bg-emerald-500 text-white';
    return 'bg-slate-500 text-white';
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className={getSentimentColor(result.sentiment)}>
              {result.entityType || 'Content'}
            </Badge>
            <span className="text-sm font-medium">{result.sourceName}</span>
          </div>
          <h3 className="font-semibold">{result.entityName || 'Unknown Entity'}</h3>
        </div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(result.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{result.content}</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {result.riskScore !== undefined && (
            <Badge variant="outline">Risk: {result.riskScore}</Badge>
          )}
          {result.category && (
            <Badge variant="outline">{result.category}</Badge>
          )}
        </div>

        <div className="flex space-x-2">
          {result.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                <LinkIcon className="h-3 w-3 mr-1" />
                Source
              </a>
            </Button>
          )}
          <Button size="sm" onClick={() => onViewDetails(result)}>
            <ArrowUpRight className="h-3 w-3 mr-1" />
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScrapingResultItem;

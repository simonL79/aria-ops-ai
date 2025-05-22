
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { ScrapingResult } from '@/types/aiScraping';

interface ScrapingResultItemProps {
  result: ScrapingResult;
  onViewDetails: (result: ScrapingResult) => void;
}

const ScrapingResultItem = ({ result, onViewDetails }: ScrapingResultItemProps) => {
  // Helper functions
  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'person': return '👤';
      case 'organization': return '🏢';
      case 'location': return '📍';
      default: return '❓';
    }
  };
  
  const getSentimentBadge = (sentiment: number) => {
    if (sentiment <= -0.5) {
      return <Badge variant="destructive" className="ml-2">Negative</Badge>;
    } else if (sentiment >= 0.5) {
      return <Badge variant="secondary" className="ml-2 bg-green-500 hover:bg-green-600">Positive</Badge>;
    } else {
      return <Badge variant="outline" className="ml-2">Neutral</Badge>;
    }
  };

  const handleOpenUrl = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <CardContent className="p-0">
      <div className="border-l-4 border-l-blue-500 p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <span className="text-lg mr-1">{getEntityIcon(result.entityType)}</span>
              <h3 className="font-medium">{result.entityName}</h3>
              {getSentimentBadge(result.sentiment)}
              {(result.riskScore || 0) > 7 && (
                <Badge variant="destructive" className="ml-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  High Risk
                </Badge>
              )}
            </div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <span>Source: {result.sourceName}</span>
              <span className="mx-2">•</span>
              <span>{new Date(result.timestamp).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {result.url && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleOpenUrl(result.url)}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Source
              </Button>
            )}
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onViewDetails(result)}
            >
              View Details
            </Button>
          </div>
        </div>
        
        <div className="mt-3 text-sm">
          <p>{result.content}</p>
        </div>
        
        {result.aiAnalysis && <AnalysisSection analysis={result.aiAnalysis} />}
      </div>
    </CardContent>
  );
};

// Extract AI analysis to a separate component
interface AnalysisSectionProps {
  analysis: {
    summary?: string;
    recommendation?: string;
    threatClassification?: string;
  };
}

const AnalysisSection = ({ analysis }: AnalysisSectionProps) => {
  if (!analysis) return null;
  
  return (
    <div className="mt-3 pt-3 border-t">
      <div className="text-xs font-medium uppercase text-muted-foreground">AI Analysis</div>
      <div className="mt-1 text-sm">
        {analysis.summary && (
          <p>{analysis.summary}</p>
        )}
        {analysis.recommendation && (
          <p className="mt-1 text-sm font-medium">
            Recommendation: {analysis.recommendation}
          </p>
        )}
      </div>
    </div>
  );
};

export default ScrapingResultItem;

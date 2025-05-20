import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, ThumbsUp, Info, ExternalLink } from 'lucide-react';
import { ScrapingResult } from '@/types/aiScraping';
import { filterResults, getAllResults } from '@/services/aiScrapingService';
import { toast } from 'sonner';

interface ScrapingResultsProps {
  results?: ScrapingResult[];
}

const ScrapingResults = ({ results: initialResults }: ScrapingResultsProps) => {
  const [filter, setFilter] = useState({
    entityType: '',
    source: '',
    sortBy: 'timestamp'
  });
  
  // Combine provided results with stored ones
  const storedResults = getAllResults();
  const results = initialResults && initialResults.length > 0 
    ? initialResults 
    : storedResults;
  
  // Apply filters
  const filteredResults = results.filter(result => {
    if (filter.entityType && result.entityType !== filter.entityType) {
      return false;
    }
    if (filter.source && result.sourceName !== filter.source) {
      return false;
    }
    return true;
  });
  
  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (filter.sortBy === 'timestamp') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (filter.sortBy === 'sentiment') {
      return a.sentiment - b.sentiment; // Most negative first
    }
    if (filter.sortBy === 'riskScore') {
      return (b.riskScore || 0) - (a.riskScore || 0);
    }
    return 0;
  });
  
  // Get unique sources for filter dropdown
  const uniqueSources = Array.from(new Set(results.map(r => r.sourceName)));
  
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
  
  const handleViewDetails = (result: ScrapingResult) => {
    // In a real implementation, this would open a detailed view
    toast.info(`Viewing details for ${result.entityName}`, {
      description: "This would open a detailed view in a production implementation"
    });
  };
  
  const handleOpenUrl = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[200px]">
          <Input 
            placeholder="Search in results..." 
            className="w-full"
            // Implement search functionality if needed
          />
        </div>
        <div>
          <Select
            value={filter.entityType}
            onValueChange={(value) => setFilter({...filter, entityType: value})}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Entity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="person">Person</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filter.source}
            onValueChange={(value) => setFilter({...filter, source: value})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sources</SelectItem>
              {uniqueSources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filter.sortBy}
            onValueChange={(value) => setFilter({...filter, sortBy: value})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timestamp">Most Recent</SelectItem>
              <SelectItem value="sentiment">Most Negative</SelectItem>
              <SelectItem value="riskScore">Highest Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {sortedResults.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-1">No results found</h3>
          <p className="text-sm">Try adjusting your filters or run a new scan</p>
        </div>
      ) : (
        sortedResults.map((result) => (
          <Card key={result.id} className="overflow-hidden">
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
                      onClick={() => handleViewDetails(result)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  <p>{result.content}</p>
                </div>
                
                {result.aiAnalysis && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs font-medium uppercase text-muted-foreground">AI Analysis</div>
                    <div className="mt-1 text-sm">
                      {result.aiAnalysis.summary && (
                        <p>{result.aiAnalysis.summary}</p>
                      )}
                      {result.aiAnalysis.recommendation && (
                        <p className="mt-1 text-sm font-medium">
                          Recommendation: {result.aiAnalysis.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ScrapingResults;

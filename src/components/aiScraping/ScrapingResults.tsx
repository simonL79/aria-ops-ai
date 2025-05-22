
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ScrapingResult } from '@/types/aiScraping';
import { getAllResults } from '@/services/aiScrapingService';
import ScrapingFilterBar from './scrapingComponents/ScrapingFilterBar';
import ScrapingResultItem from './scrapingComponents/ScrapingResultItem';
import EmptyScrapingResults from './scrapingComponents/EmptyScrapingResults';

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
  
  const handleViewDetails = (result: ScrapingResult) => {
    // In a real implementation, this would open a detailed view
    toast.info(`Viewing details for ${result.entityName}`, {
      description: "This would open a detailed view in a production implementation"
    });
  };

  return (
    <div className="space-y-4">
      <ScrapingFilterBar 
        filter={filter}
        setFilter={setFilter}
        uniqueSources={uniqueSources}
      />
      
      {sortedResults.length === 0 ? (
        <EmptyScrapingResults />
      ) : (
        sortedResults.map((result) => (
          <Card key={result.id} className="overflow-hidden">
            <ScrapingResultItem 
              result={result} 
              onViewDetails={handleViewDetails} 
            />
          </Card>
        ))
      )}
    </div>
  );
};

export default ScrapingResults;


import { Info } from 'lucide-react';

const EmptyScrapingResults = () => {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
      <h3 className="text-lg font-medium mb-1">No results found</h3>
      <p className="text-sm">Try adjusting your filters or run a new scan</p>
    </div>
  );
};

export default EmptyScrapingResults;

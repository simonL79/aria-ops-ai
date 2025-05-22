
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScrapingFilterBarProps {
  filter: {
    entityType: string;
    source: string;
    sortBy: string;
  };
  setFilter: (filter: any) => void;
  uniqueSources: string[];
}

const ScrapingFilterBar = ({ filter, setFilter, uniqueSources }: ScrapingFilterBarProps) => {
  return (
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
  );
};

export default ScrapingFilterBar;

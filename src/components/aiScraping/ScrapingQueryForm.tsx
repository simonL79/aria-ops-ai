
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader, Search } from 'lucide-react';
import { getEnabledSources } from '@/services/aiScrapingService';
import { ScrapingQuery } from '@/types/aiScraping';

interface ScrapingQueryFormProps {
  onSubmit: (query: ScrapingQuery) => void;
  isLoading: boolean;
}

const ScrapingQueryForm = ({ onSubmit, isLoading }: ScrapingQueryFormProps) => {
  const [query, setQuery] = useState('');
  const [selectedEntityTypes, setSelectedEntityTypes] = useState<string[]>(['person', 'organization']);
  
  const enabledSources = getEnabledSources();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }
    
    const scrapingQuery: ScrapingQuery = {
      query: query.trim(),
      entityTypes: selectedEntityTypes as ('person' | 'organization' | 'location')[],
      maxResults: 10
    };
    
    onSubmit(scrapingQuery);
  };
  
  const handleEntityTypeChange = (type: string, checked: boolean) => {
    setSelectedEntityTypes(prev => {
      if (checked) {
        return [...prev, type];
      } else {
        return prev.filter(t => t !== type);
      }
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">Search Query</Label>
              <div className="relative">
                <Input
                  id="query"
                  placeholder="Enter name, brand, or keyword to search for"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                  required
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Search across all enabled sources for mentions, reviews, and content
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Entity Types to Monitor</Label>
              <div className="flex flex-wrap gap-4 mt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="person" 
                    checked={selectedEntityTypes.includes('person')}
                    onCheckedChange={(checked) => handleEntityTypeChange('person', checked === true)}
                  />
                  <Label htmlFor="person" className="text-sm font-normal">Person</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="organization" 
                    checked={selectedEntityTypes.includes('organization')}
                    onCheckedChange={(checked) => handleEntityTypeChange('organization', checked === true)}
                  />
                  <Label htmlFor="organization" className="text-sm font-normal">Organization</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="location" 
                    checked={selectedEntityTypes.includes('location')}
                    onCheckedChange={(checked) => handleEntityTypeChange('location', checked === true)}
                  />
                  <Label htmlFor="location" className="text-sm font-normal">Location</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Active Sources ({enabledSources.length})</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {enabledSources.map(source => (
                  <div key={source.id} className="border px-2 py-1 rounded-md text-xs bg-muted">
                    {source.name}
                  </div>
                ))}
                {enabledSources.length === 0 && (
                  <p className="text-sm text-muted-foreground">No sources enabled. Please enable sources in the Sources tab.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !query.trim() || enabledSources.length === 0}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Run AI Scraping
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScrapingQueryForm;

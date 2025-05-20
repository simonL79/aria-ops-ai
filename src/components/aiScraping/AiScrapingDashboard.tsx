
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import SourcesManager from './SourcesManager';
import ManualInputForm from './ManualInputForm';
import ScrapingResults from './ScrapingResults';
import ScrapingQueryForm from './ScrapingQueryForm';
import PromptTemplates from './PromptTemplates';
import { ScrapingQuery, ScrapingResult } from '@/types/aiScraping';
import { runScraping } from '@/services/aiScrapingService';

const AiScrapingDashboard = () => {
  const [activeTab, setActiveTab] = useState('results');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScrapingResult[]>([]);

  const handleRunScraping = async (query: ScrapingQuery) => {
    setIsLoading(true);
    try {
      const newResults = await runScraping(query);
      setResults(newResults);
      setActiveTab('results');
    } catch (error) {
      console.error('Error running scraping:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">AI Scraping & Data Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="query">Query Builder</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="manual">Manual Input</TabsTrigger>
            <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="query">
            <div className="space-y-4">
              <ScrapingQueryForm 
                onSubmit={handleRunScraping} 
                isLoading={isLoading} 
              />
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="ml-2 text-muted-foreground">Running AI-powered scraping...</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sources">
            <SourcesManager />
          </TabsContent>

          <TabsContent value="manual">
            <ManualInputForm onSuccess={() => setActiveTab('results')} />
          </TabsContent>
          
          <TabsContent value="prompts">
            <PromptTemplates />
          </TabsContent>

          <TabsContent value="results">
            <ScrapingResults results={results} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiScrapingDashboard;

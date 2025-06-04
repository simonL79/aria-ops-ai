
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Shield, MessageSquare, FileText, TrendingUp, ArrowRight } from 'lucide-react';
import EntityScanTab from './EntityScanTab';
import CIAPrecisionTab from './CIAPrecisionTab';
import CounterNarrativeTab from './CounterNarrativeTab';
import ArticleGenerationTab from './ArticleGenerationTab';
import PerformanceTab from './PerformanceTab';
import ClientControlPanel from './ClientControlPanel';
import PipelineCommunicationPanel from './PipelineCommunicationPanel';

interface KeywordSystemTabsProps {
  keywordData: any[];
  counterNarratives: any[];
  onRefresh: () => void;
}

const KeywordSystemTabs: React.FC<KeywordSystemTabsProps> = ({
  keywordData,
  counterNarratives,
  onRefresh
}) => {
  const [selectedEntity, setSelectedEntity] = React.useState('Simon Lindsay');

  return (
    <div className="space-y-6">
      {/* Pipeline Communication Panel - NEW */}
      <PipelineCommunicationPanel entityName={selectedEntity} />
      
      <Tabs defaultValue="entity-scan" className="space-y-6">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 bg-corporate-dark">
          <TabsTrigger value="entity-scan" className="flex items-center gap-2 data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Entity Scan</span>
          </TabsTrigger>
          <TabsTrigger value="cia-precision" className="flex items-center gap-2 data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">CIA Precision</span>
          </TabsTrigger>
          <TabsTrigger value="counter-narratives" className="flex items-center gap-2 data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Counter Narratives</span>
          </TabsTrigger>
          <TabsTrigger value="article-generation" className="flex items-center gap-2 data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Article Generation</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="client-control" className="flex items-center gap-2 data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <ArrowRight className="h-4 w-4" />
            <span className="hidden sm:inline">Client Control</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entity-scan">
          <EntityScanTab onEntitySelect={setSelectedEntity} />
        </TabsContent>

        <TabsContent value="cia-precision">
          <CIAPrecisionTab entityName={selectedEntity} />
        </TabsContent>

        <TabsContent value="counter-narratives">
          <CounterNarrativeTab 
            entityName={selectedEntity}
            narratives={counterNarratives}
            onRefresh={onRefresh}
          />
        </TabsContent>

        <TabsContent value="article-generation">
          <ArticleGenerationTab entityName={selectedEntity} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceTab entityName={selectedEntity} />
        </TabsContent>

        <TabsContent value="client-control">
          <ClientControlPanel 
            keywordData={keywordData}
            narratives={counterNarratives}
            onRefresh={onRefresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordSystemTabs;

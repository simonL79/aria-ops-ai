
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EntityScanTab from './EntityScanTab';
import CIAPrecisionTab from './CIAPrecisionTab';
import AdvancedThreatAnalysisTab from './AdvancedThreatAnalysisTab';
import CounterNarrativeTab from './CounterNarrativeTab';
import ArticleGenerationTab from './ArticleGenerationTab';
import PerformanceTab from './PerformanceTab';

interface KeywordSystemTabsProps {
  selectedClient?: string;
  entityName?: string;
  keywordData?: any[];
  counterNarratives?: any[];
  onRefresh?: () => Promise<void>;
}

const KeywordSystemTabs = ({ 
  selectedClient, 
  entityName = 'Simon Lindsay', 
  keywordData = [], 
  counterNarratives = [], 
  onRefresh = async () => {} 
}: KeywordSystemTabsProps) => {
  const [activeTab, setActiveTab] = useState("entity-scan");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 w-full bg-corporate-darkSecondary">
          <TabsTrigger 
            value="entity-scan" 
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            Entity Scan
          </TabsTrigger>
          <TabsTrigger 
            value="cia-precision" 
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            CIA Precision
          </TabsTrigger>
          <TabsTrigger 
            value="advanced-analysis" 
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            Advanced Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="counter-narrative" 
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            Counter Narrative
          </TabsTrigger>
          <TabsTrigger 
            value="article-generation" 
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            Article Generation
          </TabsTrigger>
          <TabsTrigger 
            value="performance" 
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entity-scan" className="mt-6">
          <EntityScanTab />
        </TabsContent>

        <TabsContent value="cia-precision" className="mt-6">
          <CIAPrecisionTab entityName={entityName} />
        </TabsContent>

        <TabsContent value="advanced-analysis" className="mt-6">
          <AdvancedThreatAnalysisTab entityName={entityName} />
        </TabsContent>

        <TabsContent value="counter-narrative" className="mt-6">
          <CounterNarrativeTab 
            entityName={entityName} 
            narratives={counterNarratives}
            onRefresh={onRefresh}
          />
        </TabsContent>

        <TabsContent value="article-generation" className="mt-6">
          <ArticleGenerationTab entityName={entityName} />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <PerformanceTab entityName={entityName} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordSystemTabs;

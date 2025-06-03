
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Brain, FileText } from 'lucide-react';
import LiveKeywordIntelligence from './LiveKeywordIntelligence';
import CounterNarrativeStrategy from './CounterNarrativeStrategy';
import ArticleGenerationHub from './ArticleGenerationHub';

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
  return (
    <Tabs defaultValue="keyword-intelligence" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 bg-corporate-darkSecondary border border-corporate-border">
        <TabsTrigger value="keyword-intelligence" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
          <Target className="h-4 w-4 mr-2" />
          Live Keyword Intelligence
        </TabsTrigger>
        <TabsTrigger value="counter-narrative" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
          <Brain className="h-4 w-4 mr-2" />
          Counter-Narrative Strategy
        </TabsTrigger>
        <TabsTrigger value="article-generation" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
          <FileText className="h-4 w-4 mr-2" />
          Article Generation
        </TabsTrigger>
      </TabsList>

      <TabsContent value="keyword-intelligence">
        <LiveKeywordIntelligence 
          keywordData={keywordData}
          onRefresh={onRefresh}
        />
      </TabsContent>

      <TabsContent value="counter-narrative">
        <CounterNarrativeStrategy 
          narratives={counterNarratives}
          onRefresh={onRefresh}
        />
      </TabsContent>

      <TabsContent value="article-generation">
        <ArticleGenerationHub 
          narratives={counterNarratives}
          onRefresh={onRefresh}
        />
      </TabsContent>
    </Tabs>
  );
};

export default KeywordSystemTabs;

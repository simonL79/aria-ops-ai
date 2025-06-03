
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
    <div className="relative z-10">
      <Tabs defaultValue="keyword-intelligence" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-corporate-darkSecondary border border-corporate-border relative z-20">
          <TabsTrigger 
            value="keyword-intelligence" 
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray hover:text-white transition-colors relative z-30"
            type="button"
          >
            <Target className="h-4 w-4 mr-2" />
            Live Keyword Intelligence
          </TabsTrigger>
          <TabsTrigger 
            value="counter-narrative" 
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray hover:text-white transition-colors relative z-30"
            type="button"
          >
            <Brain className="h-4 w-4 mr-2" />
            Counter-Narrative Strategy
          </TabsTrigger>
          <TabsTrigger 
            value="article-generation" 
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray hover:text-white transition-colors relative z-30"
            type="button"
          >
            <FileText className="h-4 w-4 mr-2" />
            Article Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keyword-intelligence" className="relative z-10">
          <LiveKeywordIntelligence 
            keywordData={keywordData}
            onRefresh={onRefresh}
          />
        </TabsContent>

        <TabsContent value="counter-narrative" className="relative z-10">
          <CounterNarrativeStrategy 
            narratives={counterNarratives}
            onRefresh={onRefresh}
          />
        </TabsContent>

        <TabsContent value="article-generation" className="relative z-10">
          <ArticleGenerationHub 
            narratives={counterNarratives}
            onRefresh={onRefresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordSystemTabs;

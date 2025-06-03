
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, BarChart3, Settings, Bot } from 'lucide-react';
import CounterNarrativeEngine from './CounterNarrativeEngine';
import ArticleGenerationHub from './ArticleGenerationHub';
import PerformanceTracking from './PerformanceTracking';
import DeploymentCenter from './DeploymentCenter';
import EntityPrecisionDashboard from './EntityPrecisionDashboard';

interface KeywordSystemTabsProps {
  keywordData: any[];
  counterNarratives: any[];
  onRefresh: () => void;
}

const KeywordSystemTabs = ({ keywordData, counterNarratives, onRefresh }: KeywordSystemTabsProps) => {
  return (
    <Tabs defaultValue="precision" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5 bg-corporate-darkTertiary border border-corporate-border h-14">
        <TabsTrigger 
          value="precision" 
          className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray hover:text-white transition-colors"
        >
          <Target className="h-5 w-5" />
          <span className="hidden sm:inline">CIA Precision</span>
        </TabsTrigger>
        <TabsTrigger 
          value="narratives" 
          className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray hover:text-white transition-colors"
        >
          <Zap className="h-5 w-5" />
          <span className="hidden sm:inline">Counter-Narratives</span>
        </TabsTrigger>
        <TabsTrigger 
          value="articles" 
          className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray hover:text-white transition-colors"
        >
          <Bot className="h-5 w-5" />
          <span className="hidden sm:inline">Article Generation</span>
        </TabsTrigger>
        <TabsTrigger 
          value="performance" 
          className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray hover:text-white transition-colors"
        >
          <BarChart3 className="h-5 w-5" />
          <span className="hidden sm:inline">Performance</span>
        </TabsTrigger>
        <TabsTrigger 
          value="deployment" 
          className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray hover:text-white transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span className="hidden sm:inline">Deployment</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="precision">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">CIA-Level Entity Precision</h3>
              <p className="text-base text-corporate-lightGray leading-relaxed max-w-3xl">
                Advanced entity disambiguation eliminates false positives like "Lindsay Lohan" for "Simon Lindsay"
              </p>
            </div>
            <Badge className="bg-blue-900/20 text-blue-300 border-blue-500/30 px-4 py-2 text-base font-medium w-fit">
              <Target className="h-4 w-4 mr-2" />
              Advanced NER Active
            </Badge>
          </div>
          <EntityPrecisionDashboard />
        </div>
      </TabsContent>

      <TabsContent value="narratives">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">Counter-Narrative Generation</h3>
              <p className="text-base text-corporate-lightGray leading-relaxed max-w-3xl">
                AI-powered strategic counter-narratives from live intelligence
              </p>
            </div>
            <Badge variant="outline" className="border-corporate-border text-corporate-lightGray px-4 py-2 text-base font-medium w-fit">
              {counterNarratives.length} Active Narratives
            </Badge>
          </div>
          <CounterNarrativeEngine 
            keywordData={keywordData}
            narratives={counterNarratives}
            onRefresh={onRefresh}
          />
        </div>
      </TabsContent>

      <TabsContent value="articles">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">Article Generation Hub</h3>
              <p className="text-base text-corporate-lightGray leading-relaxed max-w-3xl">
                Transform counter-narratives into deployable content
              </p>
            </div>
            <Badge variant="outline" className="border-corporate-border text-corporate-lightGray px-4 py-2 text-base font-medium w-fit">
              Content Pipeline
            </Badge>
          </div>
          <ArticleGenerationHub 
            narratives={counterNarratives}
            onRefresh={onRefresh}
          />
        </div>
      </TabsContent>

      <TabsContent value="performance">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">Performance Analytics</h3>
              <p className="text-base text-corporate-lightGray leading-relaxed max-w-3xl">
                Track keyword performance and content impact
              </p>
            </div>
            <Badge variant="outline" className="border-corporate-border text-corporate-lightGray px-4 py-2 text-base font-medium w-fit">
              Real-time Metrics
            </Badge>
          </div>
          <PerformanceTracking 
            articles={[]}
            keywordData={keywordData}
            onRefresh={onRefresh}
          />
        </div>
      </TabsContent>

      <TabsContent value="deployment">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">Deployment Center</h3>
              <p className="text-base text-corporate-lightGray leading-relaxed max-w-3xl">
                Configure and manage content deployment
              </p>
            </div>
            <Badge variant="outline" className="border-corporate-border text-corporate-lightGray px-4 py-2 text-base font-medium w-fit">
              Multi-Platform
            </Badge>
          </div>
          <DeploymentCenter 
            articles={[]}
            onRefresh={onRefresh}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default KeywordSystemTabs;

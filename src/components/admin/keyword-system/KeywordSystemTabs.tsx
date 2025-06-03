
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
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="precision" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          CIA Precision
        </TabsTrigger>
        <TabsTrigger value="narratives" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Counter-Narratives
        </TabsTrigger>
        <TabsTrigger value="articles" className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          Article Generation
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Performance
        </TabsTrigger>
        <TabsTrigger value="deployment" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Deployment
        </TabsTrigger>
      </TabsList>

      <TabsContent value="precision">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">CIA-Level Entity Precision</h3>
              <p className="text-muted-foreground">Advanced entity disambiguation eliminates false positives like "Lindsay Lohan" for "Simon Lindsay"</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              <Target className="h-3 w-3 mr-1" />
              Advanced NER Active
            </Badge>
          </div>
          <EntityPrecisionDashboard />
        </div>
      </TabsContent>

      <TabsContent value="narratives">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Counter-Narrative Generation</h3>
              <p className="text-muted-foreground">AI-powered strategic counter-narratives from live intelligence</p>
            </div>
            <Badge variant="outline">
              {counterNarratives.length} Active Narratives
            </Badge>
          </div>
          <CounterNarrativeEngine 
            onRefresh={onRefresh}
          />
        </div>
      </TabsContent>

      <TabsContent value="articles">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Article Generation Hub</h3>
              <p className="text-muted-foreground">Transform counter-narratives into deployable content</p>
            </div>
            <Badge variant="outline">
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Performance Analytics</h3>
              <p className="text-muted-foreground">Track keyword performance and content impact</p>
            </div>
            <Badge variant="outline">
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Deployment Center</h3>
              <p className="text-muted-foreground">Configure and manage content deployment</p>
            </div>
            <Badge variant="outline">
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

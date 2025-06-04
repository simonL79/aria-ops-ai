
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Brain } from 'lucide-react';
import AdvancedCounterNarrativeEngine from './AdvancedCounterNarrativeEngine';
import IntelligenceLearningHub from '@/components/admin/intelligence/IntelligenceLearningHub';

interface CounterNarrativeTabProps {
  entityName: string;
  narratives: any[];
  onRefresh: () => void;
}

const CounterNarrativeTab: React.FC<CounterNarrativeTabProps> = ({ 
  entityName, 
  narratives, 
  onRefresh 
}) => {
  const [keywordData, setKeywordData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('counter-narrative');

  useEffect(() => {
    // Simulate keyword data for demonstration
    // In a real implementation, this would come from the keyword system
    setKeywordData([
      {
        id: '1',
        keyword: 'negative feedback',
        sentiment_score: -0.7,
        threat_level: 'high',
        platform: 'twitter'
      },
      {
        id: '2',
        keyword: 'poor service',
        sentiment_score: -0.5,
        threat_level: 'medium',
        platform: 'reddit'
      },
      {
        id: '3',
        keyword: 'disappointing results',
        sentiment_score: -0.3,
        threat_level: 'low',
        platform: 'facebook'
      }
    ]);
  }, [entityName]);

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-corporate-accent" />
            Advanced Counter Narrative System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium">Entity: {entityName}</h4>
              <p className="text-corporate-lightGray text-sm">
                AI-powered counter-narrative generation with strategy memory and automated response templates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tabs with Intelligence Learning */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full bg-corporate-darkSecondary">
          <TabsTrigger 
            value="counter-narrative"
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Counter Narratives
          </TabsTrigger>
          <TabsTrigger 
            value="intelligence-learning"
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            <Brain className="h-4 w-4 mr-2" />
            Intelligence Learning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="counter-narrative" className="mt-6">
          <AdvancedCounterNarrativeEngine
            keywordData={keywordData}
            narratives={narratives}
            entityName={entityName}
            onRefresh={onRefresh}
          />
        </TabsContent>

        <TabsContent value="intelligence-learning" className="mt-6">
          <IntelligenceLearningHub entityName={entityName} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CounterNarrativeTab;

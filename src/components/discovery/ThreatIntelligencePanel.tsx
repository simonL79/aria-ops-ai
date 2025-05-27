
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Target, Zap } from "lucide-react";
import { DiscoveredThreat } from '@/hooks/useDiscoveryScanning';

interface ThreatIntelligencePanelProps {
  threats: DiscoveredThreat[];
}

const ThreatIntelligencePanel = ({ threats }: ThreatIntelligencePanelProps) => {
  const [selectedThreat, setSelectedThreat] = useState<DiscoveredThreat | null>(null);

  const threatsByLevel = {
    critical: threats.filter(t => t.threatLevel >= 8),
    high: threats.filter(t => t.threatLevel >= 6 && t.threatLevel < 8),
    medium: threats.filter(t => t.threatLevel >= 4 && t.threatLevel < 6),
    low: threats.filter(t => t.threatLevel < 4)
  };

  const platformStats = threats.reduce((acc, threat) => {
    acc[threat.platform] = (acc[threat.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const entityStats = threats.reduce((acc, threat) => {
    acc[threat.entityName] = (acc[threat.entityName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const runNLPAnalysis = async (threat: DiscoveredThreat) => {
    // This would call your NLP analysis edge function
    console.log('Running NLP analysis for:', threat.id);
  };

  return (
    <div className="space-y-6">
      {/* Intelligence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Threats</p>
                <p className="text-2xl font-bold text-red-600">{threatsByLevel.critical.length}</p>
              </div>
              <Target className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">{threatsByLevel.high.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Entities</p>
                <p className="text-2xl font-bold">{Object.keys(entityStats).length}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platforms</p>
                <p className="text-2xl font-bold">{Object.keys(platformStats).length}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis">
        <TabsList>
          <TabsTrigger value="analysis">NLP Analysis</TabsTrigger>
          <TabsTrigger value="classification">Threat Classification</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Named Entity Recognition & Classification</CardTitle>
              <CardDescription>
                AI-powered analysis of discovered threats using NLP pipelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatsByLevel.critical.slice(0, 5).map((threat) => (
                  <div key={threat.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{threat.entityName}</h4>
                        <p className="text-sm text-muted-foreground">{threat.platform}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => runNLPAnalysis(threat)}
                      >
                        <Brain className="mr-1 h-3 w-3" />
                        Analyze
                      </Button>
                    </div>
                    
                    <p className="text-sm mb-2">{threat.contextSnippet}</p>
                    
                    <div className="flex gap-2">
                      <Badge variant="outline">Type: {threat.threatType}</Badge>
                      <Badge variant="outline">Level: {threat.threatLevel}/10</Badge>
                      <Badge variant="outline">Sentiment: {threat.sentiment.toFixed(2)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Classification</CardTitle>
              <CardDescription>
                Automated categorization: fraud, scam, PR crisis, legal threat, abuse, misinformation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(
                  threats.reduce((acc, threat) => {
                    acc[threat.threatType] = (acc[threat.threatType] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <div key={type} className="p-3 border rounded-lg">
                    <h4 className="font-medium capitalize">{type.replace('_', ' ')}</h4>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">threats</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>
                VADER + GPT-powered sentiment scoring and trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {threats.filter(t => t.sentiment < -0.3).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Very Negative</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {threats.filter(t => t.sentiment >= -0.3 && t.sentiment <= 0.3).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Neutral</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {threats.filter(t => t.sentiment > 0.3).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Positive</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>
                Platform distribution and mention velocity tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium">Top Platforms by Threat Count</h4>
                {Object.entries(platformStats)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([platform, count]) => (
                    <div key={platform} className="flex items-center justify-between">
                      <span>{platform}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...Object.values(platformStats))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThreatIntelligencePanel;

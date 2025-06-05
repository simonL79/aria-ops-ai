
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Search, FileText, Brain, Zap, Plus } from 'lucide-react';
import ArticleGenerationTab from './keyword-system/ArticleGenerationTab';
import { toast } from 'sonner';

const KeywordToArticleSystem = () => {
  const [selectedEntity, setSelectedEntity] = useState('');
  const [entities] = useState([
    'Simon Lindsay',
    'TechCorp Inc',
    'Global Solutions Ltd',
    'Innovation Partners'
  ]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [mockThreats] = useState([
    { id: 1, source: 'Twitter', threat: 'Negative sentiment detected', severity: 'high' },
    { id: 2, source: 'Reddit', threat: 'Reputation attack identified', severity: 'critical' },
    { id: 3, source: 'News Site', threat: 'Misleading article published', severity: 'medium' }
  ]);

  const startMonitoring = () => {
    if (!selectedEntity) {
      toast.error('Please select an entity first');
      return;
    }
    setIsMonitoring(true);
    toast.success(`🔍 Real-time monitoring started for ${selectedEntity}`);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    toast.info('Monitoring stopped');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <Target className="h-8 w-8 text-corporate-accent" />
            A.R.I.A vX™ — Keyword-to-Article System
          </h1>
          <p className="text-corporate-lightGray mt-1">
            Real-time reputation reshaping engine with AI-powered content generation
          </p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          LIVE ENGINE
        </Badge>
      </div>

      {/* Entity Selection */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5 text-corporate-accent" />
            Entity Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {entities.map((entity) => (
              <Button
                key={entity}
                onClick={() => setSelectedEntity(entity)}
                variant={selectedEntity === entity ? "default" : "outline"}
                className={
                  selectedEntity === entity
                    ? "bg-corporate-accent text-black hover:bg-corporate-accent/90"
                    : "border-corporate-border text-corporate-lightGray hover:bg-corporate-darkSecondary"
                }
              >
                {entity}
              </Button>
            ))}
          </div>
          {selectedEntity && (
            <div className="mt-4 p-3 bg-corporate-accent/10 border border-corporate-accent/30 rounded-lg">
              <p className="text-corporate-accent font-medium">
                Selected Entity: {selectedEntity}
              </p>
              <p className="text-corporate-lightGray text-sm">
                AI engine will monitor and generate content for this entity
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main System Tabs */}
      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList className="grid grid-cols-4 bg-corporate-darkSecondary">
          <TabsTrigger value="monitoring" className="text-corporate-lightGray data-[state=active]:text-black data-[state=active]:bg-corporate-accent">
            Entity Monitoring
          </TabsTrigger>
          <TabsTrigger value="filtering" className="text-corporate-lightGray data-[state=active]:text-black data-[state=active]:bg-corporate-accent">
            CIA Filtering
          </TabsTrigger>
          <TabsTrigger value="narratives" className="text-corporate-lightGray data-[state=active]:text-black data-[state=active]:bg-corporate-accent">
            Counter-Narratives
          </TabsTrigger>
          <TabsTrigger value="articles" className="text-corporate-lightGray data-[state=active]:text-black data-[state=active]:bg-corporate-accent">
            Article Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring">
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-5 w-5 text-corporate-accent" />
                Real-Time Entity Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEntity ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Monitoring: {selectedEntity}</h4>
                      <p className="text-corporate-lightGray text-sm">
                        {isMonitoring ? 'Live monitoring active across all platforms' : 'Click start to begin monitoring'}
                      </p>
                    </div>
                    <Button
                      onClick={isMonitoring ? stopMonitoring : startMonitoring}
                      className={isMonitoring 
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-corporate-accent text-black hover:bg-corporate-accent/90"
                      }
                    >
                      {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                    </Button>
                  </div>
                  
                  {isMonitoring && (
                    <div className="space-y-3">
                      <h5 className="text-white font-medium">Detected Threats:</h5>
                      {mockThreats.map((threat) => (
                        <div key={threat.id} className="p-3 bg-corporate-darkSecondary rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{threat.threat}</p>
                              <p className="text-corporate-lightGray text-sm">Source: {threat.source}</p>
                            </div>
                            <Badge className={
                              threat.severity === 'critical' ? 'bg-red-500 text-white' :
                              threat.severity === 'high' ? 'bg-orange-500 text-white' :
                              'bg-yellow-500 text-black'
                            }>
                              {threat.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
                  <p className="text-corporate-lightGray">
                    Select an entity to begin monitoring
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filtering">
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-corporate-accent" />
                CIA-Level Precision Filtering
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-corporate-darkSecondary rounded-lg">
                    <h4 className="text-white font-medium mb-2">Threat Classification</h4>
                    <p className="text-corporate-lightGray text-sm">98.7% accuracy</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '98.7%'}}></div>
                    </div>
                  </div>
                  <div className="p-4 bg-corporate-darkSecondary rounded-lg">
                    <h4 className="text-white font-medium mb-2">False Positive Rate</h4>
                    <p className="text-corporate-lightGray text-sm">1.3%</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '1.3%'}}></div>
                    </div>
                  </div>
                  <div className="p-4 bg-corporate-darkSecondary rounded-lg">
                    <h4 className="text-white font-medium mb-2">Processing Speed</h4>
                    <p className="text-corporate-lightGray text-sm">Real-time</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div className="bg-corporate-accent h-2 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
                <p className="text-corporate-lightGray">
                  Advanced AI filtering eliminates false positives and focuses on genuine threats using military-grade precision algorithms.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="narratives">
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-corporate-accent" />
                Strategic Counter-Narratives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-corporate-lightGray">
                    AI-generated counter-narratives and strategic messaging for threat neutralization
                  </p>
                  <Button className="bg-corporate-accent text-black hover:bg-corporate-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Narrative
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-corporate-darkSecondary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">Positive Brand Reinforcement</h4>
                      <Badge className="bg-green-500 text-white">ACTIVE</Badge>
                    </div>
                    <p className="text-corporate-lightGray text-sm mb-2">
                      Strategic content highlighting achievements and positive impact
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-corporate-lightGray">LinkedIn</Badge>
                      <Badge variant="outline" className="text-corporate-lightGray">Twitter</Badge>
                      <Badge variant="outline" className="text-corporate-lightGray">Medium</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-corporate-darkSecondary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">Thought Leadership</h4>
                      <Badge className="bg-blue-500 text-white">SCHEDULED</Badge>
                    </div>
                    <p className="text-corporate-lightGray text-sm mb-2">
                      Industry insights and expert commentary to establish authority
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-corporate-lightGray">Blog</Badge>
                      <Badge variant="outline" className="text-corporate-lightGray">Industry Forums</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles">
          <ArticleGenerationTab entityName={selectedEntity} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordToArticleSystem;

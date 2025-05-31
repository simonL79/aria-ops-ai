
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Search, Network, Target, Database, Clock } from 'lucide-react';
import { useAnubisMemory } from '@/hooks/useAnubisMemory';
import { EntityMemory, ThreatPattern, EntityRelationship } from '@/services/localInference/memoryManager';

const AnubisMemoryConsole = () => {
  const [entityName, setEntityName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState('');
  const [memories, setMemories] = useState<EntityMemory[]>([]);
  const [patterns, setPatterns] = useState<ThreatPattern[]>([]);
  const [relationships, setRelationships] = useState<EntityRelationship[]>([]);
  const [contextData, setContextData] = useState<any>(null);

  const {
    storeMemory,
    recallMemories,
    analyzePatterns,
    mapRelationships,
    getFullContext,
    isStoring,
    isRecalling,
    isAnalyzing
  } = useAnubisMemory();

  const handleStoreMemory = async () => {
    if (!entityName.trim() || !content.trim()) return;

    const memory: EntityMemory = {
      entityName: entityName.trim(),
      memoryType: 'threat_analysis',
      content: content.trim(),
      context: { source: 'manual_input', timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString(),
      importance: 0.8,
      decay: 0.1
    };

    const success = await storeMemory(memory);
    if (success) {
      setContent('');
    }
  };

  const handleRecallMemories = async () => {
    if (!entityName.trim() || !searchQuery.trim()) return;

    const results = await recallMemories(entityName.trim(), searchQuery.trim(), 10);
    setMemories(results);
  };

  const handleAnalyzePatterns = async () => {
    if (!entityName.trim() || !content.trim()) return;

    const pattern = await analyzePatterns(entityName.trim(), content.trim(), 'manual');
    if (pattern) {
      setPatterns(prev => [pattern, ...prev.slice(0, 9)]);
    }
  };

  const handleGetFullContext = async () => {
    if (!entityName.trim()) return;

    const context = await getFullContext(entityName.trim());
    setContextData(context);
    setMemories(context.memories);
    setPatterns(context.patterns);
    setRelationships(context.relationships);
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 0.8) return 'bg-red-500';
    if (severity >= 0.6) return 'bg-orange-500';
    if (severity >= 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Brain className="h-6 w-6 text-corporate-accent" />
            A.N.U.B.I.S™ Memory Console
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-corporate-lightGray">Entity Name</label>
              <Input
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Enter entity name..."
                className="bg-corporate-dark border-corporate-border text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-corporate-lightGray">Search Query</label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories..."
                className="bg-corporate-dark border-corporate-border text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-corporate-lightGray">Content / Analysis Input</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content for memory storage or pattern analysis..."
              className="bg-corporate-dark border-corporate-border text-white min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              onClick={handleStoreMemory}
              disabled={isStoring || !entityName.trim() || !content.trim()}
              className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
            >
              {isStoring ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Storing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Store Memory
                </>
              )}
            </Button>

            <Button
              onClick={handleRecallMemories}
              disabled={isRecalling || !entityName.trim() || !searchQuery.trim()}
              variant="outline"
              className="border-corporate-border text-corporate-lightGray"
            >
              {isRecalling ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Recalling...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Recall
                </>
              )}
            </Button>

            <Button
              onClick={handleAnalyzePatterns}
              disabled={isAnalyzing || !entityName.trim() || !content.trim()}
              variant="outline"
              className="border-corporate-border text-corporate-lightGray"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>

            <Button
              onClick={handleGetFullContext}
              disabled={isRecalling || !entityName.trim()}
              variant="outline"
              className="border-corporate-border text-corporate-lightGray"
            >
              {isRecalling ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Network className="h-4 w-4 mr-2" />
                  Full Context
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="memories" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="memories">Memories ({memories.length})</TabsTrigger>
          <TabsTrigger value="patterns">Patterns ({patterns.length})</TabsTrigger>
          <TabsTrigger value="relationships">Relations ({relationships.length})</TabsTrigger>
          <TabsTrigger value="context">Context</TabsTrigger>
        </TabsList>

        <TabsContent value="memories" className="space-y-4">
          {memories.length === 0 ? (
            <Card className="corporate-card">
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold corporate-heading mb-2">No Memories Found</h3>
                <p className="corporate-subtext">Store or recall entity memories to see them here</p>
              </CardContent>
            </Card>
          ) : (
            memories.map((memory, index) => (
              <Card key={index} className="corporate-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="border-corporate-border text-corporate-lightGray">
                      {memory.memoryType}
                    </Badge>
                    <span className="text-xs text-corporate-lightGray">
                      {new Date(memory.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm corporate-subtext">{memory.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-blue-600 text-white text-xs">
                      Importance: {memory.importance}
                    </Badge>
                    <Badge className="bg-purple-600 text-white text-xs">
                      Decay: {memory.decay}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          {patterns.length === 0 ? (
            <Card className="corporate-card">
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold corporate-heading mb-2">No Patterns Detected</h3>
                <p className="corporate-subtext">Analyze content to identify threat patterns</p>
              </CardContent>
            </Card>
          ) : (
            patterns.map((pattern, index) => (
              <Card key={index} className="corporate-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getSeverityColor(pattern.severity)} text-white`}>
                        {pattern.threatType}
                      </Badge>
                      <Badge variant="outline" className="border-corporate-border text-corporate-lightGray">
                        Severity: {pattern.severity.toFixed(2)}
                      </Badge>
                    </div>
                    <span className="text-xs text-corporate-lightGray">
                      Freq: {pattern.frequency}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-corporate-lightGray">Indicators:</div>
                    <div className="flex flex-wrap gap-1">
                      {pattern.indicators.map((indicator, i) => (
                        <Badge key={i} className="bg-corporate-darkSecondary text-corporate-lightGray text-xs">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          {relationships.length === 0 ? (
            <Card className="corporate-card">
              <CardContent className="text-center py-8">
                <Network className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold corporate-heading mb-2">No Relationships Found</h3>
                <p className="corporate-subtext">Entity relationships will appear here when mapped</p>
              </CardContent>
            </Card>
          ) : (
            relationships.map((rel, index) => (
              <Card key={index} className="corporate-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{rel.entityA}</span>
                      <Badge className="bg-corporate-accent text-black">
                        {rel.relationshipType}
                      </Badge>
                      <span className="font-medium text-white">{rel.entityB}</span>
                    </div>
                    <Badge className="bg-blue-600 text-white">
                      Strength: {rel.strength.toFixed(2)}
                    </Badge>
                  </div>
                  <p className="text-sm corporate-subtext">{rel.context}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="context" className="space-y-4">
          {contextData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="corporate-card">
                <CardHeader>
                  <CardTitle className="text-sm corporate-heading">Risk Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  {contextData.riskProfile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-corporate-lightGray">Risk Score:</span>
                        <Badge className={`${getSeverityColor(contextData.riskProfile.risk_score)} text-white`}>
                          {(contextData.riskProfile.risk_score * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-corporate-lightGray">Signals:</span>
                        <span className="text-white">{contextData.riskProfile.total_signals}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm corporate-subtext">No risk profile available</p>
                  )}
                </CardContent>
              </Card>

              <Card className="corporate-card">
                <CardHeader>
                  <CardTitle className="text-sm corporate-heading">Memory Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-corporate-lightGray">Memories:</span>
                    <span className="text-white">{contextData.memories?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-corporate-lightGray">Patterns:</span>
                    <span className="text-white">{contextData.patterns?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-corporate-lightGray">Relationships:</span>
                    <span className="text-white">{contextData.relationships?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="corporate-card">
              <CardContent className="text-center py-8">
                <Database className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold corporate-heading mb-2">No Context Loaded</h3>
                <p className="corporate-subtext">Load full context for an entity to see comprehensive analysis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnubisMemoryConsole;

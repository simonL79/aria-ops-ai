import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Shield, Network, Users, GitBranch, Zap, Activity, Target } from 'lucide-react';
import { ThreatIntelligencePanel } from '@/components/intelligence/ThreatIntelligencePanel';
import ThreatCorrelationPanel from '@/components/intelligence/ThreatCorrelationPanel';
import EnhancedSigintVisualizer from '@/components/intelligence/EnhancedSigintVisualizer';
import RealTimeCollaboration from '@/components/intelligence/RealTimeCollaboration';
import EnhancedCaseThreading from '@/components/intelligence/EnhancedCaseThreading';
import OffensiveResponsePanel from '@/components/intelligence/OffensiveResponsePanel';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const EnhancedIntelligenceWorkbench = () => {
  const { user } = useAuth();
  const [threats, setThreats] = useState<any[]>([]);
  const [selectedThreats, setSelectedThreats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'unassigned' | 'correlated'>('all');
  const [realTimeStats, setRealTimeStats] = useState({
    totalThreats: 0,
    activeAnalysts: 3,
    correlationsFound: 0,
    activeCases: 2
  });

  useEffect(() => {
    loadThreats();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        ...prev,
        totalThreats: prev.totalThreats + Math.floor(Math.random() * 2),
        correlationsFound: prev.correlationsFound + Math.floor(Math.random() * 1)
      }));
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadThreats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      setThreats(data || []);
      setRealTimeStats(prev => ({ ...prev, totalThreats: data?.length || 0 }));
    } catch (error) {
      console.error('Error loading threats:', error);
      toast.error('Failed to load threats');
    } finally {
      setLoading(false);
    }
  };

  const handleThreatSelection = (threatId: string, checked: boolean) => {
    setSelectedThreats(prev => 
      checked 
        ? [...prev, threatId]
        : prev.filter(id => id !== threatId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedThreats(checked ? filteredThreats.map(t => t.id) : []);
  };

  const filteredThreats = threats.filter(threat => {
    switch (filter) {
      case 'high':
        return threat.severity === 'high';
      case 'unassigned':
        return !threat.assigned_to;
      case 'correlated':
        return threat.detected_entities && threat.detected_entities.length > 0;
      default:
        return true;
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Generate summary for AI analysis
  const threatSummary = selectedThreats.length > 0 
    ? threats.filter(t => selectedThreats.includes(t.id))
        .map(t => t.content)
        .join(' | ')
    : threats.slice(0, 10).map(t => t.content).join(' | ');

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header with Real-time Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8" />
              Elite Intelligence Workbench
            </h1>
            <p className="text-muted-foreground mt-1">
              Advanced AI-powered threat intelligence with real-time collaboration
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{realTimeStats.totalThreats}</div>
              <div className="text-xs text-muted-foreground">Total Threats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{realTimeStats.activeAnalysts}</div>
              <div className="text-xs text-muted-foreground">Active Analysts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{realTimeStats.correlationsFound}</div>
              <div className="text-xs text-muted-foreground">Correlations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{realTimeStats.activeCases}</div>
              <div className="text-xs text-muted-foreground">Active Cases</div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Interface */}
        <Tabs defaultValue="threats" className="space-y-4">
          <TabsList className="grid grid-cols-7">
            <TabsTrigger value="threats" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Threat Matrix
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              AI Intelligence
            </TabsTrigger>
            <TabsTrigger value="correlation" className="flex items-center gap-1">
              <Network className="h-4 w-4" />
              Correlation Engine
            </TabsTrigger>
            <TabsTrigger value="visualization" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              SIGINT Network
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Collaboration
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              Case Threading
            </TabsTrigger>
            <TabsTrigger value="offensive" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Offensive Ops
            </TabsTrigger>
          </TabsList>

          <TabsContent value="threats" className="space-y-4">
            {/* Enhanced Threat Matrix */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Advanced Threat Matrix</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('all')}
                    >
                      All ({threats.length})
                    </Button>
                    <Button
                      variant={filter === 'high' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('high')}
                    >
                      High Priority ({threats.filter(t => t.severity === 'high').length})
                    </Button>
                    <Button
                      variant={filter === 'correlated' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('correlated')}
                    >
                      Correlated ({threats.filter(t => t.detected_entities?.length > 0).length})
                    </Button>
                    <Button
                      variant={filter === 'unassigned' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('unassigned')}
                    >
                      Unassigned ({threats.filter(t => !t.assigned_to).length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Bulk Actions */}
                <div className="flex items-center gap-4 mb-4 p-3 bg-muted rounded-lg">
                  <Checkbox
                    checked={selectedThreats.length === filteredThreats.length && filteredThreats.length > 0}
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                  />
                  <span className="text-sm font-medium">
                    Select All ({filteredThreats.length})
                  </span>
                  
                  {selectedThreats.length > 0 && (
                    <div className="flex items-center gap-2 ml-auto">
                      <Badge variant="secondary">
                        {selectedThreats.length} selected
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Zap className="h-3 w-3 mr-1" />
                        AI Batch Analysis
                      </Button>
                      <Button size="sm" variant="outline">
                        Create Case Thread
                      </Button>
                    </div>
                  )}
                </div>

                {/* Enhanced Threats List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredThreats.map((threat) => (
                    <div 
                      key={threat.id} 
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedThreats.includes(threat.id)}
                        onCheckedChange={(checked) => handleThreatSelection(threat.id, Boolean(checked))}
                      />
                      
                      <div className={`w-2 h-8 rounded-full ${getSeverityColor(threat.severity)}`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{threat.platform}</Badge>
                          <Badge variant="secondary">{threat.threat_type || 'Unknown'}</Badge>
                          {threat.is_identified && (
                            <Badge className="bg-green-500">
                              <Users className="h-3 w-3 mr-1" />
                              Entities Detected
                            </Badge>
                          )}
                          {threat.ai_detection_confidence && (
                            <Badge className="bg-purple-500">
                              AI: {Math.round(threat.ai_detection_confidence * 100)}%
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm font-medium mb-1 truncate">
                          {threat.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(threat.created_at).toLocaleDateString()}</span>
                          <span>{threat.confidence_score}% confidence</span>
                          {threat.detected_entities && (
                            <span>{threat.detected_entities.length} entities</span>
                          )}
                          {threat.potential_reach && (
                            <span>Reach: {threat.potential_reach.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intelligence">
            <ThreatIntelligencePanel 
              summary={threatSummary}
              threats={threats}
            />
          </TabsContent>

          <TabsContent value="correlation">
            <ThreatCorrelationPanel 
              selectedThreats={selectedThreats}
              onCaseCreated={(caseThread) => {
                toast.success('Case thread created', {
                  description: `Created case: ${caseThread.title}`
                });
                setRealTimeStats(prev => ({ ...prev, activeCases: prev.activeCases + 1 }));
              }}
            />
          </TabsContent>

          <TabsContent value="visualization">
            <EnhancedSigintVisualizer 
              threats={threats}
              selectedThreats={selectedThreats}
            />
          </TabsContent>

          <TabsContent value="collaboration">
            <RealTimeCollaboration 
              threatId={selectedThreats[0]}
              selectedThreats={selectedThreats}
            />
          </TabsContent>

          <TabsContent value="cases">
            <EnhancedCaseThreading 
              selectedThreats={selectedThreats}
              onCaseCreated={(caseThread) => {
                toast.success('Case thread created', {
                  description: `Created case: ${caseThread.title}`
                });
                setRealTimeStats(prev => ({ ...prev, activeCases: prev.activeCases + 1 }));
              }}
            />
          </TabsContent>

          <TabsContent value="offensive">
            <OffensiveResponsePanel 
              selectedThreats={selectedThreats}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EnhancedIntelligenceWorkbench;

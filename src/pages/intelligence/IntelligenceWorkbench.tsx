
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Brain, Shield, Zap, FileText, Users } from 'lucide-react';
import ThreatCorrelationPanel from '@/components/intelligence/ThreatCorrelationPanel';
import IntelDossier from '@/components/intelligence/IntelDossier';
import AnalystMacros from '@/components/intelligence/AnalystMacros';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const IntelligenceWorkbench = () => {
  const { user } = useAuth();
  const [threats, setThreats] = useState<any[]>([]);
  const [selectedThreats, setSelectedThreats] = useState<string[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<any>(null);
  const [activeView, setActiveView] = useState<'list' | 'dossier'>('list');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'unassigned'>('all');

  useEffect(() => {
    loadThreats();
  }, []);

  const loadThreats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setThreats(data || []);
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

  const handleViewDossier = (threat: any) => {
    setSelectedThreat(threat);
    setActiveView('dossier');
  };

  const filteredThreats = threats.filter(threat => {
    switch (filter) {
      case 'high':
        return threat.severity === 'high';
      case 'unassigned':
        return !threat.assigned_to;
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8" />
              Intelligence Workbench
            </h1>
            <p className="text-muted-foreground mt-1">
              CIA-level threat analysis and correlation platform
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Analyst Mode
            </Badge>
            {selectedThreats.length > 0 && (
              <Badge variant="secondary">
                {selectedThreats.length} selected
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        {activeView === 'list' ? (
          <Tabs defaultValue="threats" className="space-y-4">
            <TabsList>
              <TabsTrigger value="threats">Threat Matrix</TabsTrigger>
              <TabsTrigger value="correlation">Correlation Engine</TabsTrigger>
              <TabsTrigger value="macros">Analyst Macros</TabsTrigger>
            </TabsList>

            <TabsContent value="threats" className="space-y-4">
              {/* Threat Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Threat Matrix</CardTitle>
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
                        <Button size="sm" variant="outline">
                          Bulk Assign
                        </Button>
                        <Button size="sm" variant="outline">
                          Bulk Tag
                        </Button>
                        <Button size="sm" variant="outline">
                          Export Selected
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Threats List */}
                  <div className="space-y-2">
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
                            {threat.assigned_to && (
                              <Badge variant="outline">
                                <Users className="h-3 w-3 mr-1" />
                                Assigned
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
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDossier(threat)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Intel Dossier
                        </Button>
                      </div>
                    ))}
                  </div>

                  {filteredThreats.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No threats found for the current filter</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="correlation">
              <ThreatCorrelationPanel 
                selectedThreats={selectedThreats}
                onCaseCreated={(caseThread) => {
                  toast.success('Case thread created', {
                    description: `Created case: ${caseThread.title}`
                  });
                }}
              />
            </TabsContent>

            <TabsContent value="macros">
              <AnalystMacros 
                selectedThreats={selectedThreats}
                onMacroExecuted={(macroId, threats) => {
                  loadThreats(); // Refresh data after macro execution
                }}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div>
            <Button 
              variant="outline" 
              onClick={() => setActiveView('list')}
              className="mb-4"
            >
              ← Back to Threat Matrix
            </Button>
            
            {selectedThreat && (
              <IntelDossier 
                threatId={selectedThreat.id}
                threatData={selectedThreat}
                onClose={() => setActiveView('list')}
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IntelligenceWorkbench;

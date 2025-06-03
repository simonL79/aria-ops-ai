
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Target, TrendingUp, Eye, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdvancedEntityMatcher } from '@/services/intelligence/advancedEntityMatcher';

interface PrecisionStats {
  total_queries: number;
  total_results: number;
  total_matched: number;
  total_discarded: number;
  avg_precision_score: number;
  confidence_level: 'high' | 'medium' | 'low';
  false_positive_rate: number;
  scan_date: string;
}

interface EntityFingerprint {
  id: string;
  primary_name: string;
  aliases: string[];
  organization?: string;
  locations: string[];
  context_tags: string[];
}

const EntityPrecisionDashboard = () => {
  const [fingerprints, setFingerprints] = useState<EntityFingerprint[]>([]);
  const [selectedFingerprint, setSelectedFingerprint] = useState<string | null>(null);
  const [precisionStats, setPrecisionStats] = useState<PrecisionStats[]>([]);
  const [recentDecisions, setRecentDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntityFingerprints();
  }, []);

  useEffect(() => {
    if (selectedFingerprint) {
      loadPrecisionStats(selectedFingerprint);
      loadRecentDecisions(selectedFingerprint);
    }
  }, [selectedFingerprint]);

  const loadEntityFingerprints = async () => {
    try {
      const { data, error } = await supabase
        .from('entity_fingerprints_advanced')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFingerprints(data || []);
      if (data && data.length > 0) {
        setSelectedFingerprint(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load entity fingerprints:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrecisionStats = async (fingerprintId: string) => {
    try {
      const stats = await AdvancedEntityMatcher.getPrecisionStats(fingerprintId);
      setPrecisionStats(stats || []);
    } catch (error) {
      console.error('Failed to load precision stats:', error);
    }
  };

  const loadRecentDecisions = async (fingerprintId: string) => {
    try {
      const { data, error } = await supabase
        .from('entity_match_decisions')
        .select(`
          *,
          entity_query_variants!inner(
            entity_fingerprint_id,
            query_text,
            query_type,
            platform
          )
        `)
        .eq('entity_query_variants.entity_fingerprint_id', fingerprintId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setRecentDecisions(data || []);
    } catch (error) {
      console.error('Failed to load recent decisions:', error);
    }
  };

  const currentStats = precisionStats[0];
  const selectedEntity = fingerprints.find(f => f.id === selectedFingerprint);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            CIA-Level Entity Precision Dashboard
          </h2>
          <p className="text-muted-foreground">Advanced entity disambiguation and false positive monitoring</p>
        </div>
        
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          CIA-Level Active
        </Badge>
      </div>

      {/* Entity Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Entity Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fingerprints.map(entity => (
              <div
                key={entity.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedFingerprint === entity.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedFingerprint(entity.id)}
              >
                <h3 className="font-medium">{entity.primary_name}</h3>
                <p className="text-sm text-muted-foreground">{entity.organization}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {entity.aliases.length} aliases
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {entity.locations.length} locations
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedEntity && currentStats && (
        <>
          {/* Precision Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Precision Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {(currentStats.avg_precision_score * 100).toFixed(1)}%
                </div>
                <Progress 
                  value={currentStats.avg_precision_score * 100} 
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {currentStats.confidence_level.toUpperCase()} confidence
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Match Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {currentStats.total_results > 0 
                    ? ((currentStats.total_matched / currentStats.total_results) * 100).toFixed(1)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentStats.total_matched} / {currentStats.total_results} results
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">False Positive Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {(currentStats.false_positive_rate * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Blocked {Math.round(currentStats.false_positive_rate * currentStats.total_results)} false positives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Queries Executed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {currentStats.total_queries}
                </div>
                <p className="text-xs text-muted-foreground">
                  Intelligent variants
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Tabs defaultValue="decisions" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="decisions">Recent Decisions</TabsTrigger>
              <TabsTrigger value="trends">Precision Trends</TabsTrigger>
              <TabsTrigger value="entity">Entity Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="decisions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Recent Match Decisions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentDecisions.map(decision => (
                      <div key={decision.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge 
                                variant={
                                  decision.decision === 'accepted' ? 'default' :
                                  decision.decision === 'quarantined' ? 'secondary' : 'destructive'
                                }
                              >
                                {decision.decision}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Score: {decision.match_score.toFixed(2)}
                              </Badge>
                              {decision.false_positive_detected && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  False Positive
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium">{decision.raw_title || 'No title'}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {decision.raw_content?.substring(0, 150)}...
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {decision.entity_query_variants?.platform || 'Unknown'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {decision.entity_query_variants?.query_type || 'Unknown'}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {new Date(decision.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {decision.reason_discarded && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-800">
                            <strong>Reason:</strong> {decision.reason_discarded}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Precision Trends (Last 30 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {precisionStats.slice(0, 10).map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{stat.scan_date}</p>
                          <p className="text-sm text-muted-foreground">
                            {stat.total_queries} queries, {stat.total_matched} matches
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {(stat.avg_precision_score * 100).toFixed(1)}%
                          </div>
                          <Badge 
                            variant={
                              stat.confidence_level === 'high' ? 'default' :
                              stat.confidence_level === 'medium' ? 'secondary' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {stat.confidence_level}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="entity">
              <Card>
                <CardHeader>
                  <CardTitle>Entity Fingerprint Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Primary Name</h4>
                      <p className="text-lg">{selectedEntity.primary_name}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Aliases</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntity.aliases.map(alias => (
                          <Badge key={alias} variant="outline">{alias}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    {selectedEntity.organization && (
                      <div>
                        <h4 className="font-medium mb-2">Organization</h4>
                        <p>{selectedEntity.organization}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-2">Locations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntity.locations.map(location => (
                          <Badge key={location} variant="secondary">{location}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Context Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntity.context_tags.map(tag => (
                          <Badge key={tag} variant="destructive">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default EntityPrecisionDashboard;

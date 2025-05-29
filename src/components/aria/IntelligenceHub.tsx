
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Brain, Activity, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const IntelligenceHub = () => {
  const [intelligenceData, setIntelligenceData] = useState<any[]>([]);
  const [threatPatterns, setThreatPatterns] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchIntelligenceData();
    const interval = setInterval(fetchIntelligenceData, 45000); // Refresh every 45 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchIntelligenceData = async () => {
    try {
      // Fetch intelligence from scan results with analysis
      const { data: scanData, error: scanError } = await supabase
        .from('scan_results')
        .select('*')
        .not('detected_entities', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (scanError) throw scanError;

      setIntelligenceData(scanData || []);

      // Analyze threat patterns
      const patterns = (scanData || []).reduce((acc: any[], item) => {
        const entities = item.detected_entities || [];
        entities.forEach((entity: string) => {
          const existing = acc.find(p => p.entity === entity);
          if (existing) {
            existing.count += 1;
            existing.severity = Math.max(existing.severity, getSeverityScore(item.severity));
          } else {
            acc.push({
              entity,
              count: 1,
              severity: getSeverityScore(item.severity),
              platform: item.platform,
              lastSeen: item.created_at
            });
          }
        });
        return acc;
      }, []);

      setThreatPatterns(patterns.sort((a, b) => b.severity - a.severity).slice(0, 10));

    } catch (error) {
      console.error('Error fetching intelligence data:', error);
    }
  };

  const getSeverityScore = (severity: string) => {
    switch (severity) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-intelligence', {
        body: { 
          scanType: 'ai_analysis',
          enableLiveData: true,
          includePatternAnalysis: true
        }
      });

      if (error) throw error;

      if (data?.analysis) {
        setAiAnalysis(data.analysis);
        toast.success('AI analysis completed successfully');
      } else {
        toast.info('No new patterns detected in current data');
      }

      fetchIntelligenceData();
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error('AI analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityBadge = (severity: number) => {
    if (severity >= 4) return <Badge className="bg-red-600 text-white">CRITICAL</Badge>;
    if (severity >= 3) return <Badge className="bg-red-500 text-white">HIGH</Badge>;
    if (severity >= 2) return <Badge className="bg-yellow-500 text-white">MEDIUM</Badge>;
    return <Badge className="bg-green-500 text-white">LOW</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Intelligence Hub
          </h2>
          <p className="text-muted-foreground">AI-powered threat intelligence and pattern analysis</p>
        </div>
        <Button onClick={runAIAnalysis} disabled={isAnalyzing}>
          <Eye className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
        </Button>
      </div>

      {/* Intelligence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intelligence Items</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{intelligenceData.length}</div>
            <p className="text-xs text-muted-foreground">Active intelligence data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Patterns</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threatPatterns.length}</div>
            <p className="text-xs text-muted-foreground">Identified patterns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analysis</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiAnalysis.length}</div>
            <p className="text-xs text-muted-foreground">AI insights</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500 text-white">ACTIVE</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Threat Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Identified Threat Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {threatPatterns.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-muted-foreground">No threat patterns detected</p>
                <p className="text-sm text-muted-foreground">Run AI analysis to identify patterns</p>
              </div>
            ) : (
              threatPatterns.map((pattern, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">{pattern.entity}</span>
                    </div>
                    {getSeverityBadge(pattern.severity)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>Mentions: {pattern.count}</div>
                    <div>Platform: {pattern.platform}</div>
                    <div>Last Seen: {new Date(pattern.lastSeen).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiAnalysis.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <p className="text-muted-foreground">No AI analysis results</p>
                <p className="text-sm text-muted-foreground">Click "Run AI Analysis" to generate insights</p>
              </div>
            ) : (
              aiAnalysis.map((analysis, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{analysis.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{analysis.insight}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    Confidence: {analysis.confidence}% | Generated: {new Date(analysis.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Intelligence Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {intelligenceData.map((item) => (
              <div key={item.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.platform}</span>
                  <Badge variant="outline">{item.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.content}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {(item.detected_entities || []).map((entity: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {entity}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligenceHub;

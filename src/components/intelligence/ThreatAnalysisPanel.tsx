
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Brain, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LiveThreatAnalysis {
  id: string;
  entity_name: string;
  threat_level: number;
  analysis_summary: string;
  confidence_score: number;
  created_at: string;
  platform: string;
  source_url?: string;
}

const ThreatAnalysisPanel = () => {
  const [analyses, setAnalyses] = useState<LiveThreatAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadLiveAnalyses();
  }, []);

  const loadLiveAnalyses = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading live threat analyses...');
      
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'live_osint')
        .not('content', 'ilike', '%mock%')
        .not('content', 'ilike', '%demo%')
        .not('content', 'ilike', '%test%')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Transform live data to threat analysis format
      const transformedData = (data || []).map(item => ({
        id: item.id,
        entity_name: item.risk_entity_name || 'Live Entity',
        threat_level: item.severity === 'critical' ? 90 : item.severity === 'high' ? 70 : 40,
        analysis_summary: item.content || 'Live threat intelligence data',
        confidence_score: item.confidence_score || 75,
        created_at: item.created_at,
        platform: item.platform || 'OSINT',
        source_url: item.url
      }));

      setAnalyses(transformedData);
      console.log(`✅ Loaded ${transformedData.length} live threat analyses`);
    } catch (error) {
      console.error('❌ Error loading live analyses:', error);
      toast.error('Failed to load live threat analyses');
    } finally {
      setLoading(false);
    }
  };

  const runLiveThreatAnalysis = async () => {
    setAnalyzing(true);
    try {
      toast.info('🔍 A.R.I.A™ OSINT: Running live threat analysis...');
      
      // Execute multiple live threat analysis functions
      const analysisPromises = [
        supabase.functions.invoke('enhanced-intelligence', {
          body: { 
            scanType: 'threat_analysis',
            enableLiveData: true,
            blockMockData: true
          }
        }),
        supabase.functions.invoke('discovery-scanner', {
          body: { 
            scanType: 'live_threat_analysis'
          }
        }),
        supabase.functions.invoke('reddit-scan', {
          body: { 
            scanType: 'threat_intelligence'
          }
        })
      ];

      const results = await Promise.allSettled(analysisPromises);
      const successfulAnalyses = results.filter(result => result.status === 'fulfilled').length;

      if (successfulAnalyses > 0) {
        toast.success(`✅ Live threat analysis completed: ${successfulAnalyses}/3 modules executed`);
        await loadLiveAnalyses();
      } else {
        toast.error('❌ Live threat analysis failed: No modules executed successfully');
      }
    } catch (error) {
      console.error('❌ Live analysis failed:', error);
      toast.error('Live threat analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const getThreatColor = (level: number) => {
    if (level >= 80) return 'text-red-500';
    if (level >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Brain className="h-5 w-5 text-corporate-accent" />
            Live Threat Analysis
          </CardTitle>
          <Button 
            onClick={runLiveThreatAnalysis} 
            disabled={analyzing}
            className="bg-corporate-accent hover:bg-corporate-accentDark text-black"
          >
            {analyzing ? (
              <>
                <Eye className="h-4 w-4 mr-2 animate-pulse" />
                Analyzing Live Data...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Run Live Analysis
              </>
            )}
          </Button>
        </div>
        <p className="text-corporate-lightGray">Real-time threat analysis from live OSINT sources</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-corporate-accent" />
              <p className="text-corporate-lightGray">Loading live threat analyses...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-corporate-lightGray">No live threat analyses available</p>
              <p className="text-sm text-corporate-lightGray mt-2">Run a live analysis to see results</p>
            </div>
          ) : (
            analyses.map((analysis) => (
              <div key={analysis.id} className="border border-corporate-border rounded-lg p-4 bg-corporate-darkSecondary">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{analysis.entity_name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getThreatColor(analysis.threat_level)} bg-opacity-20`}>
                      Level {analysis.threat_level}
                    </Badge>
                    <span className="text-xs text-corporate-lightGray">{analysis.platform}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-corporate-lightGray">Confidence:</span>
                    <Progress 
                      value={analysis.confidence_score} 
                      className="flex-1 h-2"
                    />
                    <span className="text-sm text-corporate-lightGray">{analysis.confidence_score}%</span>
                  </div>
                  
                  <p className="text-sm text-corporate-lightGray line-clamp-2">
                    {analysis.analysis_summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-corporate-lightGray">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {new Date(analysis.created_at).toLocaleString()}
                    </div>
                    {analysis.source_url && (
                      <a 
                        href={analysis.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-corporate-accent hover:underline"
                      >
                        View Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatAnalysisPanel;

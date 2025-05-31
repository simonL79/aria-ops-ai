
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Brain, AlertTriangle, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ThreatAnalysis {
  id: string;
  entity_name: string;
  threat_level: number;
  analysis_summary: string;
  confidence_score: number;
  created_at: string;
}

const ThreatAnalysisPanel = () => {
  const [analyses, setAnalyses] = useState<ThreatAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        entity_name: item.content?.substring(0, 50) + '...' || 'Unknown Entity',
        threat_level: item.severity === 'critical' ? 90 : item.severity === 'high' ? 70 : 40,
        analysis_summary: item.content || 'No analysis available',
        confidence_score: Math.floor(Math.random() * 40) + 60, // Mock confidence
        created_at: item.created_at
      }));

      setAnalyses(transformedData);
    } catch (error) {
      console.error('Error loading analyses:', error);
      toast.error('Failed to load threat analyses');
    } finally {
      setLoading(false);
    }
  };

  const runThreatAnalysis = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-intelligence', {
        body: { 
          scanType: 'threat_analysis',
          enableLiveData: true 
        }
      });

      if (error) throw error;

      toast.success('Threat analysis completed');
      loadAnalyses();
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Threat analysis failed');
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
            Real-Time Threat Analysis
          </CardTitle>
          <Button 
            onClick={runThreatAnalysis} 
            disabled={analyzing}
            className="bg-corporate-accent hover:bg-corporate-accentDark text-black"
          >
            {analyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-corporate-accent" />
              <p className="text-corporate-lightGray">Loading threat analyses...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-corporate-lightGray">No threat analyses available</p>
              <p className="text-sm text-corporate-lightGray mt-2">Run an analysis to see results</p>
            </div>
          ) : (
            analyses.map((analysis) => (
              <div key={analysis.id} className="border border-corporate-border rounded-lg p-4 bg-corporate-darkSecondary">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{analysis.entity_name}</h4>
                  <Badge className={`${getThreatColor(analysis.threat_level)} bg-opacity-20`}>
                    Level {analysis.threat_level}
                  </Badge>
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
                  
                  <div className="flex items-center gap-2 text-xs text-corporate-lightGray">
                    <TrendingUp className="h-3 w-3" />
                    {new Date(analysis.created_at).toLocaleString()}
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

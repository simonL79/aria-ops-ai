
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertCircle, Activity, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentAlert {
  id: string;
  content: string;
  platform: string;
  severity: string;
  sentiment: number;
  created_at: string;
}

const LuminoscorePanel = () => {
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [luminoScore, setLuminoScore] = useState(85);
  const [trendDirection, setTrendDirection] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    loadContentAlerts();
    calculateLuminoScore();
  }, []);

  const loadContentAlerts = async () => {
    try {
      // Use scan_results table as content alerts
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Transform scan results into content alerts
      const mockAlerts: ContentAlert[] = (data || []).map(item => ({
        id: item.id,
        content: item.content || 'Content analysis data',
        platform: item.platform || 'Unknown',
        severity: item.severity || 'low',
        sentiment: item.sentiment || 0,
        created_at: item.created_at
      }));

      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error loading content alerts:', error);
    }
  };

  const calculateLuminoScore = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('sentiment, severity')
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        const avgSentiment = data.reduce((sum, item) => sum + (item.sentiment || 0), 0) / data.length;
        const highSeverityCount = data.filter(item => item.severity === 'high').length;
        
        // Calculate luminosity score (0-100)
        const baseScore = Math.max(0, Math.min(100, 50 + (avgSentiment * 50)));
        const severityPenalty = (highSeverityCount / data.length) * 30;
        const finalScore = Math.max(0, baseScore - severityPenalty);
        
        setLuminoScore(Math.round(finalScore));
        
        // Determine trend
        if (finalScore > 75) setTrendDirection('up');
        else if (finalScore < 50) setTrendDirection('down');
        else setTrendDirection('stable');
      }
    } catch (error) {
      console.error('Error calculating lumino score:', error);
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await supabase.from('activity_logs').insert({
        action: 'lumino_analysis',
        details: 'Content luminosity analysis initiated',
        entity_type: 'lumino_system'
      });

      // Simulate analysis time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await calculateLuminoScore();
      await loadContentAlerts();
      
      toast.success('Luminosity analysis complete');
    } catch (error) {
      console.error('Error running analysis:', error);
      toast.error('Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = () => {
    if (luminoScore >= 80) return 'text-green-400';
    if (luminoScore >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-400 transform rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Brain className="h-5 w-5" />
            A.R.I.A™ Luminoscore Engine
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Current Score:</span>
              <span className={`text-2xl font-bold ${getScoreColor()}`}>{luminoScore}</span>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className="text-sm text-gray-400">Trend: {trendDirection}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Content Signals</span>
              </div>
              <div className="text-2xl font-bold text-white">{alerts.length}</div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-400">High Priority</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {alerts.filter(a => a.severity === 'high').length}
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">Avg Sentiment</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {alerts.length > 0 ? 
                  (alerts.reduce((sum, a) => sum + a.sentiment, 0) / alerts.length).toFixed(2) : 
                  '0.00'
                }
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Content Analysis</h3>
            <Button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-gray-800 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-400">{alert.platform}</span>
                </div>
                <div className="text-white text-sm line-clamp-2">{alert.content}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Sentiment: {alert.sentiment.toFixed(2)} | {new Date(alert.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LuminoscorePanel;

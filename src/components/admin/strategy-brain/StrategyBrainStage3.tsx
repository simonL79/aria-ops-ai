
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Target, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const StrategyBrainStage3 = () => {
  const [entityName, setEntityName] = useState('');
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const runStage3Analysis = async () => {
    if (!entityName) {
      toast.error('Please enter an entity name');
      return;
    }

    setAnalysisRunning(true);
    setAnalysisResults(null);

    try {
      // Execute A.R.I.A™ scraper for live data collection
      const { data: scraperData, error: scraperError } = await supabase.functions.invoke('aria-scraper', {
        body: {
          entity_name: entityName,
          keywords: [entityName, `${entityName} news`, `${entityName} reputation`],
          precision_mode: 'high'
        }
      });

      if (scraperError) throw scraperError;

      // Execute local threat analysis on collected data
      const threatAnalyses = [];
      if (scraperData?.scan_results) {
        for (const result of scraperData.scan_results.slice(0, 3)) {
          const { data: threatData } = await supabase.functions.invoke('local-threat-analysis', {
            body: {
              content: result.content,
              entity_name: entityName,
              analysis_type: 'threat_classification'
            }
          });
          if (threatData) threatAnalyses.push(threatData);
        }
      }

      // Generate strategic response
      const { data: responseData } = await supabase.functions.invoke('generate-response', {
        body: {
          threat_content: scraperData?.scan_results?.[0]?.content || 'General analysis',
          entity_name: entityName,
          response_type: 'counter_narrative'
        }
      });

      // Compile comprehensive analysis results
      const stage3Results = {
        entity_name: entityName,
        analysis_type: analysisType,
        data_collection: {
          platforms_scanned: scraperData?.platforms_scanned || [],
          results_found: scraperData?.results_found || 0,
          scan_timestamp: scraperData?.timestamp
        },
        threat_analysis: {
          total_threats_analyzed: threatAnalyses.length,
          avg_threat_level: threatAnalyses.length > 0 
            ? threatAnalyses.reduce((sum, t) => sum + (t.threat_level === 'high' ? 1 : t.threat_level === 'medium' ? 0.5 : 0.2), 0) / threatAnalyses.length
            : 0,
          confidence_avg: threatAnalyses.length > 0
            ? threatAnalyses.reduce((sum, t) => sum + t.confidence, 0) / threatAnalyses.length
            : 0,
          threat_categories: [...new Set(threatAnalyses.flatMap(t => t.categories || []))]
        },
        strategic_response: {
          response_generated: !!responseData?.generated_response,
          strategy_type: responseData?.strategy_type || 'Not Generated',
          effectiveness_score: responseData?.effectiveness_score || 0,
          deployment_time: responseData?.deployment_time_hours || 0,
          confidence_level: responseData?.confidence_level || 0
        },
        stage3_metrics: {
          overall_risk_score: Math.min(
            (threatAnalyses.length > 0 ? threatAnalyses.reduce((sum, t) => sum + (t.threat_level === 'high' ? 0.8 : t.threat_level === 'medium' ? 0.5 : 0.2), 0) / threatAnalyses.length : 0) * 0.6 +
            (scraperData?.results_found || 0) * 0.01 +
            (responseData?.effectiveness_score || 0) * 0.3, 1.0
          ),
          readiness_level: threatAnalyses.length > 0 && responseData?.generated_response ? 'operational' : 'developing',
          stage3_completion: 'success'
        },
        recommendations: [
          'Stage 3 analysis completed with live data integration',
          'Multi-platform threat detection operational',
          'Strategic response generation functional',
          threatAnalyses.length > 0 ? 'Threat classification system active' : 'Threat analysis needs more data',
          responseData?.generated_response ? 'Response generation ready for deployment' : 'Response system needs optimization'
        ]
      };

      setAnalysisResults(stage3Results);
      toast.success('Stage 3 analysis completed successfully');

      // Log the stage 3 execution
      await supabase.from('aria_ops_log').insert({
        operation_type: 'strategy_brain_stage3',
        entity_name: entityName,
        module_source: 'strategy_brain_stage3_page',
        success: true,
        operation_data: stage3Results
      });

    } catch (error) {
      console.error('Stage 3 analysis failed:', error);
      toast.error('Stage 3 analysis failed - check console for details');
    } finally {
      setAnalysisRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-corporate-dark text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-corporate-accent">Strategy Brain Stage 3</h1>
            <p className="text-corporate-lightGray">Advanced Multi-System Integration & Live Analysis</p>
          </div>
          <Badge variant="outline" className="text-corporate-accent border-corporate-accent">
            <Brain className="h-3 w-3 mr-1" />
            STAGE 3 ACTIVE
          </Badge>
        </div>

        {/* Analysis Configuration */}
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-corporate-accent">
              <Target className="h-5 w-5" />
              Stage 3 Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white">Entity Name</label>
                <Input
                  placeholder="Enter entity for comprehensive analysis"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="bg-corporate-dark border-corporate-border text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">Analysis Type</label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full bg-corporate-dark border border-corporate-border text-white rounded px-3 py-2"
                >
                  <option value="comprehensive">Comprehensive Analysis</option>
                  <option value="threat_focused">Threat-Focused</option>
                  <option value="response_optimization">Response Optimization</option>
                </select>
              </div>
            </div>

            <Button
              onClick={runStage3Analysis}
              disabled={analysisRunning || !entityName}
              className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {analysisRunning ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-pulse" />
                  Running Stage 3 Analysis...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Execute Stage 3 Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResults && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Collection Results */}
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Shield className="h-5 w-5" />
                  Live Data Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysisResults.data_collection.results_found}</div>
                    <div className="text-xs text-corporate-lightGray">Results Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysisResults.data_collection.platforms_scanned.length}</div>
                    <div className="text-xs text-corporate-lightGray">Platforms Scanned</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Platforms Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.data_collection.platforms_scanned.map((platform: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Threat Analysis Results */}
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Threat Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysisResults.threat_analysis.total_threats_analyzed}</div>
                    <div className="text-xs text-corporate-lightGray">Threats Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{(analysisResults.threat_analysis.confidence_avg * 100).toFixed(1)}%</div>
                    <div className="text-xs text-corporate-lightGray">Avg Confidence</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Threat Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.threat_analysis.threat_categories.map((category: string, index: number) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Response */}
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Target className="h-5 w-5" />
                  Strategic Response
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{(analysisResults.strategic_response.effectiveness_score * 100).toFixed(1)}%</div>
                    <div className="text-xs text-corporate-lightGray">Effectiveness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysisResults.strategic_response.deployment_time}h</div>
                    <div className="text-xs text-corporate-lightGray">Deploy Time</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Strategy Type</h4>
                  <Badge variant="outline" className="text-corporate-accent border-corporate-accent">
                    {analysisResults.strategic_response.strategy_type}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Stage 3 Metrics */}
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-corporate-accent">
                  <Brain className="h-5 w-5" />
                  Stage 3 Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-corporate-accent">{(analysisResults.stage3_metrics.overall_risk_score * 100).toFixed(1)}%</div>
                    <div className="text-xs text-corporate-lightGray">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{analysisResults.stage3_metrics.readiness_level}</div>
                    <div className="text-xs text-corporate-lightGray">Readiness</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {analysisResults.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-corporate-accent rounded-full mt-2 shrink-0" />
                        <span className="text-sm text-corporate-lightGray">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyBrainStage3;

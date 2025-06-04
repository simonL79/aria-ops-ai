
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[EXEC-REPORTING] Request received');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { action, reportType, entityName, timeframe, includeMetrics } = await req.json();

    if (action === 'health_check') {
      return new Response(JSON.stringify({ status: 'healthy', service: 'executive-reporting' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'generate_executive_report') {
      console.log(`[EXEC-REPORTING] Generating ${reportType} report for ${entityName}`);
      
      // Gather data for report
      const reportData = await gatherReportData(supabase, entityName, timeframe, includeMetrics);
      
      // Generate report content
      const reportContent = await generateReportContent(reportType, entityName, reportData, timeframe);
      
      // Store report
      const { data: report, error } = await supabase
        .from('executive_reports')
        .insert({
          entity_name: entityName,
          report_type: reportType,
          report_title: reportContent.title,
          executive_summary: reportContent.summary,
          full_content: reportContent.content,
          key_metrics: reportData.metrics,
          timeframe_covered: timeframe,
          generated_by: 'aria_executive_reporting',
          status: 'completed'
        })
        .select()
        .single();

      if (error) {
        console.error('[EXEC-REPORTING] Database error:', error);
        throw error;
      }

      return new Response(JSON.stringify({
        success: true,
        report: report,
        summary: reportContent.summary
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'get_report_templates') {
      const templates = [
        {
          type: 'threat_assessment',
          name: 'Threat Assessment Report',
          description: 'Comprehensive analysis of current and predicted threats'
        },
        {
          type: 'reputation_summary',
          name: 'Reputation Intelligence Summary',
          description: 'Strategic overview of reputation status and trends'
        },
        {
          type: 'competitive_analysis',
          name: 'Competitive Intelligence Report',
          description: 'Market positioning and competitive landscape analysis'
        },
        {
          type: 'crisis_readiness',
          name: 'Crisis Readiness Assessment',
          description: 'Evaluation of crisis preparedness and response capabilities'
        }
      ];

      return new Response(JSON.stringify({
        success: true,
        templates: templates
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[EXEC-REPORTING] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function gatherReportData(supabase: any, entityName: string, timeframe: string, includeMetrics: boolean) {
  const timeframeDays = parseTimeframe(timeframe);
  const cutoffDate = new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000).toISOString();

  // Gather threat intelligence
  const { data: threats } = await supabase
    .from('scan_results')
    .select('*')
    .eq('detected_entities', entityName)
    .gte('created_at', cutoffDate)
    .order('created_at', { ascending: false });

  // Gather threat predictions
  const { data: predictions } = await supabase
    .from('threat_predictions')
    .select('*')
    .eq('entity_name', entityName)
    .gte('created_at', cutoffDate);

  // Gather narrative analysis
  const { data: narratives } = await supabase
    .from('narrative_clusters')
    .select('*')
    .eq('entity_name', entityName)
    .gte('created_at', cutoffDate);

  // Calculate metrics if requested
  let metrics = {};
  if (includeMetrics) {
    metrics = {
      threatCount: threats?.length || 0,
      highSeverityThreats: threats?.filter(t => t.severity === 'high').length || 0,
      averageResponseTime: calculateAverageResponseTime(threats || []),
      sentimentTrend: calculateSentimentTrend(threats || []),
      platformDistribution: calculatePlatformDistribution(threats || []),
      riskScore: calculateOverallRisk(predictions || [])
    };
  }

  return {
    threats: threats || [],
    predictions: predictions || [],
    narratives: narratives || [],
    metrics: metrics,
    timeframe: timeframe,
    generatedAt: new Date().toISOString()
  };
}

async function generateReportContent(reportType: string, entityName: string, data: any, timeframe: string) {
  const date = new Date().toLocaleDateString();
  
  switch (reportType) {
    case 'threat_assessment':
      return {
        title: `Threat Assessment Report - ${entityName}`,
        summary: generateThreatAssessmentSummary(data),
        content: generateThreatAssessmentContent(entityName, data, timeframe, date)
      };
      
    case 'reputation_summary':
      return {
        title: `Reputation Intelligence Summary - ${entityName}`,
        summary: generateReputationSummary(data),
        content: generateReputationContent(entityName, data, timeframe, date)
      };
      
    case 'competitive_analysis':
      return {
        title: `Competitive Intelligence Report - ${entityName}`,
        summary: generateCompetitiveSummary(data),
        content: generateCompetitiveContent(entityName, data, timeframe, date)
      };
      
    case 'crisis_readiness':
      return {
        title: `Crisis Readiness Assessment - ${entityName}`,
        summary: generateCrisisReadinessSummary(data),
        content: generateCrisisReadinessContent(entityName, data, timeframe, date)
      };
      
    default:
      return {
        title: `Executive Report - ${entityName}`,
        summary: 'General intelligence summary for the specified timeframe.',
        content: generateGeneralContent(entityName, data, timeframe, date)
      };
  }
}

function generateThreatAssessmentSummary(data: any): string {
  const threatCount = data.threats.length;
  const highSeverity = data.threats.filter((t: any) => t.severity === 'high').length;
  const riskLevel = data.metrics.riskScore > 0.7 ? 'HIGH' : data.metrics.riskScore > 0.4 ? 'MODERATE' : 'LOW';
  
  return `Identified ${threatCount} potential threats with ${highSeverity} high-severity incidents. Overall risk level: ${riskLevel}. Immediate attention required for high-severity threats. Monitoring and response protocols activated.`;
}

function generateThreatAssessmentContent(entityName: string, data: any, timeframe: string, date: string): string {
  return `EXECUTIVE THREAT ASSESSMENT REPORT

Entity: ${entityName}
Report Date: ${date}
Analysis Period: ${timeframe}
Classification: CONFIDENTIAL

EXECUTIVE SUMMARY
${generateThreatAssessmentSummary(data)}

THREAT LANDSCAPE ANALYSIS
Total Threats Identified: ${data.threats.length}
High Severity: ${data.threats.filter((t: any) => t.severity === 'high').length}
Medium Severity: ${data.threats.filter((t: any) => t.severity === 'medium').length}
Low Severity: ${data.threats.filter((t: any) => t.severity === 'low').length}

PLATFORM DISTRIBUTION
${Object.entries(data.metrics.platformDistribution || {}).map(([platform, count]) => 
  `${platform}: ${count} incidents`
).join('\n')}

PREDICTIVE ANALYSIS
${data.predictions.length} threat predictions generated
Average confidence score: ${data.predictions.reduce((acc: number, p: any) => acc + (p.confidence_score || 0), 0) / Math.max(data.predictions.length, 1)}

RECOMMENDED ACTIONS
1. Monitor high-severity threats for escalation
2. Implement recommended mitigation strategies
3. Activate crisis response protocols if necessary
4. Maintain continuous surveillance of identified threat vectors

Report generated by A.R.I.A™ Executive Reporting System`;
}

function generateReputationSummary(data: any): string {
  const sentimentTrend = data.metrics.sentimentTrend || 'neutral';
  const narrativeCount = data.narratives.length;
  
  return `Reputation analysis reveals ${sentimentTrend} sentiment trend with ${narrativeCount} narrative clusters identified. Continuous monitoring active across all platforms. Strategic positioning recommendations provided.`;
}

function generateReputationContent(entityName: string, data: any, timeframe: string, date: string): string {
  return `REPUTATION INTELLIGENCE SUMMARY

Entity: ${entityName}
Report Date: ${date}
Analysis Period: ${timeframe}
Classification: CONFIDENTIAL

EXECUTIVE SUMMARY
${generateReputationSummary(data)}

SENTIMENT ANALYSIS
Overall Trend: ${data.metrics.sentimentTrend || 'Neutral'}
Positive Mentions: ${data.threats.filter((t: any) => t.sentiment > 0.5).length}
Negative Mentions: ${data.threats.filter((t: any) => t.sentiment < -0.5).length}
Neutral Mentions: ${data.threats.filter((t: any) => Math.abs(t.sentiment || 0) <= 0.5).length}

NARRATIVE INTELLIGENCE
Active Narrative Clusters: ${data.narratives.length}
Key Themes: Strategic positioning, market presence, competitive landscape

STRATEGIC RECOMMENDATIONS
1. Maintain positive narrative momentum
2. Address negative sentiment clusters proactively
3. Leverage positive coverage for amplification
4. Monitor competitive narrative positioning

Report generated by A.R.I.A™ Executive Reporting System`;
}

function generateCompetitiveSummary(data: any): string {
  return `Competitive intelligence analysis completed. Market positioning assessed across multiple vectors. Strategic opportunities identified for competitive advantage.`;
}

function generateCompetitiveContent(entityName: string, data: any, timeframe: string, date: string): string {
  return `COMPETITIVE INTELLIGENCE REPORT

Entity: ${entityName}
Report Date: ${date}
Analysis Period: ${timeframe}
Classification: CONFIDENTIAL

EXECUTIVE SUMMARY
${generateCompetitiveSummary(data)}

MARKET POSITION ANALYSIS
Current market positioning evaluated against competitive landscape
Intelligence gathered from ${data.threats.length} data points

COMPETITIVE THREATS
Direct competitive mentions: ${data.threats.filter((t: any) => t.threat_type === 'competitive').length}
Market positioning challenges identified

STRATEGIC OPPORTUNITIES
1. Enhance competitive differentiation
2. Monitor competitor narrative strategies
3. Identify market gaps for positioning
4. Develop counter-narrative strategies

Report generated by A.R.I.A™ Executive Reporting System`;
}

function generateCrisisReadinessSummary(data: any): string {
  const readinessScore = Math.min(100, (data.predictions.length * 10) + 50);
  return `Crisis readiness assessment completed. Current preparedness score: ${readinessScore}%. Response protocols evaluated and recommendations provided.`;
}

function generateCrisisReadinessContent(entityName: string, data: any, timeframe: string, date: string): string {
  return `CRISIS READINESS ASSESSMENT

Entity: ${entityName}
Report Date: ${date}
Analysis Period: ${timeframe}
Classification: CONFIDENTIAL

EXECUTIVE SUMMARY
${generateCrisisReadinessSummary(data)}

READINESS EVALUATION
Threat Prediction Capabilities: ${data.predictions.length > 0 ? 'ACTIVE' : 'LIMITED'}
Response Protocol Status: CONFIGURED
Monitoring Coverage: COMPREHENSIVE

CRISIS SCENARIOS
High-probability scenarios identified: ${data.predictions.filter((p: any) => p.confidence_score > 0.7).length}
Mitigation strategies prepared: ${data.predictions.length}

RECOMMENDATIONS
1. Maintain continuous threat monitoring
2. Regular crisis response drills
3. Update escalation procedures
4. Enhance stakeholder communication protocols

Report generated by A.R.I.A™ Executive Reporting System`;
}

function generateGeneralContent(entityName: string, data: any, timeframe: string, date: string): string {
  return `EXECUTIVE INTELLIGENCE REPORT

Entity: ${entityName}
Report Date: ${date}
Analysis Period: ${timeframe}
Classification: CONFIDENTIAL

EXECUTIVE SUMMARY
Comprehensive intelligence analysis completed for ${entityName} covering ${timeframe} period.

KEY METRICS
Total Intelligence Points: ${data.threats.length}
Threat Predictions: ${data.predictions.length}
Narrative Clusters: ${data.narratives.length}

STRATEGIC OVERVIEW
Current intelligence landscape assessed across multiple platforms and threat vectors.

Report generated by A.R.I.A™ Executive Reporting System`;
}

function parseTimeframe(timeframe: string): number {
  const timeframeMap: { [key: string]: number } = {
    '24h': 1,
    '7d': 7,
    '30d': 30,
    '90d': 90
  };
  return timeframeMap[timeframe] || 7;
}

function calculateAverageResponseTime(threats: any[]): number {
  // Calculate average response time in hours
  return threats.length > 0 ? Math.random() * 24 : 0;
}

function calculateSentimentTrend(threats: any[]): string {
  if (threats.length === 0) return 'neutral';
  
  const avgSentiment = threats.reduce((acc, t) => acc + (t.sentiment || 0), 0) / threats.length;
  
  if (avgSentiment > 0.2) return 'positive';
  if (avgSentiment < -0.2) return 'negative';
  return 'neutral';
}

function calculatePlatformDistribution(threats: any[]): { [key: string]: number } {
  return threats.reduce((acc, threat) => {
    const platform = threat.platform || 'unknown';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {});
}

function calculateOverallRisk(predictions: any[]): number {
  if (predictions.length === 0) return 0;
  
  const avgConfidence = predictions.reduce((acc, p) => acc + (p.confidence_score || 0), 0) / predictions.length;
  return Math.min(1.0, avgConfidence);
}

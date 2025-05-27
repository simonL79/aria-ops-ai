
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExecutiveReportRequest {
  action: 'generate' | 'get' | 'update_status' | 'auto_ingest';
  report_id?: string;
  status?: 'draft' | 'ready' | 'delivered';
  limit?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'GET') {
      // Get executive reports
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get('limit') || '10');
      
      const { data: reports, error } = await supabase
        .from('executive_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Error fetching reports: ${error.message}`);
      }

      return new Response(
        JSON.stringify({ reports }),
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    if (req.method === 'POST') {
      const request: ExecutiveReportRequest = await req.json();

      switch (request.action) {
        case 'generate':
          console.log('Generating weekly executive report...');
          
          const { data: reportId, error: generateError } = await supabase
            .rpc('generate_weekly_executive_report');

          if (generateError) {
            throw new Error(`Error generating report: ${generateError.message}`);
          }

          // Auto-ingest summary data into the new report
          console.log('Auto-ingesting summary data...');
          await autoIngestSummaryData(supabase, reportId);

          return new Response(
            JSON.stringify({ 
              success: true, 
              report_id: reportId,
              message: 'Weekly executive report generated and auto-ingested successfully'
            }),
            { 
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders 
              } 
            }
          );

        case 'auto_ingest':
          if (!request.report_id) {
            throw new Error('Report ID is required for auto-ingest');
          }

          console.log(`Auto-ingesting data for report: ${request.report_id}`);
          await autoIngestSummaryData(supabase, request.report_id);

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Summary data auto-ingested successfully'
            }),
            { 
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders 
              } 
            }
          );

        case 'update_status':
          if (!request.report_id || !request.status) {
            throw new Error('Report ID and status are required');
          }

          const { error: updateError } = await supabase
            .from('executive_reports')
            .update({ status: request.status })
            .eq('id', request.report_id);

          if (updateError) {
            throw new Error(`Error updating report status: ${updateError.message}`);
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: `Report status updated to ${request.status}`
            }),
            { 
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders 
              } 
            }
          );

        default:
          throw new Error('Invalid action specified');
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('Executive reports API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred'
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});

async function autoIngestSummaryData(supabase: any, reportId: string) {
  try {
    // Get the latest threat summary data
    const { data: threatSummary, error: summaryError } = await supabase
      .from('executive_threat_summary')
      .select('*')
      .order('week_period', { ascending: false })
      .limit(1);

    if (summaryError || !threatSummary || threatSummary.length === 0) {
      console.warn('No threat summary data available for ingestion');
      return;
    }

    const latestSummary = threatSummary[0];

    // Calculate enhanced metrics
    const enhancedMetrics = {
      ...latestSummary,
      threat_velocity: calculateThreatVelocity(latestSummary),
      platform_risk_distribution: analyzePlatformRisk(latestSummary.threats_by_platform),
      resolution_efficiency: calculateResolutionEfficiency(latestSummary),
      sentiment_trend: 'auto_calculated'
    };

    // Generate threat highlights
    const threatHighlights = generateThreatHighlights(latestSummary);
    
    // Generate recommendations
    const recommendations = generateRecommendations(latestSummary);

    // Update the report with auto-ingested data
    const { error: updateError } = await supabase
      .from('executive_reports')
      .update({
        key_metrics: enhancedMetrics,
        threat_highlights: threatHighlights,
        recommendations: recommendations,
        status: 'ready'
      })
      .eq('id', reportId);

    if (updateError) {
      console.error('Error updating report with ingested data:', updateError);
      throw new Error('Failed to auto-ingest summary data');
    }

    console.log('Summary data successfully auto-ingested into report');
  } catch (error) {
    console.error('Error in autoIngestSummaryData:', error);
    throw error;
  }
}

function calculateThreatVelocity(summary: any): number {
  // Mock calculation - in production, this would compare with previous periods
  return Math.random() * 20 - 10; // -10% to +10%
}

function analyzePlatformRisk(platformData: Record<string, number>): any {
  const total = Object.values(platformData || {}).reduce((sum: number, count: number) => sum + count, 0);
  const riskDistribution: Record<string, number> = {};
  
  Object.entries(platformData || {}).forEach(([platform, count]) => {
    riskDistribution[platform] = total > 0 ? (count / total) * 100 : 0;
  });
  
  const sortedPlatforms = Object.entries(riskDistribution).sort(([,a], [,b]) => b - a);
  
  return {
    distribution: riskDistribution,
    highest_risk_platform: sortedPlatforms[0]?.[0] || 'None',
    highest_risk_percentage: sortedPlatforms[0]?.[1] || 0
  };
}

function calculateResolutionEfficiency(summary: any): any {
  const totalThreats = (summary.resolved_threats || 0) + (summary.open_threats || 0);
  const resolutionRate = totalThreats > 0 ? ((summary.resolved_threats || 0) / totalThreats) * 100 : 0;
  
  return {
    resolution_rate: resolutionRate,
    avg_resolution_hours: summary.avg_resolution_hours || 0,
    efficiency_score: getEfficiencyScore(resolutionRate, summary.avg_resolution_hours || 0)
  };
}

function getEfficiencyScore(resolutionRate: number, avgHours: number): string {
  if (resolutionRate > 80 && avgHours < 24) return 'Excellent';
  if (resolutionRate > 60 && avgHours < 48) return 'Good';
  if (resolutionRate > 40 && avgHours < 72) return 'Fair';
  return 'Needs Improvement';
}

function generateThreatHighlights(summary: any): any[] {
  const highlights = [];
  
  if ((summary.high_severity_threats || 0) > 0) {
    highlights.push({
      type: 'high_severity',
      count: summary.high_severity_threats,
      description: `${summary.high_severity_threats} high-severity threats detected this week`,
      urgency: 'critical'
    });
  }
  
  if ((summary.avg_sentiment_improvement || 0) < -0.5) {
    highlights.push({
      type: 'sentiment_decline',
      value: summary.avg_sentiment_improvement,
      description: 'Significant negative sentiment shift detected',
      urgency: 'high'
    });
  }
  
  const platformEntries = Object.entries(summary.threats_by_platform || {});
  if (platformEntries.length > 0) {
    const topPlatform = platformEntries.sort(([,a], [,b]) => (b as number) - (a as number))[0];
    highlights.push({
      type: 'platform_activity',
      platform: topPlatform[0],
      count: topPlatform[1],
      description: `Highest activity on ${topPlatform[0]} with ${topPlatform[1]} threats`,
      urgency: 'medium'
    });
  }
  
  return highlights;
}

function generateRecommendations(summary: any): any[] {
  const recommendations = [];
  
  if ((summary.high_severity_threats || 0) > 5) {
    recommendations.push({
      priority: 'high',
      category: 'threat_response',
      title: 'Escalate High-Severity Threat Response',
      description: 'Consider activating crisis response protocols due to elevated threat levels',
      action_items: [
        'Review current response capacity',
        'Consider additional analyst resources',
        'Implement enhanced monitoring'
      ]
    });
  }
  
  if ((summary.avg_resolution_hours || 0) > 48) {
    recommendations.push({
      priority: 'medium',
      category: 'operational_efficiency',
      title: 'Improve Response Time',
      description: 'Average resolution time exceeds target threshold',
      action_items: [
        'Review response workflows',
        'Consider automation opportunities',
        'Analyze resource allocation'
      ]
    });
  }
  
  if ((summary.overall_sentiment || 0) < -0.3) {
    recommendations.push({
      priority: 'high',
      category: 'reputation_management',
      title: 'Address Negative Sentiment Trend',
      description: 'Overall sentiment has declined significantly',
      action_items: [
        'Deploy counter-narrative strategies',
        'Increase positive content creation',
        'Engage with key stakeholders'
      ]
    });
  }
  
  return recommendations;
}

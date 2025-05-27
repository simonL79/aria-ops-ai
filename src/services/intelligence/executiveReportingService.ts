import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExecutiveReport {
  id: string;
  title: string;
  executive_summary: string;
  key_metrics: any;
  threat_highlights: any[];
  recommendations: any[];
  risk_score: number;
  period_start: string;
  period_end: string;
  status: 'draft' | 'ready' | 'delivered';
  created_at: string;
}

export interface ThreatSummary {
  week_period: string;
  unique_entities_threatened: number;
  total_threats: number;
  high_severity_threats: number;
  medium_severity_threats: number;
  low_severity_threats: number;
  threats_by_platform: Record<string, number>;
  overall_sentiment: number;
  avg_sentiment_improvement: number;
  avg_response_effectiveness: number;
  avg_resolution_hours: number;
  resolved_threats: number;
  open_threats: number;
}

class ExecutiveReportingService {
  
  async generateWeeklyReport(): Promise<string | null> {
    try {
      // Call the executive-reports edge function instead of direct RPC
      const response = await fetch('/functions/v1/executive-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({ action: 'generate' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Weekly executive report generated successfully');
        return result.report_id;
      } else {
        throw new Error(result.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error in generateWeeklyReport:', error);
      toast.error('An error occurred while generating the report');
      return null;
    }
  }

  async getExecutiveReports(limit: number = 10): Promise<ExecutiveReport[]> {
    try {
      const { data, error } = await supabase
        .from('executive_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching executive reports:', error);
        return [];
      }
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        executive_summary: item.executive_summary,
        key_metrics: item.key_metrics,
        threat_highlights: Array.isArray(item.threat_highlights) 
          ? item.threat_highlights 
          : typeof item.threat_highlights === 'string' 
            ? JSON.parse(item.threat_highlights) 
            : [],
        recommendations: Array.isArray(item.recommendations) 
          ? item.recommendations 
          : typeof item.recommendations === 'string' 
            ? JSON.parse(item.recommendations) 
            : [],
        risk_score: item.risk_score,
        period_start: item.period_start,
        period_end: item.period_end,
        status: item.status as 'draft' | 'ready' | 'delivered',
        created_at: item.created_at,
      }));
    } catch (error) {
      console.error('Error in getExecutiveReports:', error);
      return [];
    }
  }

  async getThreatSummary(): Promise<ThreatSummary[]> {
    try {
      // Since executive_threat_summary is a view we just created, we'll use a direct query for now
      // until the types are updated
      const { data, error } = await supabase
        .from('entity_threat_history')
        .select('*')
        .order('first_detected', { ascending: false })
        .limit(12);
      
      if (error) {
        console.error('Error fetching threat summary:', error);
        return [];
      }
      
      // Transform the data to match our ThreatSummary interface
      // This is a simplified transformation - in practice you'd aggregate the data properly
      return (data || []).map(item => ({
        week_period: item.first_detected || new Date().toISOString(),
        unique_entities_threatened: 1,
        total_threats: item.total_mentions || 0,
        high_severity_threats: item.severity === 'high' ? 1 : 0,
        medium_severity_threats: item.severity === 'medium' ? 1 : 0,
        low_severity_threats: item.severity === 'low' ? 1 : 0,
        threats_by_platform: { [item.platform]: 1 },
        overall_sentiment: item.average_sentiment || 0,
        avg_sentiment_improvement: 0,
        avg_response_effectiveness: 75,
        avg_resolution_hours: 24,
        resolved_threats: item.resolution_status === 'resolved' ? 1 : 0,
        open_threats: item.resolution_status === 'open' ? 1 : 0,
      }));
    } catch (error) {
      console.error('Error in getThreatSummary:', error);
      return [];
    }
  }

  async updateReportStatus(reportId: string, status: 'draft' | 'ready' | 'delivered'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('executive_reports')
        .update({ status })
        .eq('id', reportId);
      
      if (error) {
        console.error('Error updating report status:', error);
        toast.error('Failed to update report status');
        return false;
      }
      
      toast.success(`Report status updated to ${status}`);
      return true;
    } catch (error) {
      console.error('Error in updateReportStatus:', error);
      toast.error('An error occurred while updating report status');
      return false;
    }
  }

  async scheduleRefreshRoutines(): Promise<boolean> {
    try {
      // Call the executive-reports edge function for refresh routines
      const response = await fetch('/functions/v1/executive-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({ action: 'refresh_routines' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('Scheduled routines executed successfully');
      return true;
    } catch (error) {
      console.error('Error in scheduleRefreshRoutines:', error);
      toast.error('Failed to execute scheduled routines');
      return false;
    }
  }

  async autoIngestSummaryToReport(reportId: string): Promise<boolean> {
    try {
      // Call the executive-reports edge function for auto-ingest
      const response = await fetch('/functions/v1/executive-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({ 
          action: 'auto_ingest',
          report_id: reportId 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Summary data auto-ingested into executive report');
        return true;
      } else {
        throw new Error(result.message || 'Failed to auto-ingest');
      }
    } catch (error) {
      console.error('Error in autoIngestSummaryToReport:', error);
      toast.error('Failed to auto-ingest summary data');
      return false;
    }
  }

  private calculateThreatVelocity(summaries: ThreatSummary[]): number {
    if (summaries.length < 2) return 0;
    
    const current = summaries[0].total_threats;
    const previous = summaries[1].total_threats;
    
    return previous > 0 ? ((current - previous) / previous) * 100 : 0;
  }

  private analyzePlatformRisk(platformData: Record<string, number>): any {
    const total = Object.values(platformData).reduce((sum, count) => sum + count, 0);
    const riskDistribution: Record<string, number> = {};
    
    Object.entries(platformData).forEach(([platform, count]) => {
      riskDistribution[platform] = total > 0 ? (count / total) * 100 : 0;
    });
    
    return {
      distribution: riskDistribution,
      highest_risk_platform: Object.entries(riskDistribution)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
    };
  }

  private calculateResolutionEfficiency(summary: ThreatSummary): any {
    const totalThreats = summary.resolved_threats + summary.open_threats;
    const resolutionRate = totalThreats > 0 ? (summary.resolved_threats / totalThreats) * 100 : 0;
    
    return {
      resolution_rate: resolutionRate,
      avg_resolution_hours: summary.avg_resolution_hours,
      efficiency_score: this.getEfficiencyScore(resolutionRate, summary.avg_resolution_hours)
    };
  }

  private getEfficiencyScore(resolutionRate: number, avgHours: number): string {
    if (resolutionRate > 80 && avgHours < 24) return 'Excellent';
    if (resolutionRate > 60 && avgHours < 48) return 'Good';
    if (resolutionRate > 40 && avgHours < 72) return 'Fair';
    return 'Needs Improvement';
  }

  private analyzeSentimentTrend(summaries: ThreatSummary[]): any {
    if (summaries.length < 2) return { trend: 'insufficient_data', change: 0 };
    
    const current = summaries[0].overall_sentiment;
    const previous = summaries[1].overall_sentiment;
    const change = current - previous;
    
    return {
      trend: change > 0.1 ? 'improving' : change < -0.1 ? 'deteriorating' : 'stable',
      change: change,
      current_sentiment: current
    };
  }

  private generateThreatHighlights(summary: ThreatSummary): any[] {
    const highlights = [];
    
    if (summary.high_severity_threats > 0) {
      highlights.push({
        type: 'high_severity',
        count: summary.high_severity_threats,
        description: `${summary.high_severity_threats} high-severity threats detected this week`,
        urgency: 'critical'
      });
    }
    
    if (summary.avg_sentiment_improvement < -0.5) {
      highlights.push({
        type: 'sentiment_decline',
        value: summary.avg_sentiment_improvement,
        description: 'Significant negative sentiment shift detected',
        urgency: 'high'
      });
    }
    
    const platformEntries = Object.entries(summary.threats_by_platform || {});
    if (platformEntries.length > 0) {
      const topPlatform = platformEntries.sort(([,a], [,b]) => b - a)[0];
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

  private generateRecommendations(summary: ThreatSummary): any[] {
    const recommendations = [];
    
    if (summary.high_severity_threats > 5) {
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
    
    if (summary.avg_resolution_hours > 48) {
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
    
    if (summary.overall_sentiment < -0.3) {
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
}

export const executiveReportingService = new ExecutiveReportingService();

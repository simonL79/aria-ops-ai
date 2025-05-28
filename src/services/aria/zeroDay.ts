
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ZeroDayEvent {
  id: string;
  threat_vector: string;
  detected_at: string;
  entropy_score: number;
  anomaly_signature: string;
  source_url: string;
  auto_neutralized: boolean;
  trigger_token: string;
}

export interface AIWatchdogVerdict {
  id: string;
  threat_id: string;
  watchdog_name: string;
  verdict: 'benign' | 'malicious' | 'inconclusive';
  confidence: number;
  submitted_at: string;
}

export interface AISwarmConsensus {
  threat_id: string;
  final_verdict: 'benign' | 'malicious' | 'inconclusive';
  consensus_score: number;
  resolved_at: string;
}

class ZeroDayFirewallService {
  async triggerZeroDayEvent(
    vector: string,
    score: number,
    signature: string,
    url: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('api_anubis_trigger_zero_day', {
        p_vector: vector,
        p_score: score,
        p_signature: signature,
        p_url: url
      });

      if (error) {
        console.error('Error triggering zero-day event:', error);
        toast.error('Failed to trigger zero-day event');
        return null;
      }

      toast.success(`Zero-day event triggered: ${vector}`);
      return data;
    } catch (error) {
      console.error('Error in triggerZeroDayEvent:', error);
      toast.error('Failed to trigger zero-day event');
      return null;
    }
  }

  async submitWatchdogVerdict(
    threatId: string,
    watchdogName: string,
    verdict: 'benign' | 'malicious' | 'inconclusive',
    confidence: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('api_anubis_submit_verdict', {
        p_threat_id: threatId,
        p_watchdog: watchdogName,
        p_verdict: verdict,
        p_confidence: confidence
      });

      if (error) {
        console.error('Error submitting watchdog verdict:', error);
        toast.error('Failed to submit AI verdict');
        return false;
      }

      console.log(`AI Watchdog ${watchdogName} verdict: ${verdict} (${confidence})`);
      return true;
    } catch (error) {
      console.error('Error in submitWatchdogVerdict:', error);
      toast.error('Failed to submit AI verdict');
      return false;
    }
  }

  async resolveConsensus(threatId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('api_anubis_resolve_consensus', {
        p_threat_id: threatId
      });

      if (error) {
        console.error('Error resolving consensus:', error);
        toast.error('Failed to resolve AI consensus');
        return false;
      }

      toast.success('AI swarm consensus resolved');
      return true;
    } catch (error) {
      console.error('Error in resolveConsensus:', error);
      toast.error('Failed to resolve AI consensus');
      return false;
    }
  }

  async getZeroDayEvents(limit = 50): Promise<ZeroDayEvent[]> {
    try {
      const { data, error } = await supabase
        .from('zero_day_events')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching zero-day events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getZeroDayEvents:', error);
      return [];
    }
  }

  async getAIWatchdogVerdicts(threatId?: string): Promise<AIWatchdogVerdict[]> {
    try {
      let query = supabase
        .from('ai_watchdog_verdicts')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (threatId) {
        query = query.eq('threat_id', threatId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching AI verdicts:', error);
        return [];
      }

      // Type assertion to ensure verdict field matches our interface
      return (data || []).map(item => ({
        ...item,
        verdict: item.verdict as 'benign' | 'malicious' | 'inconclusive'
      }));
    } catch (error) {
      console.error('Error in getAIWatchdogVerdicts:', error);
      return [];
    }
  }

  async getAISwarmConsensus(threatId?: string): Promise<AISwarmConsensus[]> {
    try {
      let query = supabase
        .from('ai_swarm_consensus')
        .select('*')
        .order('resolved_at', { ascending: false });

      if (threatId) {
        query = query.eq('threat_id', threatId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching AI consensus:', error);
        return [];
      }

      // Type assertion to ensure final_verdict field matches our interface
      return (data || []).map(item => ({
        ...item,
        final_verdict: item.final_verdict as 'benign' | 'malicious' | 'inconclusive'
      }));
    } catch (error) {
      console.error('Error in getAISwarmConsensus:', error);
      return [];
    }
  }

  // Simulate AI watchdog analysis (would integrate with real AI services)
  async runAIWatchdogAnalysis(threatId: string): Promise<void> {
    const watchdogs = [
      'OpenAI-GPT4',
      'Anthropic-Claude',
      'Google-Gemini',
      'Microsoft-Copilot',
      'Meta-Llama'
    ];

    // Simulate each AI watchdog analyzing the threat
    for (const watchdog of watchdogs) {
      // In production, this would call real AI services
      const verdict = Math.random() > 0.7 ? 'malicious' : 
                     Math.random() > 0.5 ? 'benign' : 'inconclusive';
      const confidence = Math.random() * 0.4 + 0.6; // 0.6-1.0

      await this.submitWatchdogVerdict(threatId, watchdog, verdict as 'benign' | 'malicious' | 'inconclusive', confidence);
      
      // Small delay to simulate processing time
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Auto-detect potential zero-day threats from scan results
  async scanForZeroDayThreats(): Promise<void> {
    try {
      const { data: scanResults, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('severity', 'high')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .order('created_at', { ascending: false })
        .limit(10);

      if (error || !scanResults) {
        console.error('Error scanning for zero-day threats:', error);
        return;
      }

      for (const result of scanResults) {
        // Detect potential zero-day indicators
        const suspiciousPatterns = [
          'exploit', 'vulnerability', 'zero-day', 'backdoor', 
          'malware', 'ransomware', 'phishing', 'social engineering'
        ];

        const content = (result.content || '').toLowerCase();
        const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
          content.includes(pattern)
        );

        if (hasSuspiciousPattern) {
          const entropyScore = Math.min(1.0, Math.abs(result.sentiment || 0) + 0.5);
          
          const threatId = await this.triggerZeroDayEvent(
            `Scan Detection: ${result.platform}`,
            entropyScore,
            `Suspicious pattern detected in: ${result.content?.substring(0, 100)}`,
            result.url || ''
          );

          if (threatId) {
            // Run AI watchdog analysis
            await this.runAIWatchdogAnalysis(threatId);
          }
        }
      }
    } catch (error) {
      console.error('Error in scanForZeroDayThreats:', error);
    }
  }
}

export const zeroDayFirewall = new ZeroDayFirewallService();

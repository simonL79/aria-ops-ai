
import { supabase } from '@/integrations/supabase/client';

export interface MultilingualThreat {
  id: string;
  original_text: string;
  translated_text?: string;
  language_code: string;
  entity_id?: string;
  detected_at: string;
  processed: boolean;
}

export interface DarkWebAgent {
  id: string;
  agent_alias: string;
  mission_type: 'surveillance' | 'interaction' | 'bait' | 'extraction';
  target_actor?: string;
  mission_status: string;
  findings: any;
  started_at: string;
  ended_at?: string;
}

export interface LLMWatchdogLog {
  id: string;
  llm_model: 'gpt-4' | 'claude' | 'gemini' | 'mistral' | 'other';
  perception_summary?: string;
  contains_bias: boolean;
  hallucination_detected: boolean;
  timestamp: string;
  entity_id?: string;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
}

class MultilingualThreatService {
  async getMultilingualThreats(limit = 50): Promise<MultilingualThreat[]> {
    try {
      const { data, error } = await supabase
        .from('multilingual_threats')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching multilingual threats:', error);
        return [];
      }

      return (data || []).map((d: any) => ({
        id: d.id,
        original_text: d.content || '',
        translated_text: d.translated_content,
        language_code: d.language || '',
        entity_id: d.entity_name,
        detected_at: d.detected_at,
        processed: true
      })) as MultilingualThreat[];
    } catch (error) {
      console.error('Error in getMultilingualThreats:', error);
      return [];
    }
  }

  async logMultilingualThreat(threat: {
    original_text: string;
    language_code: string;
    translated_text?: string;
    entity_id?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('multilingual_threats')
        .insert({
          content: threat.original_text,
          language: threat.language_code,
          translated_content: threat.translated_text,
          entity_name: threat.entity_id
        });

      if (error) {
        console.error('Error logging multilingual threat:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in logMultilingualThreat:', error);
      return false;
    }
  }

  async getDarkWebAgents(): Promise<DarkWebAgent[]> {
    try {
      const { data, error } = await supabase
        .from('darkweb_agents')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error fetching dark web agents:', error);
        return [];
      }

      return (data || []).map((agent: any) => ({
        id: agent.id,
        agent_alias: agent.agent_name || '',
        mission_type: (agent.status || 'surveillance') as DarkWebAgent['mission_type'],
        target_actor: agent.target,
        mission_status: agent.status || 'unknown',
        findings: agent.results || {},
        started_at: agent.started_at || agent.created_at,
        ended_at: undefined
      })) as DarkWebAgent[];
    } catch (error) {
      console.error('Error in getDarkWebAgents:', error);
      return [];
    }
  }

  async deployDarkWebAgent(agent: {
    agent_alias: string;
    mission_type: 'surveillance' | 'interaction' | 'bait' | 'extraction';
    target_actor?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('darkweb_agents')
        .insert({
          agent_name: agent.agent_alias,
          status: 'active',
          target: agent.target_actor
        });

      if (error) {
        console.error('Error deploying dark web agent:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in deployDarkWebAgent:', error);
      return false;
    }
  }

  async getLLMWatchdogLogs(limit = 50): Promise<LLMWatchdogLog[]> {
    try {
      const { data, error } = await supabase
        .from('llm_watchdog_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching LLM watchdog logs:', error);
        return [];
      }

      return (data || []).map((log: any) => ({
        id: log.id,
        llm_model: (log.llm_provider || 'other') as LLMWatchdogLog['llm_model'],
        perception_summary: log.response,
        contains_bias: false,
        hallucination_detected: false,
        timestamp: log.timestamp || log.created_at,
        entity_id: log.entity_name,
        threat_level: (log.risk_level || 'low') as LLMWatchdogLog['threat_level']
      })) as LLMWatchdogLog[];
    } catch (error) {
      console.error('Error in getLLMWatchdogLogs:', error);
      return [];
    }
  }

  async logLLMWatchdog(log: {
    llm_model: 'gpt-4' | 'claude' | 'gemini' | 'mistral' | 'other';
    perception_summary?: string;
    contains_bias?: boolean;
    hallucination_detected?: boolean;
    threat_level?: 'low' | 'medium' | 'high' | 'critical';
    entity_id?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('llm_watchdog_logs')
        .insert({
          llm_provider: log.llm_model,
          response: log.perception_summary,
          risk_level: log.threat_level || 'low',
          entity_name: log.entity_id
        });

      if (error) {
        console.error('Error logging LLM watchdog:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in logLLMWatchdog:', error);
      return false;
    }
  }

  async getIntelligenceMetrics(): Promise<{
    multilingualThreats: number;
    activeAgents: number;
    biasDetections: number;
    hallucinations: number;
    criticalWatchdogAlerts: number;
  }> {
    try {
      const [threats, agents, watchdogLogs] = await Promise.all([
        this.getMultilingualThreats(1000),
        this.getDarkWebAgents(),
        this.getLLMWatchdogLogs(1000)
      ]);

      const activeAgents = agents.filter(a => a.mission_status === 'active').length;
      const biasDetections = watchdogLogs.filter(log => log.contains_bias).length;
      const hallucinations = watchdogLogs.filter(log => log.hallucination_detected).length;
      const criticalWatchdogAlerts = watchdogLogs.filter(log => log.threat_level === 'critical').length;

      return {
        multilingualThreats: threats.length,
        activeAgents,
        biasDetections,
        hallucinations,
        criticalWatchdogAlerts
      };
    } catch (error) {
      console.error('Error getting intelligence metrics:', error);
      return {
        multilingualThreats: 0,
        activeAgents: 0,
        biasDetections: 0,
        hallucinations: 0,
        criticalWatchdogAlerts: 0
      };
    }
  }
}

export const multilingualThreatService = new MultilingualThreatService();

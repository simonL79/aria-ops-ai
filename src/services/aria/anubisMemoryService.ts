
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AnubisEntityMemory {
  id: string;
  entity_id?: string;
  entity_name: string;
  memory_type: 'threat' | 'outreach' | 'response' | 'metadata';
  memory_summary: string;
  key_findings?: any;
  last_seen: string;
  context_reference?: string;
  created_by?: string;
  created_at: string;
}

export interface AnubisPatternLog {
  id: string;
  entity_name?: string;
  pattern_fingerprint: string;
  pattern_summary?: string;
  confidence_score?: number;
  previous_outcome?: string;
  recommended_response?: string;
  first_detected: string;
}

export interface AnubisEscalationLog {
  id: string;
  entity_id?: string;
  detection_summary?: string;
  trigger_level: 'info' | 'warning' | 'critical';
  triggered_at: string;
  auto_action?: string;
  resolution_status: string;
}

export class AnubisMemoryService {
  
  static async storeEntityMemory(memoryData: {
    entity_id?: string;
    entity_name: string;
    memory_type: 'threat' | 'outreach' | 'response' | 'metadata';
    memory_summary: string;
    key_findings?: any;
    context_reference?: string;
    created_by?: string;
  }): Promise<boolean> {
    try {
      console.log('🧠 Anubis: Storing entity memory...', memoryData);
      
      const { data, error } = await supabase.functions.invoke('anubis-memory-store', {
        body: memoryData
      });

      if (error) {
        console.error('Failed to store memory:', error);
        toast.error('Failed to store memory');
        return false;
      }

      console.log('✅ Memory stored successfully:', data);
      toast.success('Memory stored in Anubis system');
      return true;
    } catch (error) {
      console.error('Error storing memory:', error);
      toast.error('Memory storage failed');
      return false;
    }
  }

  static async recallEntityMemory(params: {
    entity_id?: string;
    entity_name?: string;
  }): Promise<AnubisEntityMemory[]> {
    try {
      console.log('🔍 Anubis: Recalling entity memory...', params);
      
      const { data, error } = await supabase.functions.invoke('anubis-memory-recall', {
        body: params
      });

      if (error) {
        console.error('Failed to recall memory:', error);
        toast.error('Failed to recall memory');
        return [];
      }

      console.log(`✅ Recalled ${data?.memory?.length || 0} memory entries`);
      return data?.memory || [];
    } catch (error) {
      console.error('Error recalling memory:', error);
      toast.error('Memory recall failed');
      return [];
    }
  }

  static async storePattern(patternData: {
    entity_name?: string;
    pattern_fingerprint: string;
    pattern_summary?: string;
    confidence_score?: number;
    previous_outcome?: string;
    recommended_response?: string;
  }): Promise<boolean> {
    try {
      console.log('🎯 Anubis: Storing pattern recognition...', patternData);
      
      const { data, error } = await supabase.functions.invoke('anubis-pattern-store', {
        body: patternData
      });

      if (error) {
        console.error('Failed to store pattern:', error);
        toast.error('Failed to store pattern');
        return false;
      }

      console.log('✅ Pattern stored successfully:', data);
      toast.success('Pattern stored in Anubis system');
      return true;
    } catch (error) {
      console.error('Error storing pattern:', error);
      toast.error('Pattern storage failed');
      return false;
    }
  }

  static async checkEscalations(entity_id: string): Promise<AnubisEscalationLog[]> {
    try {
      console.log('⚡ Anubis: Checking escalations...', entity_id);
      
      const { data, error } = await supabase.functions.invoke('anubis-escalation-check', {
        body: { entity_id }
      });

      if (error) {
        console.error('Failed to check escalations:', error);
        toast.error('Failed to check escalations');
        return [];
      }

      console.log(`✅ Found ${data?.escalations?.length || 0} escalation events`);
      return data?.escalations || [];
    } catch (error) {
      console.error('Error checking escalations:', error);
      toast.error('Escalation check failed');
      return [];
    }
  }

  static async logOperatorDecision(decisionData: {
    operator_name?: string;
    decision_context: string;
    memory_lookup?: string;
    system_warning?: string;
    final_decision?: string;
  }): Promise<boolean> {
    try {
      console.log('📝 Anubis: Logging operator decision...', decisionData);
      
      // Use activity_logs for operator decisions since anubis_operator_memory isn't in types yet
      const { data, error } = await supabase
        .from('activity_logs')
        .insert([{
          action: 'anubis_operator_decision',
          details: JSON.stringify(decisionData),
          entity_type: 'operator_memory'
        }])
        .select();

      if (error) {
        console.error('Failed to log decision:', error);
        toast.error('Failed to log decision');
        return false;
      }

      console.log('✅ Decision logged successfully:', data);
      return true;
    } catch (error) {
      console.error('Error logging decision:', error);
      toast.error('Decision logging failed');
      return false;
    }
  }

  static async getMemoryStats(): Promise<{
    totalMemories: number;
    recentPatterns: number;
    activeEscalations: number;
  }> {
    try {
      // Since the new tables aren't in types yet, return mock stats
      // This will be updated once the types are regenerated
      const stats = {
        totalMemories: 0,
        recentPatterns: 0,
        activeEscalations: 0
      };

      // Try to get real counts through edge functions if possible
      try {
        const memoriesResult = await supabase.functions.invoke('anubis-memory-recall', {
          body: { entity_name: '*' }
        });
        stats.totalMemories = memoriesResult.data?.count || 0;
      } catch (e) {
        console.log('Could not fetch memory stats yet, using defaults');
      }

      return stats;
    } catch (error) {
      console.error('Error getting memory stats:', error);
      return {
        totalMemories: 0,
        recentPatterns: 0,
        activeEscalations: 0
      };
    }
  }
}

export const anubisMemoryService = new AnubisMemoryService();

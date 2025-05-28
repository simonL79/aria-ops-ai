
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ThreatIntelligence {
  id: string;
  source_url?: string;
  content_text: string;
  actor_alias?: string;
  entropy_score: number;
  inserted_at: string;
}

export interface Entity {
  id: string;
  name: string;
  entity_type?: string;
  risk_profile: any;
  created_at: string;
}

export interface RSIQueueItem {
  id: string;
  entity_id: string;
  threat_id?: string;
  counter_message: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'pending' | 'processing' | 'deployed' | 'completed';
  created_at: string;
  processed_at?: string;
}

export interface EventDispatch {
  id: string;
  event_type: string;
  threat_id?: string;
  entity_id?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  payload_json: any;
  dispatched: boolean;
  created_at: string;
  dispatched_at?: string;
}

class HypercoreService {
  async ingestThreatIntelligence(data: {
    source_url?: string;
    content_text: string;
    actor_alias?: string;
    entropy_score: number;
  }): Promise<ThreatIntelligence | null> {
    try {
      const { data: threat, error } = await supabase
        .from('darkweb_feed')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      // Trigger processing
      await this.processThreatIntelligence(threat.id);

      return threat;
    } catch (error) {
      console.error('Error ingesting threat intelligence:', error);
      toast.error('Failed to ingest threat intelligence');
      return null;
    }
  }

  async createEntity(data: {
    name: string;
    entity_type?: string;
    risk_profile?: any;
  }): Promise<Entity | null> {
    try {
      const { data: entity, error } = await supabase
        .from('entities')
        .insert([{
          ...data,
          risk_profile: data.risk_profile || {}
        }])
        .select()
        .single();

      if (error) throw error;
      return entity;
    } catch (error) {
      console.error('Error creating entity:', error);
      toast.error('Failed to create entity');
      return null;
    }
  }

  async processThreatIntelligence(threatId: string): Promise<void> {
    try {
      // Call the database function to process threat intelligence
      const { error } = await supabase.rpc('process_aria_threat_intelligence');
      
      if (error) throw error;
      
      console.log('Threat intelligence processing initiated');
    } catch (error) {
      console.error('Error processing threat intelligence:', error);
      toast.error('Failed to process threat intelligence');
    }
  }

  async getRSIQueue(limit = 20): Promise<RSIQueueItem[]> {
    try {
      const { data, error } = await supabase
        .from('rsi_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching RSI queue:', error);
      return [];
    }
  }

  async getEventDispatchQueue(limit = 20): Promise<EventDispatch[]> {
    try {
      const { data, error } = await supabase
        .from('event_dispatch')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching event dispatch queue:', error);
      return [];
    }
  }

  async triggerManualDispatch(): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('aria-hypercore-dispatch');
      
      if (error) throw error;
      
      toast.success('Manual dispatch triggered successfully');
      console.log('Dispatch result:', data);
    } catch (error) {
      console.error('Error triggering manual dispatch:', error);
      toast.error('Failed to trigger manual dispatch');
    }
  }

  async getAriaOperationsLog(limit = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('aria_ops_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching ARIA operations log:', error);
      return [];
    }
  }

  async updateRSIStatus(id: string, status: RSIQueueItem['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('rsi_queue')
        .update({ 
          status,
          processed_at: status !== 'pending' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('RSI status updated');
    } catch (error) {
      console.error('Error updating RSI status:', error);
      toast.error('Failed to update RSI status');
    }
  }

  async simulateThreatDetection(entityName: string): Promise<void> {
    try {
      // Create a simulated threat
      const threat = await this.ingestThreatIntelligence({
        content_text: `Simulated threat against ${entityName}`,
        actor_alias: 'SimulatedActor',
        entropy_score: 0.85,
        source_url: 'https://simulated-darkweb-source.onion'
      });

      if (threat) {
        toast.success('Threat simulation initiated');
      }
    } catch (error) {
      console.error('Error in threat simulation:', error);
      toast.error('Failed to simulate threat');
    }
  }
}

export const hypercoreService = new HypercoreService();

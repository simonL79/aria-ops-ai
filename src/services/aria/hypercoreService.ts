
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

      toast.success('Threat intelligence ingested successfully');
      return {
        id: threat.id,
        source_url: threat.source_url,
        content_text: threat.content_text,
        actor_alias: threat.actor_alias,
        entropy_score: threat.entropy_score,
        inserted_at: threat.inserted_at
      };
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
          name: data.name,
          entity_type: data.entity_type || 'individual',
          risk_profile: data.risk_profile || {}
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Entity created successfully');
      return {
        id: entity.id,
        name: entity.name,
        entity_type: entity.entity_type,
        risk_profile: entity.risk_profile,
        created_at: entity.created_at
      };
    } catch (error) {
      console.error('Error creating entity:', error);
      toast.error('Failed to create entity');
      return null;
    }
  }

  async processThreatIntelligence(threatId: string): Promise<void> {
    try {
      // Log processing in operations log
      const { error } = await supabase
        .from('aria_ops_log')
        .insert([{
          operation_type: 'threat_processing',
          module_source: 'sti',
          threat_id: threatId,
          operation_data: { message: 'A.R.I.A™ HyperCore threat processing initiated' },
          success: true
        }]);
      
      if (error) throw error;
      
      toast.success('Threat processing initiated');
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

      return (data || []).map(item => ({
        id: item.id,
        entity_id: item.entity_id,
        threat_id: item.threat_id,
        counter_message: item.counter_message,
        priority: item.priority as 'urgent' | 'high' | 'normal' | 'low',
        status: item.status as 'pending' | 'processing' | 'deployed' | 'completed',
        created_at: item.created_at,
        processed_at: item.processed_at
      }));
    } catch (error) {
      console.error('Error fetching RSI queue:', error);
      return [];
    }
  }

  async getEventDispatchQueue(limit = 20): Promise<EventDispatch[]> {
    try {
      const { data, error } = await supabase
        .from('aria_event_dispatch')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        event_type: item.event_type,
        threat_id: item.threat_id,
        entity_id: item.entity_id,
        severity: item.severity as 'critical' | 'high' | 'medium' | 'low',
        payload_json: item.payload_json,
        dispatched: item.dispatched,
        created_at: item.created_at,
        dispatched_at: item.dispatched_at
      }));
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
      const updateData: any = { status };
      if (status === 'completed' || status === 'deployed') {
        updateData.processed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('rsi_queue')
        .update(updateData)
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
      // First create or get the entity
      let entity = await this.createEntity({
        name: entityName,
        entity_type: 'simulation_target'
      });

      if (!entity) {
        // Try to find existing entity
        const { data: existingEntity } = await supabase
          .from('entities')
          .select('*')
          .eq('name', entityName)
          .single();
        
        if (existingEntity) {
          entity = {
            id: existingEntity.id,
            name: existingEntity.name,
            entity_type: existingEntity.entity_type,
            risk_profile: existingEntity.risk_profile,
            created_at: existingEntity.created_at
          };
        } else {
          throw new Error('Failed to create or find entity');
        }
      }

      // Create threat intelligence
      const threat = await this.ingestThreatIntelligence({
        content_text: `Simulated threat detected for ${entityName}. Dark web mention found discussing potential reputation damage.`,
        actor_alias: 'SimulatedActor',
        entropy_score: 0.85,
        source_url: 'https://simulated-darkweb-source.onion'
      });

      if (threat) {
        // Add to RSI queue
        await supabase.from('rsi_queue').insert([{
          entity_id: entity.id,
          threat_id: threat.id,
          counter_message: `Automated response recommended for ${entityName}. Threat vector: simulated dark web mention.`,
          priority: 'high',
          status: 'pending'
        }]);

        // Create event dispatch
        await supabase.from('aria_event_dispatch').insert([{
          event_type: 'threat_simulation',
          threat_id: threat.id,
          entity_id: entity.id,
          severity: 'high',
          payload_json: {
            entity_name: entityName,
            threat_type: 'simulated',
            actor_alias: 'SimulatedActor',
            entropy_score: 0.85
          },
          dispatched: false
        }]);

        // Log the operation
        await supabase.from('aria_ops_log').insert([{
          operation_type: 'threat_simulation',
          module_source: 'simulator',
          entity_id: entity.id,
          threat_id: threat.id,
          operation_data: { entity_name: entityName, simulation_type: 'manual' },
          success: true
        }]);
      }
      
      toast.success('Threat simulation completed successfully');
    } catch (error) {
      console.error('Error in threat simulation:', error);
      toast.error('Failed to simulate threat');
    }
  }

  async getSyntheticThreats(limit = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('synthetic_threats')
        .select(`
          *,
          entities:entity_id (name, entity_type)
        `)
        .order('inserted_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching synthetic threats:', error);
      return [];
    }
  }

  async getNarrativeClusters(limit = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('narrative_clusters')
        .select(`
          *,
          entities:entity_id (name, entity_type)
        `)
        .order('last_updated', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching narrative clusters:', error);
      return [];
    }
  }
}

export const hypercoreService = new HypercoreService();

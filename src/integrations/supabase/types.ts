export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          updated_at: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      actor_disruption_events: {
        Row: {
          actor_handle: string
          created_at: string | null
          evidence_url: string | null
          id: string
          platform: string | null
          reason: string | null
          report_submitted_at: string | null
          reported_to_platform: boolean | null
          submitted_by: string | null
        }
        Insert: {
          actor_handle: string
          created_at?: string | null
          evidence_url?: string | null
          id?: string
          platform?: string | null
          reason?: string | null
          report_submitted_at?: string | null
          reported_to_platform?: boolean | null
          submitted_by?: string | null
        }
        Update: {
          actor_handle?: string
          created_at?: string | null
          evidence_url?: string | null
          id?: string
          platform?: string | null
          reason?: string | null
          report_submitted_at?: string | null
          reported_to_platform?: boolean | null
          submitted_by?: string | null
        }
        Relationships: []
      }
      admin_action_logs: {
        Row: {
          action: string
          created_at: string | null
          details: string | null
          email_attempted: string | null
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: string | null
          email_attempted?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: string | null
          email_attempted?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      case_threads: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      case_timelines: {
        Row: {
          case_id: string | null
          created_at: string | null
          created_by: string | null
          event_description: string | null
          event_title: string
          event_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          created_by?: string | null
          event_description?: string | null
          event_title: string
          event_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          created_by?: string | null
          event_description?: string | null
          event_title?: string
          event_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "case_timelines_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "active_case_dashboard"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "case_timelines_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "case_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      clean_launch_targets: {
        Row: {
          company_name: string
          company_number: string
          created_at: string | null
          date_of_incorporation: string | null
          id: string
          last_scanned: string | null
          officers: Json | null
          risk_category: string | null
          risk_score: number | null
          scan_status: string | null
        }
        Insert: {
          company_name: string
          company_number: string
          created_at?: string | null
          date_of_incorporation?: string | null
          id?: string
          last_scanned?: string | null
          officers?: Json | null
          risk_category?: string | null
          risk_score?: number | null
          scan_status?: string | null
        }
        Update: {
          company_name?: string
          company_number?: string
          created_at?: string | null
          date_of_incorporation?: string | null
          id?: string
          last_scanned?: string | null
          officers?: Json | null
          risk_category?: string | null
          risk_score?: number | null
          scan_status?: string | null
        }
        Relationships: []
      }
      client_entities: {
        Row: {
          alias: string | null
          client_id: string
          created_at: string | null
          entity_name: string
          entity_type: string
          id: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          alias?: string | null
          client_id: string
          created_at?: string | null
          entity_name: string
          entity_type: string
          id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          alias?: string | null
          client_id?: string
          created_at?: string | null
          entity_name?: string
          entity_type?: string
          id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_entities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_type: string | null
          contactemail: string
          contactname: string
          created_at: string
          id: string
          industry: string
          keywordtargets: string | null
          name: string
          notes: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          client_type?: string | null
          contactemail: string
          contactname: string
          created_at?: string
          id?: string
          industry: string
          keywordtargets?: string | null
          name: string
          notes?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          client_type?: string | null
          contactemail?: string
          contactname?: string
          created_at?: string
          id?: string
          industry?: string
          keywordtargets?: string | null
          name?: string
          notes?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      content_actions: {
        Row: {
          action: string
          alert_id: string | null
          created_at: string | null
          description: string
          id: string
          platform: string
          status: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          alert_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          platform: string
          status?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          alert_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          platform?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_actions_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "content_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_alerts: {
        Row: {
          client_id: string | null
          confidence_score: number | null
          content: string
          created_at: string | null
          detected_entities: Json | null
          id: string
          platform: string
          potential_reach: number | null
          sentiment: number | null
          severity: string | null
          source_type: string | null
          status: string | null
          threat_type: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          client_id?: string | null
          confidence_score?: number | null
          content: string
          created_at?: string | null
          detected_entities?: Json | null
          id?: string
          platform: string
          potential_reach?: number | null
          sentiment?: number | null
          severity?: string | null
          source_type?: string | null
          status?: string | null
          threat_type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          client_id?: string | null
          confidence_score?: number | null
          content?: string
          created_at?: string | null
          detected_entities?: Json | null
          id?: string
          platform?: string
          potential_reach?: number | null
          sentiment?: number | null
          severity?: string | null
          source_type?: string | null
          status?: string | null
          threat_type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_alerts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      counter_narratives: {
        Row: {
          created_at: string | null
          deployed_at: string | null
          deployed_by: string | null
          id: string
          message: string
          platform: string | null
          scheduled_at: string | null
          status: string
          threat_id: string | null
          tone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deployed_at?: string | null
          deployed_by?: string | null
          id?: string
          message: string
          platform?: string | null
          scheduled_at?: string | null
          status?: string
          threat_id?: string | null
          tone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deployed_at?: string | null
          deployed_by?: string | null
          id?: string
          message?: string
          platform?: string | null
          scheduled_at?: string | null
          status?: string
          threat_id?: string | null
          tone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "counter_narratives_threat_id_fkey"
            columns: ["threat_id"]
            isOneToOne: false
            referencedRelation: "high_priority_threats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counter_narratives_threat_id_fkey"
            columns: ["threat_id"]
            isOneToOne: false
            referencedRelation: "scan_results"
            referencedColumns: ["id"]
          },
        ]
      }
      diversion_campaigns: {
        Row: {
          content_title: string
          content_type: string | null
          created_at: string | null
          deployed: boolean | null
          deployed_by: string | null
          distraction_strength_score: number | null
          id: string
          scheduled_time: string | null
          target_platform: string | null
          threat_id: string | null
        }
        Insert: {
          content_title: string
          content_type?: string | null
          created_at?: string | null
          deployed?: boolean | null
          deployed_by?: string | null
          distraction_strength_score?: number | null
          id?: string
          scheduled_time?: string | null
          target_platform?: string | null
          threat_id?: string | null
        }
        Update: {
          content_title?: string
          content_type?: string | null
          created_at?: string | null
          deployed?: boolean | null
          deployed_by?: string | null
          distraction_strength_score?: number | null
          id?: string
          scheduled_time?: string | null
          target_platform?: string | null
          threat_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diversion_campaigns_threat_id_fkey"
            columns: ["threat_id"]
            isOneToOne: false
            referencedRelation: "high_priority_threats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diversion_campaigns_threat_id_fkey"
            columns: ["threat_id"]
            isOneToOne: false
            referencedRelation: "scan_results"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_threat_history: {
        Row: {
          average_sentiment: number | null
          entity_name: string
          entity_type: string
          first_detected: string | null
          id: string
          last_updated: string | null
          platform: string
          resolution_status: string | null
          severity: string | null
          threat_content: string | null
          threat_id: string | null
          threat_type: string | null
          total_mentions: number | null
        }
        Insert: {
          average_sentiment?: number | null
          entity_name: string
          entity_type: string
          first_detected?: string | null
          id?: string
          last_updated?: string | null
          platform: string
          resolution_status?: string | null
          severity?: string | null
          threat_content?: string | null
          threat_id?: string | null
          threat_type?: string | null
          total_mentions?: number | null
        }
        Update: {
          average_sentiment?: number | null
          entity_name?: string
          entity_type?: string
          first_detected?: string | null
          id?: string
          last_updated?: string | null
          platform?: string
          resolution_status?: string | null
          severity?: string | null
          threat_content?: string | null
          threat_id?: string | null
          threat_type?: string | null
          total_mentions?: number | null
        }
        Relationships: []
      }
      executive_reports: {
        Row: {
          created_at: string | null
          executive_summary: string
          generated_by: string | null
          id: string
          key_metrics: Json | null
          period_end: string
          period_start: string
          recommendations: Json | null
          report_type: string
          risk_score: number | null
          status: string | null
          threat_highlights: Json | null
          title: string
        }
        Insert: {
          created_at?: string | null
          executive_summary: string
          generated_by?: string | null
          id?: string
          key_metrics?: Json | null
          period_end: string
          period_start: string
          recommendations?: Json | null
          report_type?: string
          risk_score?: number | null
          status?: string | null
          threat_highlights?: Json | null
          title: string
        }
        Update: {
          created_at?: string | null
          executive_summary?: string
          generated_by?: string | null
          id?: string
          key_metrics?: Json | null
          period_end?: string
          period_start?: string
          recommendations?: Json | null
          report_type?: string
          risk_score?: number | null
          status?: string | null
          threat_highlights?: Json | null
          title?: string
        }
        Relationships: []
      }
      generated_responses: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          original_content_id: string | null
          response_text: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          original_content_id?: string | null
          response_text: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          original_content_id?: string | null
          response_text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_responses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      influence_simulations: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          input_summary: string
          predicted_sentiment_shift: string | null
          recommended_tactic: string | null
          scenario: string | null
          virality_risk_score: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          input_summary: string
          predicted_sentiment_shift?: string | null
          recommended_tactic?: string | null
          scenario?: string | null
          virality_risk_score?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          input_summary?: string
          predicted_sentiment_shift?: string | null
          recommended_tactic?: string | null
          scenario?: string | null
          virality_risk_score?: number | null
        }
        Relationships: []
      }
      lead_magnets: {
        Row: {
          created_at: string | null
          email: string
          id: string
          lead_magnet: string
          name: string
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          lead_magnet: string
          name: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          lead_magnet?: string
          name?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      monitored_platforms: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          last_updated: string | null
          mention_count: number | null
          name: string
          positive_ratio: number | null
          sentiment: number | null
          status: string | null
          total: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          mention_count?: number | null
          name: string
          positive_ratio?: number | null
          sentiment?: number | null
          status?: string | null
          total?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          mention_count?: number | null
          name?: string
          positive_ratio?: number | null
          sentiment?: number | null
          status?: string | null
          total?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      monitoring_sources: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      monitoring_status: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_run: string | null
          next_run: string | null
          sources_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          next_run?: string | null
          sources_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          next_run?: string | null
          sources_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      narrative_drift_tracking: {
        Row: {
          created_at: string | null
          current_narrative: string
          detected_at: string | null
          drift_score: number | null
          entity_name: string
          id: string
          key_changes: Json | null
          original_narrative: string
          platform: string
          trend_direction: string | null
        }
        Insert: {
          created_at?: string | null
          current_narrative: string
          detected_at?: string | null
          drift_score?: number | null
          entity_name: string
          id?: string
          key_changes?: Json | null
          original_narrative: string
          platform: string
          trend_direction?: string | null
        }
        Update: {
          created_at?: string | null
          current_narrative?: string
          detected_at?: string | null
          drift_score?: number | null
          entity_name?: string
          id?: string
          key_changes?: Json | null
          original_narrative?: string
          platform?: string
          trend_direction?: string | null
        }
        Relationships: []
      }
      reputation_scan_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          job_id: string | null
          keywords: string
          phone: string | null
          platform: string | null
          scan_type: string | null
          status: Database["public"]["Enums"]["reputation_scan_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          job_id?: string | null
          keywords: string
          phone?: string | null
          platform?: string | null
          scan_type?: string | null
          status?: Database["public"]["Enums"]["reputation_scan_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          job_id?: string | null
          keywords?: string
          phone?: string | null
          platform?: string | null
          scan_type?: string | null
          status?: Database["public"]["Enums"]["reputation_scan_status"]
          updated_at?: string
        }
        Relationships: []
      }
      response_effectiveness: {
        Row: {
          ai_confidence_score: number | null
          analyst_rating: number | null
          created_at: string | null
          effectiveness_score: number | null
          engagement_metrics: Json | null
          id: string
          measured_at: string | null
          response_id: string
          sentiment_improvement: number | null
          strategy_type: string
          threat_id: string | null
          time_to_resolution: unknown | null
        }
        Insert: {
          ai_confidence_score?: number | null
          analyst_rating?: number | null
          created_at?: string | null
          effectiveness_score?: number | null
          engagement_metrics?: Json | null
          id?: string
          measured_at?: string | null
          response_id: string
          sentiment_improvement?: number | null
          strategy_type: string
          threat_id?: string | null
          time_to_resolution?: unknown | null
        }
        Update: {
          ai_confidence_score?: number | null
          analyst_rating?: number | null
          created_at?: string | null
          effectiveness_score?: number | null
          engagement_metrics?: Json | null
          id?: string
          measured_at?: string | null
          response_id?: string
          sentiment_improvement?: number | null
          strategy_type?: string
          threat_id?: string | null
          time_to_resolution?: unknown | null
        }
        Relationships: []
      }
      response_transparency_log: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          description: string | null
          id: string
          initiated_by: string | null
          notes: string | null
          response_type: string | null
          source_table_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          initiated_by?: string | null
          notes?: string | null
          response_type?: string | null
          source_table_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          initiated_by?: string | null
          notes?: string | null
          response_type?: string | null
          source_table_id?: string | null
        }
        Relationships: []
      }
      scan_jobs: {
        Row: {
          id: string
          notes: string | null
          status: string
          triggered_at: string | null
          triggered_by: string | null
        }
        Insert: {
          id?: string
          notes?: string | null
          status?: string
          triggered_at?: string | null
          triggered_by?: string | null
        }
        Update: {
          id?: string
          notes?: string | null
          status?: string
          triggered_at?: string | null
          triggered_by?: string | null
        }
        Relationships: []
      }
      scan_results: {
        Row: {
          ai_detection_confidence: number | null
          assigned_to: string | null
          client_id: string | null
          client_linked: boolean | null
          confidence_score: number | null
          contact_status: string | null
          contact_status_updated_by: string | null
          content: string
          created_at: string | null
          detected_entities: Json | null
          id: string
          incident_playbook: string | null
          is_identified: boolean | null
          linked_client_id: string | null
          linked_entity_id: string | null
          media_is_ai_generated: boolean | null
          platform: string
          potential_reach: number | null
          resolved_at: string | null
          responded_at: string | null
          response_notes: string | null
          response_status: string | null
          risk_entity_name: string | null
          risk_entity_type: string | null
          sentiment: number | null
          severity: string | null
          source_credibility_score: number | null
          source_type: string | null
          status: string | null
          threat_severity: string | null
          threat_summary: string | null
          threat_type: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          ai_detection_confidence?: number | null
          assigned_to?: string | null
          client_id?: string | null
          client_linked?: boolean | null
          confidence_score?: number | null
          contact_status?: string | null
          contact_status_updated_by?: string | null
          content: string
          created_at?: string | null
          detected_entities?: Json | null
          id?: string
          incident_playbook?: string | null
          is_identified?: boolean | null
          linked_client_id?: string | null
          linked_entity_id?: string | null
          media_is_ai_generated?: boolean | null
          platform: string
          potential_reach?: number | null
          resolved_at?: string | null
          responded_at?: string | null
          response_notes?: string | null
          response_status?: string | null
          risk_entity_name?: string | null
          risk_entity_type?: string | null
          sentiment?: number | null
          severity?: string | null
          source_credibility_score?: number | null
          source_type?: string | null
          status?: string | null
          threat_severity?: string | null
          threat_summary?: string | null
          threat_type?: string | null
          updated_at?: string | null
          url?: string
        }
        Update: {
          ai_detection_confidence?: number | null
          assigned_to?: string | null
          client_id?: string | null
          client_linked?: boolean | null
          confidence_score?: number | null
          contact_status?: string | null
          contact_status_updated_by?: string | null
          content?: string
          created_at?: string | null
          detected_entities?: Json | null
          id?: string
          incident_playbook?: string | null
          is_identified?: boolean | null
          linked_client_id?: string | null
          linked_entity_id?: string | null
          media_is_ai_generated?: boolean | null
          platform?: string
          potential_reach?: number | null
          resolved_at?: string | null
          responded_at?: string | null
          response_notes?: string | null
          response_status?: string | null
          risk_entity_name?: string | null
          risk_entity_type?: string | null
          sentiment?: number | null
          severity?: string | null
          source_credibility_score?: number | null
          source_type?: string | null
          status?: string | null
          threat_severity?: string | null
          threat_summary?: string | null
          threat_type?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_results_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_results_linked_client_id_fkey"
            columns: ["linked_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_results_linked_entity_id_fkey"
            columns: ["linked_entity_id"]
            isOneToOne: false
            referencedRelation: "client_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      sentiment_tracking: {
        Row: {
          created_at: string | null
          delta_score: number | null
          entity_name: string | null
          id: string
          measurement_date: string | null
          platform: string
          response_id: string | null
          sentiment_after: number | null
          sentiment_before: number | null
          threat_id: string | null
        }
        Insert: {
          created_at?: string | null
          delta_score?: number | null
          entity_name?: string | null
          id?: string
          measurement_date?: string | null
          platform: string
          response_id?: string | null
          sentiment_after?: number | null
          sentiment_before?: number | null
          threat_id?: string | null
        }
        Update: {
          created_at?: string | null
          delta_score?: number | null
          entity_name?: string | null
          id?: string
          measurement_date?: string | null
          platform?: string
          response_id?: string | null
          sentiment_after?: number | null
          sentiment_before?: number | null
          threat_id?: string | null
        }
        Relationships: []
      }
      system_health_checks: {
        Row: {
          check_type: string
          created_at: string
          id: string
          message: string | null
          metadata: Json | null
          platform: string | null
          status: string
        }
        Insert: {
          check_type: string
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          platform?: string | null
          status: string
        }
        Update: {
          check_type?: string
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          platform?: string | null
          status?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_case_dashboard: {
        Row: {
          assigned_to: string | null
          case_id: string | null
          last_activity: string | null
          last_case_update: string | null
          log_count: number | null
          priority: string | null
          status: string | null
          title: string | null
        }
        Relationships: []
      }
      clean_launch_dashboard: {
        Row: {
          company_name: string | null
          company_number: string | null
          created_at: string | null
          date_of_incorporation: string | null
          id: string | null
          last_scanned: string | null
          officers: Json | null
          risk_category: string | null
          risk_score: number | null
          scan_status: string | null
        }
        Insert: {
          company_name?: string | null
          company_number?: string | null
          created_at?: string | null
          date_of_incorporation?: string | null
          id?: string | null
          last_scanned?: string | null
          officers?: Json | null
          risk_category?: string | null
          risk_score?: number | null
          scan_status?: string | null
        }
        Update: {
          company_name?: string | null
          company_number?: string | null
          created_at?: string | null
          date_of_incorporation?: string | null
          id?: string | null
          last_scanned?: string | null
          officers?: Json | null
          risk_category?: string | null
          risk_score?: number | null
          scan_status?: string | null
        }
        Relationships: []
      }
      high_priority_threats: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          confidence_score: number | null
          contact_status: string | null
          contact_status_updated_by: string | null
          content: string | null
          created_at: string | null
          detected_entities: Json | null
          id: string | null
          is_identified: boolean | null
          platform: string | null
          potential_reach: number | null
          priority_level: string | null
          resolved_at: string | null
          responded_at: string | null
          response_notes: string | null
          response_status: string | null
          risk_entity_name: string | null
          risk_entity_type: string | null
          sentiment: number | null
          severity: string | null
          source_type: string | null
          status: string | null
          threat_severity: string | null
          threat_summary: string | null
          threat_type: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          confidence_score?: number | null
          contact_status?: string | null
          contact_status_updated_by?: string | null
          content?: string | null
          created_at?: string | null
          detected_entities?: Json | null
          id?: string | null
          is_identified?: boolean | null
          platform?: string | null
          potential_reach?: number | null
          priority_level?: never
          resolved_at?: string | null
          responded_at?: string | null
          response_notes?: string | null
          response_status?: string | null
          risk_entity_name?: string | null
          risk_entity_type?: string | null
          sentiment?: number | null
          severity?: string | null
          source_type?: string | null
          status?: string | null
          threat_severity?: string | null
          threat_summary?: string | null
          threat_type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          confidence_score?: number | null
          contact_status?: string | null
          contact_status_updated_by?: string | null
          content?: string | null
          created_at?: string | null
          detected_entities?: Json | null
          id?: string | null
          is_identified?: boolean | null
          platform?: string | null
          potential_reach?: number | null
          priority_level?: never
          resolved_at?: string | null
          responded_at?: string | null
          response_notes?: string | null
          response_status?: string | null
          risk_entity_name?: string | null
          risk_entity_type?: string | null
          sentiment?: number | null
          severity?: string | null
          source_type?: string | null
          status?: string | null
          threat_severity?: string | null
          threat_summary?: string | null
          threat_type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_results_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      assign_staff_role: {
        Args: { user_email: string }
        Returns: undefined
      }
      check_entity_client_match: {
        Args: { entity_name_input: string }
        Returns: {
          client_id: string
          client_name: string
          entity_id: string
          entity_name: string
          match_type: string
        }[]
      }
      column_exists: {
        Args: { p_table_name: string; p_column_name: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      refresh_active_case_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      run_global_scan: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      run_scan: {
        Args: { scan_depth?: string }
        Returns: {
          ai_detection_confidence: number | null
          assigned_to: string | null
          client_id: string | null
          client_linked: boolean | null
          confidence_score: number | null
          contact_status: string | null
          contact_status_updated_by: string | null
          content: string
          created_at: string | null
          detected_entities: Json | null
          id: string
          incident_playbook: string | null
          is_identified: boolean | null
          linked_client_id: string | null
          linked_entity_id: string | null
          media_is_ai_generated: boolean | null
          platform: string
          potential_reach: number | null
          resolved_at: string | null
          responded_at: string | null
          response_notes: string | null
          response_status: string | null
          risk_entity_name: string | null
          risk_entity_type: string | null
          sentiment: number | null
          severity: string | null
          source_credibility_score: number | null
          source_type: string | null
          status: string | null
          threat_severity: string | null
          threat_summary: string | null
          threat_type: string | null
          updated_at: string | null
          url: string
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      set_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: undefined
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      app_role: "admin" | "user" | "security" | "staff" | "analyst"
      lead_status: "new" | "contacted" | "converted" | "disqualified"
      reputation_scan_status: "new" | "in_review" | "complete" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "security", "staff", "analyst"],
      lead_status: ["new", "contacted", "converted", "disqualified"],
      reputation_scan_status: ["new", "in_review", "complete", "archived"],
    },
  },
} as const

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
      anubis_auto_escalation_log: {
        Row: {
          auto_action: string | null
          detection_summary: string | null
          entity_id: string | null
          id: string
          resolution_status: string | null
          trigger_level: string | null
          triggered_at: string | null
        }
        Insert: {
          auto_action?: string | null
          detection_summary?: string | null
          entity_id?: string | null
          id?: string
          resolution_status?: string | null
          trigger_level?: string | null
          triggered_at?: string | null
        }
        Update: {
          auto_action?: string | null
          detection_summary?: string | null
          entity_id?: string | null
          id?: string
          resolution_status?: string | null
          trigger_level?: string | null
          triggered_at?: string | null
        }
        Relationships: []
      }
      anubis_creeper_log: {
        Row: {
          confidence_score: number | null
          content_discovered: string | null
          created_at: string | null
          discovered_at: string | null
          entity_name: string
          id: string
          notes: string | null
          processed: boolean | null
          source_platform: string
          threat_level: number | null
        }
        Insert: {
          confidence_score?: number | null
          content_discovered?: string | null
          created_at?: string | null
          discovered_at?: string | null
          entity_name: string
          id?: string
          notes?: string | null
          processed?: boolean | null
          source_platform: string
          threat_level?: number | null
        }
        Update: {
          confidence_score?: number | null
          content_discovered?: string | null
          created_at?: string | null
          discovered_at?: string | null
          entity_name?: string
          id?: string
          notes?: string | null
          processed?: boolean | null
          source_platform?: string
          threat_level?: number | null
        }
        Relationships: []
      }
      anubis_entity_memory: {
        Row: {
          context_reference: string | null
          created_at: string | null
          created_by: string | null
          entity_id: string | null
          entity_name: string
          id: string
          key_findings: Json | null
          last_seen: string | null
          memory_summary: string
          memory_type: string | null
        }
        Insert: {
          context_reference?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_id?: string | null
          entity_name: string
          id?: string
          key_findings?: Json | null
          last_seen?: string | null
          memory_summary: string
          memory_type?: string | null
        }
        Update: {
          context_reference?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_id?: string | null
          entity_name?: string
          id?: string
          key_findings?: Json | null
          last_seen?: string | null
          memory_summary?: string
          memory_type?: string | null
        }
        Relationships: []
      }
      anubis_feedback_memory: {
        Row: {
          action_result: string | null
          created_at: string | null
          entity_id: string
          feedback_score: number | null
          id: string
          notes: string | null
          operator_action: string | null
          source_module: string
          threat_id: string | null
          updated_at: string | null
        }
        Insert: {
          action_result?: string | null
          created_at?: string | null
          entity_id: string
          feedback_score?: number | null
          id?: string
          notes?: string | null
          operator_action?: string | null
          source_module: string
          threat_id?: string | null
          updated_at?: string | null
        }
        Update: {
          action_result?: string | null
          created_at?: string | null
          entity_id?: string
          feedback_score?: number | null
          id?: string
          notes?: string | null
          operator_action?: string | null
          source_module?: string
          threat_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      anubis_mission_chain: {
        Row: {
          action_type: string | null
          detail: string | null
          entity_id: string | null
          followup_required: boolean | null
          id: string
          initiated_by: string | null
          result: string | null
          triggered_at: string | null
        }
        Insert: {
          action_type?: string | null
          detail?: string | null
          entity_id?: string | null
          followup_required?: boolean | null
          id?: string
          initiated_by?: string | null
          result?: string | null
          triggered_at?: string | null
        }
        Update: {
          action_type?: string | null
          detail?: string | null
          entity_id?: string | null
          followup_required?: boolean | null
          id?: string
          initiated_by?: string | null
          result?: string | null
          triggered_at?: string | null
        }
        Relationships: []
      }
      anubis_operator_memory: {
        Row: {
          decision_context: string
          final_decision: string | null
          id: string
          memory_lookup: string | null
          operator_name: string | null
          system_warning: string | null
          timestamp: string | null
        }
        Insert: {
          decision_context: string
          final_decision?: string | null
          id?: string
          memory_lookup?: string | null
          operator_name?: string | null
          system_warning?: string | null
          timestamp?: string | null
        }
        Update: {
          decision_context?: string
          final_decision?: string | null
          id?: string
          memory_lookup?: string | null
          operator_name?: string | null
          system_warning?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      anubis_pattern_log: {
        Row: {
          confidence_score: number | null
          entity_name: string | null
          first_detected: string | null
          id: string
          pattern_fingerprint: string
          pattern_summary: string | null
          previous_outcome: string | null
          recommended_response: string | null
        }
        Insert: {
          confidence_score?: number | null
          entity_name?: string | null
          first_detected?: string | null
          id?: string
          pattern_fingerprint: string
          pattern_summary?: string | null
          previous_outcome?: string | null
          recommended_response?: string | null
        }
        Update: {
          confidence_score?: number | null
          entity_name?: string | null
          first_detected?: string | null
          id?: string
          pattern_fingerprint?: string
          pattern_summary?: string | null
          previous_outcome?: string | null
          recommended_response?: string | null
        }
        Relationships: []
      }
      anubis_playbook_suggestions: {
        Row: {
          created_at: string | null
          effectiveness_score: number | null
          from_feedback_ids: string[] | null
          id: string
          matched_pattern: string | null
          suggested_playbook: Json | null
        }
        Insert: {
          created_at?: string | null
          effectiveness_score?: number | null
          from_feedback_ids?: string[] | null
          id?: string
          matched_pattern?: string | null
          suggested_playbook?: Json | null
        }
        Update: {
          created_at?: string | null
          effectiveness_score?: number | null
          from_feedback_ids?: string[] | null
          id?: string
          matched_pattern?: string | null
          suggested_playbook?: Json | null
        }
        Relationships: []
      }
      anubis_recommendations: {
        Row: {
          client_id: string | null
          confidence_score: number | null
          generated_at: string | null
          id: string
          implementation_priority: string | null
          recommendation_text: string
          recommendation_type: string | null
          status: string | null
          supporting_data: Json | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          confidence_score?: number | null
          generated_at?: string | null
          id?: string
          implementation_priority?: string | null
          recommendation_text: string
          recommendation_type?: string | null
          status?: string | null
          supporting_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          confidence_score?: number | null
          generated_at?: string | null
          id?: string
          implementation_priority?: string | null
          recommendation_text?: string
          recommendation_type?: string | null
          status?: string | null
          supporting_data?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anubis_recommendations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      anubis_watchtower_log: {
        Row: {
          company_name: string | null
          contact_attempted: boolean | null
          first_discovered: string | null
          id: string
          last_outreach: string | null
          notes: string | null
          response_received: boolean | null
          status: string | null
        }
        Insert: {
          company_name?: string | null
          contact_attempted?: boolean | null
          first_discovered?: string | null
          id?: string
          last_outreach?: string | null
          notes?: string | null
          response_received?: boolean | null
          status?: string | null
        }
        Update: {
          company_name?: string | null
          contact_attempted?: boolean | null
          first_discovered?: string | null
          id?: string
          last_outreach?: string | null
          notes?: string | null
          response_received?: boolean | null
          status?: string | null
        }
        Relationships: []
      }
      aria_client_intakes: {
        Row: {
          client_name: string
          consent_timestamp: string | null
          contact_email: string
          created_at: string
          data_processing_consent: boolean
          entity_keywords: string[] | null
          gdpr_consent_given: boolean
          id: string
          identity_verified: boolean
          intake_status: string
          phone_number: string | null
          processed_to_client_entity: boolean | null
          processing_notes: string | null
          public_handles: string[] | null
          reputation_context: Json
          submission_source: string
          threat_level: string | null
          updated_at: string
          verification_method: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          client_name: string
          consent_timestamp?: string | null
          contact_email: string
          created_at?: string
          data_processing_consent?: boolean
          entity_keywords?: string[] | null
          gdpr_consent_given?: boolean
          id?: string
          identity_verified?: boolean
          intake_status?: string
          phone_number?: string | null
          processed_to_client_entity?: boolean | null
          processing_notes?: string | null
          public_handles?: string[] | null
          reputation_context?: Json
          submission_source?: string
          threat_level?: string | null
          updated_at?: string
          verification_method?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          client_name?: string
          consent_timestamp?: string | null
          contact_email?: string
          created_at?: string
          data_processing_consent?: boolean
          entity_keywords?: string[] | null
          gdpr_consent_given?: boolean
          id?: string
          identity_verified?: boolean
          intake_status?: string
          phone_number?: string | null
          processed_to_client_entity?: boolean | null
          processing_notes?: string | null
          public_handles?: string[] | null
          reputation_context?: Json
          submission_source?: string
          threat_level?: string | null
          updated_at?: string
          verification_method?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      aria_event_dispatch: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          priority: string | null
          processed_at: string | null
          scheduled_for: string | null
          status: string | null
          target_entity: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          priority?: string | null
          processed_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          target_entity?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          priority?: string | null
          processed_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          target_entity?: string | null
        }
        Relationships: []
      }
      aria_notifications: {
        Row: {
          created_at: string | null
          entity_name: string | null
          event_type: string | null
          id: string
          priority: string | null
          seen: boolean | null
          summary: string | null
        }
        Insert: {
          created_at?: string | null
          entity_name?: string | null
          event_type?: string | null
          id?: string
          priority?: string | null
          seen?: boolean | null
          summary?: string | null
        }
        Update: {
          created_at?: string | null
          entity_name?: string | null
          event_type?: string | null
          id?: string
          priority?: string | null
          seen?: boolean | null
          summary?: string | null
        }
        Relationships: []
      }
      aria_ops_log: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_name: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          module_source: string | null
          operation_data: Json | null
          operation_type: string
          success: boolean | null
          threat_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_name?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          module_source?: string | null
          operation_data?: Json | null
          operation_type: string
          success?: boolean | null
          threat_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_name?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          module_source?: string | null
          operation_data?: Json | null
          operation_type?: string
          success?: boolean | null
          threat_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aria_ops_log_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      aria_reports: {
        Row: {
          content: string | null
          created_at: string | null
          entity_name: string | null
          id: string
          report_title: string
          risk_rating: string | null
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          entity_name?: string | null
          id?: string
          report_title: string
          risk_rating?: string | null
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          entity_name?: string | null
          id?: string
          report_title?: string
          risk_rating?: string | null
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      article_performance: {
        Row: {
          article_id: string | null
          backlinks_gained: number | null
          click_through_rate: number | null
          clicks: number | null
          id: string
          impressions: number | null
          recorded_at: string | null
          search_rank: number | null
          target_keyword: string | null
        }
        Insert: {
          article_id?: string | null
          backlinks_gained?: number | null
          click_through_rate?: number | null
          clicks?: number | null
          id?: string
          impressions?: number | null
          recorded_at?: string | null
          search_rank?: number | null
          target_keyword?: string | null
        }
        Update: {
          article_id?: string | null
          backlinks_gained?: number | null
          click_through_rate?: number | null
          clicks?: number | null
          id?: string
          impressions?: number | null
          recorded_at?: string | null
          search_rank?: number | null
          target_keyword?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_performance_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "deployed_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          image: string | null
          medium_url: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category: string
          content?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image?: string | null
          medium_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image?: string | null
          medium_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_impact_metrics: {
        Row: {
          attribution_strength: number | null
          campaign_id: string | null
          client_id: string | null
          confidence_level: string | null
          created_at: string | null
          detected_at: string | null
          id: string
          metric_type: string | null
          quantified_value: number | null
          source: string | null
          supporting_evidence: Json | null
          value: string
          verified_at: string | null
        }
        Insert: {
          attribution_strength?: number | null
          campaign_id?: string | null
          client_id?: string | null
          confidence_level?: string | null
          created_at?: string | null
          detected_at?: string | null
          id?: string
          metric_type?: string | null
          quantified_value?: number | null
          source?: string | null
          supporting_evidence?: Json | null
          value: string
          verified_at?: string | null
        }
        Update: {
          attribution_strength?: number | null
          campaign_id?: string | null
          client_id?: string | null
          confidence_level?: string | null
          created_at?: string | null
          detected_at?: string | null
          id?: string
          metric_type?: string | null
          quantified_value?: number | null
          source?: string | null
          supporting_evidence?: Json | null
          value?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_impact_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_effectiveness_dashboard"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "business_impact_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_roi_dashboard"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "business_impact_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "saturation_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_impact_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_analytics: {
        Row: {
          baseline_value: number | null
          campaign_id: string | null
          created_at: string | null
          id: string
          measurement_date: string
          metric_name: string
          metric_type: string | null
          metric_value: number
          percentage_change: number | null
        }
        Insert: {
          baseline_value?: number | null
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          measurement_date: string
          metric_name: string
          metric_type?: string | null
          metric_value: number
          percentage_change?: number | null
        }
        Update: {
          baseline_value?: number | null
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          measurement_date?: string
          metric_name?: string
          metric_type?: string | null
          metric_value?: number
          percentage_change?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_effectiveness_dashboard"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_roi_dashboard"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "saturation_campaigns"
            referencedColumns: ["id"]
          },
        ]
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
      client_intake_submissions: {
        Row: {
          additional_information: string | null
          amplification_topics: string[] | null
          brand_or_alias: string | null
          concern_areas: string[] | null
          consent_to_process: boolean | null
          content_types_to_remove: string[] | null
          created_at: string | null
          data_handling_pref: string | null
          designated_contact_email: string | null
          email: string
          escalation_keywords: string[] | null
          focus_scope: string | null
          full_name: string
          gdpr_agreed_at: string | null
          id: string
          known_aliases: string[] | null
          operational_mode: string | null
          prior_attacks: boolean | null
          problematic_platforms: string[] | null
          recent_achievements: string | null
          risk_tolerance: string | null
          status: string | null
          suppression_targets: string[] | null
          topics_to_flag: string[] | null
          urgency_level: string | null
        }
        Insert: {
          additional_information?: string | null
          amplification_topics?: string[] | null
          brand_or_alias?: string | null
          concern_areas?: string[] | null
          consent_to_process?: boolean | null
          content_types_to_remove?: string[] | null
          created_at?: string | null
          data_handling_pref?: string | null
          designated_contact_email?: string | null
          email: string
          escalation_keywords?: string[] | null
          focus_scope?: string | null
          full_name: string
          gdpr_agreed_at?: string | null
          id?: string
          known_aliases?: string[] | null
          operational_mode?: string | null
          prior_attacks?: boolean | null
          problematic_platforms?: string[] | null
          recent_achievements?: string | null
          risk_tolerance?: string | null
          status?: string | null
          suppression_targets?: string[] | null
          topics_to_flag?: string[] | null
          urgency_level?: string | null
        }
        Update: {
          additional_information?: string | null
          amplification_topics?: string[] | null
          brand_or_alias?: string | null
          concern_areas?: string[] | null
          consent_to_process?: boolean | null
          content_types_to_remove?: string[] | null
          created_at?: string | null
          data_handling_pref?: string | null
          designated_contact_email?: string | null
          email?: string
          escalation_keywords?: string[] | null
          focus_scope?: string | null
          full_name?: string
          gdpr_agreed_at?: string | null
          id?: string
          known_aliases?: string[] | null
          operational_mode?: string | null
          prior_attacks?: boolean | null
          problematic_platforms?: string[] | null
          recent_achievements?: string | null
          risk_tolerance?: string | null
          status?: string | null
          suppression_targets?: string[] | null
          topics_to_flag?: string[] | null
          urgency_level?: string | null
        }
        Relationships: []
      }
      client_platform_credentials: {
        Row: {
          client_id: string | null
          created_at: string | null
          encrypted_credentials: string | null
          id: string
          is_active: boolean | null
          last_used: string | null
          platform_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          encrypted_credentials?: string | null
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          platform_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          encrypted_credentials?: string | null
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          platform_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_platform_credentials_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_platform_credentials_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "deployment_platforms"
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
          eidetic_enabled: boolean | null
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
          eidetic_enabled?: boolean | null
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
          eidetic_enabled?: boolean | null
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
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_edit_sessions: {
        Row: {
          approval_timestamp: string | null
          article_id: string | null
          compliance_flags: Json | null
          created_at: string | null
          edit_diff: Json | null
          edit_duration_minutes: number | null
          edit_type: string | null
          edited_at: string | null
          edited_content: string | null
          editor_email: string | null
          editor_id: string | null
          final_approved: boolean | null
          id: string
          legal_notes: string | null
          legal_reviewed: boolean | null
          legal_reviewer_id: string | null
          original_content: string | null
          recommendation_id: string | null
          rejection_reason: string | null
        }
        Insert: {
          approval_timestamp?: string | null
          article_id?: string | null
          compliance_flags?: Json | null
          created_at?: string | null
          edit_diff?: Json | null
          edit_duration_minutes?: number | null
          edit_type?: string | null
          edited_at?: string | null
          edited_content?: string | null
          editor_email?: string | null
          editor_id?: string | null
          final_approved?: boolean | null
          id?: string
          legal_notes?: string | null
          legal_reviewed?: boolean | null
          legal_reviewer_id?: string | null
          original_content?: string | null
          recommendation_id?: string | null
          rejection_reason?: string | null
        }
        Update: {
          approval_timestamp?: string | null
          article_id?: string | null
          compliance_flags?: Json | null
          created_at?: string | null
          edit_diff?: Json | null
          edit_duration_minutes?: number | null
          edit_type?: string | null
          edited_at?: string | null
          edited_content?: string | null
          editor_email?: string | null
          editor_id?: string | null
          final_approved?: boolean | null
          id?: string
          legal_notes?: string | null
          legal_reviewed?: boolean | null
          legal_reviewer_id?: string | null
          original_content?: string | null
          recommendation_id?: string | null
          rejection_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_edit_sessions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "deployed_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_edit_sessions_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "counter_narrative_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      content_sources: {
        Row: {
          created_at: string | null
          extracted_html: string | null
          id: string
          published_at: string | null
          source_type: string
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          extracted_html?: string | null
          id?: string
          published_at?: string | null
          source_type: string
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          extracted_html?: string | null
          id?: string
          published_at?: string | null
          source_type?: string
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      counter_narrative_recommendations: {
        Row: {
          ai_confidence_score: number | null
          content_theme: string
          content_type: string | null
          created_at: string | null
          editor_changes: Json | null
          expected_impact_score: number | null
          feedback_timestamp: string | null
          id: string
          improvement_notes: string | null
          is_selected: boolean | null
          operator_feedback: string | null
          optimization_focus: string | null
          rejection_reason: string | null
          seo_map_id: string | null
          target_keywords: Json
        }
        Insert: {
          ai_confidence_score?: number | null
          content_theme: string
          content_type?: string | null
          created_at?: string | null
          editor_changes?: Json | null
          expected_impact_score?: number | null
          feedback_timestamp?: string | null
          id?: string
          improvement_notes?: string | null
          is_selected?: boolean | null
          operator_feedback?: string | null
          optimization_focus?: string | null
          rejection_reason?: string | null
          seo_map_id?: string | null
          target_keywords?: Json
        }
        Update: {
          ai_confidence_score?: number | null
          content_theme?: string
          content_type?: string | null
          created_at?: string | null
          editor_changes?: Json | null
          expected_impact_score?: number | null
          feedback_timestamp?: string | null
          id?: string
          improvement_notes?: string | null
          is_selected?: boolean | null
          operator_feedback?: string | null
          optimization_focus?: string | null
          rejection_reason?: string | null
          seo_map_id?: string | null
          target_keywords?: Json
        }
        Relationships: [
          {
            foreignKeyName: "counter_narrative_recommendations_seo_map_id_fkey"
            columns: ["seo_map_id"]
            isOneToOne: false
            referencedRelation: "negative_seo_maps"
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
      crawl_job_queue: {
        Row: {
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          job_parameters: Json | null
          job_type: string | null
          priority: number | null
          results_summary: Json | null
          scheduled_for: string | null
          started_at: string | null
          status: string | null
          target_entity: string
          target_platforms: Json
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_parameters?: Json | null
          job_type?: string | null
          priority?: number | null
          results_summary?: Json | null
          scheduled_for?: string | null
          started_at?: string | null
          status?: string | null
          target_entity: string
          target_platforms?: Json
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_parameters?: Json | null
          job_type?: string | null
          priority?: number | null
          results_summary?: Json | null
          scheduled_for?: string | null
          started_at?: string | null
          status?: string | null
          target_entity?: string
          target_platforms?: Json
        }
        Relationships: [
          {
            foreignKeyName: "crawl_job_queue_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      darkweb_agents: {
        Row: {
          agent_alias: string
          ended_at: string | null
          findings: Json | null
          id: string
          mission_status: string | null
          mission_type: string | null
          started_at: string | null
          target_actor: string | null
        }
        Insert: {
          agent_alias: string
          ended_at?: string | null
          findings?: Json | null
          id?: string
          mission_status?: string | null
          mission_type?: string | null
          started_at?: string | null
          target_actor?: string | null
        }
        Update: {
          agent_alias?: string
          ended_at?: string | null
          findings?: Json | null
          id?: string
          mission_status?: string | null
          mission_type?: string | null
          started_at?: string | null
          target_actor?: string | null
        }
        Relationships: []
      }
      darkweb_feed: {
        Row: {
          actor_alias: string | null
          content_text: string
          entropy_score: number | null
          id: string
          inserted_at: string | null
          source_url: string | null
        }
        Insert: {
          actor_alias?: string | null
          content_text: string
          entropy_score?: number | null
          id?: string
          inserted_at?: string | null
          source_url?: string | null
        }
        Update: {
          actor_alias?: string | null
          content_text?: string
          entropy_score?: number | null
          id?: string
          inserted_at?: string | null
          source_url?: string | null
        }
        Relationships: []
      }
      data_breach_incidents: {
        Row: {
          breach_type: string
          cause_of_breach: string
          containment_measures: string | null
          created_at: string | null
          data_categories_affected: string[]
          data_subjects_notified: boolean | null
          discovery_date: string
          ico_notification_date: string | null
          ico_notification_required: boolean | null
          ico_reference: string | null
          id: string
          immediate_actions_taken: string | null
          incident_date: string | null
          incident_description: string
          incident_reference: string
          incident_status: string | null
          investigated_by: string | null
          lessons_learned: string | null
          likelihood_of_harm: string
          notification_date: string | null
          notification_method: string | null
          number_of_data_subjects_affected: number | null
          number_of_records_affected: number | null
          preventive_measures: string | null
          regulatory_action: string | null
          reported_by: string | null
          risk_assessment: string
          severity_of_harm: string
          systems_affected: string[] | null
          updated_at: string | null
        }
        Insert: {
          breach_type: string
          cause_of_breach: string
          containment_measures?: string | null
          created_at?: string | null
          data_categories_affected: string[]
          data_subjects_notified?: boolean | null
          discovery_date: string
          ico_notification_date?: string | null
          ico_notification_required?: boolean | null
          ico_reference?: string | null
          id?: string
          immediate_actions_taken?: string | null
          incident_date?: string | null
          incident_description: string
          incident_reference: string
          incident_status?: string | null
          investigated_by?: string | null
          lessons_learned?: string | null
          likelihood_of_harm: string
          notification_date?: string | null
          notification_method?: string | null
          number_of_data_subjects_affected?: number | null
          number_of_records_affected?: number | null
          preventive_measures?: string | null
          regulatory_action?: string | null
          reported_by?: string | null
          risk_assessment: string
          severity_of_harm: string
          systems_affected?: string[] | null
          updated_at?: string | null
        }
        Update: {
          breach_type?: string
          cause_of_breach?: string
          containment_measures?: string | null
          created_at?: string | null
          data_categories_affected?: string[]
          data_subjects_notified?: boolean | null
          discovery_date?: string
          ico_notification_date?: string | null
          ico_notification_required?: boolean | null
          ico_reference?: string | null
          id?: string
          immediate_actions_taken?: string | null
          incident_date?: string | null
          incident_description?: string
          incident_reference?: string
          incident_status?: string | null
          investigated_by?: string | null
          lessons_learned?: string | null
          likelihood_of_harm?: string
          notification_date?: string | null
          notification_method?: string | null
          number_of_data_subjects_affected?: number | null
          number_of_records_affected?: number | null
          preventive_measures?: string | null
          regulatory_action?: string | null
          reported_by?: string | null
          risk_assessment?: string
          severity_of_harm?: string
          systems_affected?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      data_retention_schedule: {
        Row: {
          automated_deletion: boolean | null
          created_at: string | null
          cross_border_considerations: string | null
          data_category: string
          deletion_job_name: string | null
          deletion_method: string
          id: string
          last_review_date: string | null
          legal_basis: string
          next_review_date: string | null
          responsible_role: string
          retention_justification: string
          retention_period: unknown
          review_frequency: unknown | null
          special_category_data: boolean | null
          table_name: string
          updated_at: string | null
        }
        Insert: {
          automated_deletion?: boolean | null
          created_at?: string | null
          cross_border_considerations?: string | null
          data_category: string
          deletion_job_name?: string | null
          deletion_method: string
          id?: string
          last_review_date?: string | null
          legal_basis: string
          next_review_date?: string | null
          responsible_role: string
          retention_justification: string
          retention_period: unknown
          review_frequency?: unknown | null
          special_category_data?: boolean | null
          table_name: string
          updated_at?: string | null
        }
        Update: {
          automated_deletion?: boolean | null
          created_at?: string | null
          cross_border_considerations?: string | null
          data_category?: string
          deletion_job_name?: string | null
          deletion_method?: string
          id?: string
          last_review_date?: string | null
          legal_basis?: string
          next_review_date?: string | null
          responsible_role?: string
          retention_justification?: string
          retention_period?: unknown
          review_frequency?: unknown | null
          special_category_data?: boolean | null
          table_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      data_subject_requests: {
        Row: {
          acknowledgment_sent_date: string | null
          created_at: string | null
          data_categories: string[] | null
          data_corrected: boolean | null
          data_deleted: boolean | null
          data_provided: boolean | null
          data_subject_email: string
          data_subject_name: string
          handled_by: string | null
          id: string
          legal_basis_for_refusal: string | null
          notes: string | null
          outcome: string | null
          processing_restricted: boolean | null
          processing_systems: string[] | null
          request_date: string | null
          request_details: string | null
          request_type: string
          response_due_date: string | null
          response_method: string | null
          response_sent_date: string | null
          status: string | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          acknowledgment_sent_date?: string | null
          created_at?: string | null
          data_categories?: string[] | null
          data_corrected?: boolean | null
          data_deleted?: boolean | null
          data_provided?: boolean | null
          data_subject_email: string
          data_subject_name: string
          handled_by?: string | null
          id?: string
          legal_basis_for_refusal?: string | null
          notes?: string | null
          outcome?: string | null
          processing_restricted?: boolean | null
          processing_systems?: string[] | null
          request_date?: string | null
          request_details?: string | null
          request_type: string
          response_due_date?: string | null
          response_method?: string | null
          response_sent_date?: string | null
          status?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          acknowledgment_sent_date?: string | null
          created_at?: string | null
          data_categories?: string[] | null
          data_corrected?: boolean | null
          data_deleted?: boolean | null
          data_provided?: boolean | null
          data_subject_email?: string
          data_subject_name?: string
          handled_by?: string | null
          id?: string
          legal_basis_for_refusal?: string | null
          notes?: string | null
          outcome?: string | null
          processing_restricted?: boolean | null
          processing_systems?: string[] | null
          request_date?: string | null
          request_details?: string | null
          request_type?: string
          response_due_date?: string | null
          response_method?: string | null
          response_sent_date?: string | null
          status?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      decoy_assets: {
        Row: {
          access_count: number | null
          asset_description: string | null
          asset_title: string | null
          click_through_rate: number | null
          client_id: string | null
          created_at: string | null
          decoy_url: string
          deployed_at: string | null
          engagement_score: number | null
          id: string
          is_active: boolean | null
          last_accessed: string | null
          relevance_weight: number | null
          topic_match: string
        }
        Insert: {
          access_count?: number | null
          asset_description?: string | null
          asset_title?: string | null
          click_through_rate?: number | null
          client_id?: string | null
          created_at?: string | null
          decoy_url: string
          deployed_at?: string | null
          engagement_score?: number | null
          id?: string
          is_active?: boolean | null
          last_accessed?: string | null
          relevance_weight?: number | null
          topic_match: string
        }
        Update: {
          access_count?: number | null
          asset_description?: string | null
          asset_title?: string | null
          click_through_rate?: number | null
          client_id?: string | null
          created_at?: string | null
          decoy_url?: string
          deployed_at?: string | null
          engagement_score?: number | null
          id?: string
          is_active?: boolean | null
          last_accessed?: string | null
          relevance_weight?: number | null
          topic_match?: string
        }
        Relationships: [
          {
            foreignKeyName: "decoy_assets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      deployed_articles: {
        Row: {
          article_content: string
          article_title: string
          authority_gap_analysis: Json | null
          campaign_id: string | null
          competing_domains: Json | null
          created_at: string | null
          deployed_at: string | null
          deployment_status: string | null
          deployment_url: string
          domain_authority_score: number | null
          external_links: Json | null
          http_status: number | null
          id: string
          indexed_at: string | null
          last_verified: string | null
          platform: string
          schema_metadata: Json | null
          target_keywords: Json
        }
        Insert: {
          article_content: string
          article_title: string
          authority_gap_analysis?: Json | null
          campaign_id?: string | null
          competing_domains?: Json | null
          created_at?: string | null
          deployed_at?: string | null
          deployment_status?: string | null
          deployment_url: string
          domain_authority_score?: number | null
          external_links?: Json | null
          http_status?: number | null
          id?: string
          indexed_at?: string | null
          last_verified?: string | null
          platform: string
          schema_metadata?: Json | null
          target_keywords?: Json
        }
        Update: {
          article_content?: string
          article_title?: string
          authority_gap_analysis?: Json | null
          campaign_id?: string | null
          competing_domains?: Json | null
          created_at?: string | null
          deployed_at?: string | null
          deployment_status?: string | null
          deployment_url?: string
          domain_authority_score?: number | null
          external_links?: Json | null
          http_status?: number | null
          id?: string
          indexed_at?: string | null
          last_verified?: string | null
          platform?: string
          schema_metadata?: Json | null
          target_keywords?: Json
        }
        Relationships: [
          {
            foreignKeyName: "deployed_articles_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_effectiveness_dashboard"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "deployed_articles_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_roi_dashboard"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "deployed_articles_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "saturation_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      deployment_platforms: {
        Row: {
          api_endpoint: string | null
          authentication_method: string | null
          configuration: Json | null
          created_at: string | null
          deployment_template: string | null
          id: string
          is_active: boolean | null
          platform_name: string
          rate_limits: Json | null
        }
        Insert: {
          api_endpoint?: string | null
          authentication_method?: string | null
          configuration?: Json | null
          created_at?: string | null
          deployment_template?: string | null
          id?: string
          is_active?: boolean | null
          platform_name: string
          rate_limits?: Json | null
        }
        Update: {
          api_endpoint?: string | null
          authentication_method?: string | null
          configuration?: Json | null
          created_at?: string | null
          deployment_template?: string | null
          id?: string
          is_active?: boolean | null
          platform_name?: string
          rate_limits?: Json | null
        }
        Relationships: []
      }
      disinfo_decoys: {
        Row: {
          actor_alias: string | null
          decoy_type: string | null
          deployed_at: string | null
          deployment_status: string | null
          effectiveness_score: number | null
          id: string
          notes: string | null
          target_entity: string | null
        }
        Insert: {
          actor_alias?: string | null
          decoy_type?: string | null
          deployed_at?: string | null
          deployment_status?: string | null
          effectiveness_score?: number | null
          id?: string
          notes?: string | null
          target_entity?: string | null
        }
        Update: {
          actor_alias?: string | null
          decoy_type?: string | null
          deployed_at?: string | null
          deployment_status?: string | null
          effectiveness_score?: number | null
          id?: string
          notes?: string | null
          target_entity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disinfo_decoys_target_entity_fkey"
            columns: ["target_entity"]
            isOneToOne: false
            referencedRelation: "entities"
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
      dpia_records: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          assessment_date: string
          assessment_title: string
          assessor_name: string
          assessor_role: string
          automated_decision_making: boolean | null
          created_at: string | null
          cross_border_transfers: string | null
          data_minimization_measures: string | null
          data_retention_period: unknown | null
          data_types: string[]
          id: string
          identified_risks: Json | null
          legal_basis: string
          mitigation_measures: Json | null
          necessity_justification: string
          processing_purpose: string
          profiling_activities: boolean | null
          proportionality_assessment: string
          review_date: string | null
          security_measures: string | null
          status: string | null
          third_party_sharing: string | null
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          assessment_date: string
          assessment_title: string
          assessor_name: string
          assessor_role: string
          automated_decision_making?: boolean | null
          created_at?: string | null
          cross_border_transfers?: string | null
          data_minimization_measures?: string | null
          data_retention_period?: unknown | null
          data_types: string[]
          id?: string
          identified_risks?: Json | null
          legal_basis: string
          mitigation_measures?: Json | null
          necessity_justification: string
          processing_purpose: string
          profiling_activities?: boolean | null
          proportionality_assessment: string
          review_date?: string | null
          security_measures?: string | null
          status?: string | null
          third_party_sharing?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          assessment_date?: string
          assessment_title?: string
          assessor_name?: string
          assessor_role?: string
          automated_decision_making?: boolean | null
          created_at?: string | null
          cross_border_transfers?: string | null
          data_minimization_measures?: string | null
          data_retention_period?: unknown | null
          data_types?: string[]
          id?: string
          identified_risks?: Json | null
          legal_basis?: string
          mitigation_measures?: Json | null
          necessity_justification?: string
          processing_purpose?: string
          profiling_activities?: boolean | null
          proportionality_assessment?: string
          review_date?: string | null
          security_measures?: string | null
          status?: string | null
          third_party_sharing?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      edge_function_deployments: {
        Row: {
          deployed_at: string | null
          deployed_by: string | null
          deployment_notes: string | null
          function_name: string
          id: string
          source_files: string[] | null
        }
        Insert: {
          deployed_at?: string | null
          deployed_by?: string | null
          deployment_notes?: string | null
          function_name: string
          id?: string
          source_files?: string[] | null
        }
        Update: {
          deployed_at?: string | null
          deployed_by?: string | null
          deployment_notes?: string | null
          function_name?: string
          id?: string
          source_files?: string[] | null
        }
        Relationships: []
      }
      edge_function_events: {
        Row: {
          event_payload: Json | null
          executed_at: string | null
          function_name: string
          id: string
          result_summary: string | null
          status: string
        }
        Insert: {
          event_payload?: Json | null
          executed_at?: string | null
          function_name: string
          id?: string
          result_summary?: string | null
          status: string
        }
        Update: {
          event_payload?: Json | null
          executed_at?: string | null
          function_name?: string
          id?: string
          result_summary?: string | null
          status?: string
        }
        Relationships: []
      }
      edge_function_metadata: {
        Row: {
          created_at: string | null
          description: string | null
          function_name: string
          id: string
          module_path: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          function_name: string
          id?: string
          module_path: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          function_name?: string
          id?: string
          module_path?: string
        }
        Relationships: []
      }
      eidetic_decay_history: {
        Row: {
          decay_score: number | null
          footprint_id: string | null
          id: string
          recorded_at: string | null
          relevancy_score: number | null
        }
        Insert: {
          decay_score?: number | null
          footprint_id?: string | null
          id?: string
          recorded_at?: string | null
          relevancy_score?: number | null
        }
        Update: {
          decay_score?: number | null
          footprint_id?: string | null
          id?: string
          recorded_at?: string | null
          relevancy_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eidetic_decay_history_footprint_id_fkey"
            columns: ["footprint_id"]
            isOneToOne: false
            referencedRelation: "memory_footprints"
            referencedColumns: ["id"]
          },
        ]
      }
      eidetic_footprint_queue: {
        Row: {
          content_excerpt: string | null
          decay_score: number | null
          id: string
          prospect_name: string | null
          routed_at: string | null
          status: string | null
        }
        Insert: {
          content_excerpt?: string | null
          decay_score?: number | null
          id?: string
          prospect_name?: string | null
          routed_at?: string | null
          status?: string | null
        }
        Update: {
          content_excerpt?: string | null
          decay_score?: number | null
          id?: string
          prospect_name?: string | null
          routed_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      employee_batch_scans: {
        Row: {
          company_id: string | null
          completed_at: string | null
          completed_employees: number | null
          created_at: string | null
          failed_employees: number | null
          id: string
          scan_name: string
          started_at: string | null
          started_by: string | null
          status: string | null
          total_employees: number | null
        }
        Insert: {
          company_id?: string | null
          completed_at?: string | null
          completed_employees?: number | null
          created_at?: string | null
          failed_employees?: number | null
          id?: string
          scan_name: string
          started_at?: string | null
          started_by?: string | null
          status?: string | null
          total_employees?: number | null
        }
        Update: {
          company_id?: string | null
          completed_at?: string | null
          completed_employees?: number | null
          created_at?: string | null
          failed_employees?: number | null
          id?: string
          scan_name?: string
          started_at?: string | null
          started_by?: string | null
          status?: string | null
          total_employees?: number | null
        }
        Relationships: []
      }
      employee_risk_alerts: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          company_id: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          message: string | null
          risk_level: number | null
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          company_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          message?: string | null
          risk_level?: number | null
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          company_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          message?: string | null
          risk_level?: number | null
        }
        Relationships: []
      }
      employee_risk_tags: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          severity_weight: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          severity_weight?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          severity_weight?: number | null
        }
        Relationships: []
      }
      employee_scan_queue: {
        Row: {
          batch_scan_id: string | null
          completed_at: string | null
          created_at: string | null
          employee_id: string | null
          error_message: string | null
          id: string
          max_retries: number | null
          priority: number | null
          retry_count: number | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          batch_scan_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          priority?: number | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          batch_scan_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          priority?: number | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_scan_queue_batch_scan_id_fkey"
            columns: ["batch_scan_id"]
            isOneToOne: false
            referencedRelation: "employee_batch_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_scan_results: {
        Row: {
          content: string | null
          created_at: string | null
          employee_id: string | null
          found_at: string | null
          id: string
          platform: string
          risk_category: string | null
          sentiment: number | null
          severity: string | null
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          employee_id?: string | null
          found_at?: string | null
          id?: string
          platform: string
          risk_category?: string | null
          sentiment?: number | null
          severity?: string | null
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          employee_id?: string | null
          found_at?: string | null
          id?: string
          platform?: string
          risk_category?: string | null
          sentiment?: number | null
          severity?: string | null
          url?: string | null
        }
        Relationships: []
      }
      entities: {
        Row: {
          created_at: string | null
          entity_type: string | null
          id: string
          name: string
          risk_profile: Json | null
        }
        Insert: {
          created_at?: string | null
          entity_type?: string | null
          id?: string
          name: string
          risk_profile?: Json | null
        }
        Update: {
          created_at?: string | null
          entity_type?: string | null
          id?: string
          name?: string
          risk_profile?: Json | null
        }
        Relationships: []
      }
      entity_fingerprints: {
        Row: {
          alternate_names: string[] | null
          client_id: string | null
          controversial_topics: string[] | null
          core_achievements: Json | null
          created_at: string | null
          entity_name: string
          fingerprint_confidence: number | null
          id: string
          industries: string[] | null
          known_associates: string[] | null
          last_updated: string | null
        }
        Insert: {
          alternate_names?: string[] | null
          client_id?: string | null
          controversial_topics?: string[] | null
          core_achievements?: Json | null
          created_at?: string | null
          entity_name: string
          fingerprint_confidence?: number | null
          id?: string
          industries?: string[] | null
          known_associates?: string[] | null
          last_updated?: string | null
        }
        Update: {
          alternate_names?: string[] | null
          client_id?: string | null
          controversial_topics?: string[] | null
          core_achievements?: Json | null
          created_at?: string | null
          entity_name?: string
          fingerprint_confidence?: number | null
          id?: string
          industries?: string[] | null
          known_associates?: string[] | null
          last_updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_fingerprints_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_fingerprints_advanced: {
        Row: {
          aliases: Json
          context_tags: Json
          created_at: string
          created_by: string | null
          entity_id: string
          false_positive_blocklist: Json
          id: string
          locations: Json
          organization: string | null
          primary_name: string
          updated_at: string
        }
        Insert: {
          aliases?: Json
          context_tags?: Json
          created_at?: string
          created_by?: string | null
          entity_id: string
          false_positive_blocklist?: Json
          id?: string
          locations?: Json
          organization?: string | null
          primary_name: string
          updated_at?: string
        }
        Update: {
          aliases?: Json
          context_tags?: Json
          created_at?: string
          created_by?: string | null
          entity_id?: string
          false_positive_blocklist?: Json
          id?: string
          locations?: Json
          organization?: string | null
          primary_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      entity_graph: {
        Row: {
          frequency: number | null
          id: string
          last_seen: string | null
          related_entity: string | null
          relationship_type: string | null
          source_entity: string | null
        }
        Insert: {
          frequency?: number | null
          id?: string
          last_seen?: string | null
          related_entity?: string | null
          relationship_type?: string | null
          source_entity?: string | null
        }
        Update: {
          frequency?: number | null
          id?: string
          last_seen?: string | null
          related_entity?: string | null
          relationship_type?: string | null
          source_entity?: string | null
        }
        Relationships: []
      }
      entity_match_decisions: {
        Row: {
          context_matches: Json | null
          created_at: string
          decision: string
          false_positive_detected: boolean | null
          human_feedback: string | null
          id: string
          match_score: number
          matched_entity: string
          ner_entities: Json | null
          query_variant_id: string | null
          raw_content: string | null
          raw_title: string | null
          reason_discarded: string | null
          reviewed_by: string | null
          source_url: string
        }
        Insert: {
          context_matches?: Json | null
          created_at?: string
          decision: string
          false_positive_detected?: boolean | null
          human_feedback?: string | null
          id?: string
          match_score?: number
          matched_entity: string
          ner_entities?: Json | null
          query_variant_id?: string | null
          raw_content?: string | null
          raw_title?: string | null
          reason_discarded?: string | null
          reviewed_by?: string | null
          source_url: string
        }
        Update: {
          context_matches?: Json | null
          created_at?: string
          decision?: string
          false_positive_detected?: boolean | null
          human_feedback?: string | null
          id?: string
          match_score?: number
          matched_entity?: string
          ner_entities?: Json | null
          query_variant_id?: string | null
          raw_content?: string | null
          raw_title?: string | null
          reason_discarded?: string | null
          reviewed_by?: string | null
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_match_decisions_query_variant_id_fkey"
            columns: ["query_variant_id"]
            isOneToOne: false
            referencedRelation: "entity_query_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_precision_stats: {
        Row: {
          avg_precision_score: number | null
          confidence_level: string
          created_at: string
          entity_fingerprint_id: string | null
          false_positive_rate: number | null
          id: string
          scan_date: string
          total_discarded: number | null
          total_matched: number | null
          total_queries: number | null
          total_results: number | null
        }
        Insert: {
          avg_precision_score?: number | null
          confidence_level: string
          created_at?: string
          entity_fingerprint_id?: string | null
          false_positive_rate?: number | null
          id?: string
          scan_date?: string
          total_discarded?: number | null
          total_matched?: number | null
          total_queries?: number | null
          total_results?: number | null
        }
        Update: {
          avg_precision_score?: number | null
          confidence_level?: string
          created_at?: string
          entity_fingerprint_id?: string | null
          false_positive_rate?: number | null
          id?: string
          scan_date?: string
          total_discarded?: number | null
          total_matched?: number | null
          total_queries?: number | null
          total_results?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_precision_stats_entity_fingerprint_id_fkey"
            columns: ["entity_fingerprint_id"]
            isOneToOne: false
            referencedRelation: "entity_fingerprints_advanced"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_query_variants: {
        Row: {
          avg_match_score: number | null
          entity_fingerprint_id: string | null
          executed_at: string
          id: string
          matched_count: number | null
          platform: string
          query_text: string
          query_type: string
          results_count: number | null
          search_fingerprint_id: string
        }
        Insert: {
          avg_match_score?: number | null
          entity_fingerprint_id?: string | null
          executed_at?: string
          id?: string
          matched_count?: number | null
          platform: string
          query_text: string
          query_type: string
          results_count?: number | null
          search_fingerprint_id?: string
        }
        Update: {
          avg_match_score?: number | null
          entity_fingerprint_id?: string | null
          executed_at?: string
          id?: string
          matched_count?: number | null
          platform?: string
          query_text?: string
          query_type?: string
          results_count?: number | null
          search_fingerprint_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_query_variants_entity_fingerprint_id_fkey"
            columns: ["entity_fingerprint_id"]
            isOneToOne: false
            referencedRelation: "entity_fingerprints_advanced"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_risk_profiles: {
        Row: {
          entity_name: string
          id: string
          risk_score: number | null
          total_signals: number | null
          updated_at: string | null
        }
        Insert: {
          entity_name: string
          id?: string
          risk_score?: number | null
          total_signals?: number | null
          updated_at?: string | null
        }
        Update: {
          entity_name?: string
          id?: string
          risk_score?: number | null
          total_signals?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
      eris_attack_simulations: {
        Row: {
          attack_vector: string
          created_at: string | null
          created_by: string | null
          id: string
          origin_source: string | null
          scenario_description: string | null
          target_entity: string | null
          threat_score: number | null
        }
        Insert: {
          attack_vector: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          origin_source?: string | null
          scenario_description?: string | null
          target_entity?: string | null
          threat_score?: number | null
        }
        Update: {
          attack_vector?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          origin_source?: string | null
          scenario_description?: string | null
          target_entity?: string | null
          threat_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eris_attack_simulations_target_entity_fkey"
            columns: ["target_entity"]
            isOneToOne: false
            referencedRelation: "client_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      eris_response_strategies: {
        Row: {
          created_at: string | null
          effectiveness_score: number | null
          executed: boolean | null
          gpt_recommendation: string | null
          id: string
          simulation_id: string | null
          strategy_type: string | null
        }
        Insert: {
          created_at?: string | null
          effectiveness_score?: number | null
          executed?: boolean | null
          gpt_recommendation?: string | null
          id?: string
          simulation_id?: string | null
          strategy_type?: string | null
        }
        Update: {
          created_at?: string | null
          effectiveness_score?: number | null
          executed?: boolean | null
          gpt_recommendation?: string | null
          id?: string
          simulation_id?: string | null
          strategy_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eris_response_strategies_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "eris_attack_simulations"
            referencedColumns: ["id"]
          },
        ]
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
      fix_paths: {
        Row: {
          created_at: string | null
          entity_name: string
          id: string
          steps: Json | null
          threat_level: string | null
        }
        Insert: {
          created_at?: string | null
          entity_name: string
          id?: string
          steps?: Json | null
          threat_level?: string | null
        }
        Update: {
          created_at?: string | null
          entity_name?: string
          id?: string
          steps?: Json | null
          threat_level?: string | null
        }
        Relationships: []
      }
      generated_content: {
        Row: {
          client_id: string | null
          content: string
          content_type: string
          created_at: string | null
          generation_source: string | null
          id: string
          is_live: boolean | null
          source_threat: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          content_type: string
          created_at?: string | null
          generation_source?: string | null
          id?: string
          is_live?: boolean | null
          source_threat?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          content_type?: string
          created_at?: string | null
          generation_source?: string | null
          id?: string
          is_live?: boolean | null
          source_threat?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_content_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_reports: {
        Row: {
          created_at: string | null
          entity_id: string | null
          generated_at: string | null
          generated_pdf_url: string | null
          id: string
          report_type: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          generated_at?: string | null
          generated_pdf_url?: string | null
          id?: string
          report_type?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          generated_at?: string | null
          generated_pdf_url?: string | null
          id?: string
          report_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_reports_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
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
      genesis_articles: {
        Row: {
          article_title: string
          article_url: string
          entity_id: string | null
          id: string
          is_live: boolean
          platform: string
          published_at: string | null
          verified_live: boolean | null
        }
        Insert: {
          article_title: string
          article_url: string
          entity_id?: string | null
          id?: string
          is_live?: boolean
          platform: string
          published_at?: string | null
          verified_live?: boolean | null
        }
        Update: {
          article_title?: string
          article_url?: string
          entity_id?: string | null
          id?: string
          is_live?: boolean
          platform?: string
          published_at?: string | null
          verified_live?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "genesis_articles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "genesis_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      genesis_entities: {
        Row: {
          aliases: string[] | null
          created_at: string | null
          discovery_source: string | null
          full_name: string
          id: string
          is_guarded: boolean | null
          primary_industry: string | null
          risk_profile: string | null
        }
        Insert: {
          aliases?: string[] | null
          created_at?: string | null
          discovery_source?: string | null
          full_name: string
          id?: string
          is_guarded?: boolean | null
          primary_industry?: string | null
          risk_profile?: string | null
        }
        Update: {
          aliases?: string[] | null
          created_at?: string | null
          discovery_source?: string | null
          full_name?: string
          id?: string
          is_guarded?: boolean | null
          primary_industry?: string | null
          risk_profile?: string | null
        }
        Relationships: []
      }
      genesis_guardian_log: {
        Row: {
          check_type: string | null
          entity_id: string | null
          escalation_level: string | null
          findings: string | null
          id: string
          triggered_at: string | null
        }
        Insert: {
          check_type?: string | null
          entity_id?: string | null
          escalation_level?: string | null
          findings?: string | null
          id?: string
          triggered_at?: string | null
        }
        Update: {
          check_type?: string | null
          entity_id?: string | null
          escalation_level?: string | null
          findings?: string | null
          id?: string
          triggered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "genesis_guardian_log_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "genesis_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      genesis_legal_documents: {
        Row: {
          document_text: string
          document_type: string | null
          entity_id: string | null
          generated_at: string | null
          id: string
          pdf_url: string | null
        }
        Insert: {
          document_text: string
          document_type?: string | null
          entity_id?: string | null
          generated_at?: string | null
          id?: string
          pdf_url?: string | null
        }
        Update: {
          document_text?: string
          document_type?: string | null
          entity_id?: string | null
          generated_at?: string | null
          id?: string
          pdf_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "genesis_legal_documents_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "genesis_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      genesis_response_log: {
        Row: {
          action_summary: string
          deployed_at: string | null
          deployed_by: string | null
          entity_id: string | null
          id: string
          outcome: string | null
          response_type: string | null
        }
        Insert: {
          action_summary: string
          deployed_at?: string | null
          deployed_by?: string | null
          entity_id?: string | null
          id?: string
          outcome?: string | null
          response_type?: string | null
        }
        Update: {
          action_summary?: string
          deployed_at?: string | null
          deployed_by?: string | null
          entity_id?: string | null
          id?: string
          outcome?: string | null
          response_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "genesis_response_log_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "genesis_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      genesis_threat_reports: {
        Row: {
          entity_id: string | null
          evidence_links: string[]
          id: string
          is_live: boolean
          report_generated_at: string | null
          sentiment_score: number | null
          threat_level: string | null
          threat_summary: string
        }
        Insert: {
          entity_id?: string | null
          evidence_links: string[]
          id?: string
          is_live?: boolean
          report_generated_at?: string | null
          sentiment_score?: number | null
          threat_level?: string | null
          threat_summary: string
        }
        Update: {
          entity_id?: string | null
          evidence_links?: string[]
          id?: string
          is_live?: boolean
          report_generated_at?: string | null
          sentiment_score?: number | null
          threat_level?: string | null
          threat_summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "genesis_threat_reports_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "genesis_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      graveyard_legacy_posts: {
        Row: {
          content_snippet: string | null
          created_at: string
          id: string
          is_active: boolean
          platform: string
          rank_score: number
          suppression_status: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          content_snippet?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          platform: string
          rank_score?: number
          suppression_status?: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          content_snippet?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          platform?: string
          rank_score?: number
          suppression_status?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      graveyard_simulations: {
        Row: {
          completed_at: string | null
          expected_trigger_module: string | null
          id: string
          injected_at: string | null
          leak_title: string | null
          suppression_status: string | null
          synthetic_link: string | null
        }
        Insert: {
          completed_at?: string | null
          expected_trigger_module?: string | null
          id?: string
          injected_at?: string | null
          leak_title?: string | null
          suppression_status?: string | null
          synthetic_link?: string | null
        }
        Update: {
          completed_at?: string | null
          expected_trigger_module?: string | null
          id?: string
          injected_at?: string | null
          leak_title?: string | null
          suppression_status?: string | null
          synthetic_link?: string | null
        }
        Relationships: []
      }
      gsc_rank_tracking: {
        Row: {
          clicks: number | null
          ctr: number | null
          id: string
          impressions: number | null
          position: number | null
          recorded_at: string | null
          suppression_asset_id: string | null
        }
        Insert: {
          clicks?: number | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          position?: number | null
          recorded_at?: string | null
          suppression_asset_id?: string | null
        }
        Update: {
          clicks?: number | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          position?: number | null
          recorded_at?: string | null
          suppression_asset_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gsc_rank_tracking_suppression_asset_id_fkey"
            columns: ["suppression_asset_id"]
            isOneToOne: false
            referencedRelation: "suppression_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      hardening_event_log: {
        Row: {
          action_taken: string | null
          executed_at: string | null
          id: string
          outcome_summary: string | null
          rule_id: string | null
          success: boolean | null
        }
        Insert: {
          action_taken?: string | null
          executed_at?: string | null
          id?: string
          outcome_summary?: string | null
          rule_id?: string | null
          success?: boolean | null
        }
        Update: {
          action_taken?: string | null
          executed_at?: string | null
          id?: string
          outcome_summary?: string | null
          rule_id?: string | null
          success?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "hardening_event_log_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "infrastructure_hardening_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_challenges: {
        Row: {
          challenge_result: string | null
          entity_id: string | null
          id: string
          incoming_reference: string
          received_at: string | null
          reviewed: boolean | null
          threat_level: string | null
          trust_score: number | null
        }
        Insert: {
          challenge_result?: string | null
          entity_id?: string | null
          id?: string
          incoming_reference: string
          received_at?: string | null
          reviewed?: boolean | null
          threat_level?: string | null
          trust_score?: number | null
        }
        Update: {
          challenge_result?: string | null
          entity_id?: string | null
          id?: string
          incoming_reference?: string
          received_at?: string | null
          reviewed?: boolean | null
          threat_level?: string | null
          trust_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "identity_challenges_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      indexing_footprint: {
        Row: {
          asset_title: string | null
          asset_type: string | null
          asset_url: string | null
          client_id: string | null
          competition_level: string | null
          created_at: string | null
          domain_authority: number | null
          freshness_score: number | null
          id: string
          index_rank: number | null
          keyword: string
          last_crawled: string | null
          page_authority: number | null
          search_volume: number | null
          target_rank: number | null
          updated_at: string | null
          visibility_score: number | null
        }
        Insert: {
          asset_title?: string | null
          asset_type?: string | null
          asset_url?: string | null
          client_id?: string | null
          competition_level?: string | null
          created_at?: string | null
          domain_authority?: number | null
          freshness_score?: number | null
          id?: string
          index_rank?: number | null
          keyword: string
          last_crawled?: string | null
          page_authority?: number | null
          search_volume?: number | null
          target_rank?: number | null
          updated_at?: string | null
          visibility_score?: number | null
        }
        Update: {
          asset_title?: string | null
          asset_type?: string | null
          asset_url?: string | null
          client_id?: string | null
          competition_level?: string | null
          created_at?: string | null
          domain_authority?: number | null
          freshness_score?: number | null
          id?: string
          index_rank?: number | null
          keyword?: string
          last_crawled?: string | null
          page_authority?: number | null
          search_volume?: number | null
          target_rank?: number | null
          updated_at?: string | null
          visibility_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "indexing_footprint_client_id_fkey"
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
      infrastructure_hardening_rules: {
        Row: {
          action: string | null
          applied: boolean | null
          condition: string | null
          evaluated_at: string | null
          id: string
          rule_name: string
          system_trigger: string | null
        }
        Insert: {
          action?: string | null
          applied?: boolean | null
          condition?: string | null
          evaluated_at?: string | null
          id?: string
          rule_name: string
          system_trigger?: string | null
        }
        Update: {
          action?: string | null
          applied?: boolean | null
          condition?: string | null
          evaluated_at?: string | null
          id?: string
          rule_name?: string
          system_trigger?: string | null
        }
        Relationships: []
      }
      internal_behavior_signals: {
        Row: {
          captured_at: string | null
          entity_name: string | null
          id: string
          metadata: Json | null
          notes: string | null
          severity: number | null
          signal_type: string | null
          signal_value: string | null
          source: string | null
        }
        Insert: {
          captured_at?: string | null
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          severity?: number | null
          signal_type?: string | null
          signal_value?: string | null
          source?: string | null
        }
        Update: {
          captured_at?: string | null
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          severity?: number | null
          signal_type?: string | null
          signal_value?: string | null
          source?: string | null
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
      legal_escalation_queue: {
        Row: {
          auto_generated: boolean | null
          created_at: string | null
          delivery_status: string | null
          dispatched_at: string | null
          entity_id: string | null
          id: string
          jurisdiction: string | null
          law_firm_contact: string | null
          packet_payload: Json | null
          violation_type: string | null
        }
        Insert: {
          auto_generated?: boolean | null
          created_at?: string | null
          delivery_status?: string | null
          dispatched_at?: string | null
          entity_id?: string | null
          id?: string
          jurisdiction?: string | null
          law_firm_contact?: string | null
          packet_payload?: Json | null
          violation_type?: string | null
        }
        Update: {
          auto_generated?: boolean | null
          created_at?: string | null
          delivery_status?: string | null
          dispatched_at?: string | null
          entity_id?: string | null
          id?: string
          jurisdiction?: string | null
          law_firm_contact?: string | null
          packet_payload?: Json | null
          violation_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_escalation_queue_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_indicators: {
        Row: {
          context_excerpt: string | null
          detected_keywords: string[] | null
          discovered_at: string | null
          entity_name: string | null
          id: string
          platform: string | null
          risk_level: string | null
        }
        Insert: {
          context_excerpt?: string | null
          detected_keywords?: string[] | null
          discovered_at?: string | null
          entity_name?: string | null
          id?: string
          platform?: string | null
          risk_level?: string | null
        }
        Update: {
          context_excerpt?: string | null
          detected_keywords?: string[] | null
          discovered_at?: string | null
          entity_name?: string | null
          id?: string
          platform?: string | null
          risk_level?: string | null
        }
        Relationships: []
      }
      legal_violations: {
        Row: {
          dsr_packet: Json | null
          entity_id: string | null
          id: string
          jurisdiction: string | null
          reported_at: string | null
          status: string | null
          threat_id: string | null
          violation_notes: string | null
          violation_type: string | null
        }
        Insert: {
          dsr_packet?: Json | null
          entity_id?: string | null
          id?: string
          jurisdiction?: string | null
          reported_at?: string | null
          status?: string | null
          threat_id?: string | null
          violation_notes?: string | null
          violation_type?: string | null
        }
        Update: {
          dsr_packet?: Json | null
          entity_id?: string | null
          id?: string
          jurisdiction?: string | null
          reported_at?: string | null
          status?: string | null
          threat_id?: string | null
          violation_notes?: string | null
          violation_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_violations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      lia_records: {
        Row: {
          assessment_date: string
          assessment_outcome: string
          assessor_name: string
          balancing_test: string
          created_at: string | null
          data_sources: string[]
          data_subject_impact: string
          data_types: string[]
          id: string
          legitimate_interest: string
          mitigation_measures: string
          necessity_test: string
          opt_out_mechanism: string
          processing_methods: string
          purpose_description: string
          retention_justification: string
          review_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_date: string
          assessment_outcome: string
          assessor_name: string
          balancing_test: string
          created_at?: string | null
          data_sources: string[]
          data_subject_impact: string
          data_types: string[]
          id?: string
          legitimate_interest: string
          mitigation_measures: string
          necessity_test: string
          opt_out_mechanism: string
          processing_methods: string
          purpose_description: string
          retention_justification: string
          review_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string
          assessment_outcome?: string
          assessor_name?: string
          balancing_test?: string
          created_at?: string | null
          data_sources?: string[]
          data_subject_impact?: string
          data_types?: string[]
          id?: string
          legitimate_interest?: string
          mitigation_measures?: string
          necessity_test?: string
          opt_out_mechanism?: string
          processing_methods?: string
          purpose_description?: string
          retention_justification?: string
          review_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      link_validation_log: {
        Row: {
          article_id: string | null
          error_details: string | null
          http_status: number | null
          id: string
          indexing_source: string | null
          is_indexed: boolean | null
          response_time_ms: number | null
          validation_timestamp: string | null
          validation_url: string
        }
        Insert: {
          article_id?: string | null
          error_details?: string | null
          http_status?: number | null
          id?: string
          indexing_source?: string | null
          is_indexed?: boolean | null
          response_time_ms?: number | null
          validation_timestamp?: string | null
          validation_url: string
        }
        Update: {
          article_id?: string | null
          error_details?: string | null
          http_status?: number | null
          id?: string
          indexing_source?: string | null
          is_indexed?: boolean | null
          response_time_ms?: number | null
          validation_timestamp?: string | null
          validation_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_validation_log_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "deployed_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_status: {
        Row: {
          active_threats: number | null
          created_at: string | null
          id: string
          last_report: string | null
          last_threat_seen: string | null
          name: string
          system_status: string | null
          updated_at: string | null
        }
        Insert: {
          active_threats?: number | null
          created_at?: string | null
          id?: string
          last_report?: string | null
          last_threat_seen?: string | null
          name: string
          system_status?: string | null
          updated_at?: string | null
        }
        Update: {
          active_threats?: number | null
          created_at?: string | null
          id?: string
          last_report?: string | null
          last_threat_seen?: string | null
          name?: string
          system_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      llm_memory_audit: {
        Row: {
          audit_timestamp: string | null
          bias_score: number | null
          entity_name: string
          id: string
          model_name: string | null
          model_version: string | null
          query: string | null
          reference_detected: boolean | null
          response_excerpt: string | null
        }
        Insert: {
          audit_timestamp?: string | null
          bias_score?: number | null
          entity_name: string
          id?: string
          model_name?: string | null
          model_version?: string | null
          query?: string | null
          reference_detected?: boolean | null
          response_excerpt?: string | null
        }
        Update: {
          audit_timestamp?: string | null
          bias_score?: number | null
          entity_name?: string
          id?: string
          model_name?: string | null
          model_version?: string | null
          query?: string | null
          reference_detected?: boolean | null
          response_excerpt?: string | null
        }
        Relationships: []
      }
      llm_threat_monitor: {
        Row: {
          captured_prompt: string | null
          captured_response: string | null
          entity_name: string
          id: string
          mention_type: string | null
          model_detected: string | null
          recorded_at: string | null
          vector_score: number | null
        }
        Insert: {
          captured_prompt?: string | null
          captured_response?: string | null
          entity_name: string
          id?: string
          mention_type?: string | null
          model_detected?: string | null
          recorded_at?: string | null
          vector_score?: number | null
        }
        Update: {
          captured_prompt?: string | null
          captured_response?: string | null
          entity_name?: string
          id?: string
          mention_type?: string | null
          model_detected?: string | null
          recorded_at?: string | null
          vector_score?: number | null
        }
        Relationships: []
      }
      llm_watchdog_logs: {
        Row: {
          contains_bias: boolean | null
          entity_id: string | null
          hallucination_detected: boolean | null
          id: string
          llm_model: string | null
          perception_summary: string | null
          threat_level: string | null
          timestamp: string | null
        }
        Insert: {
          contains_bias?: boolean | null
          entity_id?: string | null
          hallucination_detected?: boolean | null
          id?: string
          llm_model?: string | null
          perception_summary?: string | null
          threat_level?: string | null
          timestamp?: string | null
        }
        Update: {
          contains_bias?: boolean | null
          entity_id?: string | null
          hallucination_detected?: boolean | null
          id?: string
          llm_model?: string | null
          perception_summary?: string | null
          threat_level?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "llm_watchdog_logs_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      luminoscore_audience_breakdown: {
        Row: {
          demographic_segment: string
          engagement_rate: number | null
          entity_name: string
          id: string
          influence_factor: number | null
          measured_at: string | null
          platform: string
          reach_count: number | null
        }
        Insert: {
          demographic_segment: string
          engagement_rate?: number | null
          entity_name: string
          id?: string
          influence_factor?: number | null
          measured_at?: string | null
          platform: string
          reach_count?: number | null
        }
        Update: {
          demographic_segment?: string
          engagement_rate?: number | null
          entity_name?: string
          id?: string
          influence_factor?: number | null
          measured_at?: string | null
          platform?: string
          reach_count?: number | null
        }
        Relationships: []
      }
      luminoscore_impact_metrics: {
        Row: {
          audience_reach: number | null
          calculated_at: string | null
          entity_name: string
          exposure_score: number | null
          id: string
          influence_rating: number | null
          mention_count: number | null
          sentiment_average: number | null
          source: string
        }
        Insert: {
          audience_reach?: number | null
          calculated_at?: string | null
          entity_name: string
          exposure_score?: number | null
          id?: string
          influence_rating?: number | null
          mention_count?: number | null
          sentiment_average?: number | null
          source: string
        }
        Update: {
          audience_reach?: number | null
          calculated_at?: string | null
          entity_name?: string
          exposure_score?: number | null
          id?: string
          influence_rating?: number | null
          mention_count?: number | null
          sentiment_average?: number | null
          source?: string
        }
        Relationships: []
      }
      luminoscore_trend_analysis: {
        Row: {
          analyzed_at: string | null
          entity_name: string
          exposure_change: number | null
          id: string
          influence_change: number | null
          sentiment_shift: number | null
          trend_direction: string | null
          trend_period: string
        }
        Insert: {
          analyzed_at?: string | null
          entity_name: string
          exposure_change?: number | null
          id?: string
          influence_change?: number | null
          sentiment_shift?: number | null
          trend_direction?: string | null
          trend_period: string
        }
        Update: {
          analyzed_at?: string | null
          entity_name?: string
          exposure_change?: number | null
          id?: string
          influence_change?: number | null
          sentiment_shift?: number | null
          trend_direction?: string | null
          trend_period?: string
        }
        Relationships: []
      }
      memory_decay_profiles: {
        Row: {
          action_status: string | null
          created_at: string | null
          decay_trigger: string | null
          emotional_charge: string | null
          footprint_id: string | null
          id: string
          legal_outcome: string | null
          recommended_action: string | null
          relevancy_score: number | null
          scheduled_for: string | null
          social_velocity: number | null
          updated_at: string | null
        }
        Insert: {
          action_status?: string | null
          created_at?: string | null
          decay_trigger?: string | null
          emotional_charge?: string | null
          footprint_id?: string | null
          id?: string
          legal_outcome?: string | null
          recommended_action?: string | null
          relevancy_score?: number | null
          scheduled_for?: string | null
          social_velocity?: number | null
          updated_at?: string | null
        }
        Update: {
          action_status?: string | null
          created_at?: string | null
          decay_trigger?: string | null
          emotional_charge?: string | null
          footprint_id?: string | null
          id?: string
          legal_outcome?: string | null
          recommended_action?: string | null
          relevancy_score?: number | null
          scheduled_for?: string | null
          social_velocity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_decay_profiles_footprint_id_fkey"
            columns: ["footprint_id"]
            isOneToOne: false
            referencedRelation: "memory_footprints"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_footprints: {
        Row: {
          ai_memory_tags: string[] | null
          client_id: string | null
          content_url: string
          created_at: string | null
          decay_score: number | null
          discovered_at: string | null
          first_seen: string | null
          id: string
          is_active: boolean | null
          last_seen: string | null
          memory_context: string | null
          memory_type: string | null
          updated_at: string | null
        }
        Insert: {
          ai_memory_tags?: string[] | null
          client_id?: string | null
          content_url: string
          created_at?: string | null
          decay_score?: number | null
          discovered_at?: string | null
          first_seen?: string | null
          id?: string
          is_active?: boolean | null
          last_seen?: string | null
          memory_context?: string | null
          memory_type?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_memory_tags?: string[] | null
          client_id?: string | null
          content_url?: string
          created_at?: string | null
          decay_score?: number | null
          discovered_at?: string | null
          first_seen?: string | null
          id?: string
          is_active?: boolean | null
          last_seen?: string | null
          memory_context?: string | null
          memory_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_footprints_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_recalibrators: {
        Row: {
          asset_url: string | null
          content_excerpt: string | null
          created_at: string | null
          created_by: string | null
          deployed_at: string | null
          effectiveness_score: number | null
          footprint_id: string | null
          full_text: string | null
          id: string
          is_deployed: boolean | null
          recalibration_type: string | null
          updated_at: string | null
        }
        Insert: {
          asset_url?: string | null
          content_excerpt?: string | null
          created_at?: string | null
          created_by?: string | null
          deployed_at?: string | null
          effectiveness_score?: number | null
          footprint_id?: string | null
          full_text?: string | null
          id?: string
          is_deployed?: boolean | null
          recalibration_type?: string | null
          updated_at?: string | null
        }
        Update: {
          asset_url?: string | null
          content_excerpt?: string | null
          created_at?: string | null
          created_by?: string | null
          deployed_at?: string | null
          effectiveness_score?: number | null
          footprint_id?: string | null
          full_text?: string | null
          id?: string
          is_deployed?: boolean | null
          recalibration_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_recalibrators_footprint_id_fkey"
            columns: ["footprint_id"]
            isOneToOne: false
            referencedRelation: "memory_footprints"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_chain_log: {
        Row: {
          action: string
          entity: string
          executed_at: string | null
          id: number
          log_details: string | null
          module: string | null
          status: string | null
          step_number: number
          triggered_by: string | null
        }
        Insert: {
          action: string
          entity: string
          executed_at?: string | null
          id?: number
          log_details?: string | null
          module?: string | null
          status?: string | null
          step_number: number
          triggered_by?: string | null
        }
        Update: {
          action?: string
          entity?: string
          executed_at?: string | null
          id?: number
          log_details?: string | null
          module?: string | null
          status?: string | null
          step_number?: number
          triggered_by?: string | null
        }
        Relationships: []
      }
      model_bias_profile: {
        Row: {
          bias_level: number | null
          created_at: string | null
          entity_name: string
          factual_accuracy_score: number | null
          id: string
          last_verified: string | null
          memory_extracted: boolean | null
          model: string | null
          notes: string | null
          tone: string | null
        }
        Insert: {
          bias_level?: number | null
          created_at?: string | null
          entity_name: string
          factual_accuracy_score?: number | null
          id?: string
          last_verified?: string | null
          memory_extracted?: boolean | null
          model?: string | null
          notes?: string | null
          tone?: string | null
        }
        Update: {
          bias_level?: number | null
          created_at?: string | null
          entity_name?: string
          factual_accuracy_score?: number | null
          id?: string
          last_verified?: string | null
          memory_extracted?: boolean | null
          model?: string | null
          notes?: string | null
          tone?: string | null
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
      monitoring_schedules: {
        Row: {
          auto_response_enabled: boolean | null
          client_id: string | null
          crawl_interval: unknown | null
          created_at: string | null
          entity_name: string
          id: string
          is_active: boolean | null
          last_crawl: string | null
          next_crawl: string | null
        }
        Insert: {
          auto_response_enabled?: boolean | null
          client_id?: string | null
          crawl_interval?: unknown | null
          created_at?: string | null
          entity_name: string
          id?: string
          is_active?: boolean | null
          last_crawl?: string | null
          next_crawl?: string | null
        }
        Update: {
          auto_response_enabled?: boolean | null
          client_id?: string | null
          crawl_interval?: unknown | null
          created_at?: string | null
          entity_name?: string
          id?: string
          is_active?: boolean | null
          last_crawl?: string | null
          next_crawl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monitoring_schedules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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
      multilingual_threats: {
        Row: {
          detected_at: string | null
          entity_id: string | null
          id: string
          language_code: string
          original_text: string
          processed: boolean | null
          translated_text: string | null
        }
        Insert: {
          detected_at?: string | null
          entity_id?: string | null
          id?: string
          language_code: string
          original_text: string
          processed?: boolean | null
          translated_text?: string | null
        }
        Update: {
          detected_at?: string | null
          entity_id?: string | null
          id?: string
          language_code?: string
          original_text?: string
          processed?: boolean | null
          translated_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "multilingual_threats_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      narrative_clusters: {
        Row: {
          attack_surface_score: number | null
          created_at: string | null
          entity_name: string | null
          id: string
          intent_label: string | null
          narrative_snippet: string | null
          source_platform: string | null
        }
        Insert: {
          attack_surface_score?: number | null
          created_at?: string | null
          entity_name?: string | null
          id?: string
          intent_label?: string | null
          narrative_snippet?: string | null
          source_platform?: string | null
        }
        Update: {
          attack_surface_score?: number | null
          created_at?: string | null
          entity_name?: string | null
          id?: string
          intent_label?: string | null
          narrative_snippet?: string | null
          source_platform?: string | null
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
      negative_seo_maps: {
        Row: {
          authority_mapping: Json
          average_authority_score: number | null
          client_id: string | null
          entity_name: string
          generated_at: string | null
          id: string
          keyword_graph: Json
          sentiment_drivers: Json
          total_negative_mentions: number | null
          updated_at: string | null
        }
        Insert: {
          authority_mapping?: Json
          average_authority_score?: number | null
          client_id?: string | null
          entity_name: string
          generated_at?: string | null
          id?: string
          keyword_graph?: Json
          sentiment_drivers?: Json
          total_negative_mentions?: number | null
          updated_at?: string | null
        }
        Update: {
          authority_mapping?: Json
          average_authority_score?: number | null
          client_id?: string | null
          entity_name?: string
          generated_at?: string | null
          id?: string
          keyword_graph?: Json
          sentiment_drivers?: Json
          total_negative_mentions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "negative_seo_maps_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      nexus_command_queue: {
        Row: {
          command: string
          created_at: string | null
          id: string
          issued_by: string | null
          parameters: Json | null
          status: string | null
          target_module: string
          updated_at: string | null
        }
        Insert: {
          command: string
          created_at?: string | null
          id?: string
          issued_by?: string | null
          parameters?: Json | null
          status?: string | null
          target_module: string
          updated_at?: string | null
        }
        Update: {
          command?: string
          created_at?: string | null
          id?: string
          issued_by?: string | null
          parameters?: Json | null
          status?: string | null
          target_module?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      nexus_communications: {
        Row: {
          agent_name: string
          context: Json | null
          id: string
          message: string
          mission_id: string | null
          timestamp: string | null
        }
        Insert: {
          agent_name: string
          context?: Json | null
          id?: string
          message: string
          mission_id?: string | null
          timestamp?: string | null
        }
        Update: {
          agent_name?: string
          context?: Json | null
          id?: string
          message?: string
          mission_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nexus_communications_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "nexus_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      nexus_missions: {
        Row: {
          agents_involved: string[] | null
          end_time: string | null
          id: string
          mission_name: string
          mission_status: string | null
          objective: string
          outcome: string | null
          start_time: string | null
        }
        Insert: {
          agents_involved?: string[] | null
          end_time?: string | null
          id?: string
          mission_name: string
          mission_status?: string | null
          objective: string
          outcome?: string | null
          start_time?: string | null
        }
        Update: {
          agents_involved?: string[] | null
          end_time?: string | null
          id?: string
          mission_name?: string
          mission_status?: string | null
          objective?: string
          outcome?: string | null
          start_time?: string | null
        }
        Relationships: []
      }
      offline_spill_events: {
        Row: {
          created_at: string | null
          entity_involved: string | null
          event_description: string | null
          first_online_mention: string | null
          id: string
          offline_date: string | null
          source_platform: string | null
          spill_severity: string | null
        }
        Insert: {
          created_at?: string | null
          entity_involved?: string | null
          event_description?: string | null
          first_online_mention?: string | null
          id?: string
          offline_date?: string | null
          source_platform?: string | null
          spill_severity?: string | null
        }
        Update: {
          created_at?: string | null
          entity_involved?: string | null
          event_description?: string | null
          first_online_mention?: string | null
          id?: string
          offline_date?: string | null
          source_platform?: string | null
          spill_severity?: string | null
        }
        Relationships: []
      }
      operator_command_log: {
        Row: {
          command_summary: string | null
          command_text: string
          created_at: string | null
          id: string
          intent: string | null
          priority: string | null
          response_type: string | null
          target: string | null
          user_id: string | null
        }
        Insert: {
          command_summary?: string | null
          command_text: string
          created_at?: string | null
          id?: string
          intent?: string | null
          priority?: string | null
          response_type?: string | null
          target?: string | null
          user_id?: string | null
        }
        Update: {
          command_summary?: string | null
          command_text?: string
          created_at?: string | null
          id?: string
          intent?: string | null
          priority?: string | null
          response_type?: string | null
          target?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      operator_response_log: {
        Row: {
          command_id: string | null
          created_at: string | null
          id: string
          processed_by: string | null
          response_text: string
        }
        Insert: {
          command_id?: string | null
          created_at?: string | null
          id?: string
          processed_by?: string | null
          response_text: string
        }
        Update: {
          command_id?: string | null
          created_at?: string | null
          id?: string
          processed_by?: string | null
          response_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_response_log_command_id_fkey"
            columns: ["command_id"]
            isOneToOne: false
            referencedRelation: "operator_command_log"
            referencedColumns: ["id"]
          },
        ]
      }
      panoptica_sensor_events: {
        Row: {
          correlated_threat: string | null
          created_at: string | null
          detected_at: string | null
          event_content: string
          id: string
          relevance_score: number | null
          risk_level: string | null
          source_detail: string | null
          source_type: string
          verified: boolean | null
        }
        Insert: {
          correlated_threat?: string | null
          created_at?: string | null
          detected_at?: string | null
          event_content: string
          id?: string
          relevance_score?: number | null
          risk_level?: string | null
          source_detail?: string | null
          source_type: string
          verified?: boolean | null
        }
        Update: {
          correlated_threat?: string | null
          created_at?: string | null
          detected_at?: string | null
          event_content?: string
          id?: string
          relevance_score?: number | null
          risk_level?: string | null
          source_detail?: string | null
          source_type?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "panoptica_sensor_events_correlated_threat_fkey"
            columns: ["correlated_threat"]
            isOneToOne: false
            referencedRelation: "threats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "panoptica_sensor_events_correlated_threat_fkey"
            columns: ["correlated_threat"]
            isOneToOne: false
            referencedRelation: "verified_live_threats"
            referencedColumns: ["id"]
          },
        ]
      }
      panoptica_system_health: {
        Row: {
          diagnostic: string | null
          id: string
          last_sync: string | null
          sensor_name: string
          sync_status: string | null
        }
        Insert: {
          diagnostic?: string | null
          id?: string
          last_sync?: string | null
          sensor_name: string
          sync_status?: string | null
        }
        Update: {
          diagnostic?: string | null
          id?: string
          last_sync?: string | null
          sensor_name?: string
          sync_status?: string | null
        }
        Relationships: []
      }
      perimetrix_blacklisted_ips: {
        Row: {
          active: boolean | null
          added_at: string | null
          ip_address: string
          reason: string | null
          severity: string | null
        }
        Insert: {
          active?: boolean | null
          added_at?: string | null
          ip_address: string
          reason?: string | null
          severity?: string | null
        }
        Update: {
          active?: boolean | null
          added_at?: string | null
          ip_address?: string
          reason?: string | null
          severity?: string | null
        }
        Relationships: []
      }
      perimetrix_ip_geolocation: {
        Row: {
          city: string | null
          country: string | null
          ip_address: string
          last_updated: string | null
          latitude: number | null
          longitude: number | null
          region: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          ip_address: string
          last_updated?: string | null
          latitude?: number | null
          longitude?: number | null
          region?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          ip_address?: string
          last_updated?: string | null
          latitude?: number | null
          longitude?: number | null
          region?: string | null
        }
        Relationships: []
      }
      perimetrix_ip_request_log: {
        Row: {
          detected_threat: boolean | null
          endpoint_accessed: string | null
          id: string
          ip_address: string
          notes: string | null
          request_time: string | null
          status_code: number | null
          user_agent: string | null
        }
        Insert: {
          detected_threat?: boolean | null
          endpoint_accessed?: string | null
          id?: string
          ip_address: string
          notes?: string | null
          request_time?: string | null
          status_code?: number | null
          user_agent?: string | null
        }
        Update: {
          detected_threat?: boolean | null
          endpoint_accessed?: string | null
          id?: string
          ip_address?: string
          notes?: string | null
          request_time?: string | null
          status_code?: number | null
          user_agent?: string | null
        }
        Relationships: []
      }
      persona_deployments: {
        Row: {
          article_slug: string
          created_at: string | null
          deployed_at: string | null
          deployment_type: string | null
          entity_name: string | null
          id: string
          live_url: string
          platform: string
          success: boolean | null
          updated_at: string | null
        }
        Insert: {
          article_slug: string
          created_at?: string | null
          deployed_at?: string | null
          deployment_type?: string | null
          entity_name?: string | null
          id?: string
          live_url: string
          platform: string
          success?: boolean | null
          updated_at?: string | null
        }
        Update: {
          article_slug?: string
          created_at?: string | null
          deployed_at?: string | null
          deployment_type?: string | null
          entity_name?: string | null
          id?: string
          live_url?: string
          platform?: string
          success?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      persona_saturation_campaigns: {
        Row: {
          campaign_data: Json
          created_at: string
          deployment_targets: string[] | null
          entity_name: string
          id: string
          saturation_mode: string | null
          updated_at: string
        }
        Insert: {
          campaign_data?: Json
          created_at?: string
          deployment_targets?: string[] | null
          entity_name: string
          id?: string
          saturation_mode?: string | null
          updated_at?: string
        }
        Update: {
          campaign_data?: Json
          created_at?: string
          deployment_targets?: string[] | null
          entity_name?: string
          id?: string
          saturation_mode?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      praxis_crisis_simulations: {
        Row: {
          archetype_id: string | null
          created_at: string | null
          effectiveness_score: number | null
          entity_name: string | null
          id: string
          notes: string | null
          outcome_projection: string | null
          rsi_simulation_id: string | null
          simulated_narrative: string | null
          simulation_status: string | null
          triggered_by: string | null
        }
        Insert: {
          archetype_id?: string | null
          created_at?: string | null
          effectiveness_score?: number | null
          entity_name?: string | null
          id?: string
          notes?: string | null
          outcome_projection?: string | null
          rsi_simulation_id?: string | null
          simulated_narrative?: string | null
          simulation_status?: string | null
          triggered_by?: string | null
        }
        Update: {
          archetype_id?: string | null
          created_at?: string | null
          effectiveness_score?: number | null
          entity_name?: string | null
          id?: string
          notes?: string | null
          outcome_projection?: string | null
          rsi_simulation_id?: string | null
          simulated_narrative?: string | null
          simulation_status?: string | null
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "praxis_crisis_simulations_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "praxis_risk_archetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      praxis_risk_archetypes: {
        Row: {
          confidence_score: number | null
          drift_score: number | null
          entity_name: string | null
          forecast_type: string | null
          id: string
          last_updated: string | null
          likely_visibility: string | null
          mitigation_suggested: string | null
          predicted_window: string | null
          risk_level: string | null
          status: string | null
          supporting_signals: string[] | null
          triggered_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          drift_score?: number | null
          entity_name?: string | null
          forecast_type?: string | null
          id?: string
          last_updated?: string | null
          likely_visibility?: string | null
          mitigation_suggested?: string | null
          predicted_window?: string | null
          risk_level?: string | null
          status?: string | null
          supporting_signals?: string[] | null
          triggered_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          drift_score?: number | null
          entity_name?: string | null
          forecast_type?: string | null
          id?: string
          last_updated?: string | null
          likely_visibility?: string | null
          mitigation_suggested?: string | null
          predicted_window?: string | null
          risk_level?: string | null
          status?: string | null
          supporting_signals?: string[] | null
          triggered_at?: string | null
        }
        Relationships: []
      }
      praxis_signal_correlations: {
        Row: {
          correlation_strength: number | null
          created_at: string | null
          entity_name: string | null
          forecast_type: string | null
          historical_accuracy: number | null
          id: string
          signal_combination: string[] | null
        }
        Insert: {
          correlation_strength?: number | null
          created_at?: string | null
          entity_name?: string | null
          forecast_type?: string | null
          historical_accuracy?: number | null
          id?: string
          signal_combination?: string[] | null
        }
        Update: {
          correlation_strength?: number | null
          created_at?: string | null
          entity_name?: string | null
          forecast_type?: string | null
          historical_accuracy?: number | null
          id?: string
          signal_combination?: string[] | null
        }
        Relationships: []
      }
      privacy_notices: {
        Row: {
          approved_by: string | null
          contact_details: Json | null
          content: string
          created_at: string | null
          created_by: string | null
          data_controller_details: Json | null
          dpo_contact: Json | null
          effective_date: string
          expiry_date: string | null
          id: string
          is_active: boolean | null
          jurisdiction: string | null
          language: string | null
          notice_type: string
          target_audience: string
          title: string
          updated_at: string | null
          version: string
        }
        Insert: {
          approved_by?: string | null
          contact_details?: Json | null
          content: string
          created_at?: string | null
          created_by?: string | null
          data_controller_details?: Json | null
          dpo_contact?: Json | null
          effective_date: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction?: string | null
          language?: string | null
          notice_type: string
          target_audience: string
          title: string
          updated_at?: string | null
          version: string
        }
        Update: {
          approved_by?: string | null
          contact_details?: Json | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          data_controller_details?: Json | null
          dpo_contact?: Json | null
          effective_date?: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction?: string | null
          language?: string | null
          notice_type?: string
          target_audience?: string
          title?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      private_modules_registry: {
        Row: {
          classification: string | null
          declared_at: string | null
          id: string
          module_name: string
          owner: string
        }
        Insert: {
          classification?: string | null
          declared_at?: string | null
          id?: string
          module_name: string
          owner: string
        }
        Update: {
          classification?: string | null
          declared_at?: string | null
          id?: string
          module_name?: string
          owner?: string
        }
        Relationships: []
      }
      processing_activities: {
        Row: {
          accuracy_measures: string | null
          activity_name: string
          automated_decision_making: boolean | null
          consent_mechanisms: string | null
          controller_contact: Json
          controller_name: string
          created_at: string | null
          criminal_conviction_data: boolean | null
          data_minimization_measures: string | null
          data_sources: string[]
          data_subject_categories: string[]
          dpo_contact: Json | null
          id: string
          joint_controllers: Json | null
          last_updated: string | null
          legal_basis: string[]
          next_review_date: string | null
          personal_data_categories: string[]
          processing_purposes: string[]
          profiling_details: string | null
          recipients: string[] | null
          regular_review_date: string | null
          retention_periods: Json
          security_measures: string
          special_category_data: string[] | null
          status: string | null
          third_country_transfers: string[] | null
          transfer_safeguards: string | null
        }
        Insert: {
          accuracy_measures?: string | null
          activity_name: string
          automated_decision_making?: boolean | null
          consent_mechanisms?: string | null
          controller_contact: Json
          controller_name: string
          created_at?: string | null
          criminal_conviction_data?: boolean | null
          data_minimization_measures?: string | null
          data_sources: string[]
          data_subject_categories: string[]
          dpo_contact?: Json | null
          id?: string
          joint_controllers?: Json | null
          last_updated?: string | null
          legal_basis: string[]
          next_review_date?: string | null
          personal_data_categories: string[]
          processing_purposes: string[]
          profiling_details?: string | null
          recipients?: string[] | null
          regular_review_date?: string | null
          retention_periods: Json
          security_measures: string
          special_category_data?: string[] | null
          status?: string | null
          third_country_transfers?: string[] | null
          transfer_safeguards?: string | null
        }
        Update: {
          accuracy_measures?: string | null
          activity_name?: string
          automated_decision_making?: boolean | null
          consent_mechanisms?: string | null
          controller_contact?: Json
          controller_name?: string
          created_at?: string | null
          criminal_conviction_data?: boolean | null
          data_minimization_measures?: string | null
          data_sources?: string[]
          data_subject_categories?: string[]
          dpo_contact?: Json | null
          id?: string
          joint_controllers?: Json | null
          last_updated?: string | null
          legal_basis?: string[]
          next_review_date?: string | null
          personal_data_categories?: string[]
          processing_purposes?: string[]
          profiling_details?: string | null
          recipients?: string[] | null
          regular_review_date?: string | null
          retention_periods?: Json
          security_measures?: string
          special_category_data?: string[] | null
          status?: string | null
          third_country_transfers?: string[] | null
          transfer_safeguards?: string | null
        }
        Relationships: []
      }
      prophetic_forecasts: {
        Row: {
          confidence_score: number | null
          entity_name: string | null
          forecast_timestamp: string | null
          id: string
          model_used: string | null
          notes: string | null
          predicted_threat_type: string | null
          predicted_vector: string | null
          risk_window_end: string | null
          risk_window_start: string | null
        }
        Insert: {
          confidence_score?: number | null
          entity_name?: string | null
          forecast_timestamp?: string | null
          id?: string
          model_used?: string | null
          notes?: string | null
          predicted_threat_type?: string | null
          predicted_vector?: string | null
          risk_window_end?: string | null
          risk_window_start?: string | null
        }
        Update: {
          confidence_score?: number | null
          entity_name?: string | null
          forecast_timestamp?: string | null
          id?: string
          model_used?: string | null
          notes?: string | null
          predicted_threat_type?: string | null
          predicted_vector?: string | null
          risk_window_end?: string | null
          risk_window_start?: string | null
        }
        Relationships: []
      }
      prophetic_influences: {
        Row: {
          forecast_id: string | null
          id: string
          influence_source: string | null
          reason: string | null
          weight: number | null
        }
        Insert: {
          forecast_id?: string | null
          id?: string
          influence_source?: string | null
          reason?: string | null
          weight?: number | null
        }
        Update: {
          forecast_id?: string | null
          id?: string
          influence_source?: string | null
          reason?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prophetic_influences_forecast_id_fkey"
            columns: ["forecast_id"]
            isOneToOne: false
            referencedRelation: "prophetic_forecasts"
            referencedColumns: ["id"]
          },
        ]
      }
      prophetic_validations: {
        Row: {
          forecast_id: string | null
          id: string
          outcome: string | null
          reviewer: string | null
          validated_at: string | null
          validation_notes: string | null
        }
        Insert: {
          forecast_id?: string | null
          id?: string
          outcome?: string | null
          reviewer?: string | null
          validated_at?: string | null
          validation_notes?: string | null
        }
        Update: {
          forecast_id?: string | null
          id?: string
          outcome?: string | null
          reviewer?: string | null
          validated_at?: string | null
          validation_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prophetic_validations_forecast_id_fkey"
            columns: ["forecast_id"]
            isOneToOne: false
            referencedRelation: "prophetic_forecasts"
            referencedColumns: ["id"]
          },
        ]
      }
      prospect_alerts: {
        Row: {
          alert_type: string | null
          created_at: string | null
          entity: string
          id: string
          message: string | null
          severity: string | null
          source_module: string | null
          status: string | null
        }
        Insert: {
          alert_type?: string | null
          created_at?: string | null
          entity: string
          id?: string
          message?: string | null
          severity?: string | null
          source_module?: string | null
          status?: string | null
        }
        Update: {
          alert_type?: string | null
          created_at?: string | null
          entity?: string
          id?: string
          message?: string | null
          severity?: string | null
          source_module?: string | null
          status?: string | null
        }
        Relationships: []
      }
      prospect_entities: {
        Row: {
          average_sentiment: number | null
          competitive_threats: string[] | null
          contact_channels: string[] | null
          contact_potential: string | null
          context_summary: string | null
          created_at: string | null
          crisis_indicators: string[] | null
          decision_maker_mentions: string[] | null
          entity_name: string
          entity_type: string
          estimated_company_size: string | null
          estimated_revenue: string | null
          first_mention_source: string
          growth_indicators: string[] | null
          id: string
          industry_category: string | null
          last_updated: string | null
          media_visibility_trend: string | null
          potential_ad_spend: string | null
          potential_reach: number | null
          reputation_risk_level: string | null
          sales_opportunity_score: number | null
          total_mentions: number
          urgency_score: number | null
          visibility_score: number | null
        }
        Insert: {
          average_sentiment?: number | null
          competitive_threats?: string[] | null
          contact_channels?: string[] | null
          contact_potential?: string | null
          context_summary?: string | null
          created_at?: string | null
          crisis_indicators?: string[] | null
          decision_maker_mentions?: string[] | null
          entity_name: string
          entity_type: string
          estimated_company_size?: string | null
          estimated_revenue?: string | null
          first_mention_source: string
          growth_indicators?: string[] | null
          id?: string
          industry_category?: string | null
          last_updated?: string | null
          media_visibility_trend?: string | null
          potential_ad_spend?: string | null
          potential_reach?: number | null
          reputation_risk_level?: string | null
          sales_opportunity_score?: number | null
          total_mentions?: number
          urgency_score?: number | null
          visibility_score?: number | null
        }
        Update: {
          average_sentiment?: number | null
          competitive_threats?: string[] | null
          contact_channels?: string[] | null
          contact_potential?: string | null
          context_summary?: string | null
          created_at?: string | null
          crisis_indicators?: string[] | null
          decision_maker_mentions?: string[] | null
          entity_name?: string
          entity_type?: string
          estimated_company_size?: string | null
          estimated_revenue?: string | null
          first_mention_source?: string
          growth_indicators?: string[] | null
          id?: string
          industry_category?: string | null
          last_updated?: string | null
          media_visibility_trend?: string | null
          potential_ad_spend?: string | null
          potential_reach?: number | null
          reputation_risk_level?: string | null
          sales_opportunity_score?: number | null
          total_mentions?: number
          urgency_score?: number | null
          visibility_score?: number | null
        }
        Relationships: []
      }
      report_exports: {
        Row: {
          created_at: string | null
          error_message: string | null
          export_type: string | null
          id: string
          recipient: string | null
          report_id: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          export_type?: string | null
          id?: string
          recipient?: string | null
          report_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          export_type?: string | null
          id?: string
          recipient?: string | null
          report_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_exports_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "aria_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          content: Json | null
          entity_id: string | null
          generated_at: string | null
          id: string
          is_live: boolean | null
          report_type: string
          risk_rating: string | null
        }
        Insert: {
          content?: Json | null
          entity_id?: string | null
          generated_at?: string | null
          id?: string
          is_live?: boolean | null
          report_type: string
          risk_rating?: string | null
        }
        Update: {
          content?: Json | null
          entity_id?: string | null
          generated_at?: string | null
          id?: string
          is_live?: boolean | null
          report_type?: string
          risk_rating?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      reputation_counters: {
        Row: {
          content_type: string | null
          counter_content: string
          counter_title: string
          created_at: string | null
          created_by: string | null
          id: string
          is_published: boolean | null
          performance_metrics: Json | null
          priority_score: number | null
          publish_targets: string[] | null
          published_at: string | null
          seo_keywords: string[] | null
          target_audience: string | null
          threat_id: string | null
          tone: string | null
          updated_at: string | null
        }
        Insert: {
          content_type?: string | null
          counter_content: string
          counter_title: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          performance_metrics?: Json | null
          priority_score?: number | null
          publish_targets?: string[] | null
          published_at?: string | null
          seo_keywords?: string[] | null
          target_audience?: string | null
          threat_id?: string | null
          tone?: string | null
          updated_at?: string | null
        }
        Update: {
          content_type?: string | null
          counter_content?: string
          counter_title?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          performance_metrics?: Json | null
          priority_score?: number | null
          publish_targets?: string[] | null
          published_at?: string | null
          seo_keywords?: string[] | null
          target_audience?: string | null
          threat_id?: string | null
          tone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reputation_counters_threat_id_fkey"
            columns: ["threat_id"]
            isOneToOne: false
            referencedRelation: "threat_simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      reputation_forecasts: {
        Row: {
          created_at: string | null
          entity_name: string
          forecast_window: string | null
          id: string
          projected_impact: string | null
          sentiment_avg: number | null
          source_type: string | null
          trajectory: string | null
          velocity: number | null
        }
        Insert: {
          created_at?: string | null
          entity_name: string
          forecast_window?: string | null
          id?: string
          projected_impact?: string | null
          sentiment_avg?: number | null
          source_type?: string | null
          trajectory?: string | null
          velocity?: number | null
        }
        Update: {
          created_at?: string | null
          entity_name?: string
          forecast_window?: string | null
          id?: string
          projected_impact?: string | null
          sentiment_avg?: number | null
          source_type?: string | null
          trajectory?: string | null
          velocity?: number | null
        }
        Relationships: []
      }
      reputation_genome: {
        Row: {
          entity_id: string | null
          forecast_notes: string | null
          forecasted_risk: string | null
          id: string
          last_updated: string | null
          reputation_index: number | null
          simulation_data: Json | null
        }
        Insert: {
          entity_id?: string | null
          forecast_notes?: string | null
          forecasted_risk?: string | null
          id?: string
          last_updated?: string | null
          reputation_index?: number | null
          simulation_data?: Json | null
        }
        Update: {
          entity_id?: string | null
          forecast_notes?: string | null
          forecasted_risk?: string | null
          id?: string
          last_updated?: string | null
          reputation_index?: number | null
          simulation_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "reputation_genome_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
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
      resaturation_pushes: {
        Row: {
          admin_approved: boolean | null
          auto_generated: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          original_campaign_id: string | null
          push_volume: number
          status: string | null
          target_keywords: Json
          threat_detection_id: string | null
        }
        Insert: {
          admin_approved?: boolean | null
          auto_generated?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          original_campaign_id?: string | null
          push_volume: number
          status?: string | null
          target_keywords?: Json
          threat_detection_id?: string | null
        }
        Update: {
          admin_approved?: boolean | null
          auto_generated?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          original_campaign_id?: string | null
          push_volume?: number
          status?: string | null
          target_keywords?: Json
          threat_detection_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resaturation_pushes_original_campaign_id_fkey"
            columns: ["original_campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_effectiveness_dashboard"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "resaturation_pushes_original_campaign_id_fkey"
            columns: ["original_campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_roi_dashboard"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "resaturation_pushes_original_campaign_id_fkey"
            columns: ["original_campaign_id"]
            isOneToOne: false
            referencedRelation: "saturation_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resaturation_pushes_threat_detection_id_fkey"
            columns: ["threat_detection_id"]
            isOneToOne: false
            referencedRelation: "threat_detections"
            referencedColumns: ["id"]
          },
        ]
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
      response_execution_log: {
        Row: {
          case_id: string | null
          created_at: string | null
          effectiveness_score: number | null
          executed_by: string | null
          execution_details: Json | null
          execution_status: string | null
          execution_time_ms: number | null
          execution_type: string
          id: string
          response_plan_id: string | null
          success_metrics: Json | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          effectiveness_score?: number | null
          executed_by?: string | null
          execution_details?: Json | null
          execution_status?: string | null
          execution_time_ms?: number | null
          execution_type: string
          id?: string
          response_plan_id?: string | null
          success_metrics?: Json | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          effectiveness_score?: number | null
          executed_by?: string | null
          execution_details?: Json | null
          execution_status?: string | null
          execution_time_ms?: number | null
          execution_type?: string
          id?: string
          response_plan_id?: string | null
          success_metrics?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "response_execution_log_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "sentinel_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "response_execution_log_response_plan_id_fkey"
            columns: ["response_plan_id"]
            isOneToOne: false
            referencedRelation: "sentinel_response_plans"
            referencedColumns: ["id"]
          },
        ]
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
      rsi_activation_logs: {
        Row: {
          activation_status: string | null
          client_id: string | null
          completed_at: string | null
          effectiveness_score: number | null
          id: string
          matched_threat: string | null
          notes: string | null
          response_count: number | null
          threat_simulation_id: string | null
          trigger_type: string
          triggered_at: string | null
          triggered_by: string | null
        }
        Insert: {
          activation_status?: string | null
          client_id?: string | null
          completed_at?: string | null
          effectiveness_score?: number | null
          id?: string
          matched_threat?: string | null
          notes?: string | null
          response_count?: number | null
          threat_simulation_id?: string | null
          trigger_type: string
          triggered_at?: string | null
          triggered_by?: string | null
        }
        Update: {
          activation_status?: string | null
          client_id?: string | null
          completed_at?: string | null
          effectiveness_score?: number | null
          id?: string
          matched_threat?: string | null
          notes?: string | null
          response_count?: number | null
          threat_simulation_id?: string | null
          trigger_type?: string
          triggered_at?: string | null
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsi_activation_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsi_activation_logs_threat_simulation_id_fkey"
            columns: ["threat_simulation_id"]
            isOneToOne: false
            referencedRelation: "threat_simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      rsi_activation_queue: {
        Row: {
          id: string
          prospect_name: string | null
          queued_at: string | null
          source: string | null
          status: string | null
          threat_reason: string | null
        }
        Insert: {
          id?: string
          prospect_name?: string | null
          queued_at?: string | null
          source?: string | null
          status?: string | null
          threat_reason?: string | null
        }
        Update: {
          id?: string
          prospect_name?: string | null
          queued_at?: string | null
          source?: string | null
          status?: string | null
          threat_reason?: string | null
        }
        Relationships: []
      }
      rsi_campaigns: {
        Row: {
          budget_allocation: number | null
          campaign_description: string | null
          campaign_name: string
          client_id: string | null
          created_at: string | null
          created_by: string | null
          end_date: string | null
          forever_active: boolean | null
          id: string
          roi_score: number | null
          start_date: string | null
          status: string | null
          success_metrics: Json | null
          target_threats: string[] | null
          updated_at: string | null
        }
        Insert: {
          budget_allocation?: number | null
          campaign_description?: string | null
          campaign_name: string
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          forever_active?: boolean | null
          id?: string
          roi_score?: number | null
          start_date?: string | null
          status?: string | null
          success_metrics?: Json | null
          target_threats?: string[] | null
          updated_at?: string | null
        }
        Update: {
          budget_allocation?: number | null
          campaign_description?: string | null
          campaign_name?: string
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          forever_active?: boolean | null
          id?: string
          roi_score?: number | null
          start_date?: string | null
          status?: string | null
          success_metrics?: Json | null
          target_threats?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsi_campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      rsi_queue: {
        Row: {
          counter_message: string
          created_at: string | null
          entity_id: string | null
          id: string
          priority: string | null
          processed_at: string | null
          status: string | null
          threat_id: string | null
        }
        Insert: {
          counter_message: string
          created_at?: string | null
          entity_id?: string | null
          id?: string
          priority?: string | null
          processed_at?: string | null
          status?: string | null
          threat_id?: string | null
        }
        Update: {
          counter_message?: string
          created_at?: string | null
          entity_id?: string | null
          id?: string
          priority?: string | null
          processed_at?: string | null
          status?: string | null
          threat_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsi_queue_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      saturation_campaigns: {
        Row: {
          campaign_name: string
          client_id: string | null
          created_at: string | null
          custom_domains: Json | null
          deployment_platforms: Json
          entity_name: string
          id: string
          source_facts: Json | null
          status: string | null
          target_keywords: Json
          tone: string | null
          updated_at: string | null
          volume_tier: number | null
        }
        Insert: {
          campaign_name: string
          client_id?: string | null
          created_at?: string | null
          custom_domains?: Json | null
          deployment_platforms?: Json
          entity_name: string
          id?: string
          source_facts?: Json | null
          status?: string | null
          target_keywords?: Json
          tone?: string | null
          updated_at?: string | null
          volume_tier?: number | null
        }
        Update: {
          campaign_name?: string
          client_id?: string | null
          created_at?: string | null
          custom_domains?: Json | null
          deployment_platforms?: Json
          entity_name?: string
          id?: string
          source_facts?: Json | null
          status?: string | null
          target_keywords?: Json
          tone?: string | null
          updated_at?: string | null
          volume_tier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "saturation_campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_job_configs: {
        Row: {
          alert_channels: string[] | null
          auto_flag_threshold: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          platforms: string[] | null
          risk_threshold: number | null
          scan_depth: string | null
          updated_at: string | null
        }
        Insert: {
          alert_channels?: string[] | null
          auto_flag_threshold?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          platforms?: string[] | null
          risk_threshold?: number | null
          scan_depth?: string | null
          updated_at?: string | null
        }
        Update: {
          alert_channels?: string[] | null
          auto_flag_threshold?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          platforms?: string[] | null
          risk_threshold?: number | null
          scan_depth?: string | null
          updated_at?: string | null
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
          detected_at: string | null
          detected_entities: Json | null
          entity_name: string | null
          freshness_window: string | null
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
          source_confidence_score: number | null
          source_credibility_score: number | null
          source_type: string | null
          status: string | null
          threat_severity: string | null
          threat_summary: string | null
          threat_type: string | null
          updated_at: string | null
          url: string
          verification_method: string | null
          verified_at: string | null
          verified_source: boolean | null
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
          detected_at?: string | null
          detected_entities?: Json | null
          entity_name?: string | null
          freshness_window?: string | null
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
          source_confidence_score?: number | null
          source_credibility_score?: number | null
          source_type?: string | null
          status?: string | null
          threat_severity?: string | null
          threat_summary?: string | null
          threat_type?: string | null
          updated_at?: string | null
          url?: string
          verification_method?: string | null
          verified_at?: string | null
          verified_source?: boolean | null
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
          detected_at?: string | null
          detected_entities?: Json | null
          entity_name?: string | null
          freshness_window?: string | null
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
          source_confidence_score?: number | null
          source_credibility_score?: number | null
          source_type?: string | null
          status?: string | null
          threat_severity?: string | null
          threat_summary?: string | null
          threat_type?: string | null
          updated_at?: string | null
          url?: string
          verification_method?: string | null
          verified_at?: string | null
          verified_source?: boolean | null
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
      scanner_query_log: {
        Row: {
          created_at: string | null
          entity_name: string
          error_message: string | null
          executed_at: string | null
          id: string
          platform: string
          query_duration_ms: number | null
          results_matched_entity: number | null
          search_terms: string[]
          total_results_returned: number | null
        }
        Insert: {
          created_at?: string | null
          entity_name: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          platform: string
          query_duration_ms?: number | null
          results_matched_entity?: number | null
          search_terms: string[]
          total_results_returned?: number | null
        }
        Update: {
          created_at?: string | null
          entity_name?: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          platform?: string
          query_duration_ms?: number | null
          results_matched_entity?: number | null
          search_terms?: string[]
          total_results_returned?: number | null
        }
        Relationships: []
      }
      sentience_memory_log: {
        Row: {
          context: string
          created_by: string | null
          id: string
          insight_level: number | null
          reflection: string
          timestamp: string | null
        }
        Insert: {
          context: string
          created_by?: string | null
          id?: string
          insight_level?: number | null
          reflection: string
          timestamp?: string | null
        }
        Update: {
          context?: string
          created_by?: string | null
          id?: string
          insight_level?: number | null
          reflection?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      sentience_recalibration_decisions: {
        Row: {
          created_at: string | null
          executed: boolean | null
          id: string
          memory_log_id: string | null
          notes: string | null
          recalibration_type: string | null
          triggered_by: string | null
        }
        Insert: {
          created_at?: string | null
          executed?: boolean | null
          id?: string
          memory_log_id?: string | null
          notes?: string | null
          recalibration_type?: string | null
          triggered_by?: string | null
        }
        Update: {
          created_at?: string | null
          executed?: boolean | null
          id?: string
          memory_log_id?: string | null
          notes?: string | null
          recalibration_type?: string | null
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentience_recalibration_decisions_memory_log_id_fkey"
            columns: ["memory_log_id"]
            isOneToOne: false
            referencedRelation: "sentience_memory_log"
            referencedColumns: ["id"]
          },
        ]
      }
      sentiment_crawl_results: {
        Row: {
          authority_score: number | null
          backlink_count: number | null
          client_id: string | null
          content_text: string
          crawled_at: string | null
          created_at: string | null
          id: string
          platform: string
          sentiment_label: string | null
          sentiment_score: number | null
          source_url: string
        }
        Insert: {
          authority_score?: number | null
          backlink_count?: number | null
          client_id?: string | null
          content_text: string
          crawled_at?: string | null
          created_at?: string | null
          id?: string
          platform: string
          sentiment_label?: string | null
          sentiment_score?: number | null
          source_url: string
        }
        Update: {
          authority_score?: number | null
          backlink_count?: number | null
          client_id?: string | null
          content_text?: string
          crawled_at?: string | null
          created_at?: string | null
          id?: string
          platform?: string
          sentiment_label?: string | null
          sentiment_score?: number | null
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "sentiment_crawl_results_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
      sentinel_auto_hardening: {
        Row: {
          adjustment: string | null
          config_area: string
          executed_at: string | null
          id: string
          rationale: string | null
          verified: boolean | null
        }
        Insert: {
          adjustment?: string | null
          config_area: string
          executed_at?: string | null
          id?: string
          rationale?: string | null
          verified?: boolean | null
        }
        Update: {
          adjustment?: string | null
          config_area?: string
          executed_at?: string | null
          id?: string
          rationale?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      sentinel_auto_response_config: {
        Row: {
          business_hours_only: boolean
          client_id: string
          cooldown_hours: number
          created_at: string
          enabled: boolean
          id: string
          max_responses_per_day: number
          response_type: string
          severity_threshold: string
          threat_type: string
          updated_at: string
        }
        Insert: {
          business_hours_only?: boolean
          client_id: string
          cooldown_hours?: number
          created_at?: string
          enabled?: boolean
          id?: string
          max_responses_per_day?: number
          response_type: string
          severity_threshold: string
          threat_type: string
          updated_at?: string
        }
        Update: {
          business_hours_only?: boolean
          client_id?: string
          cooldown_hours?: number
          created_at?: string
          enabled?: boolean
          id?: string
          max_responses_per_day?: number
          response_type?: string
          severity_threshold?: string
          threat_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sentinel_auto_response_config_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "sentinel_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      sentinel_cases: {
        Row: {
          case_status: string | null
          case_summary: string | null
          case_title: string | null
          client_id: string | null
          created_at: string | null
          discovery_method: string | null
          entity_name: string
          escalation_level: string | null
          id: string
          intelligence_brief: string | null
          response_status: string | null
          threat_level: number | null
          updated_at: string | null
        }
        Insert: {
          case_status?: string | null
          case_summary?: string | null
          case_title?: string | null
          client_id?: string | null
          created_at?: string | null
          discovery_method?: string | null
          entity_name: string
          escalation_level?: string | null
          id?: string
          intelligence_brief?: string | null
          response_status?: string | null
          threat_level?: number | null
          updated_at?: string | null
        }
        Update: {
          case_status?: string | null
          case_summary?: string | null
          case_title?: string | null
          client_id?: string | null
          created_at?: string | null
          discovery_method?: string | null
          entity_name?: string
          escalation_level?: string | null
          id?: string
          intelligence_brief?: string | null
          response_status?: string | null
          threat_level?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentinel_cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      sentinel_clients: {
        Row: {
          auto_response_enabled: boolean
          client_name: string
          contact_email: string
          created_at: string
          created_by: string | null
          entity_names: string[]
          guardian_mode_enabled: boolean
          id: string
          protection_level: string
          status: string
          updated_at: string
        }
        Insert: {
          auto_response_enabled?: boolean
          client_name: string
          contact_email: string
          created_at?: string
          created_by?: string | null
          entity_names?: string[]
          guardian_mode_enabled?: boolean
          id?: string
          protection_level?: string
          status?: string
          updated_at?: string
        }
        Update: {
          auto_response_enabled?: boolean
          client_name?: string
          contact_email?: string
          created_at?: string
          created_by?: string | null
          entity_names?: string[]
          guardian_mode_enabled?: boolean
          id?: string
          protection_level?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sentinel_defense_triggers: {
        Row: {
          detected_pattern: string | null
          id: string
          response_action: string | null
          signature_id: string | null
          source: string
          status: string | null
          triggered_at: string | null
        }
        Insert: {
          detected_pattern?: string | null
          id?: string
          response_action?: string | null
          signature_id?: string | null
          source: string
          status?: string | null
          triggered_at?: string | null
        }
        Update: {
          detected_pattern?: string | null
          id?: string
          response_action?: string | null
          signature_id?: string | null
          source?: string
          status?: string | null
          triggered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentinel_defense_triggers_signature_id_fkey"
            columns: ["signature_id"]
            isOneToOne: false
            referencedRelation: "sentinel_threat_signatures"
            referencedColumns: ["id"]
          },
        ]
      }
      sentinel_guardian_registry: {
        Row: {
          alert_threshold: string
          auto_response_enabled: boolean
          client_id: string
          created_at: string
          entity_name: string
          id: string
          last_scan: string
          monitoring_keywords: string[]
          scan_frequency_minutes: number
          status: string
          threats_resolved: number
          total_threats_detected: number
          updated_at: string
        }
        Insert: {
          alert_threshold?: string
          auto_response_enabled?: boolean
          client_id: string
          created_at?: string
          entity_name: string
          id?: string
          last_scan?: string
          monitoring_keywords?: string[]
          scan_frequency_minutes?: number
          status?: string
          threats_resolved?: number
          total_threats_detected?: number
          updated_at?: string
        }
        Update: {
          alert_threshold?: string
          auto_response_enabled?: boolean
          client_id?: string
          created_at?: string
          entity_name?: string
          id?: string
          last_scan?: string
          monitoring_keywords?: string[]
          scan_frequency_minutes?: number
          status?: string
          threats_resolved?: number
          total_threats_detected?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sentinel_guardian_registry_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "sentinel_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      sentinel_mission_log: {
        Row: {
          action_details: Json
          action_type: string
          client_id: string
          completed_at: string | null
          created_at: string
          effectiveness_score: number | null
          executed_by: string
          execution_status: string
          id: string
          next_action_recommended: string | null
          plan_id: string
          result_summary: string | null
          started_at: string | null
        }
        Insert: {
          action_details?: Json
          action_type: string
          client_id: string
          completed_at?: string | null
          created_at?: string
          effectiveness_score?: number | null
          executed_by?: string
          execution_status?: string
          id?: string
          next_action_recommended?: string | null
          plan_id: string
          result_summary?: string | null
          started_at?: string | null
        }
        Update: {
          action_details?: Json
          action_type?: string
          client_id?: string
          completed_at?: string | null
          created_at?: string
          effectiveness_score?: number | null
          executed_by?: string
          execution_status?: string
          id?: string
          next_action_recommended?: string | null
          plan_id?: string
          result_summary?: string | null
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentinel_mission_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "sentinel_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentinel_mission_log_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "sentinel_response_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      sentinel_mission_reports: {
        Row: {
          case_id: string | null
          created_at: string | null
          generated_by: string | null
          id: string
          mission_id: string | null
          report_data: Json | null
          response_type: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          generated_by?: string | null
          id?: string
          mission_id?: string | null
          report_data?: Json | null
          response_type?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          generated_by?: string | null
          id?: string
          mission_id?: string | null
          report_data?: Json | null
          response_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentinel_mission_reports_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "sentinel_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      sentinel_response_plans: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          estimated_effectiveness: number
          generated_by: string
          id: string
          plan_type: string
          resource_requirements: string | null
          risk_assessment: string | null
          specific_actions: Json
          strategy_summary: string
          success_criteria: string | null
          threat_id: string
          time_to_execute: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          estimated_effectiveness?: number
          generated_by?: string
          id?: string
          plan_type: string
          resource_requirements?: string | null
          risk_assessment?: string | null
          specific_actions?: Json
          strategy_summary: string
          success_criteria?: string | null
          threat_id: string
          time_to_execute?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          estimated_effectiveness?: number
          generated_by?: string
          id?: string
          plan_type?: string
          resource_requirements?: string | null
          risk_assessment?: string | null
          specific_actions?: Json
          strategy_summary?: string
          success_criteria?: string | null
          threat_id?: string
          time_to_execute?: string
        }
        Relationships: [
          {
            foreignKeyName: "sentinel_response_plans_threat_id_fkey"
            columns: ["threat_id"]
            isOneToOne: false
            referencedRelation: "sentinel_threat_discovery"
            referencedColumns: ["id"]
          },
        ]
      }
      sentinel_threat_discovery: {
        Row: {
          client_id: string
          confidence_score: number
          created_at: string
          discovered_at: string
          discovery_method: string
          entity_name: string
          id: string
          last_verified: string
          platform: string
          potential_reach: number | null
          severity_level: string
          social_handle: string | null
          source_url: string | null
          status: string
          threat_content: string
          threat_type: string
        }
        Insert: {
          client_id: string
          confidence_score?: number
          created_at?: string
          discovered_at?: string
          discovery_method: string
          entity_name: string
          id?: string
          last_verified?: string
          platform: string
          potential_reach?: number | null
          severity_level: string
          social_handle?: string | null
          source_url?: string | null
          status?: string
          threat_content: string
          threat_type: string
        }
        Update: {
          client_id?: string
          confidence_score?: number
          created_at?: string
          discovered_at?: string
          discovery_method?: string
          entity_name?: string
          id?: string
          last_verified?: string
          platform?: string
          potential_reach?: number | null
          severity_level?: string
          social_handle?: string | null
          source_url?: string | null
          status?: string
          threat_content?: string
          threat_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sentinel_threat_discovery_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "sentinel_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      sentinel_threat_signatures: {
        Row: {
          created_at: string | null
          id: string
          pattern: string
          severity_level: string | null
          signature_name: string
          threat_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pattern: string
          severity_level?: string | null
          signature_name: string
          threat_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pattern?: string
          severity_level?: string | null
          signature_name?: string
          threat_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sentinel_threat_timeline: {
        Row: {
          case_id: string | null
          created_at: string | null
          event_description: string | null
          event_type: string
          id: string
          metadata: Json | null
          response_taken: string | null
          source_platform: string | null
          source_url: string | null
          threat_severity: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          event_description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          response_taken?: string | null
          source_platform?: string | null
          source_url?: string | null
          threat_severity?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          event_description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          response_taken?: string | null
          source_platform?: string | null
          source_url?: string | null
          threat_severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentinel_threat_timeline_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "sentinel_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      sentinelgrid_entity_risk_links: {
        Row: {
          entity_name: string
          id: string
          linked_at: string | null
          relevance_score: number | null
          risk_id: string | null
        }
        Insert: {
          entity_name: string
          id?: string
          linked_at?: string | null
          relevance_score?: number | null
          risk_id?: string | null
        }
        Update: {
          entity_name?: string
          id?: string
          linked_at?: string | null
          relevance_score?: number | null
          risk_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentinelgrid_entity_risk_links_risk_id_fkey"
            columns: ["risk_id"]
            isOneToOne: false
            referencedRelation: "sentinelgrid_global_risk_indicators"
            referencedColumns: ["id"]
          },
        ]
      }
      sentinelgrid_global_risk_indicators: {
        Row: {
          detected_at: string | null
          id: string
          indicator_details: string | null
          is_active: boolean | null
          region: string
          risk_type: string
          severity: number | null
          source: string | null
        }
        Insert: {
          detected_at?: string | null
          id?: string
          indicator_details?: string | null
          is_active?: boolean | null
          region: string
          risk_type: string
          severity?: number | null
          source?: string | null
        }
        Update: {
          detected_at?: string | null
          id?: string
          indicator_details?: string | null
          is_active?: boolean | null
          region?: string
          risk_type?: string
          severity?: number | null
          source?: string | null
        }
        Relationships: []
      }
      seo_keyword_analysis: {
        Row: {
          crawl_result_id: string | null
          created_at: string | null
          difficulty_score: number | null
          frequency: number | null
          id: string
          keyword: string
          keyword_type: string | null
          search_volume: number | null
          tf_idf_score: number | null
        }
        Insert: {
          crawl_result_id?: string | null
          created_at?: string | null
          difficulty_score?: number | null
          frequency?: number | null
          id?: string
          keyword: string
          keyword_type?: string | null
          search_volume?: number | null
          tf_idf_score?: number | null
        }
        Update: {
          crawl_result_id?: string | null
          created_at?: string | null
          difficulty_score?: number | null
          frequency?: number | null
          id?: string
          keyword?: string
          keyword_type?: string | null
          search_volume?: number | null
          tf_idf_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_keyword_analysis_crawl_result_id_fkey"
            columns: ["crawl_result_id"]
            isOneToOne: false
            referencedRelation: "sentiment_crawl_results"
            referencedColumns: ["id"]
          },
        ]
      }
      sigma_scan_results: {
        Row: {
          confidence_score: number | null
          content: string | null
          created_at: string | null
          detected_entities: string[] | null
          entity_name: string
          id: string
          platform: string | null
          sentiment: number | null
          severity: string | null
          source_type: string | null
          url: string | null
        }
        Insert: {
          confidence_score?: number | null
          content?: string | null
          created_at?: string | null
          detected_entities?: string[] | null
          entity_name: string
          id?: string
          platform?: string | null
          sentiment?: number | null
          severity?: string | null
          source_type?: string | null
          url?: string | null
        }
        Update: {
          confidence_score?: number | null
          content?: string | null
          created_at?: string | null
          detected_entities?: string[] | null
          entity_name?: string
          id?: string
          platform?: string | null
          sentiment?: number | null
          severity?: string | null
          source_type?: string | null
          url?: string | null
        }
        Relationships: []
      }
      source_domain_authority: {
        Row: {
          authority_tier: string | null
          average_page_rank: number | null
          backlink_count: number | null
          check_frequency: unknown | null
          created_at: string | null
          domain: string
          domain_rating: number | null
          id: string
          is_blacklisted: boolean | null
          last_checked: string | null
          organic_traffic_estimate: number | null
          spam_score: number | null
        }
        Insert: {
          authority_tier?: string | null
          average_page_rank?: number | null
          backlink_count?: number | null
          check_frequency?: unknown | null
          created_at?: string | null
          domain: string
          domain_rating?: number | null
          id?: string
          is_blacklisted?: boolean | null
          last_checked?: string | null
          organic_traffic_estimate?: number | null
          spam_score?: number | null
        }
        Update: {
          authority_tier?: string | null
          average_page_rank?: number | null
          backlink_count?: number | null
          check_frequency?: unknown | null
          created_at?: string | null
          domain?: string
          domain_rating?: number | null
          id?: string
          is_blacklisted?: boolean | null
          last_checked?: string | null
          organic_traffic_estimate?: number | null
          spam_score?: number | null
        }
        Relationships: []
      }
      sovra_action_log: {
        Row: {
          action_type: string | null
          executed_at: string | null
          executed_by: string | null
          id: string
          result: string | null
          threat_id: string | null
        }
        Insert: {
          action_type?: string | null
          executed_at?: string | null
          executed_by?: string | null
          id?: string
          result?: string | null
          threat_id?: string | null
        }
        Update: {
          action_type?: string | null
          executed_at?: string | null
          executed_by?: string | null
          id?: string
          result?: string | null
          threat_id?: string | null
        }
        Relationships: []
      }
      strategy_memory: {
        Row: {
          client_id: string | null
          content_tone: string | null
          deployment_platforms: Json
          failure_points: Json | null
          id: string
          keyword_focus: Json
          lessons_learned: string | null
          overall_effectiveness_score: number | null
          recorded_at: string | null
          strategy_type: string
          success_metrics: Json
        }
        Insert: {
          client_id?: string | null
          content_tone?: string | null
          deployment_platforms?: Json
          failure_points?: Json | null
          id?: string
          keyword_focus?: Json
          lessons_learned?: string | null
          overall_effectiveness_score?: number | null
          recorded_at?: string | null
          strategy_type: string
          success_metrics?: Json
        }
        Update: {
          client_id?: string | null
          content_tone?: string | null
          deployment_platforms?: Json
          failure_points?: Json | null
          id?: string
          keyword_focus?: Json
          lessons_learned?: string | null
          overall_effectiveness_score?: number | null
          recorded_at?: string | null
          strategy_type?: string
          success_metrics?: Json
        }
        Relationships: [
          {
            foreignKeyName: "strategy_memory_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_responses: {
        Row: {
          actions: Json | null
          created_at: string | null
          description: string | null
          entity_name: string
          executed_at: string | null
          execution_result: Json | null
          id: string
          priority: string
          resources: string[] | null
          status: string | null
          strategy_id: string
          strategy_type: string
          timeframe: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          created_at?: string | null
          description?: string | null
          entity_name: string
          executed_at?: string | null
          execution_result?: Json | null
          id?: string
          priority: string
          resources?: string[] | null
          status?: string | null
          strategy_id: string
          strategy_type: string
          timeframe?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          created_at?: string | null
          description?: string | null
          entity_name?: string
          executed_at?: string | null
          execution_result?: Json | null
          id?: string
          priority?: string
          resources?: string[] | null
          status?: string | null
          strategy_id?: string
          strategy_type?: string
          timeframe?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      strike_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          batch_id: string | null
          created_at: string | null
          evidence_pdf: string | null
          executed_at: string | null
          execution_result: Json | null
          id: string
          platform: string
          reason: string
          requested_by: string
          status: string | null
          strike_type: string | null
          url: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          batch_id?: string | null
          created_at?: string | null
          evidence_pdf?: string | null
          executed_at?: string | null
          execution_result?: Json | null
          id?: string
          platform: string
          reason: string
          requested_by: string
          status?: string | null
          strike_type?: string | null
          url: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          batch_id?: string | null
          created_at?: string | null
          evidence_pdf?: string | null
          executed_at?: string | null
          execution_result?: Json | null
          id?: string
          platform?: string
          reason?: string
          requested_by?: string
          status?: string | null
          strike_type?: string | null
          url?: string
        }
        Relationships: []
      }
      suppression_actions: {
        Row: {
          action_status: string | null
          action_type: string
          created_at: string | null
          description: string | null
          executed_at: string | null
          id: string
          initiated_by: string | null
          legacy_post_id: string | null
        }
        Insert: {
          action_status?: string | null
          action_type: string
          created_at?: string | null
          description?: string | null
          executed_at?: string | null
          id?: string
          initiated_by?: string | null
          legacy_post_id?: string | null
        }
        Update: {
          action_status?: string | null
          action_type?: string
          created_at?: string | null
          description?: string | null
          executed_at?: string | null
          id?: string
          initiated_by?: string | null
          legacy_post_id?: string | null
        }
        Relationships: []
      }
      suppression_assets: {
        Row: {
          asset_title: string | null
          asset_type: string | null
          asset_url: string
          created_at: string | null
          engagement_score: number | null
          gsc_clicks: number | null
          gsc_ctr: number | null
          gsc_impressions: number | null
          gsc_last_checked: string | null
          gsc_position: number | null
          id: string
          legacy_post_id: string | null
          published_at: string | null
          publishing_channel: string | null
          rank_goal: number | null
          visibility_score: number | null
        }
        Insert: {
          asset_title?: string | null
          asset_type?: string | null
          asset_url: string
          created_at?: string | null
          engagement_score?: number | null
          gsc_clicks?: number | null
          gsc_ctr?: number | null
          gsc_impressions?: number | null
          gsc_last_checked?: string | null
          gsc_position?: number | null
          id?: string
          legacy_post_id?: string | null
          published_at?: string | null
          publishing_channel?: string | null
          rank_goal?: number | null
          visibility_score?: number | null
        }
        Update: {
          asset_title?: string | null
          asset_type?: string | null
          asset_url?: string
          created_at?: string | null
          engagement_score?: number | null
          gsc_clicks?: number | null
          gsc_ctr?: number | null
          gsc_impressions?: number | null
          gsc_last_checked?: string | null
          gsc_position?: number | null
          id?: string
          legacy_post_id?: string | null
          published_at?: string | null
          publishing_channel?: string | null
          rank_goal?: number | null
          visibility_score?: number | null
        }
        Relationships: []
      }
      synthetic_threats: {
        Row: {
          confidence_score: number | null
          detected_at: string | null
          detection_tool: string | null
          entity_name: string | null
          id: string
          is_confirmed: boolean | null
          matched_phrase: string | null
          media_type: string | null
          sample_url: string | null
          threat_score: number | null
        }
        Insert: {
          confidence_score?: number | null
          detected_at?: string | null
          detection_tool?: string | null
          entity_name?: string | null
          id?: string
          is_confirmed?: boolean | null
          matched_phrase?: string | null
          media_type?: string | null
          sample_url?: string | null
          threat_score?: number | null
        }
        Update: {
          confidence_score?: number | null
          detected_at?: string | null
          detection_tool?: string | null
          entity_name?: string | null
          id?: string
          is_confirmed?: boolean | null
          matched_phrase?: string | null
          media_type?: string | null
          sample_url?: string | null
          threat_score?: number | null
        }
        Relationships: []
      }
      system_config: {
        Row: {
          config_key: string
          config_value: string
          created_at: string | null
          description: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value: string
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: string
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_health_checks: {
        Row: {
          check_time: string | null
          created_at: string | null
          details: string | null
          id: string
          is_automated: boolean | null
          module: string
          status: string | null
        }
        Insert: {
          check_time?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          is_automated?: boolean | null
          module: string
          status?: string | null
        }
        Update: {
          check_time?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          is_automated?: boolean | null
          module?: string
          status?: string | null
        }
        Relationships: []
      }
      threat_detections: {
        Row: {
          auto_flagged: boolean | null
          content_preview: string | null
          detected_at: string | null
          id: string
          monitoring_schedule_id: string | null
          requires_resaturation: boolean | null
          resolved_at: string | null
          severity_score: number | null
          source_url: string | null
          status: string | null
          threat_type: string | null
        }
        Insert: {
          auto_flagged?: boolean | null
          content_preview?: string | null
          detected_at?: string | null
          id?: string
          monitoring_schedule_id?: string | null
          requires_resaturation?: boolean | null
          resolved_at?: string | null
          severity_score?: number | null
          source_url?: string | null
          status?: string | null
          threat_type?: string | null
        }
        Update: {
          auto_flagged?: boolean | null
          content_preview?: string | null
          detected_at?: string | null
          id?: string
          monitoring_schedule_id?: string | null
          requires_resaturation?: boolean | null
          resolved_at?: string | null
          severity_score?: number | null
          source_url?: string | null
          status?: string | null
          threat_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "threat_detections_monitoring_schedule_id_fkey"
            columns: ["monitoring_schedule_id"]
            isOneToOne: false
            referencedRelation: "monitoring_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      threat_genomes: {
        Row: {
          created_at: string | null
          description: string | null
          hash: string
          id: string
          known_outcomes: string[] | null
          match_percent: number | null
          pattern_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hash: string
          id?: string
          known_outcomes?: string[] | null
          match_percent?: number | null
          pattern_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hash?: string
          id?: string
          known_outcomes?: string[] | null
          match_percent?: number | null
          pattern_name?: string
        }
        Relationships: []
      }
      threat_ingestion_queue: {
        Row: {
          created_at: string | null
          detected_at: string | null
          entity_match: string | null
          freshness_window: string | null
          id: string
          processed_by: string | null
          processing_notes: string | null
          raw_content: string
          risk_score: number | null
          source: string
          source_confidence_score: number | null
          status: string | null
          updated_at: string | null
          verification_method: string | null
          verified_at: string | null
          verified_source: boolean | null
        }
        Insert: {
          created_at?: string | null
          detected_at?: string | null
          entity_match?: string | null
          freshness_window?: string | null
          id?: string
          processed_by?: string | null
          processing_notes?: string | null
          raw_content: string
          risk_score?: number | null
          source: string
          source_confidence_score?: number | null
          status?: string | null
          updated_at?: string | null
          verification_method?: string | null
          verified_at?: string | null
          verified_source?: boolean | null
        }
        Update: {
          created_at?: string | null
          detected_at?: string | null
          entity_match?: string | null
          freshness_window?: string | null
          id?: string
          processed_by?: string | null
          processing_notes?: string | null
          raw_content?: string
          risk_score?: number | null
          source?: string
          source_confidence_score?: number | null
          status?: string | null
          updated_at?: string | null
          verification_method?: string | null
          verified_at?: string | null
          verified_source?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "threat_ingestion_queue_entity_match_fkey"
            columns: ["entity_match"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      threat_profiles: {
        Row: {
          created_at: string | null
          entity_name: string
          fix_plan: string | null
          id: string
          match_confidence: number | null
          negative_sentiment_score: number | null
          primary_platforms: string[] | null
          related_entities: string[] | null
          risk_score: number
          signature_match: string | null
          threat_level: string
          total_mentions: number | null
        }
        Insert: {
          created_at?: string | null
          entity_name: string
          fix_plan?: string | null
          id?: string
          match_confidence?: number | null
          negative_sentiment_score?: number | null
          primary_platforms?: string[] | null
          related_entities?: string[] | null
          risk_score: number
          signature_match?: string | null
          threat_level: string
          total_mentions?: number | null
        }
        Update: {
          created_at?: string | null
          entity_name?: string
          fix_plan?: string | null
          id?: string
          match_confidence?: number | null
          negative_sentiment_score?: number | null
          primary_platforms?: string[] | null
          related_entities?: string[] | null
          risk_score?: number
          signature_match?: string | null
          threat_level?: string
          total_mentions?: number | null
        }
        Relationships: []
      }
      threat_simulations: {
        Row: {
          client_id: string | null
          created_at: string | null
          geographical_scope: string[] | null
          id: string
          likelihood_score: number | null
          predicted_keywords: string[] | null
          threat_level: number | null
          threat_source: string | null
          threat_topic: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          geographical_scope?: string[] | null
          id?: string
          likelihood_score?: number | null
          predicted_keywords?: string[] | null
          threat_level?: number | null
          threat_source?: string | null
          threat_topic: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          geographical_scope?: string[] | null
          id?: string
          likelihood_score?: number | null
          predicted_keywords?: string[] | null
          threat_level?: number | null
          threat_source?: string | null
          threat_topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "threat_simulations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      threats: {
        Row: {
          content: string
          created_at: string | null
          detected_at: string | null
          entity_id: string | null
          freshness_window: string | null
          id: string
          is_live: boolean | null
          risk_score: number | null
          sentiment: string | null
          source: string
          source_confidence_score: number | null
          status: string | null
          summary: string | null
          threat_type: string | null
          updated_at: string | null
          verification_method: string | null
          verified_at: string | null
          verified_source: boolean | null
        }
        Insert: {
          content: string
          created_at?: string | null
          detected_at?: string | null
          entity_id?: string | null
          freshness_window?: string | null
          id?: string
          is_live?: boolean | null
          risk_score?: number | null
          sentiment?: string | null
          source: string
          source_confidence_score?: number | null
          status?: string | null
          summary?: string | null
          threat_type?: string | null
          updated_at?: string | null
          verification_method?: string | null
          verified_at?: string | null
          verified_source?: boolean | null
        }
        Update: {
          content?: string
          created_at?: string | null
          detected_at?: string | null
          entity_id?: string | null
          freshness_window?: string | null
          id?: string
          is_live?: boolean | null
          risk_score?: number | null
          sentiment?: string | null
          source?: string
          source_confidence_score?: number | null
          status?: string | null
          summary?: string | null
          threat_type?: string | null
          updated_at?: string | null
          verification_method?: string | null
          verified_at?: string | null
          verified_source?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "threats_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      tone_drift_profiles: {
        Row: {
          baseline_tone: string | null
          confidence_level: number | null
          created_at: string | null
          deviation_keywords: string[] | null
          drift_score: number | null
          entity_name: string | null
          id: string
          recent_tone: string | null
          reference_period: string | null
          updated_at: string | null
        }
        Insert: {
          baseline_tone?: string | null
          confidence_level?: number | null
          created_at?: string | null
          deviation_keywords?: string[] | null
          drift_score?: number | null
          entity_name?: string | null
          id?: string
          recent_tone?: string | null
          reference_period?: string | null
          updated_at?: string | null
        }
        Update: {
          baseline_tone?: string | null
          confidence_level?: number | null
          created_at?: string | null
          deviation_keywords?: string[] | null
          drift_score?: number | null
          entity_name?: string | null
          id?: string
          recent_tone?: string | null
          reference_period?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      unified_reports: {
        Row: {
          created_at: string | null
          csv_url: string | null
          entity_name: string
          high_severity_count: number | null
          id: string
          markdown_url: string | null
          pdf_url: string | null
          related_entities: string[] | null
          report_text: string | null
          scan_metadata: Json | null
          summary: string | null
          threat_count: number | null
        }
        Insert: {
          created_at?: string | null
          csv_url?: string | null
          entity_name: string
          high_severity_count?: number | null
          id?: string
          markdown_url?: string | null
          pdf_url?: string | null
          related_entities?: string[] | null
          report_text?: string | null
          scan_metadata?: Json | null
          summary?: string | null
          threat_count?: number | null
        }
        Update: {
          created_at?: string | null
          csv_url?: string | null
          entity_name?: string
          high_severity_count?: number | null
          id?: string
          markdown_url?: string | null
          pdf_url?: string | null
          related_entities?: string[] | null
          report_text?: string | null
          scan_metadata?: Json | null
          summary?: string | null
          threat_count?: number | null
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
      watchtower_candidates: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          discovery_source: string | null
          entity_name: string
          id: string
          last_scanned: string | null
          outreach_status: string | null
          potential_value: number | null
          scan_results: Json | null
          threat_details: Json | null
          threat_score: number | null
          threat_summary: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          discovery_source?: string | null
          entity_name: string
          id?: string
          last_scanned?: string | null
          outreach_status?: string | null
          potential_value?: number | null
          scan_results?: Json | null
          threat_details?: Json | null
          threat_score?: number | null
          threat_summary?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          discovery_source?: string | null
          entity_name?: string
          id?: string
          last_scanned?: string | null
          outreach_status?: string | null
          potential_value?: number | null
          scan_results?: Json | null
          threat_details?: Json | null
          threat_score?: number | null
          threat_summary?: string | null
        }
        Relationships: []
      }
      watchtower_conversion_pipeline: {
        Row: {
          candidate_id: string | null
          conversion_value: number | null
          converted_to_client_id: string | null
          id: string
          moved_to_stage_at: string | null
          pipeline_stage: string | null
          stage_data: Json | null
        }
        Insert: {
          candidate_id?: string | null
          conversion_value?: number | null
          converted_to_client_id?: string | null
          id?: string
          moved_to_stage_at?: string | null
          pipeline_stage?: string | null
          stage_data?: Json | null
        }
        Update: {
          candidate_id?: string | null
          conversion_value?: number | null
          converted_to_client_id?: string | null
          id?: string
          moved_to_stage_at?: string | null
          pipeline_stage?: string | null
          stage_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "watchtower_conversion_pipeline_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "watchtower_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchtower_conversion_pipeline_converted_to_client_id_fkey"
            columns: ["converted_to_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      watchtower_outreach_log: {
        Row: {
          candidate_id: string | null
          conversion_status: string | null
          id: string
          outreach_content: string | null
          outreach_type: string | null
          response_received: boolean | null
          sent_at: string | null
        }
        Insert: {
          candidate_id?: string | null
          conversion_status?: string | null
          id?: string
          outreach_content?: string | null
          outreach_type?: string | null
          response_received?: boolean | null
          sent_at?: string | null
        }
        Update: {
          candidate_id?: string | null
          conversion_status?: string | null
          id?: string
          outreach_content?: string | null
          outreach_type?: string | null
          response_received?: boolean | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watchtower_outreach_log_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "watchtower_candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      zeuslink_osint_feeds: {
        Row: {
          created_at: string | null
          fetch_frequency: string | null
          id: string
          is_active: boolean | null
          last_fetched: string | null
          source_name: string
          source_url: string
          trust_score: number | null
        }
        Insert: {
          created_at?: string | null
          fetch_frequency?: string | null
          id?: string
          is_active?: boolean | null
          last_fetched?: string | null
          source_name: string
          source_url: string
          trust_score?: number | null
        }
        Update: {
          created_at?: string | null
          fetch_frequency?: string | null
          id?: string
          is_active?: boolean | null
          last_fetched?: string | null
          source_name?: string
          source_url?: string
          trust_score?: number | null
        }
        Relationships: []
      }
      zeuslink_osint_signals: {
        Row: {
          confidence_score: number | null
          detected_at: string | null
          feed_id: string | null
          id: string
          is_live: boolean | null
          related_entity_name: string | null
          signal_content: string
          signal_type: string | null
        }
        Insert: {
          confidence_score?: number | null
          detected_at?: string | null
          feed_id?: string | null
          id?: string
          is_live?: boolean | null
          related_entity_name?: string | null
          signal_content: string
          signal_type?: string | null
        }
        Update: {
          confidence_score?: number | null
          detected_at?: string | null
          feed_id?: string | null
          id?: string
          is_live?: boolean | null
          related_entity_name?: string | null
          signal_content?: string
          signal_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "zeuslink_osint_signals_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "zeuslink_osint_feeds"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      aria_notifications_dashboard: {
        Row: {
          created_at: string | null
          entity_name: string | null
          event_type: string | null
          id: string | null
          priority: string | null
          priority_order: number | null
          seen: boolean | null
          summary: string | null
        }
        Relationships: []
      }
      campaign_effectiveness_dashboard: {
        Row: {
          articles_deployed: number | null
          articles_indexed: number | null
          avg_ctr: number | null
          avg_search_rank: number | null
          campaign_id: string | null
          campaign_name: string | null
          entity_name: string | null
          last_updated: string | null
          total_clicks: number | null
          volume_tier: number | null
        }
        Relationships: []
      }
      campaign_roi_dashboard: {
        Row: {
          approved_edits: number | null
          articles_deployed: number | null
          articles_indexed: number | null
          avg_ctr: number | null
          avg_domain_authority: number | null
          avg_search_rank: number | null
          business_impacts: number | null
          campaign_id: string | null
          campaign_name: string | null
          entity_name: string | null
          last_business_impact: string | null
          last_campaign_update: string | null
          total_edits: number | null
          total_quantified_value: number | null
          volume_tier: number | null
        }
        Relationships: []
      }
      cerebra_bias_dashboard: {
        Row: {
          avg_accuracy: number | null
          avg_bias: number | null
          critical_mentions: number | null
          entity_name: string | null
          first_detected: string | null
          inaccuracies: number | null
          last_checked: string | null
          model: string | null
          total_profiles: number | null
        }
        Relationships: []
      }
      domain_authority_competitive_analysis: {
        Row: {
          authority_tier: string | null
          average_page_rank: number | null
          avg_ranking_performance: number | null
          domain: string | null
          last_deployment: string | null
          our_articles_on_domain: number | null
          top_10_rankings: number | null
        }
        Relationships: []
      }
      eidetic_summary: {
        Row: {
          action_status: string | null
          asset_url: string | null
          client_id: string | null
          client_name: string | null
          content_url: string | null
          decay_score: number | null
          effectiveness_score: number | null
          first_seen: string | null
          last_seen: string | null
          memory_type: string | null
          recommended_action: string | null
          relevancy_score: number | null
          scheduled_for: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_footprints_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_intelligence_summary: {
        Row: {
          active_campaigns: number | null
          associate_count: number | null
          avg_content_authority: number | null
          business_impacts_recorded: number | null
          client_id: string | null
          entity_name: string | null
          industry_presence: number | null
          known_aliases: number | null
          last_business_impact: string | null
          last_updated: string | null
          total_threats_detected: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_fingerprints_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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
      praxis_forecast_dashboard: {
        Row: {
          active_signals: number | null
          confidence_score: number | null
          crisis_simulated: number | null
          entity_name: string | null
          forecast_type: string | null
          last_triggered: string | null
          last_updated: string | null
          likely_visibility: string | null
          risk_level: string | null
          status: string | null
        }
        Relationships: []
      }
      praxis_signal_trends: {
        Row: {
          avg_severity: number | null
          entity_name: string | null
          first_detected: string | null
          latest_signal: string | null
          peak_severity: number | null
          signal_count: number | null
          signal_type: string | null
          trend_duration_days: number | null
        }
        Relationships: []
      }
      risk_score_inputs: {
        Row: {
          entity_name: string | null
          risk_score: number | null
          total_signals: number | null
        }
        Relationships: []
      }
      rsi_dashboard_summary: {
        Row: {
          activation_count: number | null
          active_decoys: number | null
          avg_index_rank: number | null
          avg_visibility_score: number | null
          client_id: string | null
          client_name: string | null
          counter_narratives_count: number | null
          decoy_assets_count: number | null
          likelihood_score: number | null
          published_counters: number | null
          threat_detected_at: string | null
          threat_level: number | null
          threat_topic: string | null
        }
        Relationships: [
          {
            foreignKeyName: "threat_simulations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      threat_detection_summary: {
        Row: {
          avg_severity: number | null
          entity_name: string | null
          high_severity_threats: number | null
          last_threat_detected: string | null
          resolved_threats: number | null
          total_threats: number | null
        }
        Relationships: []
      }
      verified_live_threats: {
        Row: {
          content: string | null
          created_at: string | null
          detected_at: string | null
          id: string | null
          status: string | null
          threat_type: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          detected_at?: string | null
          id?: string | null
          status?: string | null
          threat_type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          detected_at?: string | null
          id?: string | null
          status?: string | null
          threat_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_staff_role: {
        Args: { user_email: string }
        Returns: undefined
      }
      calculate_decay_score: {
        Args: { rank_score: number; resurfacing_score: number }
        Returns: number
      }
      calculate_freshness_window: {
        Args: { detected_time: string }
        Returns: string
      }
      calculate_threat_urgency: {
        Args: { threat_level: number; likelihood_score: number }
        Returns: number
      }
      check_entity_client_match: {
        Args: { entity_name_input: string }
        Returns: {
          client_id: string
          client_name: string
          client_contact: string
          entity_id: string
          entity_name: string
          entity_type: string
          match_type: string
          confidence_score: number
        }[]
      }
      check_internal_access: {
        Args: { module_name: string }
        Returns: undefined
      }
      check_rls_compliance: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          rls_enabled: boolean
        }[]
      }
      column_exists: {
        Args: { p_table_name: string; p_column_name: string }
        Returns: boolean
      }
      execute_batch_strikes: {
        Args: { p_batch_id: string; p_admin_id: string }
        Returns: string
      }
      generate_decay_score: {
        Args: {
          relevancy: number
          velocity: number
          first_seen: string
          now_time?: string
        }
        Returns: number
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_module_access_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          module_name: string
          total_attempts: number
          successful_access: number
          blocked_attempts: number
          last_access: string
        }[]
      }
      get_rsi_effectiveness: {
        Args: { campaign_id: string }
        Returns: {
          total_threats: number
          countered_threats: number
          avg_response_time: unknown
          success_rate: number
        }[]
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
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_mock_data_allowed: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_anubis_check: {
        Args: {
          check_name: string
          result: string
          passed: boolean
          severity?: string
          run_context?: string
          run_by?: string
          notes?: string
        }
        Returns: undefined
      }
      log_compliance_activity: {
        Args: {
          p_activity_type: string
          p_description: string
          p_data_processed?: Json
          p_legal_basis?: string
          p_data_sources?: string[]
        }
        Returns: string
      }
      log_module_usage: {
        Args: { p_module_name: string; p_action: string; p_details?: string }
        Returns: undefined
      }
      mark_notification_seen: {
        Args: { notification_id: string }
        Returns: undefined
      }
      queue_report_export: {
        Args: {
          p_report_id: string
          p_export_type: string
          p_recipient: string
        }
        Returns: string
      }
      refresh_active_case_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_cerebra_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_praxis_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      run_global_scan: {
        Args: Record<PropertyKey, never> | { scan_depth?: string }
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
          detected_at: string | null
          detected_entities: Json | null
          entity_name: string | null
          freshness_window: string | null
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
          source_confidence_score: number | null
          source_credibility_score: number | null
          source_type: string | null
          status: string | null
          threat_severity: string | null
          threat_summary: string | null
          threat_type: string | null
          updated_at: string | null
          url: string
          verification_method: string | null
          verified_at: string | null
          verified_source: boolean | null
        }[]
      }
      sentinel_discover_threats: {
        Args: { p_client_name: string; p_entity_names: string[] }
        Returns: {
          threat_count: number
          discovery_summary: string
        }[]
      }
      sentinel_generate_response_plans: {
        Args: { p_threat_id: string }
        Returns: {
          plan_type: string
          strategy_summary: string
          actions_count: number
        }[]
      }
      set_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: undefined
      }
      trigger_risk_escalations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_entity_risk_scores: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_aria_on_admin_login: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

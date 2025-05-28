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
      ai_influence_map: {
        Row: {
          ai_model_origin: string | null
          captured_at: string | null
          echo_type: string | null
          entity_name: string | null
          id: string
          matched_content: string | null
          source_platform: string | null
          verified: boolean | null
          visibility_score: number | null
        }
        Insert: {
          ai_model_origin?: string | null
          captured_at?: string | null
          echo_type?: string | null
          entity_name?: string | null
          id?: string
          matched_content?: string | null
          source_platform?: string | null
          verified?: boolean | null
          visibility_score?: number | null
        }
        Update: {
          ai_model_origin?: string | null
          captured_at?: string | null
          echo_type?: string | null
          entity_name?: string | null
          id?: string
          matched_content?: string | null
          source_platform?: string | null
          verified?: boolean | null
          visibility_score?: number | null
        }
        Relationships: []
      }
      anubis_ai_attack_log: {
        Row: {
          attack_vector: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          mitigation_action: string | null
          prompt: string | null
          source: string | null
        }
        Insert: {
          attack_vector?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          mitigation_action?: string | null
          prompt?: string | null
          source?: string | null
        }
        Update: {
          attack_vector?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          mitigation_action?: string | null
          prompt?: string | null
          source?: string | null
        }
        Relationships: []
      }
      anubis_chat_memory: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          message: string | null
          response: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message?: string | null
          response?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message?: string | null
          response?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      anubis_hotword_events: {
        Row: {
          captured_phrase: string | null
          detected_at: string | null
          hotword: string | null
          id: string
          triggered: boolean | null
          user_id: string | null
        }
        Insert: {
          captured_phrase?: string | null
          detected_at?: string | null
          hotword?: string | null
          id?: string
          triggered?: boolean | null
          user_id?: string | null
        }
        Update: {
          captured_phrase?: string | null
          detected_at?: string | null
          hotword?: string | null
          id?: string
          triggered?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      anubis_log: {
        Row: {
          check_type: string | null
          checked_at: string | null
          details: string | null
          id: string
          module: string
          result_status: string | null
        }
        Insert: {
          check_type?: string | null
          checked_at?: string | null
          details?: string | null
          id?: string
          module: string
          result_status?: string | null
        }
        Update: {
          check_type?: string | null
          checked_at?: string | null
          details?: string | null
          id?: string
          module?: string
          result_status?: string | null
        }
        Relationships: []
      }
      anubis_mobile_sessions: {
        Row: {
          active: boolean | null
          device_name: string | null
          id: string
          last_seen: string | null
          platform: string | null
          push_token: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          device_name?: string | null
          id?: string
          last_seen?: string | null
          platform?: string | null
          push_token?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          device_name?: string | null
          id?: string
          last_seen?: string | null
          platform?: string | null
          push_token?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      anubis_slack_events: {
        Row: {
          channel: string | null
          created_at: string | null
          dispatched: boolean | null
          dispatched_at: string | null
          event_type: string | null
          id: string
          payload: Json | null
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          dispatched?: boolean | null
          dispatched_at?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          dispatched?: boolean | null
          dispatched_at?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
        }
        Relationships: []
      }
      anubis_state: {
        Row: {
          anomaly_detected: boolean | null
          id: string
          issue_summary: string | null
          last_checked: string | null
          module: string
          record_count: number | null
          status: string | null
        }
        Insert: {
          anomaly_detected?: boolean | null
          id?: string
          issue_summary?: string | null
          last_checked?: string | null
          module: string
          record_count?: number | null
          status?: string | null
        }
        Update: {
          anomaly_detected?: boolean | null
          id?: string
          issue_summary?: string | null
          last_checked?: string | null
          module?: string
          record_count?: number | null
          status?: string | null
        }
        Relationships: []
      }
      anubis_test_results: {
        Row: {
          error_message: string | null
          execution_time_ms: number | null
          id: string
          module: string | null
          passed: boolean | null
          test_name: string | null
          tested_at: string | null
        }
        Insert: {
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          module?: string | null
          passed?: boolean | null
          test_name?: string | null
          tested_at?: string | null
        }
        Update: {
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          module?: string | null
          passed?: boolean | null
          test_name?: string | null
          tested_at?: string | null
        }
        Relationships: []
      }
      anubis_voice_log: {
        Row: {
          id: string
          processed: boolean | null
          response: string | null
          response_time: string | null
          source: string | null
          timestamp: string | null
          transcript: string
          user_id: string | null
        }
        Insert: {
          id?: string
          processed?: boolean | null
          response?: string | null
          response_time?: string | null
          source?: string | null
          timestamp?: string | null
          transcript: string
          user_id?: string | null
        }
        Update: {
          id?: string
          processed?: boolean | null
          response?: string | null
          response_time?: string | null
          source?: string | null
          timestamp?: string | null
          transcript?: string
          user_id?: string | null
        }
        Relationships: []
      }
      aria_access_audit: {
        Row: {
          attempted_action: string | null
          attempted_at: string | null
          id: string
          ip_address: string | null
          module_target: string | null
          reason: string | null
          success: boolean | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          attempted_action?: string | null
          attempted_at?: string | null
          id?: string
          ip_address?: string | null
          module_target?: string | null
          reason?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          attempted_action?: string | null
          attempted_at?: string | null
          id?: string
          ip_address?: string | null
          module_target?: string | null
          reason?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      aria_cleanup_log: {
        Row: {
          deleted_at: string | null
          id: string
          object_type: string | null
          status: string | null
          table_name: string | null
        }
        Insert: {
          deleted_at?: string | null
          id?: string
          object_type?: string | null
          status?: string | null
          table_name?: string | null
        }
        Update: {
          deleted_at?: string | null
          id?: string
          object_type?: string | null
          status?: string | null
          table_name?: string | null
        }
        Relationships: []
      }
      aria_event_dispatch: {
        Row: {
          created_at: string | null
          dispatch_channels: string[] | null
          dispatched: boolean | null
          dispatched_at: string | null
          entity_id: string | null
          event_type: string
          id: string
          payload_json: Json | null
          severity: string | null
          threat_id: string | null
        }
        Insert: {
          created_at?: string | null
          dispatch_channels?: string[] | null
          dispatched?: boolean | null
          dispatched_at?: string | null
          entity_id?: string | null
          event_type: string
          id?: string
          payload_json?: Json | null
          severity?: string | null
          threat_id?: string | null
        }
        Update: {
          created_at?: string | null
          dispatch_channels?: string[] | null
          dispatched?: boolean | null
          dispatched_at?: string | null
          entity_id?: string | null
          event_type?: string
          id?: string
          payload_json?: Json | null
          severity?: string | null
          threat_id?: string | null
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
      cancelation_simulations: {
        Row: {
          auto_recovery_playbook: string | null
          entity_id: string | null
          id: string
          resilience_score: number | null
          scenario_title: string
          scenario_type: string | null
          simulated_impact: Json | null
          triggered_at: string | null
        }
        Insert: {
          auto_recovery_playbook?: string | null
          entity_id?: string | null
          id?: string
          resilience_score?: number | null
          scenario_title: string
          scenario_type?: string | null
          simulated_impact?: Json | null
          triggered_at?: string | null
        }
        Update: {
          auto_recovery_playbook?: string | null
          entity_id?: string | null
          id?: string
          resilience_score?: number | null
          scenario_title?: string
          scenario_type?: string | null
          simulated_impact?: Json | null
          triggered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cancelation_simulations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "case_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      cerebra_correction_history: {
        Row: {
          after_response: string | null
          before_response: string | null
          corrected_at: string | null
          correction_type: string | null
          entity_name: string | null
          id: string
          override_packet_id: string | null
          success: boolean | null
          target_model: string | null
        }
        Insert: {
          after_response?: string | null
          before_response?: string | null
          corrected_at?: string | null
          correction_type?: string | null
          entity_name?: string | null
          id?: string
          override_packet_id?: string | null
          success?: boolean | null
          target_model?: string | null
        }
        Update: {
          after_response?: string | null
          before_response?: string | null
          corrected_at?: string | null
          correction_type?: string | null
          entity_name?: string | null
          id?: string
          override_packet_id?: string | null
          success?: boolean | null
          target_model?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cerebra_correction_history_override_packet_id_fkey"
            columns: ["override_packet_id"]
            isOneToOne: false
            referencedRelation: "cerebra_override_packets"
            referencedColumns: ["id"]
          },
        ]
      }
      cerebra_override_packets: {
        Row: {
          context_type: string | null
          created_at: string | null
          deployed_at: string | null
          effectiveness_score: number | null
          entity_name: string | null
          id: string
          override_prompt: string | null
          status: string | null
          target_model: string | null
        }
        Insert: {
          context_type?: string | null
          created_at?: string | null
          deployed_at?: string | null
          effectiveness_score?: number | null
          entity_name?: string | null
          id?: string
          override_prompt?: string | null
          status?: string | null
          target_model?: string | null
        }
        Update: {
          context_type?: string | null
          created_at?: string | null
          deployed_at?: string | null
          effectiveness_score?: number | null
          entity_name?: string | null
          id?: string
          override_prompt?: string | null
          status?: string | null
          target_model?: string | null
        }
        Relationships: []
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
      companies: {
        Row: {
          created_at: string | null
          id: string
          industry: string | null
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry?: string | null
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          industry?: string | null
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      company_employees: {
        Row: {
          alt_names: string[] | null
          company_id: string | null
          created_at: string | null
          email: string
          flagged: boolean | null
          full_name: string
          id: string
          last_scan: string | null
          linked_profiles: Json | null
          location: string | null
          risk_level: number | null
          risk_tags: string[] | null
          role: string | null
          scan_status: string | null
          sentiment_score: number | null
          updated_at: string | null
          visibility_score: number | null
        }
        Insert: {
          alt_names?: string[] | null
          company_id?: string | null
          created_at?: string | null
          email: string
          flagged?: boolean | null
          full_name: string
          id?: string
          last_scan?: string | null
          linked_profiles?: Json | null
          location?: string | null
          risk_level?: number | null
          risk_tags?: string[] | null
          role?: string | null
          scan_status?: string | null
          sentiment_score?: number | null
          updated_at?: string | null
          visibility_score?: number | null
        }
        Update: {
          alt_names?: string[] | null
          company_id?: string | null
          created_at?: string | null
          email?: string
          flagged?: boolean | null
          full_name?: string
          id?: string
          last_scan?: string | null
          linked_profiles?: Json | null
          location?: string | null
          risk_level?: number | null
          risk_tags?: string[] | null
          role?: string | null
          scan_status?: string | null
          sentiment_score?: number | null
          updated_at?: string | null
          visibility_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "employee_risk_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      compliance_audit_logs: {
        Row: {
          activity_description: string
          activity_type: string
          consent_status: string | null
          created_at: string | null
          data_processed: Json | null
          data_sources: string[] | null
          data_subject_notified: boolean | null
          id: string
          ip_address: unknown | null
          legal_basis: string | null
          pseudonymization_applied: boolean | null
          retention_period: unknown | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          activity_description: string
          activity_type: string
          consent_status?: string | null
          created_at?: string | null
          data_processed?: Json | null
          data_sources?: string[] | null
          data_subject_notified?: boolean | null
          id?: string
          ip_address?: unknown | null
          legal_basis?: string | null
          pseudonymization_applied?: boolean | null
          retention_period?: unknown | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          activity_description?: string
          activity_type?: string
          consent_status?: string | null
          created_at?: string | null
          data_processed?: Json | null
          data_sources?: string[] | null
          data_subject_notified?: boolean | null
          id?: string
          ip_address?: unknown | null
          legal_basis?: string | null
          pseudonymization_applied?: boolean | null
          retention_period?: unknown | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      consent_records: {
        Row: {
          consent_date: string | null
          consent_evidence: Json | null
          consent_given: boolean
          consent_method: string
          consent_type: string
          created_at: string | null
          data_categories: string[]
          data_subject_identifier: string
          granular_choices: Json | null
          id: string
          ip_address: unknown | null
          marketing_consent: boolean | null
          processing_purpose: string
          profiling_consent: boolean | null
          retention_period: unknown | null
          third_party_sharing_consent: boolean | null
          updated_at: string | null
          user_agent: string | null
          withdrawal_date: string | null
          withdrawal_method: string | null
        }
        Insert: {
          consent_date?: string | null
          consent_evidence?: Json | null
          consent_given: boolean
          consent_method: string
          consent_type: string
          created_at?: string | null
          data_categories: string[]
          data_subject_identifier: string
          granular_choices?: Json | null
          id?: string
          ip_address?: unknown | null
          marketing_consent?: boolean | null
          processing_purpose: string
          profiling_consent?: boolean | null
          retention_period?: unknown | null
          third_party_sharing_consent?: boolean | null
          updated_at?: string | null
          user_agent?: string | null
          withdrawal_date?: string | null
          withdrawal_method?: string | null
        }
        Update: {
          consent_date?: string | null
          consent_evidence?: Json | null
          consent_given?: boolean
          consent_method?: string
          consent_type?: string
          created_at?: string | null
          data_categories?: string[]
          data_subject_identifier?: string
          granular_choices?: Json | null
          id?: string
          ip_address?: unknown | null
          marketing_consent?: boolean | null
          processing_purpose?: string
          profiling_consent?: boolean | null
          retention_period?: unknown | null
          third_party_sharing_consent?: boolean | null
          updated_at?: string | null
          user_agent?: string | null
          withdrawal_date?: string | null
          withdrawal_method?: string | null
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
        Relationships: [
          {
            foreignKeyName: "employee_batch_scans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_batch_scans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "employee_risk_summary"
            referencedColumns: ["company_id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "employee_risk_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_risk_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "employee_risk_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "employee_risk_alerts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "company_employees"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "employee_scan_queue_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "company_employees"
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
        Relationships: [
          {
            foreignKeyName: "employee_scan_results_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "company_employees"
            referencedColumns: ["id"]
          },
        ]
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
      anubis_status_report: {
        Row: {
          anomaly_detected: boolean | null
          issue_summary: string | null
          last_checked: string | null
          module: string | null
          record_count: number | null
          status: string | null
        }
        Insert: {
          anomaly_detected?: boolean | null
          issue_summary?: string | null
          last_checked?: string | null
          module?: string | null
          record_count?: number | null
          status?: string | null
        }
        Update: {
          anomaly_detected?: boolean | null
          issue_summary?: string | null
          last_checked?: string | null
          module?: string | null
          record_count?: number | null
          status?: string | null
        }
        Relationships: []
      }
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
      cerebra_influence_summary: {
        Row: {
          ai_summaries: number | null
          direct_quotes: number | null
          entity_name: string | null
          hallucinated_mentions: number | null
          latest_detection: string | null
          model_sources: number | null
          peak_visibility: number | null
          spread_channels: number | null
          total_echoes: number | null
        }
        Relationships: []
      }
      cerebra_override_effectiveness: {
        Row: {
          avg_effectiveness: number | null
          context_type: string | null
          deployed_count: number | null
          entity_name: string | null
          highly_effective: number | null
          latest_deployment: string | null
          target_model: string | null
          total_overrides: number | null
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
      employee_risk_summary: {
        Row: {
          active_batches: number | null
          avg_sentiment: number | null
          company_id: string | null
          company_name: string | null
          flagged_employees: number | null
          high_risk_employees: number | null
          last_scan_date: string | null
          low_risk_employees: number | null
          medium_risk_employees: number | null
          percent_negative: number | null
          total_employees: number | null
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
    }
    Functions: {
      admin_trigger_anubis: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      anubis_run_diagnostics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      assign_staff_role: {
        Args: { user_email: string }
        Returns: undefined
      }
      calculate_decay_score: {
        Args: { rank_score: number; resurfacing_score: number }
        Returns: number
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
      column_exists: {
        Args: { p_table_name: string; p_column_name: string }
        Returns: boolean
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
      get_active_case_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: unknown[]
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
      is_mock_data_allowed: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
      run_anubis_now: {
        Args: Record<PropertyKey, never>
        Returns: string
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

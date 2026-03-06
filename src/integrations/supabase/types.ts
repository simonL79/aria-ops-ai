export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
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
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      anubis_entity_memory: {
        Row: {
          content: string | null
          created_at: string
          entity_name: string | null
          id: string
          memory_summary: string | null
          memory_type: string | null
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          entity_name?: string | null
          id?: string
          memory_summary?: string | null
          memory_type?: string | null
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          entity_name?: string | null
          id?: string
          memory_summary?: string | null
          memory_type?: string | null
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      anubis_pattern_log: {
        Row: {
          confidence: number | null
          created_at: string
          entity_name: string | null
          id: string
          metadata: Json | null
          pattern_fingerprint: string | null
          pattern_type: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          pattern_fingerprint?: string | null
          pattern_type?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          pattern_fingerprint?: string | null
          pattern_type?: string | null
        }
        Relationships: []
      }
      aria_client_intakes: {
        Row: {
          client_name: string
          contact_email: string | null
          contact_name: string | null
          created_at: string
          details: string | null
          id: string
          metadata: Json | null
          service_type: string | null
          status: string | null
          updated_at: string
          urgency: string | null
        }
        Insert: {
          client_name: string
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          details?: string | null
          id?: string
          metadata?: Json | null
          service_type?: string | null
          status?: string | null
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          client_name?: string
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          details?: string | null
          id?: string
          metadata?: Json | null
          service_type?: string | null
          status?: string | null
          updated_at?: string
          urgency?: string | null
        }
        Relationships: []
      }
      aria_notifications: {
        Row: {
          created_at: string
          entity_name: string | null
          event_type: string
          id: string
          metadata: Json | null
          priority: string | null
          seen: boolean | null
          summary: string | null
        }
        Insert: {
          created_at?: string
          entity_name?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          seen?: boolean | null
          summary?: string | null
        }
        Update: {
          created_at?: string
          entity_name?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          seen?: boolean | null
          summary?: string | null
        }
        Relationships: []
      }
      aria_ops_log: {
        Row: {
          created_at: string
          entity_name: string | null
          execution_time_ms: number | null
          id: string
          module_source: string | null
          operation_data: Json | null
          operation_type: string
          success: boolean | null
        }
        Insert: {
          created_at?: string
          entity_name?: string | null
          execution_time_ms?: number | null
          id?: string
          module_source?: string | null
          operation_data?: Json | null
          operation_type: string
          success?: boolean | null
        }
        Update: {
          created_at?: string
          entity_name?: string | null
          execution_time_ms?: number | null
          id?: string
          module_source?: string | null
          operation_data?: Json | null
          operation_type?: string
          success?: boolean | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          image: string | null
          medium_url: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          slug: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image?: string | null
          medium_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          slug?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image?: string | null
          medium_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          slug?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_entities: {
        Row: {
          alias: string | null
          client_id: string
          created_at: string
          entity_name: string
          entity_type: string | null
          id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          alias?: string | null
          client_id: string
          created_at?: string
          entity_name: string
          entity_type?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          alias?: string | null
          client_id?: string
          created_at?: string
          entity_name?: string
          entity_type?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
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
          brand_or_alias: string | null
          consent_to_process: boolean | null
          created_at: string
          email: string
          focus_scope: string | null
          full_name: string
          gdpr_agreed_at: string | null
          id: string
          known_aliases: string[] | null
          metadata: Json | null
          operational_mode: string | null
          prior_attacks: boolean | null
          problematic_platforms: string[] | null
          status: string | null
          topics_to_flag: string[] | null
          updated_at: string
        }
        Insert: {
          brand_or_alias?: string | null
          consent_to_process?: boolean | null
          created_at?: string
          email: string
          focus_scope?: string | null
          full_name: string
          gdpr_agreed_at?: string | null
          id?: string
          known_aliases?: string[] | null
          metadata?: Json | null
          operational_mode?: string | null
          prior_attacks?: boolean | null
          problematic_platforms?: string[] | null
          status?: string | null
          topics_to_flag?: string[] | null
          updated_at?: string
        }
        Update: {
          brand_or_alias?: string | null
          consent_to_process?: boolean | null
          created_at?: string
          email?: string
          focus_scope?: string | null
          full_name?: string
          gdpr_agreed_at?: string | null
          id?: string
          known_aliases?: string[] | null
          metadata?: Json | null
          operational_mode?: string | null
          prior_attacks?: boolean | null
          problematic_platforms?: string[] | null
          status?: string | null
          topics_to_flag?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          client_type: string | null
          contactemail: string | null
          contactname: string | null
          created_at: string
          id: string
          industry: string | null
          keywordtargets: string | null
          name: string
          notes: string | null
          status: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          client_type?: string | null
          contactemail?: string | null
          contactname?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          keywordtargets?: string | null
          name: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          client_type?: string | null
          contactemail?: string | null
          contactname?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          keywordtargets?: string | null
          name?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      content_sources: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          published_at: string | null
          source_type: string | null
          status: string | null
          summary: string | null
          tags: string[] | null
          title: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          published_at?: string | null
          source_type?: string | null
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          published_at?: string | null
          source_type?: string | null
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      counter_narratives: {
        Row: {
          content: string | null
          created_at: string
          entity_name: string | null
          id: string
          metadata: Json | null
          narrative_type: string | null
          platform: string | null
          status: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          narrative_type?: string | null
          platform?: string | null
          status?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          narrative_type?: string | null
          platform?: string | null
          status?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      darkweb_agents: {
        Row: {
          agent_name: string | null
          created_at: string
          id: string
          metadata: Json | null
          results: Json | null
          started_at: string | null
          status: string | null
          target: string | null
        }
        Insert: {
          agent_name?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          results?: Json | null
          started_at?: string | null
          status?: string | null
          target?: string | null
        }
        Update: {
          agent_name?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          results?: Json | null
          started_at?: string | null
          status?: string | null
          target?: string | null
        }
        Relationships: []
      }
      data_breach_incidents: {
        Row: {
          affected_records: number | null
          created_at: string
          description: string | null
          id: string
          incident_type: string | null
          metadata: Json | null
          reported_at: string | null
          resolved_at: string | null
          severity: string | null
          status: string | null
        }
        Insert: {
          affected_records?: number | null
          created_at?: string
          description?: string | null
          id?: string
          incident_type?: string | null
          metadata?: Json | null
          reported_at?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
        }
        Update: {
          affected_records?: number | null
          created_at?: string
          description?: string | null
          id?: string
          incident_type?: string | null
          metadata?: Json | null
          reported_at?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
        }
        Relationships: []
      }
      data_retention_schedule: {
        Row: {
          created_at: string
          data_type: string | null
          deletion_job_name: string | null
          id: string
          last_review_date: string | null
          metadata: Json | null
          next_review_date: string | null
          retention_period: string | null
          review_frequency: string | null
          status: string | null
          table_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_type?: string | null
          deletion_job_name?: string | null
          id?: string
          last_review_date?: string | null
          metadata?: Json | null
          next_review_date?: string | null
          retention_period?: string | null
          review_frequency?: string | null
          status?: string | null
          table_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_type?: string | null
          deletion_job_name?: string | null
          id?: string
          last_review_date?: string | null
          metadata?: Json | null
          next_review_date?: string | null
          retention_period?: string | null
          review_frequency?: string | null
          status?: string | null
          table_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      data_subject_requests: {
        Row: {
          automated_decisions_reviewed: boolean | null
          completed_at: string | null
          created_at: string
          data_categories: string[] | null
          data_deleted: boolean | null
          data_exported: boolean | null
          data_subject_email: string | null
          data_subject_name: string | null
          deadline: string | null
          details: string | null
          id: string
          identity_verified: boolean | null
          metadata: Json | null
          objection_grounds: string | null
          processing_notes: string | null
          request_details: string | null
          request_type: string | null
          response_date: string | null
          response_sent: boolean | null
          restriction_applied: boolean | null
          status: string | null
          subject_email: string | null
          subject_name: string | null
          systems_affected: string[] | null
          third_parties_notified: boolean | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          automated_decisions_reviewed?: boolean | null
          completed_at?: string | null
          created_at?: string
          data_categories?: string[] | null
          data_deleted?: boolean | null
          data_exported?: boolean | null
          data_subject_email?: string | null
          data_subject_name?: string | null
          deadline?: string | null
          details?: string | null
          id?: string
          identity_verified?: boolean | null
          metadata?: Json | null
          objection_grounds?: string | null
          processing_notes?: string | null
          request_details?: string | null
          request_type?: string | null
          response_date?: string | null
          response_sent?: boolean | null
          restriction_applied?: boolean | null
          status?: string | null
          subject_email?: string | null
          subject_name?: string | null
          systems_affected?: string[] | null
          third_parties_notified?: boolean | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          automated_decisions_reviewed?: boolean | null
          completed_at?: string | null
          created_at?: string
          data_categories?: string[] | null
          data_deleted?: boolean | null
          data_exported?: boolean | null
          data_subject_email?: string | null
          data_subject_name?: string | null
          deadline?: string | null
          details?: string | null
          id?: string
          identity_verified?: boolean | null
          metadata?: Json | null
          objection_grounds?: string | null
          processing_notes?: string | null
          request_details?: string | null
          request_type?: string | null
          response_date?: string | null
          response_sent?: boolean | null
          restriction_applied?: boolean | null
          status?: string | null
          subject_email?: string | null
          subject_name?: string | null
          systems_affected?: string[] | null
          third_parties_notified?: boolean | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      dpia_records: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          assessment_title: string | null
          consultation_required: boolean | null
          created_at: string
          data_categories: string | null
          data_minimization_measures: string | null
          data_retention_period: string | null
          data_types: string | null
          dpo_opinion: string | null
          entity_name: string | null
          id: string
          identified_risks: Json | null
          legal_basis: string | null
          metadata: Json | null
          mitigation_measures: Json | null
          necessity_justification: string | null
          processing_purpose: string | null
          proportionality_assessment: string | null
          residual_risk: string | null
          review_date: string | null
          security_measures: string | null
          status: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          assessment_title?: string | null
          consultation_required?: boolean | null
          created_at?: string
          data_categories?: string | null
          data_minimization_measures?: string | null
          data_retention_period?: string | null
          data_types?: string | null
          dpo_opinion?: string | null
          entity_name?: string | null
          id?: string
          identified_risks?: Json | null
          legal_basis?: string | null
          metadata?: Json | null
          mitigation_measures?: Json | null
          necessity_justification?: string | null
          processing_purpose?: string | null
          proportionality_assessment?: string | null
          residual_risk?: string | null
          review_date?: string | null
          security_measures?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          assessment_title?: string | null
          consultation_required?: boolean | null
          created_at?: string
          data_categories?: string | null
          data_minimization_measures?: string | null
          data_retention_period?: string | null
          data_types?: string | null
          dpo_opinion?: string | null
          entity_name?: string | null
          id?: string
          identified_risks?: Json | null
          legal_basis?: string | null
          metadata?: Json | null
          mitigation_measures?: Json | null
          necessity_justification?: string | null
          processing_purpose?: string | null
          proportionality_assessment?: string | null
          residual_risk?: string | null
          review_date?: string | null
          security_measures?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      entities: {
        Row: {
          created_at: string
          description: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      entity_fingerprints_advanced: {
        Row: {
          aliases: string[] | null
          confidence_score: number | null
          context_tags: string[] | null
          created_at: string
          entity_id: string | null
          false_positive_blocklist: string[] | null
          id: string
          locations: string[] | null
          metadata: Json | null
          organization: string | null
          primary_name: string | null
          updated_at: string
        }
        Insert: {
          aliases?: string[] | null
          confidence_score?: number | null
          context_tags?: string[] | null
          created_at?: string
          entity_id?: string | null
          false_positive_blocklist?: string[] | null
          id?: string
          locations?: string[] | null
          metadata?: Json | null
          organization?: string | null
          primary_name?: string | null
          updated_at?: string
        }
        Update: {
          aliases?: string[] | null
          confidence_score?: number | null
          context_tags?: string[] | null
          created_at?: string
          entity_id?: string | null
          false_positive_blocklist?: string[] | null
          id?: string
          locations?: string[] | null
          metadata?: Json | null
          organization?: string | null
          primary_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      entity_precision_stats: {
        Row: {
          created_at: string
          entity_name: string | null
          false_positives: number | null
          id: string
          metadata: Json | null
          precision_score: number | null
          recall_score: number | null
          total_scans: number | null
          true_positives: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_name?: string | null
          false_positives?: number | null
          id?: string
          metadata?: Json | null
          precision_score?: number | null
          recall_score?: number | null
          total_scans?: number | null
          true_positives?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_name?: string | null
          false_positives?: number | null
          id?: string
          metadata?: Json | null
          precision_score?: number | null
          recall_score?: number | null
          total_scans?: number | null
          true_positives?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      lead_magnets: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          metadata: Json | null
          name: string | null
          phone: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      lia_records: {
        Row: {
          assessment_type: string | null
          created_at: string
          details: Json | null
          entity_name: string | null
          id: string
          risk_level: string | null
          status: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          assessment_type?: string | null
          created_at?: string
          details?: Json | null
          entity_name?: string | null
          id?: string
          risk_level?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          assessment_type?: string | null
          created_at?: string
          details?: Json | null
          entity_name?: string | null
          id?: string
          risk_level?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      live_status: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          last_report: string | null
          name: string
          system_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          last_report?: string | null
          name: string
          system_status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          last_report?: string | null
          name?: string
          system_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      llm_watchdog_logs: {
        Row: {
          created_at: string
          entity_name: string | null
          id: string
          llm_provider: string | null
          metadata: Json | null
          query: string | null
          response: string | null
          risk_level: string | null
          timestamp: string | null
        }
        Insert: {
          created_at?: string
          entity_name?: string | null
          id?: string
          llm_provider?: string | null
          metadata?: Json | null
          query?: string | null
          response?: string | null
          risk_level?: string | null
          timestamp?: string | null
        }
        Update: {
          created_at?: string
          entity_name?: string | null
          id?: string
          llm_provider?: string | null
          metadata?: Json | null
          query?: string | null
          response?: string | null
          risk_level?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      monitored_platforms: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          platform_name: string
          platform_type: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform_name: string
          platform_type?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform_name?: string
          platform_type?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      monitoring_status: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          is_active: boolean | null
          last_check: string | null
          module_name: string
          sources_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          is_active?: boolean | null
          last_check?: string | null
          module_name: string
          sources_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          is_active?: boolean | null
          last_check?: string | null
          module_name?: string
          sources_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      multilingual_threats: {
        Row: {
          content: string | null
          created_at: string
          detected_at: string | null
          entity_name: string | null
          id: string
          language: string | null
          metadata: Json | null
          severity: string | null
          source: string | null
          translated_content: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          detected_at?: string | null
          entity_name?: string | null
          id?: string
          language?: string | null
          metadata?: Json | null
          severity?: string | null
          source?: string | null
          translated_content?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          detected_at?: string | null
          entity_name?: string | null
          id?: string
          language?: string | null
          metadata?: Json | null
          severity?: string | null
          source?: string | null
          translated_content?: string | null
        }
        Relationships: []
      }
      narrative_clusters: {
        Row: {
          cluster_data: Json | null
          created_at: string
          entity_name: string | null
          id: string
          intent_label: string | null
          narrative_snippet: string | null
          source_platform: string | null
        }
        Insert: {
          cluster_data?: Json | null
          created_at?: string
          entity_name?: string | null
          id?: string
          intent_label?: string | null
          narrative_snippet?: string | null
          source_platform?: string | null
        }
        Update: {
          cluster_data?: Json | null
          created_at?: string
          entity_name?: string | null
          id?: string
          intent_label?: string | null
          narrative_snippet?: string | null
          source_platform?: string | null
        }
        Relationships: []
      }
      persona_saturation_campaigns: {
        Row: {
          campaign_name: string | null
          content: Json | null
          created_at: string
          entity_name: string | null
          id: string
          metrics: Json | null
          platforms: string[] | null
          status: string | null
          updated_at: string
        }
        Insert: {
          campaign_name?: string | null
          content?: Json | null
          created_at?: string
          entity_name?: string | null
          id?: string
          metrics?: Json | null
          platforms?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          campaign_name?: string | null
          content?: Json | null
          created_at?: string
          entity_name?: string | null
          id?: string
          metrics?: Json | null
          platforms?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      privacy_notices: {
        Row: {
          content: string | null
          created_at: string
          effective_date: string | null
          id: string
          metadata: Json | null
          status: string | null
          title: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          effective_date?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          title?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          effective_date?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          title?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      reputation_scan_submissions: {
        Row: {
          company: string | null
          created_at: string
          details: string | null
          email: string | null
          full_name: string | null
          id: string
          metadata: Json | null
          phone: string | null
          scan_type: string | null
          status: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          details?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          metadata?: Json | null
          phone?: string | null
          scan_type?: string | null
          status?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          details?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          metadata?: Json | null
          phone?: string | null
          scan_type?: string | null
          status?: string | null
        }
        Relationships: []
      }
      rsi_queue: {
        Row: {
          created_at: string
          entity_name: string | null
          id: string
          payload: Json | null
          priority: string | null
          status: string | null
          task_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_name?: string | null
          id?: string
          payload?: Json | null
          priority?: string | null
          status?: string | null
          task_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_name?: string | null
          id?: string
          payload?: Json | null
          priority?: string | null
          status?: string | null
          task_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scan_results: {
        Row: {
          confidence_score: number | null
          content: string | null
          created_at: string
          detected_entities: Json | null
          entity_name: string | null
          id: string
          metadata: Json | null
          platform: string | null
          potential_reach: number | null
          sentiment: string | null
          severity: string | null
          source_type: string | null
          status: string | null
          threat_type: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          confidence_score?: number | null
          content?: string | null
          created_at?: string
          detected_entities?: Json | null
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          platform?: string | null
          potential_reach?: number | null
          sentiment?: string | null
          severity?: string | null
          source_type?: string | null
          status?: string | null
          threat_type?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          confidence_score?: number | null
          content?: string | null
          created_at?: string
          detected_entities?: Json | null
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          platform?: string | null
          potential_reach?: number | null
          sentiment?: string | null
          severity?: string | null
          source_type?: string | null
          status?: string | null
          threat_type?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      scanner_query_log: {
        Row: {
          executed_at: string
          execution_time_ms: number | null
          id: string
          metadata: Json | null
          platform: string | null
          query_text: string | null
          results_count: number | null
          results_matched_entity: number | null
          source: string | null
          total_results_returned: number | null
        }
        Insert: {
          executed_at?: string
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          platform?: string | null
          query_text?: string | null
          results_count?: number | null
          results_matched_entity?: number | null
          source?: string | null
          total_results_returned?: number | null
        }
        Update: {
          executed_at?: string
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          platform?: string | null
          query_text?: string | null
          results_count?: number | null
          results_matched_entity?: number | null
          source?: string | null
          total_results_returned?: number | null
        }
        Relationships: []
      }
      strategy_responses: {
        Row: {
          actions: Json | null
          content: string | null
          created_at: string
          description: string | null
          entity_name: string | null
          executed_at: string | null
          execution_result: Json | null
          id: string
          metadata: Json | null
          priority: string | null
          resources: Json | null
          status: string | null
          strategy_id: string | null
          strategy_type: string | null
          timeframe: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          actions?: Json | null
          content?: string | null
          created_at?: string
          description?: string | null
          entity_name?: string | null
          executed_at?: string | null
          execution_result?: Json | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          resources?: Json | null
          status?: string | null
          strategy_id?: string | null
          strategy_type?: string | null
          timeframe?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          actions?: Json | null
          content?: string | null
          created_at?: string
          description?: string | null
          entity_name?: string | null
          executed_at?: string | null
          execution_result?: Json | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          resources?: Json | null
          status?: string | null
          strategy_id?: string | null
          strategy_type?: string | null
          timeframe?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      strike_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          entity_name: string | null
          id: string
          metadata: Json | null
          platform: string | null
          reason: string | null
          status: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          platform?: string | null
          reason?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          platform?: string | null
          reason?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      suppression_assets: {
        Row: {
          asset_type: string | null
          created_at: string
          id: string
          metadata: Json | null
          published_at: string | null
          status: string | null
          title: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          asset_type?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          published_at?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          asset_type?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          published_at?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      system_config: {
        Row: {
          config_key: string
          config_value: string | null
          created_at: string
          description: string | null
          id: string
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value?: string | null
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: string | null
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_health_checks: {
        Row: {
          check_type: string | null
          created_at: string
          details: Json | null
          id: string
          metrics: Json | null
          status: string | null
        }
        Insert: {
          check_type?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          metrics?: Json | null
          status?: string | null
        }
        Update: {
          check_type?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          metrics?: Json | null
          status?: string | null
        }
        Relationships: []
      }
      threats: {
        Row: {
          content: string | null
          created_at: string
          entity_name: string | null
          id: string
          metadata: Json | null
          severity: string | null
          source: string | null
          status: string | null
          threat_type: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          severity?: string | null
          source?: string | null
          status?: string | null
          threat_type?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          entity_name?: string | null
          id?: string
          metadata?: Json | null
          severity?: string | null
          source?: string | null
          status?: string | null
          threat_type?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_compliance_activity: {
        Args: {
          p_activity_type?: string
          p_description?: string
          p_entity_name?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

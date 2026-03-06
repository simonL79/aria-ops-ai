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
          user_email?: string | null
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
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          status: string | null
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
          status?: string | null
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
          status?: string | null
          updated_at?: string
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
          automated_deletion: boolean | null
          created_at: string
          cross_border_considerations: string | null
          data_category: string | null
          data_type: string | null
          deletion_job_name: string | null
          deletion_method: string | null
          exceptions: string | null
          id: string
          last_review_date: string | null
          legal_basis: string | null
          metadata: Json | null
          next_review_date: string | null
          responsible_team: string | null
          retention_justification: string | null
          retention_period: string | null
          review_frequency: string | null
          status: string | null
          table_name: string | null
          updated_at: string
        }
        Insert: {
          automated_deletion?: boolean | null
          created_at?: string
          cross_border_considerations?: string | null
          data_category?: string | null
          data_type?: string | null
          deletion_job_name?: string | null
          deletion_method?: string | null
          exceptions?: string | null
          id?: string
          last_review_date?: string | null
          legal_basis?: string | null
          metadata?: Json | null
          next_review_date?: string | null
          responsible_team?: string | null
          retention_justification?: string | null
          retention_period?: string | null
          review_frequency?: string | null
          status?: string | null
          table_name?: string | null
          updated_at?: string
        }
        Update: {
          automated_deletion?: boolean | null
          created_at?: string
          cross_border_considerations?: string | null
          data_category?: string | null
          data_type?: string | null
          deletion_job_name?: string | null
          deletion_method?: string | null
          exceptions?: string | null
          id?: string
          last_review_date?: string | null
          legal_basis?: string | null
          metadata?: Json | null
          next_review_date?: string | null
          responsible_team?: string | null
          retention_justification?: string | null
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
          appeal_status: string | null
          assigned_to: string | null
          automated_decisions_reviewed: boolean | null
          closure_reason: string | null
          communication_log: Json | null
          completed_at: string | null
          created_at: string
          data_categories: string[] | null
          data_deleted: boolean | null
          data_exported: boolean | null
          data_mapping: Json | null
          data_subject_email: string | null
          data_subject_name: string | null
          deadline: string | null
          details: string | null
          id: string
          identity_verified: boolean | null
          impact_assessment: string | null
          legal_basis_for_refusal: string | null
          metadata: Json | null
          objection_grounds: string | null
          priority: string | null
          processing_notes: string | null
          processing_systems: string[] | null
          regulatory_authority: string | null
          request_date: string | null
          request_details: string | null
          request_type: string | null
          response_date: string | null
          response_method: string | null
          response_sent: boolean | null
          restriction_applied: boolean | null
          review_notes: string | null
          status: string | null
          subject_email: string | null
          subject_name: string | null
          systems_affected: string[] | null
          third_parties_notified: boolean | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          appeal_status?: string | null
          assigned_to?: string | null
          automated_decisions_reviewed?: boolean | null
          closure_reason?: string | null
          communication_log?: Json | null
          completed_at?: string | null
          created_at?: string
          data_categories?: string[] | null
          data_deleted?: boolean | null
          data_exported?: boolean | null
          data_mapping?: Json | null
          data_subject_email?: string | null
          data_subject_name?: string | null
          deadline?: string | null
          details?: string | null
          id?: string
          identity_verified?: boolean | null
          impact_assessment?: string | null
          legal_basis_for_refusal?: string | null
          metadata?: Json | null
          objection_grounds?: string | null
          priority?: string | null
          processing_notes?: string | null
          processing_systems?: string[] | null
          regulatory_authority?: string | null
          request_date?: string | null
          request_details?: string | null
          request_type?: string | null
          response_date?: string | null
          response_method?: string | null
          response_sent?: boolean | null
          restriction_applied?: boolean | null
          review_notes?: string | null
          status?: string | null
          subject_email?: string | null
          subject_name?: string | null
          systems_affected?: string[] | null
          third_parties_notified?: boolean | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          appeal_status?: string | null
          assigned_to?: string | null
          automated_decisions_reviewed?: boolean | null
          closure_reason?: string | null
          communication_log?: Json | null
          completed_at?: string | null
          created_at?: string
          data_categories?: string[] | null
          data_deleted?: boolean | null
          data_exported?: boolean | null
          data_mapping?: Json | null
          data_subject_email?: string | null
          data_subject_name?: string | null
          deadline?: string | null
          details?: string | null
          id?: string
          identity_verified?: boolean | null
          impact_assessment?: string | null
          legal_basis_for_refusal?: string | null
          metadata?: Json | null
          objection_grounds?: string | null
          priority?: string | null
          processing_notes?: string | null
          processing_systems?: string[] | null
          regulatory_authority?: string | null
          request_date?: string | null
          request_details?: string | null
          request_type?: string | null
          response_date?: string | null
          response_method?: string | null
          response_sent?: boolean | null
          restriction_applied?: boolean | null
          review_notes?: string | null
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
          assessment_date: string | null
          assessment_title: string | null
          assessor_name: string | null
          assessor_role: string | null
          automated_decision_making: string | null
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
          profiling_activities: string | null
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
          assessment_date?: string | null
          assessment_title?: string | null
          assessor_name?: string | null
          assessor_role?: string | null
          automated_decision_making?: string | null
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
          profiling_activities?: string | null
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
          assessment_date?: string | null
          assessment_title?: string | null
          assessor_name?: string | null
          assessor_role?: string | null
          automated_decision_making?: string | null
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
          profiling_activities?: string | null
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
      eidetic_footprint_queue: {
        Row: {
          content_excerpt: string | null
          created_at: string
          decay_score: number | null
          id: string
          prospect_name: string | null
          routed_at: string | null
          status: string | null
        }
        Insert: {
          content_excerpt?: string | null
          created_at?: string
          decay_score?: number | null
          id?: string
          prospect_name?: string | null
          routed_at?: string | null
          status?: string | null
        }
        Update: {
          content_excerpt?: string | null
          created_at?: string
          decay_score?: number | null
          id?: string
          prospect_name?: string | null
          routed_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      employee_scan_queue: {
        Row: {
          completed_at: string | null
          created_at: string
          employee_id: string | null
          error_message: string | null
          id: string
          priority: number | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          employee_id?: string | null
          error_message?: string | null
          id?: string
          priority?: number | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          employee_id?: string | null
          error_message?: string | null
          id?: string
          priority?: number | null
          started_at?: string | null
          status?: string | null
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
      entity_graph: {
        Row: {
          created_at: string
          frequency: number | null
          id: string
          last_seen: string | null
          metadata: Json | null
          related_entity: string | null
          relationship_type: string | null
          source_entity: string | null
        }
        Insert: {
          created_at?: string
          frequency?: number | null
          id?: string
          last_seen?: string | null
          metadata?: Json | null
          related_entity?: string | null
          relationship_type?: string | null
          source_entity?: string | null
        }
        Update: {
          created_at?: string
          frequency?: number | null
          id?: string
          last_seen?: string | null
          metadata?: Json | null
          related_entity?: string | null
          relationship_type?: string | null
          source_entity?: string | null
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
      eris_attack_simulations: {
        Row: {
          attack_vector: string | null
          created_at: string
          id: string
          metadata: Json | null
          origin_source: string | null
          scenario_description: string | null
          status: string | null
          target_entity: string | null
          threat_score: number | null
        }
        Insert: {
          attack_vector?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          origin_source?: string | null
          scenario_description?: string | null
          status?: string | null
          target_entity?: string | null
          threat_score?: number | null
        }
        Update: {
          attack_vector?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          origin_source?: string | null
          scenario_description?: string | null
          status?: string | null
          target_entity?: string | null
          threat_score?: number | null
        }
        Relationships: []
      }
      eris_response_strategies: {
        Row: {
          created_at: string
          effectiveness_score: number | null
          executed: boolean | null
          gpt_recommendation: string | null
          id: string
          metadata: Json | null
          simulation_id: string | null
          strategy_type: string | null
        }
        Insert: {
          created_at?: string
          effectiveness_score?: number | null
          executed?: boolean | null
          gpt_recommendation?: string | null
          id?: string
          metadata?: Json | null
          simulation_id?: string | null
          strategy_type?: string | null
        }
        Update: {
          created_at?: string
          effectiveness_score?: number | null
          executed?: boolean | null
          gpt_recommendation?: string | null
          id?: string
          metadata?: Json | null
          simulation_id?: string | null
          strategy_type?: string | null
        }
        Relationships: []
      }
      executive_reports: {
        Row: {
          created_at: string
          executive_summary: string | null
          id: string
          key_metrics: Json | null
          metadata: Json | null
          period_end: string | null
          period_start: string | null
          report_type: string | null
          status: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          executive_summary?: string | null
          id?: string
          key_metrics?: Json | null
          metadata?: Json | null
          period_end?: string | null
          period_start?: string | null
          report_type?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          executive_summary?: string | null
          id?: string
          key_metrics?: Json | null
          metadata?: Json | null
          period_end?: string | null
          period_start?: string | null
          report_type?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      genesis_entities: {
        Row: {
          created_at: string
          entity_type: string | null
          id: string
          metadata: Json | null
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      graveyard_simulations: {
        Row: {
          created_at: string
          expected_trigger_module: string | null
          id: string
          injected_at: string | null
          leak_title: string | null
          suppression_status: string | null
        }
        Insert: {
          created_at?: string
          expected_trigger_module?: string | null
          id?: string
          injected_at?: string | null
          leak_title?: string | null
          suppression_status?: string | null
        }
        Update: {
          created_at?: string
          expected_trigger_module?: string | null
          id?: string
          injected_at?: string | null
          leak_title?: string | null
          suppression_status?: string | null
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
          assessor_name: string | null
          assessor_role: string | null
          balancing_test: string | null
          created_at: string
          data_categories: string | null
          data_sources: string[] | null
          data_subject_impact: string | null
          details: Json | null
          entity_name: string | null
          id: string
          legitimate_interest: string | null
          mitigation_measures: string | null
          necessity_test: string | null
          opt_out_mechanism: string | null
          processing_methods: string | null
          purpose_description: string | null
          retention_period: string | null
          review_date: string | null
          risk_level: string | null
          safeguards: string | null
          status: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          assessment_type?: string | null
          assessor_name?: string | null
          assessor_role?: string | null
          balancing_test?: string | null
          created_at?: string
          data_categories?: string | null
          data_sources?: string[] | null
          data_subject_impact?: string | null
          details?: Json | null
          entity_name?: string | null
          id?: string
          legitimate_interest?: string | null
          mitigation_measures?: string | null
          necessity_test?: string | null
          opt_out_mechanism?: string | null
          processing_methods?: string | null
          purpose_description?: string | null
          retention_period?: string | null
          review_date?: string | null
          risk_level?: string | null
          safeguards?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          assessment_type?: string | null
          assessor_name?: string | null
          assessor_role?: string | null
          balancing_test?: string | null
          created_at?: string
          data_categories?: string | null
          data_sources?: string[] | null
          data_subject_impact?: string | null
          details?: Json | null
          entity_name?: string | null
          id?: string
          legitimate_interest?: string | null
          mitigation_measures?: string | null
          necessity_test?: string | null
          opt_out_mechanism?: string | null
          processing_methods?: string | null
          purpose_description?: string | null
          retention_period?: string | null
          review_date?: string | null
          risk_level?: string | null
          safeguards?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      live_status: {
        Row: {
          active_threats: number | null
          created_at: string
          details: Json | null
          id: string
          last_report: string | null
          last_threat_seen: string | null
          name: string
          system_status: string
          updated_at: string
        }
        Insert: {
          active_threats?: number | null
          created_at?: string
          details?: Json | null
          id?: string
          last_report?: string | null
          last_threat_seen?: string | null
          name: string
          system_status?: string
          updated_at?: string
        }
        Update: {
          active_threats?: number | null
          created_at?: string
          details?: Json | null
          id?: string
          last_report?: string | null
          last_threat_seen?: string | null
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
      memory_decay_profiles: {
        Row: {
          action_status: string | null
          created_at: string
          decay_trigger: string | null
          emotional_charge: string | null
          footprint_id: string | null
          id: string
          legal_outcome: string | null
          recommended_action: string | null
          relevancy_score: number | null
          scheduled_for: string | null
          social_velocity: number | null
        }
        Insert: {
          action_status?: string | null
          created_at?: string
          decay_trigger?: string | null
          emotional_charge?: string | null
          footprint_id?: string | null
          id?: string
          legal_outcome?: string | null
          recommended_action?: string | null
          relevancy_score?: number | null
          scheduled_for?: string | null
          social_velocity?: number | null
        }
        Update: {
          action_status?: string | null
          created_at?: string
          decay_trigger?: string | null
          emotional_charge?: string | null
          footprint_id?: string | null
          id?: string
          legal_outcome?: string | null
          recommended_action?: string | null
          relevancy_score?: number | null
          scheduled_for?: string | null
          social_velocity?: number | null
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
          content_url: string | null
          created_at: string
          decay_score: number | null
          discovered_at: string | null
          first_seen: string | null
          id: string
          is_active: boolean | null
          last_seen: string | null
          memory_context: string | null
          memory_type: string | null
          updated_at: string
        }
        Insert: {
          ai_memory_tags?: string[] | null
          client_id?: string | null
          content_url?: string | null
          created_at?: string
          decay_score?: number | null
          discovered_at?: string | null
          first_seen?: string | null
          id?: string
          is_active?: boolean | null
          last_seen?: string | null
          memory_context?: string | null
          memory_type?: string | null
          updated_at?: string
        }
        Update: {
          ai_memory_tags?: string[] | null
          client_id?: string | null
          content_url?: string | null
          created_at?: string
          decay_score?: number | null
          discovered_at?: string | null
          first_seen?: string | null
          id?: string
          is_active?: boolean | null
          last_seen?: string | null
          memory_context?: string | null
          memory_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      memory_recalibrators: {
        Row: {
          asset_url: string | null
          content_excerpt: string | null
          created_at: string
          deployed_at: string | null
          effectiveness_score: number | null
          footprint_id: string | null
          full_text: string | null
          id: string
          is_deployed: boolean | null
          recalibration_type: string | null
        }
        Insert: {
          asset_url?: string | null
          content_excerpt?: string | null
          created_at?: string
          deployed_at?: string | null
          effectiveness_score?: number | null
          footprint_id?: string | null
          full_text?: string | null
          id?: string
          is_deployed?: boolean | null
          recalibration_type?: string | null
        }
        Update: {
          asset_url?: string | null
          content_excerpt?: string | null
          created_at?: string
          deployed_at?: string | null
          effectiveness_score?: number | null
          footprint_id?: string | null
          full_text?: string | null
          id?: string
          is_deployed?: boolean | null
          recalibration_type?: string | null
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
      operator_command_log: {
        Row: {
          command_text: string | null
          created_at: string
          id: string
          intent: string | null
          metadata: Json | null
          priority: string | null
          response_type: string | null
          target: string | null
        }
        Insert: {
          command_text?: string | null
          created_at?: string
          id?: string
          intent?: string | null
          metadata?: Json | null
          priority?: string | null
          response_type?: string | null
          target?: string | null
        }
        Update: {
          command_text?: string | null
          created_at?: string
          id?: string
          intent?: string | null
          metadata?: Json | null
          priority?: string | null
          response_type?: string | null
          target?: string | null
        }
        Relationships: []
      }
      operator_response_log: {
        Row: {
          command_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          processed_by: string | null
          response_text: string | null
        }
        Insert: {
          command_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          processed_by?: string | null
          response_text?: string | null
        }
        Update: {
          command_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          processed_by?: string | null
          response_text?: string | null
        }
        Relationships: []
      }
      panoptica_sensor_events: {
        Row: {
          created_at: string
          detected_at: string | null
          event_content: string | null
          flagged: boolean | null
          id: string
          metadata: Json | null
          relevance_score: number | null
          risk_level: string | null
          source_detail: string | null
          source_type: string | null
        }
        Insert: {
          created_at?: string
          detected_at?: string | null
          event_content?: string | null
          flagged?: boolean | null
          id?: string
          metadata?: Json | null
          relevance_score?: number | null
          risk_level?: string | null
          source_detail?: string | null
          source_type?: string | null
        }
        Update: {
          created_at?: string
          detected_at?: string | null
          event_content?: string | null
          flagged?: boolean | null
          id?: string
          metadata?: Json | null
          relevance_score?: number | null
          risk_level?: string | null
          source_detail?: string | null
          source_type?: string | null
        }
        Relationships: []
      }
      panoptica_system_health: {
        Row: {
          created_at: string
          diagnostic: string | null
          id: string
          last_sync: string | null
          metadata: Json | null
          sensor_name: string | null
          sync_status: string | null
        }
        Insert: {
          created_at?: string
          diagnostic?: string | null
          id?: string
          last_sync?: string | null
          metadata?: Json | null
          sensor_name?: string | null
          sync_status?: string | null
        }
        Update: {
          created_at?: string
          diagnostic?: string | null
          id?: string
          last_sync?: string | null
          metadata?: Json | null
          sensor_name?: string | null
          sync_status?: string | null
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
          approved_by: string | null
          automated_decisions: string | null
          contact_details: string | null
          content: string | null
          cookies_policy: string | null
          created_at: string
          data_categories_covered: string[] | null
          data_controller: string | null
          effective_date: string | null
          id: string
          individual_rights: string | null
          international_transfers: string | null
          jurisdiction: string | null
          language: string | null
          last_reviewed: string | null
          legal_bases: string[] | null
          metadata: Json | null
          notice_type: string | null
          publication_url: string | null
          purposes: string[] | null
          recipients: string[] | null
          retention_periods: string | null
          review_frequency: string | null
          status: string | null
          title: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          approved_by?: string | null
          automated_decisions?: string | null
          contact_details?: string | null
          content?: string | null
          cookies_policy?: string | null
          created_at?: string
          data_categories_covered?: string[] | null
          data_controller?: string | null
          effective_date?: string | null
          id?: string
          individual_rights?: string | null
          international_transfers?: string | null
          jurisdiction?: string | null
          language?: string | null
          last_reviewed?: string | null
          legal_bases?: string[] | null
          metadata?: Json | null
          notice_type?: string | null
          publication_url?: string | null
          purposes?: string[] | null
          recipients?: string[] | null
          retention_periods?: string | null
          review_frequency?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          approved_by?: string | null
          automated_decisions?: string | null
          contact_details?: string | null
          content?: string | null
          cookies_policy?: string | null
          created_at?: string
          data_categories_covered?: string[] | null
          data_controller?: string | null
          effective_date?: string | null
          id?: string
          individual_rights?: string | null
          international_transfers?: string | null
          jurisdiction?: string | null
          language?: string | null
          last_reviewed?: string | null
          legal_bases?: string[] | null
          metadata?: Json | null
          notice_type?: string | null
          publication_url?: string | null
          purposes?: string[] | null
          recipients?: string[] | null
          retention_periods?: string | null
          review_frequency?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      prospect_alerts: {
        Row: {
          alert_type: string | null
          created_at: string
          entity: string | null
          id: string
          source_module: string | null
          status: string | null
        }
        Insert: {
          alert_type?: string | null
          created_at?: string
          entity?: string | null
          id?: string
          source_module?: string | null
          status?: string | null
        }
        Update: {
          alert_type?: string | null
          created_at?: string
          entity?: string | null
          id?: string
          source_module?: string | null
          status?: string | null
        }
        Relationships: []
      }
      reputation_scan_submissions: {
        Row: {
          admin_notes: string | null
          company: string | null
          created_at: string
          details: string | null
          email: string | null
          full_name: string | null
          id: string
          keywords: string | null
          metadata: Json | null
          phone: string | null
          scan_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          details?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          keywords?: string | null
          metadata?: Json | null
          phone?: string | null
          scan_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          details?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          keywords?: string | null
          metadata?: Json | null
          phone?: string | null
          scan_type?: string | null
          status?: string | null
          updated_at?: string | null
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
          ai_detection_confidence: number | null
          confidence_score: number | null
          content: string | null
          created_at: string
          detected_entities: Json | null
          entity_name: string | null
          id: string
          incident_playbook: string | null
          media_is_ai_generated: boolean | null
          metadata: Json | null
          platform: string | null
          potential_reach: number | null
          sentiment: string | null
          severity: string | null
          source_credibility_score: number | null
          source_type: string | null
          status: string | null
          threat_type: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          ai_detection_confidence?: number | null
          confidence_score?: number | null
          content?: string | null
          created_at?: string
          detected_entities?: Json | null
          entity_name?: string | null
          id?: string
          incident_playbook?: string | null
          media_is_ai_generated?: boolean | null
          metadata?: Json | null
          platform?: string | null
          potential_reach?: number | null
          sentiment?: string | null
          severity?: string | null
          source_credibility_score?: number | null
          source_type?: string | null
          status?: string | null
          threat_type?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          ai_detection_confidence?: number | null
          confidence_score?: number | null
          content?: string | null
          created_at?: string
          detected_entities?: Json | null
          entity_name?: string | null
          id?: string
          incident_playbook?: string | null
          media_is_ai_generated?: boolean | null
          metadata?: Json | null
          platform?: string | null
          potential_reach?: number | null
          sentiment?: string | null
          severity?: string | null
          source_credibility_score?: number | null
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
      sentience_memory_log: {
        Row: {
          context: string | null
          created_at: string
          created_by: string | null
          id: string
          insight_level: number | null
          metadata: Json | null
          reflection: string | null
          timestamp: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          insight_level?: number | null
          metadata?: Json | null
          reflection?: string | null
          timestamp?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          insight_level?: number | null
          metadata?: Json | null
          reflection?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      sentience_recalibration_decisions: {
        Row: {
          applied: boolean | null
          confidence: number | null
          created_at: string
          decision_type: string | null
          id: string
          memory_log_id: string | null
          metadata: Json | null
          rationale: string | null
        }
        Insert: {
          applied?: boolean | null
          confidence?: number | null
          created_at?: string
          decision_type?: string | null
          id?: string
          memory_log_id?: string | null
          metadata?: Json | null
          rationale?: string | null
        }
        Update: {
          applied?: boolean | null
          confidence?: number | null
          created_at?: string
          decision_type?: string | null
          id?: string
          memory_log_id?: string | null
          metadata?: Json | null
          rationale?: string | null
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
          asset_title: string | null
          asset_type: string | null
          asset_url: string | null
          created_at: string
          current_rank: number | null
          engagement_score: number | null
          gsc_clicks: number | null
          gsc_ctr: number | null
          gsc_impressions: number | null
          id: string
          metadata: Json | null
          published_at: string | null
          publishing_channel: string | null
          rank_goal: number | null
          status: string | null
          target_keyword: string | null
          title: string | null
          updated_at: string
          url: string | null
          visibility_score: number | null
        }
        Insert: {
          asset_title?: string | null
          asset_type?: string | null
          asset_url?: string | null
          created_at?: string
          current_rank?: number | null
          engagement_score?: number | null
          gsc_clicks?: number | null
          gsc_ctr?: number | null
          gsc_impressions?: number | null
          id?: string
          metadata?: Json | null
          published_at?: string | null
          publishing_channel?: string | null
          rank_goal?: number | null
          status?: string | null
          target_keyword?: string | null
          title?: string | null
          updated_at?: string
          url?: string | null
          visibility_score?: number | null
        }
        Update: {
          asset_title?: string | null
          asset_type?: string | null
          asset_url?: string | null
          created_at?: string
          current_rank?: number | null
          engagement_score?: number | null
          gsc_clicks?: number | null
          gsc_ctr?: number | null
          gsc_impressions?: number | null
          id?: string
          metadata?: Json | null
          published_at?: string | null
          publishing_channel?: string | null
          rank_goal?: number | null
          status?: string | null
          target_keyword?: string | null
          title?: string | null
          updated_at?: string
          url?: string | null
          visibility_score?: number | null
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
          check_time: string | null
          check_type: string | null
          created_at: string
          details: Json | null
          id: string
          metrics: Json | null
          module: string | null
          status: string | null
        }
        Insert: {
          check_time?: string | null
          check_type?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          metrics?: Json | null
          module?: string | null
          status?: string | null
        }
        Update: {
          check_time?: string | null
          check_type?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          metrics?: Json | null
          module?: string | null
          status?: string | null
        }
        Relationships: []
      }
      threat_ingestion_queue: {
        Row: {
          created_at: string
          detected_at: string | null
          id: string
          metadata: Json | null
          source: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          detected_at?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          detected_at?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
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
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      is_current_user_admin: { Args: never; Returns: boolean }
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

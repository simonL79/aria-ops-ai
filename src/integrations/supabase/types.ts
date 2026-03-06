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
          memory_type: string | null
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          entity_name?: string | null
          id?: string
          memory_type?: string | null
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          entity_name?: string | null
          id?: string
          memory_type?: string | null
          metadata?: Json | null
          updated_at?: string
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
          source_type: string | null
          status: string | null
          title: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          source_type?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          source_type?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          url?: string | null
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
          created_at: string
          entity_id: string | null
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
          created_at?: string
          entity_id?: string | null
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
          created_at?: string
          entity_id?: string | null
          id?: string
          locations?: string[] | null
          metadata?: Json | null
          organization?: string | null
          primary_name?: string | null
          updated_at?: string
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
      monitoring_status: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          is_active: boolean | null
          last_check: string | null
          module_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          is_active?: boolean | null
          last_check?: string | null
          module_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          is_active?: boolean | null
          last_check?: string | null
          module_name?: string
          updated_at?: string
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
          query_text: string | null
          results_count: number | null
          source: string | null
        }
        Insert: {
          executed_at?: string
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          query_text?: string | null
          results_count?: number | null
          source?: string | null
        }
        Update: {
          executed_at?: string
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          query_text?: string | null
          results_count?: number | null
          source?: string | null
        }
        Relationships: []
      }
      strategy_responses: {
        Row: {
          content: string | null
          created_at: string
          entity_name: string | null
          executed_at: string | null
          id: string
          metadata: Json | null
          priority: string | null
          status: string | null
          strategy_type: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          entity_name?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          strategy_type?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          entity_name?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          strategy_type?: string | null
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

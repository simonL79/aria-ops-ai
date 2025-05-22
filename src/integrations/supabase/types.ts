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
      clients: {
        Row: {
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
      reputation_scan_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          keywords: string
          phone: string | null
          status: Database["public"]["Enums"]["reputation_scan_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          keywords: string
          phone?: string | null
          status?: Database["public"]["Enums"]["reputation_scan_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          keywords?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["reputation_scan_status"]
          updated_at?: string
        }
        Relationships: []
      }
      scan_results: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          confidence_score: number | null
          contact_status: string | null
          contact_status_updated_by: string | null
          content: string
          created_at: string | null
          detected_entities: Json | null
          id: string
          platform: string
          potential_reach: number | null
          resolved_at: string | null
          responded_at: string | null
          sentiment: number | null
          severity: string | null
          source_type: string | null
          status: string | null
          threat_type: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          confidence_score?: number | null
          contact_status?: string | null
          contact_status_updated_by?: string | null
          content: string
          created_at?: string | null
          detected_entities?: Json | null
          id?: string
          platform: string
          potential_reach?: number | null
          resolved_at?: string | null
          responded_at?: string | null
          sentiment?: number | null
          severity?: string | null
          source_type?: string | null
          status?: string | null
          threat_type?: string | null
          updated_at?: string | null
          url?: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          confidence_score?: number | null
          contact_status?: string | null
          contact_status_updated_by?: string | null
          content?: string
          created_at?: string | null
          detected_entities?: Json | null
          id?: string
          platform?: string
          potential_reach?: number | null
          resolved_at?: string | null
          responded_at?: string | null
          sentiment?: number | null
          severity?: string | null
          source_type?: string | null
          status?: string | null
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
        ]
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
    }
    Functions: {
      assign_staff_role: {
        Args: { user_email: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      run_scan: {
        Args: { scan_depth?: string }
        Returns: {
          assigned_to: string | null
          client_id: string | null
          confidence_score: number | null
          contact_status: string | null
          contact_status_updated_by: string | null
          content: string
          created_at: string | null
          detected_entities: Json | null
          id: string
          platform: string
          potential_reach: number | null
          resolved_at: string | null
          responded_at: string | null
          sentiment: number | null
          severity: string | null
          source_type: string | null
          status: string | null
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

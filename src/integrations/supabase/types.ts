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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      app_metadata: {
        Row: {
          app_id: string
          app_name: string | null
          app_size: number | null
          content_rating: string | null
          created_at: string
          developer_id: string | null
          developer_name: string | null
          id: string
          install_count: string | null
          last_updated: string | null
          permission_risk_score: number | null
          permissions: string[] | null
          platform: string
          privacy_policy_url: string | null
          rating: number | null
          review_count: number | null
          submission_id: string | null
          suspicious_permissions: string[] | null
          version: string | null
        }
        Insert: {
          app_id: string
          app_name?: string | null
          app_size?: number | null
          content_rating?: string | null
          created_at?: string
          developer_id?: string | null
          developer_name?: string | null
          id?: string
          install_count?: string | null
          last_updated?: string | null
          permission_risk_score?: number | null
          permissions?: string[] | null
          platform: string
          privacy_policy_url?: string | null
          rating?: number | null
          review_count?: number | null
          submission_id?: string | null
          suspicious_permissions?: string[] | null
          version?: string | null
        }
        Update: {
          app_id?: string
          app_name?: string | null
          app_size?: number | null
          content_rating?: string | null
          created_at?: string
          developer_id?: string | null
          developer_name?: string | null
          id?: string
          install_count?: string | null
          last_updated?: string | null
          permission_risk_score?: number | null
          permissions?: string[] | null
          platform?: string
          privacy_policy_url?: string | null
          rating?: number | null
          review_count?: number | null
          submission_id?: string | null
          suspicious_permissions?: string[] | null
          version?: string | null
        }
        Relationships: []
      }
      batch_submissions: {
        Row: {
          created_at: string
          file_name: string
          id: string
          processed_urls: number
          session_id: string | null
          status: string
          total_urls: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          processed_urls?: number
          session_id?: string | null
          status?: string
          total_urls?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          processed_urls?: number
          session_id?: string | null
          status?: string
          total_urls?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chatbot_knowledge: {
        Row: {
          answer: string
          category: string
          confidence_threshold: number | null
          created_at: string
          id: string
          intent: string
          keywords: string[] | null
          question: string
        }
        Insert: {
          answer: string
          category: string
          confidence_threshold?: number | null
          created_at?: string
          id?: string
          intent: string
          keywords?: string[] | null
          question: string
        }
        Update: {
          answer?: string
          category?: string
          confidence_threshold?: number | null
          created_at?: string
          id?: string
          intent?: string
          keywords?: string[] | null
          question?: string
        }
        Relationships: []
      }
      dns_records: {
        Row: {
          created_at: string
          domain: string
          id: string
          ip_reputation_score: number | null
          mx_records: string[] | null
          record_type: string
          record_value: string
          subdomain_count: number | null
          suspicious_subdomains: string[] | null
          ttl: number | null
          txt_records: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          ip_reputation_score?: number | null
          mx_records?: string[] | null
          record_type: string
          record_value: string
          subdomain_count?: number | null
          suspicious_subdomains?: string[] | null
          ttl?: number | null
          txt_records?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          ip_reputation_score?: number | null
          mx_records?: string[] | null
          record_type?: string
          record_value?: string
          subdomain_count?: number | null
          suspicious_subdomains?: string[] | null
          ttl?: number | null
          txt_records?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      educational_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      educational_content: {
        Row: {
          category_id: string | null
          content: Json
          content_type: string
          created_at: string
          difficulty_level: string
          estimated_reading_time: number | null
          id: string
          is_published: boolean
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          content: Json
          content_type?: string
          created_at?: string
          difficulty_level?: string
          estimated_reading_time?: number | null
          id?: string
          is_published?: boolean
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          content?: Json
          content_type?: string
          created_at?: string
          difficulty_level?: string
          estimated_reading_time?: number | null
          id?: string
          is_published?: boolean
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "educational_content_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "educational_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      real_time_alerts: {
        Row: {
          alert_type: string
          created_at: string
          detection_method: string | null
          evidence_details: Json | null
          explanation: string | null
          id: string
          is_acknowledged: boolean | null
          risk_score: number
          session_id: string | null
          threat_category: string
          threat_subcategory: string | null
          triggered_features: string[] | null
          url: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          detection_method?: string | null
          evidence_details?: Json | null
          explanation?: string | null
          id?: string
          is_acknowledged?: boolean | null
          risk_score: number
          session_id?: string | null
          threat_category: string
          threat_subcategory?: string | null
          triggered_features?: string[] | null
          url: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          detection_method?: string | null
          evidence_details?: Json | null
          explanation?: string | null
          id?: string
          is_acknowledged?: boolean | null
          risk_score?: number
          session_id?: string | null
          threat_category?: string
          threat_subcategory?: string | null
          triggered_features?: string[] | null
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      screenshots: {
        Row: {
          brand_similarities: Json | null
          created_at: string
          id: string
          layout_analysis: Json | null
          screenshot_hash: string | null
          screenshot_url: string | null
          similar_brands: string[] | null
          submission_id: string | null
          ui_elements: Json | null
          url: string
          visual_risk_score: number | null
        }
        Insert: {
          brand_similarities?: Json | null
          created_at?: string
          id?: string
          layout_analysis?: Json | null
          screenshot_hash?: string | null
          screenshot_url?: string | null
          similar_brands?: string[] | null
          submission_id?: string | null
          ui_elements?: Json | null
          url: string
          visual_risk_score?: number | null
        }
        Update: {
          brand_similarities?: Json | null
          created_at?: string
          id?: string
          layout_analysis?: Json | null
          screenshot_hash?: string | null
          screenshot_url?: string | null
          similar_brands?: string[] | null
          submission_id?: string | null
          ui_elements?: Json | null
          url?: string
          visual_risk_score?: number | null
        }
        Relationships: []
      }
      threat_categories: {
        Row: {
          category_name: string
          color_code: string | null
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          severity_level: string
        }
        Insert: {
          category_name: string
          color_code?: string | null
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          severity_level?: string
        }
        Update: {
          category_name?: string
          color_code?: string | null
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          severity_level?: string
        }
        Relationships: []
      }
      threat_intelligence: {
        Row: {
          confidence_score: number
          created_at: string
          first_seen: string
          id: string
          indicator_type: string
          indicator_value: string
          is_active: boolean | null
          last_seen: string
          metadata: Json | null
          source: string
          threat_type: string
        }
        Insert: {
          confidence_score: number
          created_at?: string
          first_seen?: string
          id?: string
          indicator_type: string
          indicator_value: string
          is_active?: boolean | null
          last_seen?: string
          metadata?: Json | null
          source: string
          threat_type: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          first_seen?: string
          id?: string
          indicator_type?: string
          indicator_value?: string
          is_active?: boolean | null
          last_seen?: string
          metadata?: Json | null
          source?: string
          threat_type?: string
        }
        Relationships: []
      }
      url_submissions: {
        Row: {
          analysis_results: Json | null
          analysis_status: string
          app_store_link: string | null
          batch_id: string | null
          classification_confidence: number | null
          created_at: string
          file_name: string | null
          file_size: number | null
          id: string
          primary_detection_reason: string | null
          risk_level: string | null
          risk_score: number | null
          session_id: string | null
          submission_type: string
          supporting_evidence: Json | null
          threat_category: string | null
          threat_subcategory: string | null
          updated_at: string
          url: string
          user_id: string | null
        }
        Insert: {
          analysis_results?: Json | null
          analysis_status?: string
          app_store_link?: string | null
          batch_id?: string | null
          classification_confidence?: number | null
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          primary_detection_reason?: string | null
          risk_level?: string | null
          risk_score?: number | null
          session_id?: string | null
          submission_type?: string
          supporting_evidence?: Json | null
          threat_category?: string | null
          threat_subcategory?: string | null
          updated_at?: string
          url: string
          user_id?: string | null
        }
        Update: {
          analysis_results?: Json | null
          analysis_status?: string
          app_store_link?: string | null
          batch_id?: string | null
          classification_confidence?: number | null
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          primary_detection_reason?: string | null
          risk_level?: string | null
          risk_score?: number | null
          session_id?: string | null
          submission_type?: string
          supporting_evidence?: Json | null
          threat_category?: string | null
          threat_subcategory?: string | null
          updated_at?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "url_submissions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batch_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_educational_progress: {
        Row: {
          completed_at: string | null
          content_id: string | null
          created_at: string
          id: string
          progress_percentage: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          content_id?: string | null
          created_at?: string
          id?: string
          progress_percentage?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          content_id?: string | null
          created_at?: string
          id?: string
          progress_percentage?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_educational_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "educational_content"
            referencedColumns: ["id"]
          },
        ]
      }
      whois_data: {
        Row: {
          admin_contact: string | null
          created_at: string
          creation_date: string | null
          domain: string
          expiration_date: string | null
          id: string
          name_servers: string[] | null
          privacy_protection: boolean | null
          registrant_country: string | null
          registrant_name: string | null
          registrant_org: string | null
          registrar: string | null
          status: string[] | null
          tech_contact: string | null
          updated_at: string
          updated_date: string | null
        }
        Insert: {
          admin_contact?: string | null
          created_at?: string
          creation_date?: string | null
          domain: string
          expiration_date?: string | null
          id?: string
          name_servers?: string[] | null
          privacy_protection?: boolean | null
          registrant_country?: string | null
          registrant_name?: string | null
          registrant_org?: string | null
          registrar?: string | null
          status?: string[] | null
          tech_contact?: string | null
          updated_at?: string
          updated_date?: string | null
        }
        Update: {
          admin_contact?: string | null
          created_at?: string
          creation_date?: string | null
          domain?: string
          expiration_date?: string | null
          id?: string
          name_servers?: string[] | null
          privacy_protection?: boolean | null
          registrant_country?: string | null
          registrant_name?: string | null
          registrant_org?: string | null
          registrar?: string | null
          status?: string[] | null
          tech_contact?: string | null
          updated_at?: string
          updated_date?: string | null
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

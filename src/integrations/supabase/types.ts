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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      join_requests: {
        Row: {
          connection_context: string | null
          email: string
          id: string
          intro: string
          name: string
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["join_request_status"]
          voucher_id: string | null
        }
        Insert: {
          connection_context?: string | null
          email: string
          id?: string
          intro: string
          name: string
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["join_request_status"]
          voucher_id?: string | null
        }
        Update: {
          connection_context?: string | null
          email?: string
          id?: string
          intro?: string
          name?: string
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["join_request_status"]
          voucher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "join_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "join_requests_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          intro_text: string | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          vouched_at: string | null
          vouched_by: string | null
          zip_code: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          intro_text?: string | null
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          vouched_at?: string | null
          vouched_by?: string | null
          zip_code?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          intro_text?: string | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          vouched_at?: string | null
          vouched_by?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_vouched_by_fkey"
            columns: ["vouched_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplies: {
        Row: {
          category: string
          condition: string
          contact_email: string | null
          created_at: string
          date_available: string | null
          description: string
          house_rules: string[] | null
          id: string
          image_url: string | null
          images: string[] | null
          location: string | null
          name: string
          owner_id: string
          party_types: string[] | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          category: string
          condition: string
          contact_email?: string | null
          created_at?: string
          date_available?: string | null
          description: string
          house_rules?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          location?: string | null
          name: string
          owner_id: string
          party_types?: string[] | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          category?: string
          condition?: string
          contact_email?: string | null
          created_at?: string
          date_available?: string | null
          description?: string
          house_rules?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          location?: string | null
          name?: string
          owner_id?: string
          party_types?: string[] | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supply_requests: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_contact: string
          sender_name: string
          status: string
          supply_id: string
          supply_name: string
          supply_owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_contact: string
          sender_name: string
          status?: string
          supply_id: string
          supply_name: string
          supply_owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_contact?: string
          sender_name?: string
          status?: string
          supply_id?: string
          supply_name?: string
          supply_owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_profile: {
        Args: { profile_id: string }
        Returns: {
          id: string
          name: string
          vouched_at: string
          zip_code: string
        }[]
      }
      get_supply_owner_info: {
        Args: { owner_id_param: string }
        Returns: {
          name: string
          zip_code: string
        }[]
      }
      is_user_steward: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_user_vouched: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      join_request_status: "pending" | "vouched" | "rejected"
      user_role: "member" | "steward"
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
    Enums: {
      join_request_status: ["pending", "vouched", "rejected"],
      user_role: ["member", "steward"],
    },
  },
} as const

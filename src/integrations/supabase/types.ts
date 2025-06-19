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
          created_at: string
          date_available: string | null
          description: string
          id: string
          name: string
          owner_id: string
          party_types: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          condition: string
          created_at?: string
          date_available?: string | null
          description: string
          id?: string
          name: string
          owner_id: string
          party_types?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string
          date_available?: string | null
          description?: string
          id?: string
          name?: string
          owner_id?: string
          party_types?: string[] | null
          updated_at?: string
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
      vouches: {
        Row: {
          created_at: string
          id: string
          vouch_note: string | null
          vouched_id: string
          voucher_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          vouch_note?: string | null
          vouched_id: string
          voucher_id: string
        }
        Update: {
          created_at?: string
          id?: string
          vouch_note?: string | null
          vouched_id?: string
          voucher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouches_vouched_id_fkey"
            columns: ["vouched_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vouches_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      join_request_status: ["pending", "vouched", "rejected"],
      user_role: ["member", "steward"],
    },
  },
} as const

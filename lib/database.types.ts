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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      branches: {
        Row: {
          address: string | null
          archived_at: string | null
          company_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          archived_at?: string | null
          company_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          archived_at?: string | null
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          archived_at: string | null
          company_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          company_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_aliases: {
        Row: {
          alias_match_key: string
          created_at: string
          id: string
          product_id: string
        }
        Insert: {
          alias_match_key: string
          created_at?: string
          id?: string
          product_id: string
        }
        Update: {
          alias_match_key?: string
          created_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_aliases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_suppliers: {
        Row: {
          archived_at: string | null
          created_at: string
          is_primary: boolean
          min_order_qty: number | null
          notes: string | null
          price: number | null
          product_id: string
          supplier_id: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          is_primary?: boolean
          min_order_qty?: number | null
          notes?: string | null
          price?: number | null
          product_id: string
          supplier_id: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          is_primary?: boolean
          min_order_qty?: number | null
          notes?: string | null
          price?: number | null
          product_id?: string
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_suppliers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          archived_at: string | null
          category_id: string | null
          company_id: string
          created_at: string
          id: string
          last_synced_at: string | null
          match_key: string
          name: string
          unit: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          category_id?: string | null
          company_id: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          match_key: string
          name: string
          unit: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          category_id?: string | null
          company_id?: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          match_key?: string
          name?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string
          created_at: string
          department: Database["public"]["Enums"]["department"] | null
          id: string
          login: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          department?: Database["public"]["Enums"]["department"] | null
          id: string
          login: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          department?: Database["public"]["Enums"]["department"] | null
          id?: string
          login?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          arrived_at: string | null
          code: string
          company_id: string
          created_at: string
          created_by: string
          id: string
          notes: string | null
          sent_at: string | null
          supplier_id: string
          updated_at: string
        }
        Insert: {
          arrived_at?: string | null
          code: string
          company_id: string
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          sent_at?: string | null
          supplier_id: string
          updated_at?: string
        }
        Update: {
          arrived_at?: string | null
          code?: string
          company_id?: string
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          sent_at?: string | null
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      request_items: {
        Row: {
          created_at: string
          id: string
          line_status: Database["public"]["Enums"]["line_status"]
          notes: string | null
          po_id: string | null
          product_id: string
          qty: number
          received_qty: number | null
          request_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          line_status?: Database["public"]["Enums"]["line_status"]
          notes?: string | null
          po_id?: string | null
          product_id: string
          qty: number
          received_qty?: number | null
          request_id: string
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          line_status?: Database["public"]["Enums"]["line_status"]
          notes?: string | null
          po_id?: string | null
          product_id?: string
          qty?: number
          received_qty?: number | null
          request_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_status_view"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          branch_id: string
          closed_at: string | null
          code: string
          company_id: string
          created_at: string
          created_by: string
          from_role: Database["public"]["Enums"]["department"]
          id: string
          needed_by: string
          notes: string | null
          ordered_at: string | null
          receiving_note: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level"]
        }
        Insert: {
          branch_id: string
          closed_at?: string | null
          code: string
          company_id: string
          created_at?: string
          created_by: string
          from_role: Database["public"]["Enums"]["department"]
          id?: string
          needed_by: string
          notes?: string | null
          ordered_at?: string | null
          receiving_note?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Update: {
          branch_id?: string
          closed_at?: string | null
          code?: string
          company_id?: string
          created_at?: string
          created_by?: string
          from_role?: Database["public"]["Enums"]["department"]
          id?: string
          needed_by?: string
          notes?: string | null
          ordered_at?: string | null
          receiving_note?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Relationships: [
          {
            foreignKeyName: "requests_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_events: {
        Row: {
          at_time: string
          by_user: string | null
          event_type: Database["public"]["Enums"]["supplier_event_type"]
          id: string
          payload: Json | null
          reason: string | null
          supplier_id: string
          until_time: string | null
        }
        Insert: {
          at_time?: string
          by_user?: string | null
          event_type: Database["public"]["Enums"]["supplier_event_type"]
          id?: string
          payload?: Json | null
          reason?: string | null
          supplier_id: string
          until_time?: string | null
        }
        Update: {
          at_time?: string
          by_user?: string | null
          event_type?: Database["public"]["Enums"]["supplier_event_type"]
          id?: string
          payload?: Json | null
          reason?: string | null
          supplier_id?: string
          until_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_events_by_user_fkey"
            columns: ["by_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_events_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          archived_at: string | null
          archived_reason: string | null
          company_id: string
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          paused_at: string | null
          paused_by: string | null
          paused_reason: string | null
          paused_until: string | null
          phone: string | null
          preferred_channel: string | null
          telegram: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          archived_at?: string | null
          archived_reason?: string | null
          company_id: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          paused_at?: string | null
          paused_by?: string | null
          paused_reason?: string | null
          paused_until?: string | null
          phone?: string | null
          preferred_channel?: string | null
          telegram?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          archived_at?: string | null
          archived_reason?: string | null
          company_id?: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          paused_at?: string | null
          paused_by?: string | null
          paused_reason?: string | null
          paused_until?: string | null
          phone?: string | null
          preferred_channel?: string | null
          telegram?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_paused_by_fkey"
            columns: ["paused_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_log: {
        Row: {
          added_count: number
          archived_count: number
          company_id: string
          id: string
          payload: Json | null
          performed_at: string
          performed_by: string | null
          skipped_lines: string[] | null
          source_filename: string | null
          unchanged_count: number
          updated_count: number
        }
        Insert: {
          added_count?: number
          archived_count?: number
          company_id: string
          id?: string
          payload?: Json | null
          performed_at?: string
          performed_by?: string | null
          skipped_lines?: string[] | null
          source_filename?: string | null
          unchanged_count?: number
          updated_count?: number
        }
        Update: {
          added_count?: number
          archived_count?: number
          company_id?: string
          id?: string
          payload?: Json | null
          performed_at?: string
          performed_by?: string | null
          skipped_lines?: string[] | null
          source_filename?: string | null
          unchanged_count?: number
          updated_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "sync_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_log_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_branches: {
        Row: {
          branch_id: string
          user_id: string
        }
        Insert: {
          branch_id: string
          user_id: string
        }
        Update: {
          branch_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_branches_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_branches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      request_status_view: {
        Row: {
          derived_status: string | null
          request_id: string | null
        }
        Insert: {
          derived_status?: never
          request_id?: string | null
        }
        Update: {
          derived_status?: never
          request_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_branch_ids: { Args: never; Returns: string[] }
      current_company_id: { Args: never; Returns: string }
      current_department: {
        Args: never
        Returns: Database["public"]["Enums"]["department"]
      }
      current_role_value: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_buyer_or_admin: { Args: never; Returns: boolean }
      is_supplier_active: {
        Args: { s: Database["public"]["Tables"]["suppliers"]["Row"] }
        Returns: boolean
      }
      is_top_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      department: "kitchen" | "bar" | "hall"
      line_status:
        | "pending"
        | "ordered"
        | "arrived"
        | "received"
        | "partial"
        | "missing"
        | "cancelled"
      request_status: "draft" | "active" | "cancelled"
      supplier_event_type:
        | "created"
        | "updated"
        | "paused"
        | "resumed"
        | "archived"
        | "restored"
      urgency_level: "normal" | "urgent"
      user_role:
        | "admin"
        | "chef"
        | "head_barista"
        | "hall_admin"
        | "staff"
        | "buyer"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      department: ["kitchen", "bar", "hall"],
      line_status: [
        "pending",
        "ordered",
        "arrived",
        "received",
        "partial",
        "missing",
        "cancelled",
      ],
      request_status: ["draft", "active", "cancelled"],
      supplier_event_type: [
        "created",
        "updated",
        "paused",
        "resumed",
        "archived",
        "restored",
      ],
      urgency_level: ["normal", "urgent"],
      user_role: [
        "admin",
        "chef",
        "head_barista",
        "hall_admin",
        "staff",
        "buyer",
      ],
    },
  },
} as const

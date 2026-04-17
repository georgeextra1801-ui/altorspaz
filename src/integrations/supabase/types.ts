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
      admin_sensitive_access: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          resource: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          resource: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          resource?: string
          user_id?: string
        }
        Relationships: []
      }
      app_flags: {
        Row: {
          enabled: boolean
          key: string
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          key: string
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      bank_reconciliations: {
        Row: {
          account_number: string | null
          bank_balance: number
          bank_name: string
          book_balance: number
          created_at: string
          difference: number
          id: string
          notes: string | null
          reconciliation_date: string
          recorded_by: string | null
          status: string
        }
        Insert: {
          account_number?: string | null
          bank_balance?: number
          bank_name: string
          book_balance?: number
          created_at?: string
          difference?: number
          id?: string
          notes?: string | null
          reconciliation_date?: string
          recorded_by?: string | null
          status?: string
        }
        Update: {
          account_number?: string | null
          bank_balance?: number
          bank_name?: string
          book_balance?: number
          created_at?: string
          difference?: number
          id?: string
          notes?: string | null
          reconciliation_date?: string
          recorded_by?: string | null
          status?: string
        }
        Relationships: []
      }
      campaign_banners: {
        Row: {
          alt_text: string | null
          banner_slot: number
          campaign_key: string
          created_at: string
          id: string
          image_url: string | null
          storage_path: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          alt_text?: string | null
          banner_slot: number
          campaign_key: string
          created_at?: string
          id?: string
          image_url?: string | null
          storage_path?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          alt_text?: string | null
          banner_slot?: number
          campaign_key?: string
          created_at?: string
          id?: string
          image_url?: string | null
          storage_path?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      campaign_pages: {
        Row: {
          campaign_key: string
          config: Json
          created_at: string
          created_by: string | null
          hero_primary_text: string
          hero_secondary_text: string
          id: string
          is_published: boolean
          name: string
          primary_button_link: string
          primary_button_text: string
          product_handle: string
          secondary_button_link: string
          secondary_button_text: string
          slug: string
          target_audience: string | null
          top_strip_text: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          campaign_key: string
          config?: Json
          created_at?: string
          created_by?: string | null
          hero_primary_text?: string
          hero_secondary_text?: string
          id?: string
          is_published?: boolean
          name: string
          primary_button_link?: string
          primary_button_text?: string
          product_handle?: string
          secondary_button_link?: string
          secondary_button_text?: string
          slug: string
          target_audience?: string | null
          top_strip_text?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          campaign_key?: string
          config?: Json
          created_at?: string
          created_by?: string | null
          hero_primary_text?: string
          hero_secondary_text?: string
          id?: string
          is_published?: boolean
          name?: string
          primary_button_link?: string
          primary_button_text?: string
          product_handle?: string
          secondary_button_link?: string
          secondary_button_text?: string
          slug?: string
          target_audience?: string | null
          top_strip_text?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      cash_receipts: {
        Row: {
          amount: number
          concept: string
          created_at: string
          id: string
          notes: string | null
          payer_name: string
          payment_method: string
          receipt_date: string
          receipt_number: string
          recorded_by: string | null
          reference_number: string | null
        }
        Insert: {
          amount: number
          concept: string
          created_at?: string
          id?: string
          notes?: string | null
          payer_name: string
          payment_method?: string
          receipt_date?: string
          receipt_number: string
          recorded_by?: string | null
          reference_number?: string | null
        }
        Update: {
          amount?: number
          concept?: string
          created_at?: string
          id?: string
          notes?: string | null
          payer_name?: string
          payment_method?: string
          receipt_date?: string
          receipt_number?: string
          recorded_by?: string | null
          reference_number?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          concept: string
          created_at: string
          expense_date: string
          expense_number: string
          id: string
          notes: string | null
          payee_name: string
          payment_method: string
          recorded_by: string | null
          reference_number: string | null
        }
        Insert: {
          amount: number
          category?: string
          concept: string
          created_at?: string
          expense_date?: string
          expense_number: string
          id?: string
          notes?: string | null
          payee_name: string
          payment_method?: string
          recorded_by?: string | null
          reference_number?: string | null
        }
        Update: {
          amount?: number
          category?: string
          concept?: string
          created_at?: string
          expense_date?: string
          expense_number?: string
          id?: string
          notes?: string | null
          payee_name?: string
          payment_method?: string
          recorded_by?: string | null
          reference_number?: string | null
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          badge_bg_color: string
          badge_text: string
          badge_text_color: string
          created_at: string
          cta_link: string
          cta_text: string
          cta2_link: string
          cta2_text: string
          highlight: string
          highlight_color: string
          highlight_hex: string
          id: string
          image_url: string | null
          is_active: boolean
          overlay_from_color: string
          overlay_image_url: string | null
          overlay_position_x: number
          overlay_position_y: number
          overlay_scale: number
          overlay_storage_path: string | null
          overlay_via_color: string
          sort_order: number
          storage_path: string | null
          subtitle: string
          subtitle_color: string
          subtitle_font: string
          subtitle_size: string
          text_align: string
          title: string
          title_color: string
          title_font: string
          title_size: string
          updated_at: string
        }
        Insert: {
          badge_bg_color?: string
          badge_text?: string
          badge_text_color?: string
          created_at?: string
          cta_link?: string
          cta_text?: string
          cta2_link?: string
          cta2_text?: string
          highlight?: string
          highlight_color?: string
          highlight_hex?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          overlay_from_color?: string
          overlay_image_url?: string | null
          overlay_position_x?: number
          overlay_position_y?: number
          overlay_scale?: number
          overlay_storage_path?: string | null
          overlay_via_color?: string
          sort_order?: number
          storage_path?: string | null
          subtitle?: string
          subtitle_color?: string
          subtitle_font?: string
          subtitle_size?: string
          text_align?: string
          title?: string
          title_color?: string
          title_font?: string
          title_size?: string
          updated_at?: string
        }
        Update: {
          badge_bg_color?: string
          badge_text?: string
          badge_text_color?: string
          created_at?: string
          cta_link?: string
          cta_text?: string
          cta2_link?: string
          cta2_text?: string
          highlight?: string
          highlight_color?: string
          highlight_hex?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          overlay_from_color?: string
          overlay_image_url?: string | null
          overlay_position_x?: number
          overlay_position_y?: number
          overlay_scale?: number
          overlay_storage_path?: string | null
          overlay_via_color?: string
          sort_order?: number
          storage_path?: string | null
          subtitle?: string
          subtitle_color?: string
          subtitle_font?: string
          subtitle_size?: string
          text_align?: string
          title?: string
          title_color?: string
          title_font?: string
          title_size?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string | null
          created_at: string
          id: string
          notes: string | null
          product_title: string
          quantity: number
          sku: string | null
          store_name: string
          total_value: number | null
          unit_cost: number | null
          upload_id: string
          variant_title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_title: string
          quantity?: number
          sku?: string | null
          store_name: string
          total_value?: number | null
          unit_cost?: number | null
          upload_id: string
          variant_title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_title?: string
          quantity?: number
          sku?: string | null
          store_name?: string
          total_value?: number | null
          unit_cost?: number | null
          upload_id?: string
          variant_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "inventory_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string
          created_by: string
          direction: Database["public"]["Enums"]["inventory_movement_direction"]
          id: string
          inventory_item_id: string
          movement_reason: Database["public"]["Enums"]["inventory_movement_reason"]
          note: string | null
          quantity: number
          quantity_delta: number
          reference: string | null
          resulting_quantity: number
          sale_reference: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          direction: Database["public"]["Enums"]["inventory_movement_direction"]
          id?: string
          inventory_item_id: string
          movement_reason: Database["public"]["Enums"]["inventory_movement_reason"]
          note?: string | null
          quantity: number
          quantity_delta: number
          reference?: string | null
          resulting_quantity: number
          sale_reference?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          direction?: Database["public"]["Enums"]["inventory_movement_direction"]
          id?: string
          inventory_item_id?: string
          movement_reason?: Database["public"]["Enums"]["inventory_movement_reason"]
          note?: string | null
          quantity?: number
          quantity_delta?: number
          reference?: string | null
          resulting_quantity?: number
          sale_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_uploads: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          notes: string | null
          row_count: number | null
          status: string
          store_name: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          notes?: string | null
          row_count?: number | null
          status?: string
          store_name: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          notes?: string | null
          row_count?: number | null
          status?: string
          store_name?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      manual_sales: {
        Row: {
          channel: string
          collection: string | null
          created_at: string
          id: string
          notes: string | null
          product_title: string
          product_type: string | null
          quantity: number
          recorded_by: string | null
          sale_date: string
          sku: string | null
          tags: string[] | null
          total_price: number
          unit_price: number
          variant_title: string | null
        }
        Insert: {
          channel?: string
          collection?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_title: string
          product_type?: string | null
          quantity?: number
          recorded_by?: string | null
          sale_date?: string
          sku?: string | null
          tags?: string[] | null
          total_price: number
          unit_price: number
          variant_title?: string | null
        }
        Update: {
          channel?: string
          collection?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_title?: string
          product_type?: string | null
          quantity?: number
          recorded_by?: string | null
          sale_date?: string
          sku?: string | null
          tags?: string[] | null
          total_price?: number
          unit_price?: number
          variant_title?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      order_annotation_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          shopify_order_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          shopify_order_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          shopify_order_id?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      order_annotations: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          recorded_by: string | null
          shipping_cost: number | null
          shopify_order_id: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          recorded_by?: string | null
          shipping_cost?: number | null
          shopify_order_id: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          recorded_by?: string | null
          shipping_cost?: number | null
          shopify_order_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_costs: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          product_title: string
          sku: string | null
          supplier: string | null
          unit_cost: number
          updated_at: string
          variant_title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          product_title: string
          sku?: string | null
          supplier?: string | null
          unit_cost?: number
          updated_at?: string
          variant_title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          product_title?: string
          sku?: string | null
          supplier?: string | null
          unit_cost?: number
          updated_at?: string
          variant_title?: string | null
        }
        Relationships: []
      }
      profile_private: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recolored_product_cache: {
        Row: {
          created_at: string
          id: string
          product_image_hash: string
          public_url: string
          storage_path: string
          target_color: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_image_hash: string
          public_url: string
          storage_path: string
          target_color: string
        }
        Update: {
          created_at?: string
          id?: string
          product_image_hash?: string
          public_url?: string
          storage_path?: string
          target_color?: string
        }
        Relationships: []
      }
      reconciliation_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          item_date: string
          item_type: string
          reconciled: boolean
          reconciliation_id: string
          reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          item_date: string
          item_type?: string
          reconciled?: boolean
          reconciliation_id: string
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          item_date?: string
          item_type?: string
          reconciled?: boolean
          reconciliation_id?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reconciliation_items_reconciliation_id_fkey"
            columns: ["reconciliation_id"]
            isOneToOne: false
            referencedRelation: "bank_reconciliations"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_purchases: {
        Row: {
          category: string
          created_at: string
          id: string
          invoice_number: string | null
          notes: string | null
          payment_method: string
          product_title: string
          purchase_date: string
          quantity: number
          recorded_by: string | null
          sku: string | null
          supplier_name: string
          total_cost: number
          unit_cost: number
          variant_title: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_method?: string
          product_title: string
          purchase_date?: string
          quantity?: number
          recorded_by?: string | null
          sku?: string | null
          supplier_name: string
          total_cost: number
          unit_cost: number
          variant_title?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_method?: string
          product_title?: string
          purchase_date?: string
          quantity?: number
          recorded_by?: string | null
          sku?: string | null
          supplier_name?: string
          total_cost?: number
          unit_cost?: number
          variant_title?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      warehouse_dispatches: {
        Row: {
          created_at: string
          dispatched_by: string
          id: string
          inventory_item_id: string
          note: string | null
          product_title: string
          quantity: number
          sale_reference: string | null
          sku: string
          store_name: string
          variant_title: string | null
        }
        Insert: {
          created_at?: string
          dispatched_by: string
          id?: string
          inventory_item_id: string
          note?: string | null
          product_title: string
          quantity: number
          sale_reference?: string | null
          sku: string
          store_name: string
          variant_title?: string | null
        }
        Update: {
          created_at?: string
          dispatched_by?: string
          id?: string
          inventory_item_id?: string
          note?: string | null
          product_title?: string
          quantity?: number
          sale_reference?: string | null
          sku?: string
          store_name?: string
          variant_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_dispatches_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_sensitive_access: {
        Args: { _resource: string; _user_id: string }
        Returns: boolean
      }
      record_inventory_entry: {
        Args: {
          _direction: Database["public"]["Enums"]["inventory_movement_direction"]
          _inventory_item_id: string
          _movement_reason: Database["public"]["Enums"]["inventory_movement_reason"]
          _note?: string
          _quantity: number
          _reference?: string
        }
        Returns: {
          created_at: string
          created_by: string
          direction: Database["public"]["Enums"]["inventory_movement_direction"]
          id: string
          inventory_item_id: string
          movement_reason: Database["public"]["Enums"]["inventory_movement_reason"]
          note: string | null
          quantity: number
          quantity_delta: number
          reference: string | null
          resulting_quantity: number
          sale_reference: string | null
        }
        SetofOptions: {
          from: "*"
          to: "inventory_movements"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      record_warehouse_dispatch: {
        Args: {
          _inventory_item_id: string
          _note?: string
          _quantity: number
          _sale_reference?: string
        }
        Returns: {
          created_at: string
          dispatched_by: string
          id: string
          inventory_item_id: string
          note: string | null
          product_title: string
          quantity: number
          sale_reference: string | null
          sku: string
          store_name: string
          variant_title: string | null
        }
        SetofOptions: {
          from: "*"
          to: "warehouse_dispatches"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "warehouse"
      inventory_movement_direction: "in" | "out"
      inventory_movement_reason:
        | "purchase_supplier"
        | "customer_return"
        | "manual_adjustment"
        | "store_transfer"
        | "sale_dispatch"
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
      app_role: ["admin", "moderator", "user", "warehouse"],
      inventory_movement_direction: ["in", "out"],
      inventory_movement_reason: [
        "purchase_supplier",
        "customer_return",
        "manual_adjustment",
        "store_transfer",
        "sale_dispatch",
      ],
    },
  },
} as const

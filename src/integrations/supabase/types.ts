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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          affected_assets: string[] | null
          auto_response: string | null
          created_at: string | null
          description: string
          id: string
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status: Database["public"]["Enums"]["alert_status"] | null
          title: string
          type: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          affected_assets?: string[] | null
          auto_response?: string | null
          created_at?: string | null
          description: string
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"] | null
          title: string
          type: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          affected_assets?: string[] | null
          auto_response?: string | null
          created_at?: string | null
          description?: string
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"] | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collision_predictions: {
        Row: {
          created_at: string | null
          id: string
          miss_distance: number | null
          predicted_time: string | null
          probability: number | null
          satellite1_id: string | null
          satellite2_id: string | null
          threat_level: Database["public"]["Enums"]["threat_level"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          miss_distance?: number | null
          predicted_time?: string | null
          probability?: number | null
          satellite1_id?: string | null
          satellite2_id?: string | null
          threat_level?: Database["public"]["Enums"]["threat_level"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          miss_distance?: number | null
          predicted_time?: string | null
          probability?: number | null
          satellite1_id?: string | null
          satellite2_id?: string | null
          threat_level?: Database["public"]["Enums"]["threat_level"] | null
        }
        Relationships: [
          {
            foreignKeyName: "collision_predictions_satellite1_id_fkey"
            columns: ["satellite1_id"]
            isOneToOne: false
            referencedRelation: "satellite_orbital_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collision_predictions_satellite1_id_fkey"
            columns: ["satellite1_id"]
            isOneToOne: false
            referencedRelation: "satellites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collision_predictions_satellite2_id_fkey"
            columns: ["satellite2_id"]
            isOneToOne: false
            referencedRelation: "satellite_orbital_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collision_predictions_satellite2_id_fkey"
            columns: ["satellite2_id"]
            isOneToOne: false
            referencedRelation: "satellites"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      satellites: {
        Row: {
          altitude: number | null
          apogee: number | null
          battery_level: number | null
          country: string | null
          created_at: string | null
          id: string
          inclination: number | null
          last_contact: string | null
          launch_date: string | null
          name: string
          perigee: number | null
          period: number | null
          position_x: number | null
          position_y: number | null
          position_z: number | null
          signal_strength: number | null
          status: Database["public"]["Enums"]["satellite_status"] | null
          temperature: number | null
          type: string
          updated_at: string | null
          velocity_x: number | null
          velocity_y: number | null
          velocity_z: number | null
        }
        Insert: {
          altitude?: number | null
          apogee?: number | null
          battery_level?: number | null
          country?: string | null
          created_at?: string | null
          id?: string
          inclination?: number | null
          last_contact?: string | null
          launch_date?: string | null
          name: string
          perigee?: number | null
          period?: number | null
          position_x?: number | null
          position_y?: number | null
          position_z?: number | null
          signal_strength?: number | null
          status?: Database["public"]["Enums"]["satellite_status"] | null
          temperature?: number | null
          type: string
          updated_at?: string | null
          velocity_x?: number | null
          velocity_y?: number | null
          velocity_z?: number | null
        }
        Update: {
          altitude?: number | null
          apogee?: number | null
          battery_level?: number | null
          country?: string | null
          created_at?: string | null
          id?: string
          inclination?: number | null
          last_contact?: string | null
          launch_date?: string | null
          name?: string
          perigee?: number | null
          period?: number | null
          position_x?: number | null
          position_y?: number | null
          position_z?: number | null
          signal_strength?: number | null
          status?: Database["public"]["Enums"]["satellite_status"] | null
          temperature?: number | null
          type?: string
          updated_at?: string | null
          velocity_x?: number | null
          velocity_y?: number | null
          velocity_z?: number | null
        }
        Relationships: []
      }
      space_weather: {
        Row: {
          ap_daily: number | null
          ap1: number | null
          ap2: number | null
          ap3: number | null
          ap4: number | null
          ap5: number | null
          ap6: number | null
          ap7: number | null
          ap8: number | null
          bartels_solar_rotation: number
          created_at: string | null
          data_quality: number | null
          date: string
          day_within_rotation: number
          days: number
          days_midday: number
          f107_adj: number | null
          f107_obs: number | null
          id: string
          kp1: number | null
          kp2: number | null
          kp3: number | null
          kp4: number | null
          kp5: number | null
          kp6: number | null
          kp7: number | null
          kp8: number | null
          sunspot_number: number | null
          updated_at: string | null
        }
        Insert: {
          ap_daily?: number | null
          ap1?: number | null
          ap2?: number | null
          ap3?: number | null
          ap4?: number | null
          ap5?: number | null
          ap6?: number | null
          ap7?: number | null
          ap8?: number | null
          bartels_solar_rotation: number
          created_at?: string | null
          data_quality?: number | null
          date: string
          day_within_rotation: number
          days: number
          days_midday: number
          f107_adj?: number | null
          f107_obs?: number | null
          id?: string
          kp1?: number | null
          kp2?: number | null
          kp3?: number | null
          kp4?: number | null
          kp5?: number | null
          kp6?: number | null
          kp7?: number | null
          kp8?: number | null
          sunspot_number?: number | null
          updated_at?: string | null
        }
        Update: {
          ap_daily?: number | null
          ap1?: number | null
          ap2?: number | null
          ap3?: number | null
          ap4?: number | null
          ap5?: number | null
          ap6?: number | null
          ap7?: number | null
          ap8?: number | null
          bartels_solar_rotation?: number
          created_at?: string | null
          data_quality?: number | null
          date?: string
          day_within_rotation?: number
          days?: number
          days_midday?: number
          f107_adj?: number | null
          f107_obs?: number | null
          id?: string
          kp1?: number | null
          kp2?: number | null
          kp3?: number | null
          kp4?: number | null
          kp5?: number | null
          kp6?: number | null
          kp7?: number | null
          kp8?: number | null
          sunspot_number?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      threats: {
        Row: {
          created_at: string | null
          description: string
          detected_at: string | null
          id: string
          probability: number | null
          recommendation: string | null
          resolved_at: string | null
          satellite_id: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status: Database["public"]["Enums"]["alert_status"] | null
          type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          detected_at?: string | null
          id?: string
          probability?: number | null
          recommendation?: string | null
          resolved_at?: string | null
          satellite_id?: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"] | null
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          detected_at?: string | null
          id?: string
          probability?: number | null
          recommendation?: string | null
          resolved_at?: string | null
          satellite_id?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"] | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "threats_satellite_id_fkey"
            columns: ["satellite_id"]
            isOneToOne: false
            referencedRelation: "satellite_orbital_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threats_satellite_id_fkey"
            columns: ["satellite_id"]
            isOneToOne: false
            referencedRelation: "satellites"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      satellite_orbital_view: {
        Row: {
          altitude: number | null
          battery_level: number | null
          country: string | null
          created_at: string | null
          distance_from_center: number | null
          id: string | null
          inclination: number | null
          last_contact: string | null
          latitude: number | null
          longitude: number | null
          name: string | null
          orbital_speed: number | null
          period: number | null
          position_x: number | null
          position_y: number | null
          position_z: number | null
          signal_strength: number | null
          status: Database["public"]["Enums"]["satellite_status"] | null
          temperature: number | null
          type: string | null
          updated_at: string | null
          velocity_x: number | null
          velocity_y: number | null
          velocity_z: number | null
        }
        Insert: {
          altitude?: number | null
          battery_level?: number | null
          country?: string | null
          created_at?: string | null
          distance_from_center?: never
          id?: string | null
          inclination?: number | null
          last_contact?: string | null
          latitude?: never
          longitude?: never
          name?: string | null
          orbital_speed?: never
          period?: number | null
          position_x?: number | null
          position_y?: number | null
          position_z?: number | null
          signal_strength?: number | null
          status?: Database["public"]["Enums"]["satellite_status"] | null
          temperature?: number | null
          type?: string | null
          updated_at?: string | null
          velocity_x?: number | null
          velocity_y?: number | null
          velocity_z?: number | null
        }
        Update: {
          altitude?: number | null
          battery_level?: number | null
          country?: string | null
          created_at?: string | null
          distance_from_center?: never
          id?: string | null
          inclination?: number | null
          last_contact?: string | null
          latitude?: never
          longitude?: never
          name?: string | null
          orbital_speed?: never
          period?: number | null
          position_x?: number | null
          position_y?: number | null
          position_z?: number | null
          signal_strength?: number | null
          status?: Database["public"]["Enums"]["satellite_status"] | null
          temperature?: number | null
          type?: string | null
          updated_at?: string | null
          velocity_x?: number | null
          velocity_y?: number | null
          velocity_z?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alert_severity: "low" | "medium" | "high" | "critical"
      alert_status: "active" | "acknowledged" | "resolved"
      app_role: "admin" | "operator" | "viewer"
      satellite_status: "operational" | "maintenance" | "critical" | "inactive"
      threat_level: "low" | "medium" | "high" | "critical"
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
      alert_severity: ["low", "medium", "high", "critical"],
      alert_status: ["active", "acknowledged", "resolved"],
      app_role: ["admin", "operator", "viewer"],
      satellite_status: ["operational", "maintenance", "critical", "inactive"],
      threat_level: ["low", "medium", "high", "critical"],
    },
  },
} as const

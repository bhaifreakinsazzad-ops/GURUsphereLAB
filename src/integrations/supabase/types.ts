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
  public: {
    Tables: {
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donor_name: string | null
          id: string
          message: string | null
          method: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donor_name?: string | null
          id?: string
          message?: string | null
          method: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donor_name?: string | null
          id?: string
          message?: string | null
          method?: string
        }
        Relationships: []
      }
      memorial_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_profiles: {
        Row: {
          availability: string
          bio: string
          contact_method: string | null
          created_at: string
          expertise: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string
          bio: string
          contact_method?: string | null
          created_at?: string
          expertise: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string
          bio?: string
          contact_method?: string | null
          created_at?: string
          expertise?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentorship_requests: {
        Row: {
          created_at: string
          id: string
          mentor_id: string
          message: string
          status: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentor_id: string
          message: string
          status?: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mentor_id?: string
          message?: string
          status?: string
          student_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          created_at: string
          id: string
          position: number
          project_id: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          position?: number
          project_id: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          project_id?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "team_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_topics: {
        Row: {
          abstract: string
          category: string
          created_at: string
          id: string
          link: string | null
          tags: string[] | null
          title: string
          updated_at: string
          upvotes: number
          user_id: string
        }
        Insert: {
          abstract: string
          category: string
          created_at?: string
          id?: string
          link?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          upvotes?: number
          user_id: string
        }
        Update: {
          abstract?: string
          category?: string
          created_at?: string
          id?: string
          link?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          upvotes?: number
          user_id?: string
        }
        Relationships: []
      }
      resource_submissions: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          title: string
          url: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          title: string
          url: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          title?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_wishes: {
        Row: {
          created_at: string
          id: string
          user_id: string
          wish_key: string
          wish_title: string
          wish_type: string
          wish_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          wish_key: string
          wish_title: string
          wish_type: string
          wish_url: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          wish_key?: string
          wish_title?: string
          wish_type?: string
          wish_url?: string
        }
        Relationships: []
      }
      team_projects: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          max_members: number
          owner_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          max_members?: number
          owner_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          max_members?: number
          owner_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      increment_research_upvote: {
        Args: { _topic_id: string }
        Returns: number
      }
      promote_to_admin: { Args: { _email: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "mentor" | "student"
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
      app_role: ["admin", "mentor", "student"],
    },
  },
} as const

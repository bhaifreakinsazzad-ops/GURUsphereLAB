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
      club_waitlist: {
        Row: {
          club_slug: string
          created_at: string
          display_name: string | null
          email: string
          id: string
          notes: string | null
          quiz_match: string | null
        }
        Insert: {
          club_slug: string
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          notes?: string | null
          quiz_match?: string | null
        }
        Update: {
          club_slug?: string
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          notes?: string | null
          quiz_match?: string | null
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["course_difficulty"]
          educator_id: string | null
          estimated_minutes: number
          id: string
          language: string
          outcomes: string[]
          prerequisites: string[]
          published_at: string | null
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["course_status"]
          subject_id: string | null
          thumbnail_url: string | null
          title: string
          title_bn: string | null
          updated_at: string
          visibility: Database["public"]["Enums"]["course_visibility"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["course_difficulty"]
          educator_id?: string | null
          estimated_minutes?: number
          id?: string
          language?: string
          outcomes?: string[]
          prerequisites?: string[]
          published_at?: string | null
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["course_status"]
          subject_id?: string | null
          thumbnail_url?: string | null
          title: string
          title_bn?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["course_visibility"]
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["course_difficulty"]
          educator_id?: string | null
          estimated_minutes?: number
          id?: string
          language?: string
          outcomes?: string[]
          prerequisites?: string[]
          published_at?: string | null
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["course_status"]
          subject_id?: string | null
          thumbnail_url?: string | null
          title?: string
          title_bn?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["course_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "courses_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
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
      educator_applications: {
        Row: {
          created_at: string
          credentials: string
          expertise: string[]
          full_name: string
          headline: string
          id: string
          languages: string[]
          linkedin_url: string | null
          motivation: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          sample_work_url: string | null
          status: Database["public"]["Enums"]["educator_application_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials: string
          expertise?: string[]
          full_name: string
          headline: string
          id?: string
          languages?: string[]
          linkedin_url?: string | null
          motivation: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          sample_work_url?: string | null
          status?: Database["public"]["Enums"]["educator_application_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credentials?: string
          expertise?: string[]
          full_name?: string
          headline?: string
          id?: string
          languages?: string[]
          linkedin_url?: string | null
          motivation?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          sample_work_url?: string | null
          status?: Database["public"]["Enums"]["educator_application_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          last_activity_at: string
          status: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          last_activity_at?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          last_activity_at?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_preferences: {
        Row: {
          career_objective: string | null
          created_at: string
          experience_level: string | null
          interests: string[]
          learning_style: string | null
          onboarding_completed_at: string | null
          preferred_language: string
          primary_goal: string | null
          updated_at: string
          user_id: string
          weekly_minutes: number | null
        }
        Insert: {
          career_objective?: string | null
          created_at?: string
          experience_level?: string | null
          interests?: string[]
          learning_style?: string | null
          onboarding_completed_at?: string | null
          preferred_language?: string
          primary_goal?: string | null
          updated_at?: string
          user_id: string
          weekly_minutes?: number | null
        }
        Update: {
          career_objective?: string | null
          created_at?: string
          experience_level?: string | null
          interests?: string[]
          learning_style?: string | null
          onboarding_completed_at?: string | null
          preferred_language?: string
          primary_goal?: string | null
          updated_at?: string
          user_id?: string
          weekly_minutes?: number | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          last_position: number
          lesson_id: string
          progress_value: number
          state: Database["public"]["Enums"]["progress_state"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          last_position?: number
          lesson_id: string
          progress_value?: number
          state?: Database["public"]["Enums"]["progress_state"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          last_position?: number
          lesson_id?: string
          progress_value?: number
          state?: Database["public"]["Enums"]["progress_state"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          estimated_minutes: number
          id: string
          is_preview: boolean
          lesson_type: Database["public"]["Enums"]["lesson_type"]
          module_id: string
          position: number
          resource_url: string | null
          slug: string
          status: Database["public"]["Enums"]["lesson_status"]
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          estimated_minutes?: number
          id?: string
          is_preview?: boolean
          lesson_type?: Database["public"]["Enums"]["lesson_type"]
          module_id: string
          position?: number
          resource_url?: string | null
          slug: string
          status?: Database["public"]["Enums"]["lesson_status"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          estimated_minutes?: number
          id?: string
          is_preview?: boolean
          lesson_type?: Database["public"]["Enums"]["lesson_type"]
          module_id?: string
          position?: number
          resource_url?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["lesson_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
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
      subjects: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          name: string
          name_bn: string | null
          slug: string
          status: Database["public"]["Enums"]["subject_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name: string
          name_bn?: string | null
          slug: string
          status?: Database["public"]["Enums"]["subject_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
          name_bn?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["subject_status"]
          updated_at?: string
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
      app_role: "admin" | "mentor" | "student" | "educator"
      course_difficulty: "beginner" | "intermediate" | "advanced"
      course_status:
        | "draft"
        | "submitted"
        | "changes_requested"
        | "approved"
        | "published"
        | "archived"
        | "rejected"
      course_visibility: "public" | "unlisted" | "private"
      educator_application_status:
        | "pending"
        | "approved"
        | "rejected"
        | "changes_requested"
      enrollment_status: "active" | "completed" | "dropped"
      lesson_status: "draft" | "ready" | "published" | "archived"
      lesson_type: "text" | "video" | "link" | "embed"
      progress_state: "not_started" | "in_progress" | "completed"
      subject_status: "active" | "hidden" | "archived"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "mentor", "student", "educator"],
      course_difficulty: ["beginner", "intermediate", "advanced"],
      course_status: [
        "draft",
        "submitted",
        "changes_requested",
        "approved",
        "published",
        "archived",
        "rejected",
      ],
      course_visibility: ["public", "unlisted", "private"],
      educator_application_status: [
        "pending",
        "approved",
        "rejected",
        "changes_requested",
      ],
      enrollment_status: ["active", "completed", "dropped"],
      lesson_status: ["draft", "ready", "published", "archived"],
      lesson_type: ["text", "video", "link", "embed"],
      progress_state: ["not_started", "in_progress", "completed"],
      subject_status: ["active", "hidden", "archived"],
    },
  },
} as const

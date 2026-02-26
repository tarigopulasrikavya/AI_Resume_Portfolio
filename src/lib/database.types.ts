export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          location: string;
          title: string;
          bio: string;
          website: string;
          linkedin: string;
          github: string;
          avatar_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          email?: string;
          phone?: string;
          location?: string;
          title?: string;
          bio?: string;
          website?: string;
          linkedin?: string;
          github?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          location?: string;
          title?: string;
          bio?: string;
          website?: string;
          linkedin?: string;
          github?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      work_experience: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          position: string;
          location: string;
          start_date: string | null;
          end_date: string | null;
          description: string;
          is_current: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company?: string;
          position?: string;
          location?: string;
          start_date?: string | null;
          end_date?: string | null;
          description?: string;
          is_current?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company?: string;
          position?: string;
          location?: string;
          start_date?: string | null;
          end_date?: string | null;
          description?: string;
          is_current?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          user_id: string;
          institution: string;
          degree: string;
          field_of_study: string;
          location: string;
          start_date: string | null;
          end_date: string | null;
          gpa: string;
          description: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution?: string;
          degree?: string;
          field_of_study?: string;
          location?: string;
          start_date?: string | null;
          end_date?: string | null;
          gpa?: string;
          description?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          institution?: string;
          degree?: string;
          field_of_study?: string;
          location?: string;
          start_date?: string | null;
          end_date?: string | null;
          gpa?: string;
          description?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          proficiency: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string;
          category?: string;
          proficiency?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          proficiency?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          technologies: string[];
          url: string;
          github_url: string;
          image_url: string;
          start_date: string | null;
          end_date: string | null;
          is_featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          description?: string;
          technologies?: string[];
          url?: string;
          github_url?: string;
          image_url?: string;
          start_date?: string | null;
          end_date?: string | null;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          technologies?: string[];
          url?: string;
          github_url?: string;
          image_url?: string;
          start_date?: string | null;
          end_date?: string | null;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      resume_settings: {
        Row: {
          id: string;
          user_id: string;
          theme: string;
          font: string;
          section_order: unknown;
          show_photo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: string;
          font?: string;
          section_order?: unknown;
          show_photo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: string;
          font?: string;
          section_order?: unknown;
          show_photo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

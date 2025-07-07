/**
 * Helper type that represents any valid JSON value.
 * Can be a string, number, boolean, null, object or array.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Representation of the Supabase database structure.
 */
export interface Database {
  public: {
    Tables: {
      /**
       * Blog table in the `public` schema.
       */
      blogs: {
        /**
         * Structure of an existing row in the table.
         */
        Row: {
          id: number;
          title: string | null;
          contenido: string;
          "ID de usuario": string | null;
          created_at: string;
          updated_at: string | null;
          publicado: boolean;
          "imagen destacada": string | null;
          deleted_at: string | null;
          description: string | null;
          author: string | null;
          image_url: string | null;
        };

        /**
         * Structure for inserting a new row in the table.
         * Optional fields can be omitted.
         */
        Insert: {
          id?: number;
          title?: string | null;
          contenido: string;
          "ID de usuario"?: string | null;
          created_at?: string;
          updated_at?: string | null;
          publicado?: boolean;
          "imagen destacada"?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          author?: string | null;
          image_url?: string | null;
        };

        /**
         * Structure for updating an existing row in the table.
         * All fields are optional.
         */
        Update: {
          id?: number;
          title?: string | null;
          contenido?: string;
          "ID de usuario"?: string | null;
          created_at?: string;
          updated_at?: string | null;
          publicado?: boolean;
          "imagen destacada"?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          author?: string | null;
          image_url?: string | null;
        };

        /**
         * Table relationships with other tables.
         * Currently no explicit relationships defined.
         */
        Relationships: [];
      };

      /**
       * Custom users table (can represent a profile or additional metadata).
       */
      users: {
        Row: {
          id: string;
          email: string | null;
          role: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          email?: string | null;
          role?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          role?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      [_ in never]: never;
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };

  auth: {
    Tables: {
      /**
       * Supabase Auth `users` table, contains basic information about authenticated users.
       */
      users: {
        Row: {
          id: string;
          email: string | null;
          role: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          email?: string | null;
          role?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          role?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
  };
}

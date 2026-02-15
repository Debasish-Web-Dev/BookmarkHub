/**
 * Bookmark Type Definition
 * Represents a single bookmark in the database
 */
export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string;
}

/**
 * Insert Bookmark Type
 * Used when creating a new bookmark (without id and created_at)
 */
export interface InsertBookmark {
  title: string;
  url: string;
  user_id: string;
}

/**
 * User Type from Supabase Auth
 */
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

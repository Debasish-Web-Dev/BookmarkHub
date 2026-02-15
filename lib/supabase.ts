/**
 * Supabase Client for Client Components
 * This file creates a Supabase client that works in the browser
 * Used in "use client" components
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates and returns a Supabase client for browser-side operations
 * This client handles authentication state automatically
 * @returns Supabase client instance
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

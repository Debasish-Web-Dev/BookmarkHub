/**
 * Home Page
 * Landing page that redirects based on authentication state
 */

import { createServerSupabaseClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'

export default async function Home() {
  // Check if user is authenticated
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect based on auth state
  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}

/**
 * Dashboard Page
 * Main page where users can view and manage their bookmarks
 * Protected route - only accessible to authenticated users
 */

import { createServerSupabaseClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'

export default async function DashboardPage() {
  // Get authenticated user
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated (extra safety, middleware should handle this)
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen">
      {/* Navigation bar */}
      <Navbar user={user} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-purple-100">
            Manage your bookmarks and keep your favorite links organized
          </p>
        </div>

        {/* Two-column layout on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookmark form - takes 1 column */}
          <div className="lg:col-span-1">
            <BookmarkForm userId={user.id} />
          </div>

          {/* Bookmark list - takes 2 columns */}
          <div className="lg:col-span-2">
            <BookmarkList userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}

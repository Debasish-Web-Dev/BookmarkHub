/**
 * Bookmark List Component
 * Displays all bookmarks with real-time updates
 * Uses Supabase Realtime to sync changes across tabs
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Bookmark } from '@/types/bookmark'
import BookmarkCard from './BookmarkCard'
import EmptyState from './EmptyState'
import LoadingSpinner from './LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'

interface BookmarkListProps {
  userId: string
}

export default function BookmarkList({ userId }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Fetch initial bookmarks
    fetchBookmarks()

    // Set up real-time subscription
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`, // Only listen to current user's bookmarks
        },
        (payload) => {
          console.log('Real-time event:', payload)
          
          // Handle different event types
          if (payload.eventType === 'INSERT') {
            // Add new bookmark to the list
            setBookmarks((current) => [payload.new as Bookmark, ...current])
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted bookmark from the list
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== payload.old.id)
            )
          } else if (payload.eventType === 'UPDATE') {
            // Update existing bookmark in the list
            setBookmarks((current) =>
              current.map((bookmark) =>
                bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
              )
            )
          }
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  // Fetch bookmarks from database
  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (bookmarks.length === 0) {
    return <EmptyState />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header with count */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Bookmarks
        </h2>
        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm">
          {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
        </span>
      </div>

      {/* Bookmarks grid with animations */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  )
}
